"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { completeGoal, completeYesterday, deleteGoal, getStreak } from "../services/api";
import StreakCalendar from "./StreakCalendar";

export default function GoalCard({ goal, onRefresh }) {
  const [streak, setStreak] = useState(null);
  const [completing, setCompleting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [yesterdayMode, setYesterdayMode] = useState(false);
  const [missReason, setMissReason] = useState("");

  useEffect(() => {
    getStreak(goal.id)
      .then((data) => setStreak(data.current_streak))
      .catch(() => setStreak(0));
  }, [goal.id]);

  async function handleComplete() {
    setCompleting(true);
    try {
      await completeGoal(goal.id);
      onRefresh();
    } finally {
      setCompleting(false);
    }
  }

  async function handleDelete() {
    if (!confirm(`Delete "${goal.title}"?`)) return;
    setDeleting(true);
    try {
      await deleteGoal(goal.id);
      onRefresh();
    } finally {
      setDeleting(false);
    }
  }

  async function handleYesterdayMissed() {
    await completeYesterday(goal.id, false, missReason || null);
    setYesterdayMode(false);
    setMissReason("");
    onRefresh();
  }

  async function handleYesterdayComplete() {
    await completeYesterday(goal.id, true, null);
    setYesterdayMode(false);
    onRefresh();
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{goal.title}</h3>
        </div>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="text-red-500 text-sm hover:text-red-600 disabled:opacity-40"
        >
          {deleting ? "Deleting..." : "Delete"}
        </button>
      </div>
      <p className="text-gray-500 mb-4 mt-1">{goal.description}</p>

      {/* Streak */}
      <p className="text-orange-500 font-medium mb-4">
        🔥 {streak !== null ? streak : "..."} day streak
      </p>

      {/* Complete button */}
      <button
        onClick={handleComplete}
        disabled={goal.completed_today || completing}
        className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition ${
          goal.completed_today
            ? "bg-green-100 text-green-700 cursor-not-allowed"
            : "bg-green-500 text-white hover:bg-green-600"
        }`}
      >
        {goal.completed_today ? "✔ Completed Today" : completing ? "Completing..." : "Complete Today"}
      </button>

      {/* Yesterday missed */}
      {!yesterdayMode ? (
        <button
          onClick={() => setYesterdayMode(true)}
          className="mt-3 text-xs text-gray-400 hover:text-gray-600 text-left"
        >
          You missed yesterday&apos;s goal?
        </button>
      ) : (
        <div className="flex flex-col gap-2 border-t pt-3">
          <p className="text-sm font-medium text-gray-700">Yesterday&apos;s status:</p>
          <input
            type="text"
            placeholder="Miss reason (optional)"
            value={missReason}
            onChange={(e) => setMissReason(e.target.value)}
            className="rounded border border-gray-300 px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-300"
          />
          <div className="flex gap-2">
            <button
              onClick={handleYesterdayComplete}
              className="rounded bg-green-500 px-3 py-1 text-xs text-white hover:bg-green-600"
            >
              Mark Completed
            </button>
            <button
              onClick={handleYesterdayMissed}
              className="rounded bg-gray-200 px-3 py-1 text-xs text-gray-700 hover:bg-gray-300"
            >
              Add Reason & Miss
            </button>
            <button
              onClick={() => setYesterdayMode(false)}
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Calendar toggle */}
      <button
        onClick={() => setShowCalendar((v) => !v)}
        className="text-xs text-indigo-500 hover:text-indigo-600 text-left mt-3"
      >
        📅 {showCalendar ? "Hide" : "Show"} History
      </button>
      {showCalendar && <StreakCalendar goalId={goal.id} />}
    </motion.div>
  );
}
