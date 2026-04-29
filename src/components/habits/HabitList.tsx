import { Habit } from '@/src/types/habit'
import HabitCard from './HabitCard'

type HabitListProps = {
  habits: Habit[]
  onToggle: (habitId: string) => void
  onEdit: (habit: Habit) => void
  onDelete: (habitId: string) => void
}

export default function HabitList({ habits, onToggle, onEdit, onDelete }: HabitListProps) {
  if (habits.length === 0) {
    return (
      <div
        data-testid="empty-state"
        className="flex flex-col items-center justify-center py-16 gap-3 text-center"
      >
        <div className="w-12 h-12 rounded-full border-2 border-dashed border-gray-200 flex items-center justify-center">
          <span className="text-xl text-gray-300 leading-none">+</span>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-400">No habits yet</p>
          <p className="text-xs text-gray-300 mt-1 leading-relaxed">
            Add your first habit above to<br />start building your streak.
          </p>
        </div>
      </div>
    )
  }

  return (
    <ul className="flex flex-col gap-3">
      {habits.map((habit) => (
        <li key={habit.id}>
          <HabitCard
            habit={habit}
            onToggle={onToggle}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </li>
      ))}
    </ul>
  )
}