import { prisma } from "./prisma";

export async function calculateWorkoutStreak(userId: string): Promise<number> {
  // Get all workouts for the user, ordered by date
  const workouts = await prisma.workout.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: { createdAt: true },
  });

  if (workouts.length === 0) return 0;

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Check if there's a workout today
  const latestWorkout = workouts[0].createdAt;
  const latestWorkoutDate = new Date(latestWorkout);
  latestWorkoutDate.setHours(0, 0, 0, 0);

  // If no workout today or yesterday, streak is 0
  if (today.getTime() - latestWorkoutDate.getTime() > 2 * 24 * 60 * 60 * 1000) {
    return 0;
  }

  // Count consecutive days with workouts
  let currentDate = latestWorkoutDate;
  let currentWorkoutIndex = 0;

  while (currentWorkoutIndex < workouts.length) {
    const workoutDate = new Date(workouts[currentWorkoutIndex].createdAt);
    workoutDate.setHours(0, 0, 0, 0);

    if (currentDate.getTime() === workoutDate.getTime()) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
      currentWorkoutIndex++;
    } else if (
      currentDate.getTime() - workoutDate.getTime() ===
      24 * 60 * 60 * 1000
    ) {
      // Found a workout from the previous day
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      // Streak is broken
      break;
    }
  }

  return streak;
}

export async function getLastWorkout(userId: string) {
  return prisma.workout.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getWorkoutStats(userId: string) {
  const streak = await calculateWorkoutStreak(userId);
  const totalWorkouts = await prisma.workout.count({
    where: { userId },
  });
  const lastWorkout = await getLastWorkout(userId);

  return {
    streak,
    totalWorkouts,
    lastWorkout,
  };
}
