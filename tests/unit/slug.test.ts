import { describe, test, expect } from "vitest";
import { getHabitSlug } from "../../src/lib/slug";
describe("getHabitSlug", () => {
  test("returns lowercase hyphenated slug for a basic habit name", () => {
    expect(getHabitSlug("Drink Water")).toBe("drink-water");
  });

  test("trims outer spaces and collapses repeated internal spaces", () => {
    expect(getHabitSlug('  Read   Books  ')).toBe('read-books');
  })

  test("removes non alphanumeric characters except hyphens", () => {
    expect(getHabitSlug('Read Books!!')).toBe('read-books')
  })
});
