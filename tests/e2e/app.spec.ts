import { test, expect } from '@playwright/test'

test.describe('Habit Tracker app', () => {

  test.beforeEach(async ({ page }) => {
    // clear localStorage before each test
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
  })

  test('shows the splash screen and redirects unauthenticated users to /login', async ({ page }) => {
    await page.goto('/')

    // splash screen should be visible
    await expect(page.getByTestId('splash-screen')).toBeVisible()

    // should redirect to login
    await expect(page).toHaveURL('/login', { timeout: 5000 })
  })

  test('redirects authenticated users from / to /dashboard', async ({ page }) => {
    // create a session in localStorage first
    await page.goto('/')
    await page.evaluate(() => {
      const user = {
        id: 'user-123',
        email: 'test@test.com',
        password: 'password123',
        createdAt: new Date().toISOString(),
      }
      const session = { userId: 'user-123', email: 'test@test.com' }
      localStorage.setItem('habit-tracker-users', JSON.stringify([user]))
      localStorage.setItem('habit-tracker-session', JSON.stringify(session))
    })

    await page.goto('/')

    // should redirect to dashboard
    await expect(page).toHaveURL('/dashboard', { timeout: 5000 })
  })

  test('prevents unauthenticated access to /dashboard', async ({ page }) => {
    await page.goto('/dashboard')

    // should redirect to login
    await expect(page).toHaveURL('/login', { timeout: 5000 })
  })

  test('signs up a new user and lands on the dashboard', async ({ page }) => {
    await page.goto('/signup')

    await page.getByTestId('auth-signup-email').fill('newuser@test.com')
    await page.getByTestId('auth-signup-password').fill('password123')
    await page.getByTestId('auth-signup-submit').click()

    // should land on dashboard
    await expect(page).toHaveURL('/dashboard', { timeout: 5000 })
    await expect(page.getByTestId('dashboard-page')).toBeVisible()
  })

  test('logs in an existing user and loads only that user\'s habits', async ({ page }) => {
    // set up two users with different habits
    await page.goto('/')
    await page.evaluate(() => {
      const users = [
        { id: 'user-1', email: 'user1@test.com', password: 'pass123', createdAt: new Date().toISOString() },
        { id: 'user-2', email: 'user2@test.com', password: 'pass123', createdAt: new Date().toISOString() },
      ]
      const habits = [
        {
          id: 'habit-1',
          userId: 'user-1',
          name: 'Drink Water',
          description: '',
          frequency: 'daily',
          createdAt: new Date().toISOString(),
          completions: [],
        },
        {
          id: 'habit-2',
          userId: 'user-2',
          name: 'Morning Run',
          description: '',
          frequency: 'daily',
          createdAt: new Date().toISOString(),
          completions: [],
        },
      ]
      localStorage.setItem('habit-tracker-users', JSON.stringify(users))
      localStorage.setItem('habit-tracker-habits', JSON.stringify(habits))
    })

    await page.goto('/login')
    await page.getByTestId('auth-login-email').fill('user1@test.com')
    await page.getByTestId('auth-login-password').fill('pass123')
    await page.getByTestId('auth-login-submit').click()

    await expect(page).toHaveURL('/dashboard', { timeout: 5000 })

    // user1's habit should be visible
    await expect(page.getByTestId('habit-card-drink-water')).toBeVisible()

    // user2's habit should NOT be visible
    await expect(page.getByTestId('habit-card-morning-run')).not.toBeVisible()
  })

  test('creates a habit from the dashboard', async ({ page }) => {
    // sign up first
    await page.goto('/signup')
    await page.getByTestId('auth-signup-email').fill('creator@test.com')
    await page.getByTestId('auth-signup-password').fill('password123')
    await page.getByTestId('auth-signup-submit').click()

    await expect(page).toHaveURL('/dashboard', { timeout: 5000 })

    // open the form
    await page.getByTestId('create-habit-button').click()
    await expect(page.getByTestId('habit-form')).toBeVisible()

    // fill in the form
    await page.getByTestId('habit-name-input').fill('Drink Water')
    await page.getByTestId('habit-save-button').click()

    // habit card should appear
    await expect(page.getByTestId('habit-card-drink-water')).toBeVisible()
  })

  test('completes a habit for today and updates the streak', async ({ page }) => {
    // sign up and create a habit
    await page.goto('/signup')
    await page.getByTestId('auth-signup-email').fill('streak@test.com')
    await page.getByTestId('auth-signup-password').fill('password123')
    await page.getByTestId('auth-signup-submit').click()

    await expect(page).toHaveURL('/dashboard', { timeout: 5000 })

    await page.getByTestId('create-habit-button').click()
    await page.getByTestId('habit-name-input').fill('Drink Water')
    await page.getByTestId('habit-save-button').click()

    await expect(page.getByTestId('habit-card-drink-water')).toBeVisible()

    // streak should start at 0
    await expect(page.getByTestId('habit-streak-drink-water')).toContainText('0')

    // mark as complete
    await page.getByTestId('habit-complete-drink-water').click()

    // streak should update to 1
    await expect(page.getByTestId('habit-streak-drink-water')).toContainText('1')
  })

  test('persists session and habits after page reload', async ({ page }) => {
    // sign up and create a habit
    await page.goto('/signup')
    await page.getByTestId('auth-signup-email').fill('persist@test.com')
    await page.getByTestId('auth-signup-password').fill('password123')
    await page.getByTestId('auth-signup-submit').click()

    await expect(page).toHaveURL('/dashboard', { timeout: 5000 })

    await page.getByTestId('create-habit-button').click()
    await page.getByTestId('habit-name-input').fill('Read Books')
    await page.getByTestId('habit-save-button').click()

    await expect(page.getByTestId('habit-card-read-books')).toBeVisible()

    // reload the page
    await page.reload()

    // should still be on dashboard
    await expect(page).toHaveURL('/dashboard', { timeout: 5000 })

    // habit should still be there
    await expect(page.getByTestId('habit-card-read-books')).toBeVisible()
  })

  test('logs out and redirects to /login', async ({ page }) => {
    // sign up first
    await page.goto('/signup')
    await page.getByTestId('auth-signup-email').fill('logout@test.com')
    await page.getByTestId('auth-signup-password').fill('password123')
    await page.getByTestId('auth-signup-submit').click()

    await expect(page).toHaveURL('/dashboard', { timeout: 5000 })

    // click logout
    await page.getByTestId('auth-logout-button').click()

    // should redirect to login
    await expect(page).toHaveURL('/login', { timeout: 5000 })

    // going to dashboard should redirect back to login
    await page.goto('/dashboard')
    await expect(page).toHaveURL('/login', { timeout: 5000 })
  })

  test('loads the cached app shell when offline after the app has been loaded once', async ({ page, context }) => {
    // visit the app first so it gets cached
    await page.goto('/')
    await expect(page).toHaveURL('/login', { timeout: 5000 })

    // go offline
    await context.setOffline(true)

    // reload the page
    await page.goto('/')

    // app should still load without crashing
    const body = page.locator('body')
    await expect(body).toBeVisible()

    // go back online
    await context.setOffline(false)
  })

})