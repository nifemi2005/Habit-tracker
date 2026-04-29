"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Habit } from "@/src/types/habit";
import { getCurrentSession, logOut } from "@/src/lib/auth";
import { getHabits, saveHabits } from "@/src/lib/storage";
import { toggleHabitCompletion } from "@/src/lib/habits";
import HabitList from "../../components/habits/HabitList";
import HabitForm from "../../components/habits/HabitForm";

export default function DashBoard() {
  const router = useRouter();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [session, setSession] = useState<{
    userId: string;
    email: string;
  } | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  useEffect(() => {
    const currentSession = getCurrentSession();

    if (!currentSession) {
      router.push("/login");
      return;
    }
    setSession(currentSession);

    //load only this user's habit
    const allHabits = getHabits();
    const userHabits = allHabits.filter(
      (h) => h.userId === currentSession.userId,
    );
    setHabits(userHabits);
  }, [router]);

  function handleLogout() {
    logOut();
    router.push("./login");
  }

  function handleSaveHabit(habit: Habit) {
    const allHabits = getHabits();
    const exist = allHabits.find((h) => h.id === habit.id);

    let updated: Habit[];
    if (exist) {
      updated = allHabits.map((h) => (h.id === habit.id ? habit : h));
    } else {
      // adding new habit
      updated = [...allHabits, habit];
    }

    saveHabits(updated);
    const userHabits = updated.filter((h) => h.userId === session?.userId);
    setHabits(userHabits);
    setShowForm(false);
    setEditingHabit(null);
  }

  function handleDelete(habitId: string) {
    const allHabits = getHabits();
    const updated = allHabits.filter((h) => h.id !== habitId);
    saveHabits(updated);
    setHabits(updated.filter((h) => h.userId === session?.userId));
  }

  function handleToggle(habitId: string) {
    const today = new Date().toISOString().split("T")[0];
    const allHabits = getHabits();
    const updated = allHabits.map((h) => {
      if (h.id === habitId) return toggleHabitCompletion(h, today);
      return h;
    });
    saveHabits(updated);
    setHabits(updated.filter((h) => h.userId === session?.userId));
  }

  function handleEdit(habit: Habit) {
    setEditingHabit(habit);
    setShowForm(true);
  }

  return (
    <main className="min-h-screen bg-[#F7F5F0]">
      <div className="max-w-lg mx-auto">
        <header className="bg-white border-b border-[#ece9e3] px-4 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400">Good morning</p>
            <h1 className="text-lg font-medium text-gray-900">My habits</h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#EEEDFE] border border-[#AFA9EC] flex items-center justify-center text-xs font-medium text-[#534AB7]">
              {session?.email?.[0]?.toUpperCase()}
            </div>

            <button
              data-testid="auth-logout-button"
              onClick={handleLogout}
              className="text-xs text-gray-400 bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5 hover:bg-gray-100 transition-colors"
            >
              Log out
            </button>
          </div>
        </header>

        <div className="grid grid-cols-2 gap-3 p-4">
          <div className="bg-[#EEEDFE] border border-[#AFA9EC] rounded-xl p-3">
            <div className="text-2xl font-medium text-[#3C3489]">
              {habits.length}
            </div>
            <div className="text-xs text-[#534AB7] mt-0.5">habits total</div>
          </div>
          <div className="bg-[#E1F5EE] border border-[#5DCAA5] rounded-xl p-3">
            <div className="text-2xl font-medium text-[#085041]">
              {habits.length > 0
                ? Math.max(
                    ...habits.map((h) => {
                      const today = new Date().toISOString().split("T")[0];
                      return h.completions.filter((d) => d <= today).length;
                    }),
                  )
                : 0}
            </div>
            <p className="text-xs text-[#0F6E56] mt-0.5">best streak</p>
          </div>
        </div>

        <div className="flex items-center justify-between px-4 pb-3">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
            Today
          </p>
          <button
            data-testid="create-habit-button"
            onClick={() => {
              setEditingHabit(null);
              setShowForm(true);
            }}
            className="flex items-center gap-1.5 bg-gray-900 text-white text-xs font-medium px-3 py-1.5 rounded-full hover:bg-gray-700 transition-colors"
          >
            <span className="text-sm leading-none">+</span> New habit
          </button>
        </div>

        {showForm && (
          <div className="mx-4 mb-4">
            <HabitForm
              habit={editingHabit}
              userId={session?.userId ?? ""}
              onSave={handleSaveHabit}
              onCancel={() => {
                setShowForm(false);
                setEditingHabit(null);
              }}
            />
          </div>
        )}

        <div className="px-4 pb-8" data-testid="dashboard-page">
          <HabitList
            habits={habits}
            onToggle={handleToggle}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </main>
  );
}
