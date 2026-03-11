"use client";

import { useEffect, useMemo, useState } from "react";
import { getHistory } from "../services/api";

export default function StreakCalendar({ goalId }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    getHistory(goalId)
      .then(setHistory)
      .catch(() => setHistory([]));
  }, [goalId]);

  const days = useMemo(() => {
    const totalDays = 14;
    const historyData = new Set(history.filter((h) => h.completed).map((h) => h.date));

    return Array.from({ length: totalDays }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (totalDays - 1 - i));

      return {
        key: date.toISOString().slice(0, 10),
        date,
        completed: historyData.has(date.toISOString().slice(0, 10)),
      };
    });
  }, [history]);

  return (
    <div className="mt-3 rounded-lg border border-gray-100 p-3">
      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => (
          <div key={day.key} className="text-center">
            <div
              className={`w-6 h-6 rounded mx-auto ${
                day.completed ? "bg-green-500" : "bg-gray-200"
              }`}
            />
            <p className="text-xs text-gray-400 mt-1">{day.date.getDate()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
