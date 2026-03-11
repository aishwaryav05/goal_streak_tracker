"use client";

import { useCallback, useEffect, useState } from "react";
import { getGoals, getStreak } from "../services/api";
import GoalCard from "../components/GoalCard";
import CreateGoalForm from "../components/CreateGoalForm";
import DashboardStats from "../components/DashboardStats";

type Goal = {
  id: number;
  title: string;
  description: string;
  is_active?: boolean;
  completed_today?: boolean;
};

export default function Home() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bestStreak, setBestStreak] = useState(0);

  const fetchGoals = useCallback(async () => {
    try {
      const data = await getGoals();
      setGoals(data);
      const streaks = await Promise.all(
        data.map(async (goal: Goal) => {
          try {
            const result = await getStreak(goal.id);
            return result.current_streak ?? 0;
          } catch {
            return 0;
          }
        })
      );
      setBestStreak(streaks.length > 0 ? Math.max(...streaks) : 0);
      setError(null);
    } catch {
      setError("Could not load goals. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const completedToday = goals.filter((goal) => goal.completed_today).length;

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto px-6">
        <h1 className="text-4xl font-bold mb-2 text-gray-900">Student Consistency Tracker</h1>
        <p className="text-gray-500 mb-8">Build daily consistency with goal streaks</p>

        {!loading && !error && (
          <DashboardStats goals={goals} completedToday={completedToday} bestStreak={bestStreak} />
        )}

        <div className="mt-8">
          <CreateGoalForm onCreated={fetchGoals} />
        </div>

        <section className="mt-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Today&apos;s Goals</h2>

          {loading && <p className="text-gray-400">Loading goals&hellip;</p>}
          {error && <p className="text-red-500">{error}</p>}

          {!loading && !error && goals.length === 0 && (
            <div className="text-center py-20 text-gray-400 bg-white rounded-xl shadow-sm">
              No goals yet. Start your first streak today.
            </div>
          )}

          {goals.length > 0 && (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {goals.map((goal) => (
                <GoalCard key={goal.id} goal={goal} onRefresh={fetchGoals} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
