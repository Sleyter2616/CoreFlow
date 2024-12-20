'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

const difficultyLevels = ['Beginner', 'Intermediate', 'Advanced']
const workoutTypes = ['Strength', 'Cardio', 'HIIT', 'Yoga', 'Flexibility']
const durations = [15, 30, 45, 60, 90]

export default function NewWorkoutPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    type: 'Strength',
    difficulty: 'Beginner',
    duration: 30,
    focus: '',
    equipment: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // TODO: Call AI service to generate workout
      await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulate API call
      router.push('/dashboard/workouts')
    } catch (error) {
      console.error('Failed to generate workout:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Generate New Workout</h1>
        <p className="mt-1 text-sm text-gray-400">
          Let our AI create a personalized workout plan based on your preferences.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Workout Type */}
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-white">
              Workout Type
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-700 bg-background text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            >
              {workoutTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty Level */}
          <div>
            <label htmlFor="difficulty" className="block text-sm font-medium text-white">
              Difficulty Level
            </label>
            <select
              id="difficulty"
              name="difficulty"
              value={formData.difficulty}
              onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-700 bg-background text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            >
              {difficultyLevels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>

          {/* Duration */}
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-white">
              Duration (minutes)
            </label>
            <select
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-700 bg-background text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            >
              {durations.map((duration) => (
                <option key={duration} value={duration}>
                  {duration} minutes
                </option>
              ))}
            </select>
          </div>

          {/* Focus Areas */}
          <div>
            <label htmlFor="focus" className="block text-sm font-medium text-white">
              Focus Areas
            </label>
            <input
              type="text"
              name="focus"
              id="focus"
              value={formData.focus}
              onChange={(e) => setFormData({ ...formData, focus: e.target.value })}
              placeholder="e.g., Upper body, Core, Legs"
              className="mt-1 block w-full rounded-md border-gray-700 bg-background text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
          </div>
        </div>

        {/* Equipment */}
        <div>
          <label htmlFor="equipment" className="block text-sm font-medium text-white">
            Available Equipment
          </label>
          <textarea
            id="equipment"
            name="equipment"
            rows={3}
            value={formData.equipment}
            onChange={(e) => setFormData({ ...formData, equipment: e.target.value })}
            placeholder="List any equipment you have available (e.g., dumbbells, resistance bands, yoga mat)"
            className="mt-1 block w-full rounded-md border-gray-700 bg-background text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center rounded-md bg-primary-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 disabled:opacity-50"
          >
            {loading ? (
              <>
                <LoadingSpinner className="mr-2 h-4 w-4" />
                Generating...
              </>
            ) : (
              'Generate Workout'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
