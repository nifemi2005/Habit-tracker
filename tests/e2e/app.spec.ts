import { test } from '@playwright/test'

test.describe('Habit Tracker app', () => {
  test.skip('shows the splash screen and redirects unauthenticated users to /login', async () => {})
  test.skip('redirects authenticated users from / to /dashboard', async () => {})
  test.skip('prevents unauthenticated access to /dashboard', async () => {})
  test.skip('signs up a new user and lands on the dashboard', async () => {})
  test.skip('logs in an existing user and loads only that user\'s habits', async () => {})
  test.skip('creates a habit from the dashboard', async () => {})
  test.skip('completes a habit for today and updates the streak', async () => {})
  test.skip('persists session and habits after page reload', async () => {})
  test.skip('logs out and redirects to /login', async () => {})
  test.skip('loads the cached app shell when offline after the app has been loaded once', async () => {})
})