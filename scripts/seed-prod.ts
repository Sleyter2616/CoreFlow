import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Delete all existing data
  await prisma.workoutExercise.deleteMany({})
  await prisma.workout.deleteMany({})
  await prisma.subscription.deleteMany({})
  await prisma.exercise.deleteMany({})
  await prisma.user.deleteMany({})

  // Create exercises
  const pushups = await prisma.exercise.create({
    data: {
      id: 'pushups',
      name: 'Push-ups',
      description: 'Classic bodyweight exercise for chest and triceps',
      type: 'strength',
      muscle: ['chest', 'triceps', 'shoulders'],
      equipment: ['none'],
      difficulty: 'beginner'
    }
  })

  const squats = await prisma.exercise.create({
    data: {
      id: 'squats',
      name: 'Squats',
      description: 'Fundamental lower body exercise',
      type: 'strength',
      muscle: ['quadriceps', 'hamstrings', 'glutes'],
      equipment: ['none'],
      difficulty: 'beginner'
    }
  })

  const running = await prisma.exercise.create({
    data: {
      id: 'running',
      name: 'Running',
      description: 'Cardiovascular exercise',
      type: 'cardio',
      muscle: ['legs', 'core'],
      equipment: ['none'],
      difficulty: 'beginner'
    }
  })

  // Create a test user with a specific email
  const hashedPassword = await bcrypt.hash('password123', 10)
  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      name: 'Test User',
      password: hashedPassword,
      height: 175, // cm
      weight: 70, // kg
      dateOfBirth: new Date('1990-01-01'),
      gender: 'male',
      fitnessLevel: 'intermediate',
      subscription: {
        create: {
          plan: 'PRO',
          status: 'active',
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        }
      }
    }
  })

  // Create some test workouts
  const workout1 = await prisma.workout.create({
    data: {
      userId: user.id,
      type: 'strength',
      difficulty: 'intermediate',
      name: 'Full Body Workout',
      duration: 45,
      calories: 300,
      exercises: {
        create: [
          {
            exerciseId: pushups.id,
            sets: 3,
            reps: 12,
            weight: 0,
            duration: 0,
            notes: 'Keep core tight',
            order: 1
          },
          {
            exerciseId: squats.id,
            sets: 4,
            reps: 10,
            weight: 20,
            duration: 0,
            notes: 'Focus on form',
            order: 2
          }
        ]
      }
    }
  })

  const workout2 = await prisma.workout.create({
    data: {
      userId: user.id,
      type: 'cardio',
      difficulty: 'beginner',
      name: 'Morning Run',
      duration: 30,
      calories: 250,
      exercises: {
        create: [
          {
            exerciseId: running.id,
            sets: 1,
            reps: 1,
            weight: 0,
            duration: 30,
            notes: 'Steady pace',
            order: 1
          }
        ]
      }
    }
  })

  console.log('Database has been seeded with test data:', {
    user: { id: user.id, email: user.email },
    exercises: [pushups.id, squats.id, running.id],
    workouts: [workout1.id, workout2.id]
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
