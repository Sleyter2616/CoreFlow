import { getServerSession } from "next-auth/next";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle, Activity, Calendar, Trophy, Clock, Dumbbell } from "lucide-react";
import { ProgressChart } from "@/components/dashboard/progress-chart";
import { PersonalRecords } from "@/components/dashboard/personal-records";
import { getRecentPersonalRecords } from "@/lib/personal-records";
import { getWorkoutStats } from "@/lib/workout-streak";
import { authOptions } from "@/lib/auth";
import { formatDistanceToNow } from "date-fns";

async function getDashboardStats(email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (!user) {
    // If no user exists, create one with our test data
    const testUser = await prisma.user.create({
      data: {
        email,
        name: 'Test User',
        height: 180,
        weight: 80,
        fitnessLevel: 'intermediate',
      },
    });
    return null;
  }

  const workouts = await prisma.workout.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: {
      exercises: {
        include: {
          exercise: true,
        },
      },
    },
  });

  const personalRecords = await getRecentPersonalRecords(user.id);
  const { streak, totalWorkouts } = await getWorkoutStats(user.id);

  // Mock data for the chart - replace with real data later
  const progressData = [
    { name: "Week 1", weight: 150 },
    { name: "Week 2", weight: 155 },
    { name: "Week 3", weight: 153 },
    { name: "Week 4", weight: 158 },
  ];

  return {
    recentWorkouts: workouts,
    totalWorkouts,
    progressData,
    personalRecords,
    streak,
  };
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;

  const stats = await getDashboardStats(session.user.email);
  if (!stats) {
    // If no stats, the user was just created. Redirect to refresh the page
    return (
      <div className="p-6">
        <p>Setting up your dashboard...</p>
        <meta httpEquiv="refresh" content="1" />
      </div>
    );
  }

  const { recentWorkouts, totalWorkouts, progressData, personalRecords, streak } = stats;

  return (
    <div className="p-6 space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/dashboard/workouts">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Workouts</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalWorkouts}</div>
            </CardContent>
          </Card>
        </Link>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Workout Streak</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{streak} days</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Personal Records</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{personalRecords.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        {/* Progress Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Progress Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <ProgressChart data={progressData} />
          </CardContent>
        </Card>

        {/* Recent Workouts */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Recent Workouts</CardTitle>
                <CardDescription>Your latest workout sessions</CardDescription>
              </div>
              <Link href="/dashboard/workouts/new">
                <Button size="sm">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  New Workout
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentWorkouts.map((workout) => (
                <Link
                  key={workout.id}
                  href={`/dashboard/workouts/${workout.id}`}
                  className="block"
                >
                  <div className="flex items-center justify-between p-4 bg-accent rounded-lg hover:bg-accent/80 transition-colors">
                    <div className="space-y-1">
                      <p className="font-medium">{workout.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(workout.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4 text-muted-foreground">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{workout.duration}m</span>
                      </div>
                      <div className="flex items-center">
                        <Dumbbell className="w-4 h-4 mr-1" />
                        <span>{workout.exercises.length}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Personal Records */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Personal Records</CardTitle>
          </CardHeader>
          <CardContent>
            <PersonalRecords records={personalRecords} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
