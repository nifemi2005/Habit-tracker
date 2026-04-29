# Habit Tracker PWA

A mobile-first Progressive Web App for tracking daily habits and building streaks. Built with Next.js, TypeScript, Tailwind CSS, and localStorage for persistence.

---

## Project Overview

Habit Tracker allows users to:
- Sign up and log in with email and password
- Create, edit, and delete habits
- Mark habits complete for today and unmark them
- View a live current streak for each habit
- Retain all data after page reload
- Install the app on their device as a PWA
- Load the cached app shell offline without crashing

Authentication and persistence are fully local and deterministic — no external database or auth service is used.

---

## Setup Instructions

**Requirements:**
- Node.js 18 or higher
- npm 9 or higher

**Steps:**

1. Clone the repository:
```bash
   git clone https://github.com/nifemi2005/habit-tracker.git
   cd habit-tracker
```

2. Install dependencies:
```bash
   npm install
```

3. Install Playwright browsers:
```bash
   npx playwright install
```

---

## Run Instructions

**Development:**
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

**Production:**
```bash
npm run build
npm run start
```
Use this mode to test the PWA and service worker.

---

## Test Instructions

**Run all tests:**
```bash
npm test
```

**Run unit tests only:**
```bash
npm run test:unit
```

**Run integration tests only:**
```bash
npm run test:integration
```

**Run E2E tests only:**
```bash
npm run test:e2e
```

**View coverage report:**
```bash
npm run test:unit
```
The coverage report is printed in the terminal after the unit tests run. Minimum threshold is 80% line coverage for files inside `src/lib`.

---

## Local Persistence Structure

All data is stored in `localStorage` using three keys:

**`habit-tracker-users`**
Stores a JSON array of registered users:
```json
[
  {
    "id": "uuid",
    "email": "user@example.com",
    "password": "password123",
    "createdAt": "2026-01-01T00:00:00.000Z"
  }
]
```

**`habit-tracker-session`**
Stores the currently logged in user's session or `null`:
```json
{
  "userId": "uuid",
  "email": "user@example.com"
}
```

**`habit-tracker-habits`**
Stores a JSON array of all habits across all users:
```json
[
  {
    "id": "uuid",
    "userId": "uuid",
    "name": "Drink Water",
    "description": "8 glasses a day",
    "frequency": "daily",
    "createdAt": "2026-01-01T00:00:00.000Z",
    "completions": ["2026-04-27", "2026-04-28"]
  }
]
```

Each user only sees habits where `userId` matches their session `userId`.

---

## PWA Support

The app is installable and works offline using two files:

**`public/manifest.json`**
Defines the app name, icons, theme color, start URL and display mode. This is what the browser reads when deciding how to install the app.

**`public/sw.js`**
A service worker that:
- Caches the app shell on first load (install event)
- Serves cached pages when offline (fetch event)
- Cleans up old caches when updated (activate event)

The service worker is registered on the client via `src/components/shared/ServiceWorkerRegister.tsx` which runs a `useEffect` on mount.

To test PWA behavior, run the production build and visit the app in Chrome. The install icon will appear in the address bar.

---

## Trade-offs and Limitations

- **No password hashing** — passwords are stored as plain text in localStorage. In a real app, passwords would be hashed using bcrypt or similar before storage.
- **No token expiry** — sessions persist indefinitely until the user logs out. A real app would use expiring tokens.
- **localStorage limits** — browsers limit localStorage to ~5MB. A large number of habits or completions could eventually hit this limit.
- **No sync across devices** — since data lives in localStorage, it is device-specific. Habits created on one device won't appear on another.
- **Service worker caching** — the service worker caches a fixed app shell. Dynamic data (habits, session) is always read from localStorage, not the cache.
- **Single frequency** — only daily frequency is supported in this stage.

---

## Test File to Behavior Mapping

| Test file | What it verifies |
|-----------|-----------------|
| `tests/unit/slug.test.ts` | `getHabitSlug()` correctly converts habit names to URL-safe slugs — lowercase, hyphenated, no special characters |
| `tests/unit/validators.test.ts` | `validateHabitName()` rejects empty names, names over 60 characters, and returns trimmed valid values |
| `tests/unit/streaks.test.ts` | `calculateCurrentStreak()` returns correct streak counts, handles duplicates, breaks on missing days |
| `tests/unit/habits.test.ts` | `toggleHabitCompletion()` adds and removes dates correctly without mutating the original habit. Also covers storage read/write and auth signup/login/logout logic |
| `tests/integration/auth-flow.test.tsx` | Signup form creates a session and redirects. Login form stores session. Both forms show correct error messages for invalid input |
| `tests/integration/habit-form.test.tsx` | Habit form validates name, creates habits, edits without changing immutable fields, requires confirmation before delete, and updates streak on toggle |
| `tests/e2e/app.spec.ts` | Full user flows in a real browser — splash redirect, auth protection, signup, login, habit creation, completion, streak update, persistence after reload, logout, and offline behavior |