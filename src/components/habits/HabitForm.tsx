'use client'

import { useState, useEffect } from 'react'
import { Habit } from '../../types/habit'
import { validateHabitName } from '../../lib/validators'
import { getHabitSlug } from '../../lib/slug'

type HabitFormProps = {
  habit: Habit | null
  userId: string
  onSave: (habit: Habit) => void
  onCancel: () => void
}

export default function HabitForm({ habit, userId, onSave, onCancel }: HabitFormProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (habit) {
      setName(habit.name)
      setDescription(habit.description)
    } else {
      setName('')
      setDescription('')
    }
    setError(null)
  }, [habit])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const validation = validateHabitName(name)
    if (!validation.valid) {
      setError(validation.error)
      return
    }

    const now = new Date().toISOString()

    const savedHabit: Habit = habit
      ? {
          ...habit,
          name: validation.value,
          description: description.trim(),
        }
      : {
          id: crypto.randomUUID(),
          userId,
          name: validation.value,
          description: description.trim(),
          frequency: 'daily',
          createdAt: now,
          completions: [],
        }

    onSave(savedHabit)
  }

  return (
    <div
      data-testid="habit-form"
      className="bg-white border border-[#e0ddd8] rounded-2xl overflow-hidden"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#ece9e3]">
        <h2 className="text-sm font-medium text-gray-900">
          {habit ? 'Edit habit' : 'New habit'}
        </h2>
        <button
          onClick={onCancel}
          className="w-6 h-6 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors text-sm"
          aria-label="Close form"
        >
          ×
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-4">

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="habit-name"
            className="text-xs font-medium text-gray-400 uppercase tracking-wider"
          >
            Name
          </label>
          <input
            id="habit-name"
            type="text"
            data-testid="habit-name-input"
            value={name}
            onChange={(e) => { setName(e.target.value); setError(null) }}
            placeholder="e.g. Drink water"
            className="bg-[#F7F5F0] border border-[#e0ddd8] rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 placeholder:text-gray-300"
          />
          {error && (
            <p className="text-xs text-red-500">{error}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="habit-description"
            className="text-xs font-medium text-gray-400 uppercase tracking-wider"
          >
            Description
            <span className="text-gray-300 ml-1 normal-case">(optional)</span>
          </label>
          <textarea
            id="habit-description"
            data-testid="habit-description-input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. 8 glasses a day"
            rows={2}
            className="bg-[#F7F5F0] border border-[#e0ddd8] rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 placeholder:text-gray-300 resize-none"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="habit-frequency"
            className="text-xs font-medium text-gray-400 uppercase tracking-wider"
          >
            Frequency
          </label>
          <select
            id="habit-frequency"
            data-testid="habit-frequency-select"
            defaultValue="daily"
            className="bg-[#F7F5F0] border border-[#e0ddd8] rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
          >
            <option value="daily">Daily</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-1">
          <button
            type="submit"
            data-testid="habit-save-button"
            className="bg-gray-900 text-white rounded-xl py-2.5 text-sm font-medium hover:bg-gray-700 transition-colors"
          >
            {habit ? 'Save changes' : 'Save habit'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-white text-gray-500 border border-[#e0ddd8] rounded-xl py-2.5 text-sm hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>

      </form>
    </div>
  )
}