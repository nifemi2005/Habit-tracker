'use client'

import { useState } from 'react'
import { Habit } from '../../types/habit'
import { getHabitSlug } from '../../lib/slug'
import { calculateStreaks } from '../../lib/streaks'

type HabitCardProps = {
  habit: Habit
  onToggle: (habitId: string) => void
  onEdit: (habit: Habit) => void
  onDelete: (habitId: string) => void
}

const borderColors = [
  'border-l-[#7F77DD]',
  'border-l-[#1D9E75]',
  'border-l-[#BA7517]',
  'border-l-[#D4537E]',
  'border-l-[#378ADD]',
]

export default function HabitCard({ habit, onToggle, onEdit, onDelete }: HabitCardProps) {
  const [showConfirm, setShowConfirm] = useState(false)

  const slug = getHabitSlug(habit.name)
  const today = new Date().toISOString().split('T')[0]
  const isCompleted = habit.completions.includes(today)
  const streak = calculateStreaks(habit.completions)

  // pick a consistent color per habit based on its id
  const colorIndex = habit.id.charCodeAt(0) % borderColors.length
  const borderColor = borderColors[colorIndex]

  function handleDelete() {
    if (showConfirm) {
      onDelete(habit.id)
      setShowConfirm(false)
    } else {
      setShowConfirm(true)
    }
  }

  return (
    <div
      data-testid={`habit-card-${slug}`}
      className={`bg-white border-l-4 ${borderColor} border-t border-r border-b border-t-[#ece9e3] border-r-[#ece9e3] border-b-[#ece9e3] rounded-2xl p-3 transition-opacity ${isCompleted ? 'opacity-60' : 'opacity-100'}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0 pr-3">
          <p className={`text-sm font-medium text-gray-900 ${isCompleted ? 'line-through text-gray-400' : ''}`}>
            {habit.name}
          </p>
          {habit.description && (
            <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
              {habit.description}
            </p>
          )}
        </div>

        {/* Completion toggle */}
        <button
          data-testid={`habit-complete-${slug}`}
          onClick={() => onToggle(habit.id)}
          aria-label={isCompleted ? 'Mark incomplete' : 'Mark complete'}
          aria-pressed={isCompleted}
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
            isCompleted
              ? 'bg-[#1D9E75] border-[#1D9E75]'
              : 'bg-white border-gray-300 hover:border-gray-400'
          }`}
        >
          {isCompleted && (
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
              <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </button>
      </div>

      <div className="flex items-center justify-between">
        {/* Streak */}
        <div
          data-testid={`habit-streak-${slug}`}
          className="flex items-center gap-1.5"
        >
          <div className="w-2 h-2 rounded-full bg-[#EF9F27] shrink-0" />
          <span className="text-xs text-gray-600">
            <span className="font-medium text-[#BA7517]">{streak}</span> day streak
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-medium text-[10px] text-gray-600 bg-[#F7F5F0] border border-[#e8e5e0] rounded-full px-2 py-0.5">
            {habit.frequency}
          </span>

          {/* Edit button */}
          <button
            data-testid={`habit-edit-${slug}`}
            onClick={() => onEdit(habit)}
            aria-label="Edit habit"
            className="text-xs text-gray-600 hover:text-gray-700 transition-colors px-1"
          >
            Edit
          </button>

          {/* Delete button */}
          {showConfirm ? (
            <div className="flex items-center gap-1">
              <button
                data-testid="confirm-delete-button"
                onClick={handleDelete}
                className="text-xs text-red-500 font-medium hover:text-red-700 transition-colors px-1"
              >
                Confirm
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="text-xs text-gray-600 hover:text-gray-600 transition-colors px-1"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              data-testid={`habit-delete-${slug}`}
              onClick={handleDelete}
              aria-label="Delete habit"
              className="text-xs text-gray-600 hover:text-red-500 transition-colors px-1"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  )
}