'use client'

import Link from 'next/link'
import { ThemeToggle } from '../theme-toggle'
import { Logo } from '../logo'
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'

export function Navbar() {
  const { data: session } = useSession()
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  return (
    <nav className="bg-background-secondary border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <Logo className="text-primary-500" />
                <span className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 text-transparent bg-clip-text">
                  CoreFlow
                </span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/dashboard"
                className="border-transparent text-gray-300 hover:text-primary-400 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Dashboard
              </Link>
              <Link
                href="/workouts"
                className="border-transparent text-gray-300 hover:text-primary-400 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Workouts
              </Link>
              <Link
                href="/progress"
                className="border-transparent text-gray-300 hover:text-primary-400 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Progress
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
            <ThemeToggle />
            
            {session ? (
              <>
                <button
                  type="button"
                  className="bg-background p-1 rounded-full text-gray-400 hover:text-primary-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <span className="sr-only">View notifications</span>
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                </button>

                <div className="ml-3 relative">
                  <div>
                    <button
                      type="button"
                      className="bg-background rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                    >
                      <span className="sr-only">Open user menu</span>
                      <img
                        className="h-8 w-8 rounded-full"
                        src={session.user?.image || "https://avatars.githubusercontent.com/u/1?v=4"}
                        alt=""
                      />
                    </button>
                  </div>
                  
                  {isProfileOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-background ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="py-1">
                        <Link
                          href="/profile"
                          className="block px-4 py-2 text-sm text-gray-300 hover:bg-background-secondary"
                        >
                          Your Profile
                        </Link>
                        <Link
                          href="/settings"
                          className="block px-4 py-2 text-sm text-gray-300 hover:bg-background-secondary"
                        >
                          Settings
                        </Link>
                        <button
                          onClick={() => signOut()}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-background-secondary"
                        >
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex space-x-4">
                <Link
                  href="/login"
                  className="text-gray-300 hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  className="bg-primary-500 text-white hover:bg-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
