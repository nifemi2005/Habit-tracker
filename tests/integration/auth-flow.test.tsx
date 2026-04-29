import { describe, test, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SignupForm from '../../src/components/auth/SignupForm'
import LoginForm from '../../src/components/auth/LoginForm'

// mock next/navigation
const mockPush = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}))

// localStorage mock
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value },
    removeItem: (key: string) => { delete store[key] },
    clear: () => { store = {} },
  }
})()
Object.defineProperty(global, 'localStorage', { value: localStorageMock })

describe('auth flow', () => {
  beforeEach(() => {
    localStorageMock.clear()
    mockPush.mockClear()
  })

  test('submits the signup form and creates a session', async () => {
    const user = userEvent.setup()
    render(<SignupForm />)

    await user.type(screen.getByTestId('auth-signup-email'), 'test@test.com')
    await user.type(screen.getByTestId('auth-signup-password'), 'password123')
    await user.click(screen.getByTestId('auth-signup-submit'))

    await waitFor(() => {
      // session should be created in localStorage
      const session = JSON.parse(localStorageMock.getItem('habit-tracker-session') ?? 'null')
      expect(session).not.toBeNull()
      expect(session.email).toBe('test@test.com')
      // should redirect to dashboard
      expect(mockPush).toHaveBeenCalledWith('/dashboard')
    })
  })

  test('shows an error for duplicate signup email', async () => {
    const user = userEvent.setup()

    // first signup
    render(<SignupForm />)
    await user.type(screen.getByTestId('auth-signup-email'), 'test@test.com')
    await user.type(screen.getByTestId('auth-signup-password'), 'password123')
    await user.click(screen.getByTestId('auth-signup-submit'))

    // second signup with same email
    render(<SignupForm />)
    await user.type(screen.getAllByTestId('auth-signup-email')[1], 'test@test.com')
    await user.type(screen.getAllByTestId('auth-signup-password')[1], 'password456')
    await user.click(screen.getAllByTestId('auth-signup-submit')[1])

    await waitFor(() => {
      expect(screen.getByText('User already exists')).toBeInTheDocument()
    })
  })

  test('submits the login form and stores the active session', async () => {
    const user = userEvent.setup()

    // create a user first
    const { signUp } = await import('../../src/lib/auth')
    signUp('login@test.com', 'password123')
    localStorageMock.removeItem('habit-tracker-session')

    render(<LoginForm />)
    await user.type(screen.getByTestId('auth-login-email'), 'login@test.com')
    await user.type(screen.getByTestId('auth-login-password'), 'password123')
    await user.click(screen.getByTestId('auth-login-submit'))

    await waitFor(() => {
      const session = JSON.parse(localStorageMock.getItem('habit-tracker-session') ?? 'null')
      expect(session).not.toBeNull()
      expect(session.email).toBe('login@test.com')
      expect(mockPush).toHaveBeenCalledWith('/dashboard')
    })
  })

  test('shows an error for invalid login credentials', async () => {
    const user = userEvent.setup()
    render(<LoginForm />)

    await user.type(screen.getByTestId('auth-login-email'), 'nobody@test.com')
    await user.type(screen.getByTestId('auth-login-password'), 'wrongpassword')
    await user.click(screen.getByTestId('auth-login-submit'))

    await waitFor(() => {
      expect(screen.getByText('Invalid email or password')).toBeInTheDocument()
    })
  })
})