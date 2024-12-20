import { getServerSession } from "next-auth/next";
import { Card } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle, Activity, Calendar, Trophy } from "lucide-react";
import { ProgressChart } from "@/components/dashboard/progress-chart";

async function getWorkoutStats(userId: string) {
  const workouts = await prisma.workout.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: {
      exercises: true,
    },
  });

  const totalWorkouts = await prisma.workout.count({
    where: { userId },
  });

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
  };
}

export default async function DashboardPage() {
  const session = await getServerSession();
  if (!session?.user?.email) return null;

  const { recentWorkouts, totalWorkouts, progressData } = await getWorkoutStats(
    session.user.email
  );

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center space-x-2">
            <Activity className="h-6 w-6 text-[hsl(var(--primary))]" />
            <h3 className="text-xl font-semibold">Total Workouts</h3>
          </div>
          <p className="text-3xl font-bold mt-2">{totalWorkouts}</p>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center space-x-2">
            <Calendar className="h-6 w-6 text-[hsl(var(--primary))]" />
            <h3 className="text-xl font-semibold">Workout Streak</h3>
          </div>
          <p className="text-3xl font-bold mt-2">3 days</p>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center space-x-2">
            <Trophy className="h-6 w-6 text-[hsl(var(--primary))]" />
            <h3 className="text-xl font-semibold">Personal Records</h3>
          </div>
          <p className="text-3xl font-bold mt-2">5</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Progress Chart</h3>
          <ProgressChart data={progressData} />
        </Card>

        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Recent Workouts</h3>
            <Link href="/dashboard/workouts/new">
              <Button>
                <PlusCircle className="h-4 w-4 mr-2" />
                New Workout
              </Button>
            </Link>
          </div>
          <div className="space-y-4">
            {recentWorkouts.map((workout) => (
              <Link
                key={workout.id}
                href={`/dashboard/workouts/${workout.id}`}
                className="block"
              >
                <Card className="p-4 hover:bg-[hsl(var(--accent))] transition-colors">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold">{workout.name}</h4>
                      <p className="text-sm text-[hsl(var(--muted-foreground))]">
                        {workout.exercises.length} exercises •{" "}
                        {new Date(workout.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Activity className="h-5 w-5 text-[hsl(var(--muted-foreground))]" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
