import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

interface ExerciseTemplate {
  type: string;
  count: number;
  intensity?: number;
  restPeriod?: number;
}

interface WorkoutTemplate {
  duration: number;
  calories: number;
  exercises: ExerciseTemplate[];
}

interface FitnessProfile {
  type: string;
  difficulty: string;
  fitnessGoal: string;
  workoutFrequency: number;
  experienceLevel: string;
  currentBenchPress?: number;
  currentSquat?: number;
  currentDeadlift?: number;
  injuries: string;
  equipment: string[];
  focusAreas: string[];
  timeAvailable: number;
}

// Helper function to calculate appropriate weight based on current maxes
function calculateWeight(max: number | undefined, percentageOfMax: number): number {
  if (!max) return 0;
  return Math.round((max * percentageOfMax) / 5) * 5; // Round to nearest 5
}

// Helper function to determine sets and reps based on fitness goal
function getSetsAndReps(goal: string, exerciseType: string) {
  switch (goal) {
    case "build_muscle":
      return { sets: 4, reps: 8, intensity: 0.75 }; // 75% of max, 4x8
    case "increase_strength":
      return { sets: 5, reps: 5, intensity: 0.85 }; // 85% of max, 5x5
    case "lose_weight":
      return { sets: 3, reps: 15, intensity: 0.65 }; // 65% of max, 3x15
    case "improve_endurance":
      return { sets: 3, reps: 12, intensity: 0.7 }; // 70% of max, 3x12
    default:
      return { sets: 3, reps: 10, intensity: 0.7 }; // Default: 70% of max, 3x10
  }
}

function getExercisesByMuscleGroup(exercises: any[], muscleGroup: string, equipment: string[], count: number) {
  return exercises
    .filter(
      (exercise) =>
        exercise.muscle.includes(muscleGroup) &&
        exercise.equipment.some((eq: string) => equipment.includes(eq))
    )
    .slice(0, count);
}

function generateWorkoutPlan(profile: FitnessProfile, exercises: any[]) {
  const { fitnessGoal, focusAreas, equipment, timeAvailable, experienceLevel } = profile;

  // Determine exercise distribution based on focus areas
  const exercisesPerArea = Math.floor(timeAvailable / (focusAreas.length * 10));
  let workoutExercises = [];
  let order = 1;

  // Generate exercises for each focus area
  for (const area of focusAreas) {
    const areaExercises = getExercisesByMuscleGroup(
      exercises,
      area,
      equipment,
      exercisesPerArea
    );

    for (const exercise of areaExercises) {
      const { sets, reps, intensity } = getSetsAndReps(fitnessGoal, exercise.type);
      
      // Calculate weight based on relevant max
      let weight = 0;
      if (exercise.name.toLowerCase().includes("bench")) {
        weight = calculateWeight(profile.currentBenchPress, intensity);
      } else if (exercise.name.toLowerCase().includes("squat")) {
        weight = calculateWeight(profile.currentSquat, intensity);
      } else if (exercise.name.toLowerCase().includes("deadlift")) {
        weight = calculateWeight(profile.currentDeadlift, intensity);
      } else {
        // For other exercises, use a percentage of the closest related lift
        weight = calculateWeight(
          Math.min(
            profile.currentBenchPress || 999999,
            profile.currentSquat || 999999,
            profile.currentDeadlift || 999999
          ) * 0.6,
          intensity
        );
      }

      workoutExercises.push({
        exerciseId: exercise.id,
        sets,
        reps,
        weight,
        order: order++,
      });
    }
  }

  return {
    name: `${experienceLevel} ${fitnessGoal.replace("_", " ")} Workout`,
    type: profile.type,
    difficulty: profile.experienceLevel,
    duration: timeAvailable,
    calories: timeAvailable * 8, // Rough estimate of calories burned
    exercises: workoutExercises,
  };
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const profile: FitnessProfile = await request.json();

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Get available exercises
    const exercises = await prisma.exercise.findMany({
      where: {
        equipment: {
          hasSome: profile.equipment,
        },
      },
    });

    if (exercises.length === 0) {
      return new NextResponse("No exercises found for the given equipment", { status: 404 });
    }

    // Generate workout plan
    const workoutPlan = generateWorkoutPlan(profile, exercises);

    // Create the workout
    const workout = await prisma.workout.create({
      data: {
        userId: user.id,
        name: workoutPlan.name,
        type: workoutPlan.type,
        difficulty: workoutPlan.difficulty,
        duration: workoutPlan.duration,
        calories: workoutPlan.calories,
        exercises: {
          create: workoutPlan.exercises.map((exercise) => ({
            exerciseId: exercise.exerciseId,
            sets: exercise.sets,
            reps: exercise.reps,
            weight: exercise.weight,
            order: exercise.order,
          })),
        },
      },
    });

    return NextResponse.json(workout);
  } catch (error) {
    console.error("Error generating workout:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
