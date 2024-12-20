import { Card } from "@/components/ui/card";
import { Dumbbell } from "lucide-react";
import type { WorkoutExercise, Exercise } from "@prisma/client";

type WorkoutExerciseWithDetails = WorkoutExercise & {
  exercise: Exercise;
};

interface WorkoutExerciseListProps {
  exercises: WorkoutExerciseWithDetails[];
}

export function WorkoutExerciseList({ exercises }: WorkoutExerciseListProps) {
  return (
    <div className="space-y-4">
      {exercises.map((exercise) => (
        <Card key={exercise.id} className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <Dumbbell className="h-5 w-5 text-[hsl(var(--primary))]" />
                <h3 className="font-semibold">{exercise.exercise.name}</h3>
              </div>
              <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
                {exercise.exercise.description}
              </p>
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm font-medium">Sets</p>
                  <p className="text-lg">{exercise.sets}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Reps</p>
                  <p className="text-lg">{exercise.reps || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Weight</p>
                  <p className="text-lg">
                    {exercise.weight ? `${exercise.weight} kg` : "N/A"}
                  </p>
                </div>
                {exercise.duration && (
                  <div>
                    <p className="text-sm font-medium">Duration</p>
                    <p className="text-lg">{exercise.duration}s</p>
                  </div>
                )}
              </div>
              {exercise.notes && (
                <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">
                  Notes: {exercise.notes}
                </p>
              )}
            </div>
            <div className="text-sm text-[hsl(var(--muted-foreground))]">
              #{exercise.order}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
