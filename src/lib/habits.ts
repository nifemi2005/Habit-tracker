import { Habit } from "../types/habit";

export function toggleHabitCompletion(habit: Habit, date: string): Habit {
  // check if date already exists in completions
  const exists = habit.completions.includes(date);

  let updatedCompletions: string[];

  if (exists) {
    updatedCompletions = habit.completions.filter((d) => d !== date);
  } else {
    // add the date
    updatedCompletions = [...habit.completions, date];
  }

  // remove duplicates just to be safe
  const unique = [...new Set(updatedCompletions)];

  // return a new habit object — never mutate the original
  return {
    ...habit,
    completions: unique,
  };
}
