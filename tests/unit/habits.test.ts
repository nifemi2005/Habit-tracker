import { describe, test, expect, beforeEach } from "vitest";
import { toggleHabitCompletion } from "../../src/lib/habits";
import { signUp, logIn, logOut, getCurrentSession } from "../../src/lib/auth";
import {
  getUsers,
  saveUsers,
  getSession,
  saveSession,
  getHabits,
  saveHabits,
} from "../../src/lib/storage";
import { USERS_KEY, SESSION_KEY, HABITS_KEY } from "../../src/lib/constants";
import { Habit } from "../../src/types/habit";

// ---- localStorage mock ----
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(global, "localStorage", { value: localStorageMock });

// ---- toggleHabitCompletion tests ----
const baseHabit: Habit = {
  id: "habit-1",
  userId: "user-1",
  name: "Drink Water",
  description: "Stay hydrated",
  frequency: "daily",
  createdAt: "2026-01-01T00:00:00.000Z",
  completions: [],
};

describe("toggleHabitCompletion", () => {
  test("adds a completion date when the date is not present", () => {
    const result = toggleHabitCompletion(baseHabit, "2026-04-27");
    expect(result.completions).toContain("2026-04-27");
  });

  test("removes a completion date when the date already exists", () => {
    const habitWithCompletion = { ...baseHabit, completions: ["2026-04-27"] };
    const result = toggleHabitCompletion(habitWithCompletion, "2026-04-27");
    expect(result.completions).not.toContain("2026-04-27");
  });

  test("does not mutate the original habit object", () => {
    const original = { ...baseHabit, completions: [] };
    toggleHabitCompletion(original, "2026-04-27");
    expect(original.completions).toHaveLength(0);
  });

  test("does not return duplicate completion dates", () => {
    const habitWithDuplicate = {
      ...baseHabit,
      completions: ["2026-04-27", "2026-04-27"],
    };
    const result = toggleHabitCompletion(habitWithDuplicate, "2026-04-28");
    const count = result.completions.filter((d) => d === "2026-04-27").length;
    expect(count).toBe(1);
  });
});

// ---- storage tests ----
describe("storage", () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  test("saves and retrieves users", () => {
    const users = [
      { id: "1", email: "a@a.com", password: "123", createdAt: "2026-01-01" },
    ];
    saveUsers(users);
    expect(getUsers()).toEqual(users);
  });

  test("returns empty array when no users in storage", () => {
    expect(getUsers()).toEqual([]);
  });

  test("saves and retrieves session", () => {
    const session = { userId: "1", email: "a@a.com" };
    saveSession(session);
    expect(getSession()).toEqual(session);
  });

  test("removes session when null is saved", () => {
    saveSession({ userId: "1", email: "a@a.com" });
    saveSession(null);
    expect(getSession()).toBeNull();
  });

  test("saves and retrieves habits", () => {
    const habits: Habit[] = [{ ...baseHabit }];
    saveHabits(habits);
    expect(getHabits()).toEqual(habits);
  });

  test("returns empty array when no habits in storage", () => {
    expect(getHabits()).toEqual([]);
  });
});

// ---- constants tests ----
describe("constants", () => {
  test("exports correct localStorage keys", () => {
    expect(USERS_KEY).toBe("habit-tracker-users");
    expect(SESSION_KEY).toBe("habit-tracker-session");
    expect(HABITS_KEY).toBe("habit-tracker-habits");
  });
});

// ---- auth tests ----
describe("auth", () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  test("signs up a new user successfully", () => {
    const result = signUp("test@test.com", "password123");
    expect(result.success).toBe(true);
    expect(result.error).toBeNull();
  });

  test("rejects duplicate email on signup", () => {
    signUp("test@test.com", "password123");
    const result = signUp("test@test.com", "password456");
    expect(result.success).toBe(false);
    expect(result.error).toBe("User already exists");
  });

  test("logs in with correct credentials", () => {
    signUp("test@test.com", "password123");
    const result = logIn("test@test.com", "password123");
    expect(result.success).toBe(true);
    expect(result.error).toBeNull();
  });

  test("rejects login with wrong password", () => {
    signUp("test@test.com", "password123");
    const result = logIn("test@test.com", "wrongpassword");
    expect(result.success).toBe(false);
    expect(result.error).toBe("Invalid email or password");
  });

  test("logs out and clears session", () => {
    signUp("test@test.com", "password123");
    logOut();
    expect(getCurrentSession()).toBeNull();
  });

  test("creates a session on successful signup", () => {
    signUp("test@test.com", "password123");
    const session = getCurrentSession();
    expect(session).not.toBeNull();
    expect(session?.email).toBe("test@test.com");
  });
});
