import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle, Activity, Calendar, Clock, Target, Dumbbell } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { formatDistanceToNow } from "date-fns";

async function getWorkoutStats(userId: string) {
  const totalWorkouts = await prisma.workout.count({
    where: { userId }
  });

  const totalMinutes = await prisma.workout.aggregate({
    where: { userId },
    _sum: {
      duration: true
    }
  });

  const recentWorkouts = await prisma.workout.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: {
      exercises: {
        include: {
          exercise: true
        }
      }
    }
  });

  return {
    totalWorkouts,
    totalMinutes: totalMinutes._sum.duration || 0,
    recentWorkouts
  };
}

async function getWorkouts(email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (!user) return null;

  const workouts = await prisma.workout.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      exercises: {
        include: {
          exercise: true,
        },
      },
    },
  });

  const stats = await getWorkoutStats(user.id);

  return { workouts, stats };
}

export default async function WorkoutsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;

  const data = await getWorkouts(session.user.email);
  if (!data) return null;

  const { workouts, stats } = data;

  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Your Workouts</h1>
          <p className="text-muted-foreground mt-1">Track and manage your fitness journey</p>
        </div>
        <Link href="/dashboard/workouts/new">
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            Create New Workout
          </Button>
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center space-x-2">
            <Activity className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-medium">Total Workouts</h3>
          </div>
          <p className="text-2xl font-bold mt-2">{stats.totalWorkouts}</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-medium">Total Time</h3>
          </div>
          <p className="text-2xl font-bold mt-2">{Math.round(stats.totalMinutes / 60)} hours</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-2">
            <Target className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-medium">Recent Streak</h3>
          </div>
          <p className="text-2xl font-bold mt-2">
            {/* Calculate streak based on consecutive days */}
            {calculateStreak(stats.recentWorkouts)} days
          </p>
        </Card>
      </div>

      {/* Workouts List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workouts.map((workout) => (
          <Link
            key={workout.id}
            href={`/dashboard/workouts/${workout.id}`}
            className="block"
          >
            <Card className="p-6 hover:bg-accent transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{workout.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(workout.createdAt), { addSuffix: true })}
                  </p>
                </div>
                <div className="flex items-center space-x-1 text-primary">
                  <Dumbbell className="h-5 w-5" />
                  <span className="text-sm font-medium">{workout.exercises.length}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 mr-2" />
                  {workout.duration} minutes
                </div>

                <div className="text-sm">
                  {workout.exercises.slice(0, 2).map((ex) => (
                    <div key={ex.id} className="flex items-center text-muted-foreground">
                      <span className="w-2 h-2 rounded-full bg-primary/50 mr-2" />
                      {ex.exercise.name}
                    </div>
                  ))}
                  {workout.exercises.length > 2 && (
                    <p className="text-sm text-muted-foreground mt-1">
                      +{workout.exercises.length - 2} more exercises
                    </p>
                  )}
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

function calculateStreak(recentWorkouts: any[]): number {
  if (!recentWorkouts.length) return 0;

  let streak = 1;
  let currentDate = new Date(recentWorkouts[0].createdAt);
  currentDate.setHours(0, 0, 0, 0);

  for (let i = 1; i < recentWorkouts.length; i++) {
    const workoutDate = new Date(recentWorkouts[i].createdAt);
    workoutDate.setHours(0, 0, 0, 0);

    const diffDays = Math.floor((currentDate.getTime() - workoutDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      streak++;
      currentDate = workoutDate;
    } else {
      break;
    }
  }

  return streak;
}
