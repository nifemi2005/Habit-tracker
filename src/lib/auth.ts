import { getUsers, saveUsers, getSession, saveSession } from './storage'
import { User, Session } from '../types/auth'

export function signUp(email: string, password: string): {
  success: boolean;
  error: string | null;
} {
  const users = getUsers()

  // check if email already exists
  const exists = users.find((u) => u.email === email)
  if (exists) {
    return { success: false, error: 'User already exists' }
  }

  // create new user
  const newUser: User = {
    id: crypto.randomUUID(),
    email,
    password,
    createdAt: new Date().toISOString(),
  }

  // save user
  saveUsers([...users, newUser])

  // create session
  saveSession({ userId: newUser.id, email: newUser.email })

  return { success: true, error: null }
}

export function logIn(email: string, password: string): {
  success: boolean;
  error: string | null;
} {
  const users = getUsers()

  // find user with matching email and password
  const user = users.find((u) => u.email === email && u.password === password)

  if (!user) {
    return { success: false, error: 'Invalid email or password' }
  }

  // create session
  saveSession({ userId: user.id, email: user.email })

  return { success: true, error: null }
}

export function logOut(): void {
  saveSession(null)
}

export function getCurrentSession(): Session | null {
  return getSession()
}