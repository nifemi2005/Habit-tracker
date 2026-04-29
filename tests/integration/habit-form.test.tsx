import { describe, test, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import HabitForm from '../../src/components/habits/HabitForm'
import HabitList from '../../src/components/habits/HabitList'
import { Habit } from '../../src/types/habit'

const mockPush = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}))

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

const baseHabit: Habit = {
  id: 'habit-1',
  userId: 'user-1',
  name: 'Drink Water',
  description: 'Stay hydrated',
  frequency: 'daily',
  createdAt: '2026-01-01T00:00:00.000Z',
  completions: [],
}

describe('habit form', () => {
  beforeEach(() => {
    localStorageMock.clear()
    mockPush.mockClear()
  })

  test('shows a validation error when habit name is empty', async () => {
    const user = userEvent.setup()
    const onSave = vi.fn()
    const onCancel = vi.fn()

    render(
      <HabitForm
        habit={null}
        userId="user-1"
        onSave={onSave}
        onCancel={onCancel}
      />
    )

    await user.click(screen.getByTestId('habit-save-button'))

    await waitFor(() => {
      expect(screen.getByText('Habit name is required')).toBeInTheDocument()
      expect(onSave).not.toHaveBeenCalled()
    })
  })

  test('creates a new habit and renders it in the list', async () => {
    const user = userEvent.setup()
    const habits: Habit[] = []
    const onSave = vi.fn((habit: Habit) => habits.push(habit))
    const onCancel = vi.fn()
    const onToggle = vi.fn()
    const onEdit = vi.fn()
    const onDelete = vi.fn()

    const { rerender } = render(
      <>
        <HabitForm habit={null} userId="user-1" onSave={onSave} onCancel={onCancel} />
        <HabitList habits={habits} onToggle={onToggle} onEdit={onEdit} onDelete={onDelete} />
      </>
    )

    await user.type(screen.getByTestId('habit-name-input'), 'Drink Water')
    await user.click(screen.getByTestId('habit-save-button'))

    await waitFor(() => expect(onSave).toHaveBeenCalled())

    rerender(
      <>
        <HabitForm habit={null} userId="user-1" onSave={onSave} onCancel={onCancel} />
        <HabitList habits={habits} onToggle={onToggle} onEdit={onEdit} onDelete={onDelete} />
      </>
    )

    await waitFor(() => {
      expect(screen.getByTestId('habit-card-drink-water')).toBeInTheDocument()
    })
  })

  test('edits an existing habit and preserves immutable fields', async () => {
    const user = userEvent.setup()
    const onSave = vi.fn()
    const onCancel = vi.fn()

    render(
      <HabitForm
        habit={baseHabit}
        userId="user-1"
        onSave={onSave}
        onCancel={onCancel}
      />
    )

    // clear and retype name
    await user.clear(screen.getByTestId('habit-name-input'))
    await user.type(screen.getByTestId('habit-name-input'), 'Drink More Water')
    await user.click(screen.getByTestId('habit-save-button'))

    await waitFor(() => {
      expect(onSave).toHaveBeenCalled()
      const saved = onSave.mock.calls[0][0] as Habit
      // name updated
      expect(saved.name).toBe('Drink More Water')
      // immutable fields preserved
      expect(saved.id).toBe(baseHabit.id)
      expect(saved.userId).toBe(baseHabit.userId)
      expect(saved.createdAt).toBe(baseHabit.createdAt)
      expect(saved.completions).toEqual(baseHabit.completions)
    })
  })

  test('deletes a habit only after explicit confirmation', async () => {
    const user = userEvent.setup()
    const onToggle = vi.fn()
    const onEdit = vi.fn()
    const onDelete = vi.fn()

    render(
      <HabitList
        habits={[baseHabit]}
        onToggle={onToggle}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    )

    // first click shows confirm button
    await user.click(screen.getByTestId('habit-delete-drink-water'))
    expect(onDelete).not.toHaveBeenCalled()

    // confirm button appears
    await waitFor(() => {
      expect(screen.getByTestId('confirm-delete-button')).toBeInTheDocument()
    })

    // second click confirms deletion
    await user.click(screen.getByTestId('confirm-delete-button'))
    expect(onDelete).toHaveBeenCalledWith(baseHabit.id)
  })

  test('toggles completion and updates the streak display', async () => {
    const user = userEvent.setup()
    const today = new Date().toISOString().split('T')[0]
    const onToggle = vi.fn()
    const onEdit = vi.fn()
    const onDelete = vi.fn()

    const { rerender } = render(
      <HabitList
        habits={[baseHabit]}
        onToggle={onToggle}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    )

    // streak starts at 0
    expect(screen.getByTestId('habit-streak-drink-water')).toHaveTextContent('0')

    // click complete
    await user.click(screen.getByTestId('habit-complete-drink-water'))
    expect(onToggle).toHaveBeenCalledWith(baseHabit.id)

    // rerender with updated completions
    const updatedHabit = { ...baseHabit, completions: [today] }
    rerender(
      <HabitList
        habits={[updatedHabit]}
        onToggle={onToggle}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    )

    await waitFor(() => {
      expect(screen.getByTestId('habit-streak-drink-water')).toHaveTextContent('1')
    })
  })
})