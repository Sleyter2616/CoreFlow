import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock, Dumbbell, Target, Trophy } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ id: string }>
}

async function getWorkout(workoutId: string, userId: string) {
  const workout = await prisma.workout.findUnique({
    where: {
      id: workoutId,
      userId: userId,
    },
    include: {
      exercises: {
        include: {
          exercise: true,
        },
        orderBy: {
          order: 'asc',
        },
      },
    },
  })

  if (!workout) {
    return null
  }

  return workout
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Workout ${id} | CoreFlow`,
  }
}

export default async function WorkoutPage({ params }: PageProps) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return notFound()
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  })

  if (!user) {
    return notFound()
  }

  const { id } = await params;
  const workout = await getWorkout(id, user.id)
  
  if (!workout) {
    return notFound()
  }

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard/workouts">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Workouts
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">{workout.name}</h1>
          </div>
          <p className="text-muted-foreground">
            Created {formatDistanceToNow(new Date(workout.createdAt), { addSuffix: true })}
          </p>
        </div>
      </div>

      {/* Workout Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-medium">Duration</h3>
          </div>
          <p className="text-2xl font-bold mt-2">{workout.duration} minutes</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-2">
            <Dumbbell className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-medium">Exercises</h3>
          </div>
          <p className="text-2xl font-bold mt-2">{workout.exercises.length}</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-2">
            <Target className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-medium">Type</h3>
          </div>
          <p className="text-2xl font-bold mt-2">{workout.type}</p>
        </Card>
      </div>

      {/* Exercise List */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Exercises</h2>
        <div className="grid gap-4">
          {workout.exercises.map((exercise, index) => (
            <Card key={exercise.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-medium">
                      {index + 1}
                    </span>
                    <h3 className="text-lg font-semibold">{exercise.exercise.name}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {exercise.exercise.muscle.join(", ")}
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-medium">
                    {exercise.sets} sets × {exercise.reps} reps
                  </div>
                  {exercise.weight && (
                    <div className="text-sm text-muted-foreground">
                      {exercise.weight} lbs
                    </div>
                  )}
                </div>
              </div>
              {exercise.notes && (
                <div className="mt-4 text-sm text-muted-foreground">
                  <p>{exercise.notes}</p>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Notes Section */}
      {workout.description && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Notes</h2>
          <Card className="p-6">
            <p className="text-muted-foreground">{workout.description}</p>
          </Card>
        </div>
      )}
    </div>
  );
}
