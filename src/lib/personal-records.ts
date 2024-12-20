import { prisma } from "./prisma";

export type PersonalRecordType = "oneRepMax" | "maxWeight" | "maxReps" | "maxTime";

export async function getPersonalRecords(userId: string) {
  const records = await prisma.personalRecord.findMany({
    where: { userId },
    include: {
      exercise: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      date: "desc",
    },
  });

  return records;
}

export async function checkAndUpdatePersonalRecord({
  userId,
  exerciseId,
  value,
  unit,
  type,
  workoutId,
}: {
  userId: string;
  exerciseId: string;
  value: number;
  unit: string;
  type: PersonalRecordType;
  workoutId: string;
}) {
  // Get the current record for this exercise and type
  const currentRecord = await prisma.personalRecord.findUnique({
    where: {
      userId_exerciseId_type: {
        userId,
        exerciseId,
        type,
      },
    },
  });

  // If no record exists or the new value is higher, update/create the record
  if (!currentRecord || value > currentRecord.value) {
    const record = await prisma.personalRecord.upsert({
      where: {
        userId_exerciseId_type: {
          userId,
          exerciseId,
          type,
        },
      },
      update: {
        value,
        unit,
        date: new Date(),
        workoutId,
      },
      create: {
        userId,
        exerciseId,
        value,
        unit,
        type,
        date: new Date(),
        workoutId,
      },
    });

    return {
      record,
      isNewRecord: true,
      improvement: currentRecord ? value - currentRecord.value : value,
    };
  }

  return {
    record: currentRecord,
    isNewRecord: false,
    improvement: 0,
  };
}

export async function calculateOneRepMax(weight: number, reps: number) {
  // Brzycki Formula: 1RM = weight × (36 / (37 - reps))
  return Math.round(weight * (36 / (37 - reps)));
}

export async function getRecentPersonalRecords(userId: string, limit = 5) {
  const records = await prisma.personalRecord.findMany({
    where: { userId },
    include: {
      exercise: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      date: "desc",
    },
    take: limit,
  });

  return records;
}
