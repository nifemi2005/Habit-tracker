import { USERS_KEY, SESSION_KEY, HABITS_KEY } from './constants'
import { User, Session } from '../types/auth'
import { Habit } from '../types/habit'

// Users
export function getUsers(): User[] {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem(USERS_KEY)
  return data ? JSON.parse(data) : []
}

export function saveUsers(users: User[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

// Session
export function getSession(): Session | null {
  if (typeof window === 'undefined') return null
  const data = localStorage.getItem(SESSION_KEY)
  return data ? JSON.parse(data) : null
}

export function saveSession(session: Session | null): void {
  if (session === null) {
    localStorage.removeItem(SESSION_KEY)
  } else {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  }
}

// Habits
export function getHabits(): Habit[] {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem(HABITS_KEY)
  return data ? JSON.parse(data) : []
}

export function saveHabits(habits: Habit[]): void {
  localStorage.setItem(HABITS_KEY, JSON.stringify(habits))
}