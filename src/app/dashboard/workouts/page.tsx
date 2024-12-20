'use client'

import { useState } from 'react'
import Link from 'next/link'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

const mockWorkouts = [
  {
    id: '1',
    name: 'Upper Body Strength',
    type: 'Strength',
    difficulty: 'Intermediate',
    duration: 45,
    calories: 320,
    date: '2024-12-19',
  },
  {
    id: '2',
    name: 'HIIT Cardio Blast',
    type: 'HIIT',
    difficulty: 'Advanced',
    duration: 30,
    calories: 400,
    date: '2024-12-18',
  },
  // Add more mock workouts as needed
]

export default function WorkoutsPage() {
  const [filter, setFilter] = useState('')
  const [loading] = useState(false)

  const filteredWorkouts = mockWorkouts.filter(
    (workout) =>
      workout.name.toLowerCase().includes(filter.toLowerCase()) ||
      workout.type.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Your Workouts</h1>
          <p className="mt-1 text-sm text-gray-400">
            View and manage your workout history
          </p>
        </div>
        <Link
          href="/dashboard/workouts/new"
          className="inline-flex items-center rounded-md bg-primary-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
        >
          New Workout
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <label htmlFor="search" className="sr-only">
            Search workouts
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="search"
              name="search"
              id="search"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="block w-full rounded-md border-0 bg-background py-1.5 pl-10 pr-3 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-500 sm:text-sm sm:leading-6"
              placeholder="Search workouts..."
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <LoadingSpinner className="h-8 w-8" />
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg bg-background-secondary shadow">
          <ul role="list" className="divide-y divide-gray-700">
            {filteredWorkouts.map((workout) => (
              <li key={workout.id}>
                <Link
                  href={`/dashboard/workouts/${workout.id}`}
                  className="block hover:bg-background"
                >
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <svg
                            className="h-6 w-6 text-primary-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                            />
                          </svg>
                        </div>
                        <p className="truncate text-sm font-medium text-white">
                          {workout.name}
                        </p>
                      </div>
                      <div className="ml-2 flex flex-shrink-0">
                        <p className="inline-flex rounded-full bg-primary-500/10 px-2 text-xs font-semibold leading-5 text-primary-500">
                          {workout.type}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-400">
                          <svg
                            className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                            />
                          </svg>
                          {workout.difficulty}
                        </p>
                        <p className="mt-2 flex items-center text-sm text-gray-400 sm:mt-0 sm:ml-6">
                          <svg
                            className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          {workout.duration} minutes
                        </p>
                        <p className="mt-2 flex items-center text-sm text-gray-400 sm:mt-0 sm:ml-6">
                          <svg
                            className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 10V3L4 14h7v7l9-11h-7z"
                            />
                          </svg>
                          {workout.calories} kcal
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-400 sm:mt-0">
                        <svg
                          className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <p>{workout.date}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
