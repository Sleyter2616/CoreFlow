import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { 
  startOfWeek, startOfMonth, startOfYear, endOfWeek, endOfMonth, endOfYear,
  subWeeks, subMonths, format 
} from "date-fns";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const timeframe = searchParams.get("timeframe") || "week";

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    let startDate: Date;
    let endDate: Date;
    const now = new Date();

    switch (timeframe) {
      case "week":
        startDate = startOfWeek(now);
        endDate = endOfWeek(now);
        break;
      case "month":
        startDate = startOfMonth(now);
        endDate = endOfMonth(now);
        break;
      case "year":
        startDate = startOfYear(now);
        endDate = endOfYear(now);
        break;
      default:
        startDate = startOfWeek(now);
        endDate = endOfWeek(now);
    }

    // Get current period workouts
    const workouts = await prisma.workout.findMany({
      where: {
        userId: user.id,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        exercises: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // Get previous period workouts for progress calculation
    const previousStartDate = timeframe === "week" 
      ? subWeeks(startDate, 1)
      : subMonths(startDate, 1);
    
    const previousWorkouts = await prisma.workout.findMany({
      where: {
        userId: user.id,
        createdAt: {
          gte: previousStartDate,
          lt: startDate,
        },
      },
    });

    // Calculate progress percentages
    const weeklyProgress = calculateProgress(
      previousWorkouts.length,
      workouts.length
    );

    const monthlyProgress = calculateProgress(
      previousWorkouts.reduce((sum, w) => sum + w.duration, 0),
      workouts.reduce((sum, w) => sum + w.duration, 0)
    );

    // Calculate daily aggregates
    const dailyData = workouts.reduce((acc: any, workout) => {
      const date = format(workout.createdAt, 'yyyy-MM-dd');
      if (!acc[date]) {
        acc[date] = {
          date,
          workouts: 0,
          duration: 0,
          calories: 0,
        };
      }
      acc[date].workouts += 1;
      acc[date].duration += workout.duration;
      acc[date].calories += workout.calories;
      return acc;
    }, {});

    // Convert to array and sort by date
    const data = Object.values(dailyData).sort((a: any, b: any) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Calculate workout type distribution
    const workoutTypes = workouts.reduce((acc: any, workout) => {
      const type = workout.type || 'Other';
      if (!acc[type]) {
        acc[type] = 0;
      }
      acc[type]++;
      return acc;
    }, {});

    const workoutTypeData = Object.entries(workoutTypes).map(([name, value]) => ({
      name,
      value,
    }));

    // Calculate totals and averages
    const totalWorkouts = workouts.length;
    const totalDuration = workouts.reduce((sum, w) => sum + w.duration, 0);
    const totalCalories = workouts.reduce((sum, w) => sum + (w.calories || 0), 0);
    const avgDuration = totalWorkouts > 0 ? Math.round(totalDuration / totalWorkouts) : 0;

    return NextResponse.json({
      data,
      summary: {
        totalWorkouts,
        avgDuration,
        totalDuration,
        totalCalories,
        workoutTypes: workoutTypeData,
        weeklyProgress,
        monthlyProgress,
      },
    });
  } catch (error) {
    console.error("[PROGRESS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

function calculateProgress(previous: number, current: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}
