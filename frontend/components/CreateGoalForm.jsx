"use client";

import { useState } from "react";
import { createGoal } from "../services/api";

export default function CreateGoalForm({ onCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    setError(null);
    try {
      await createGoal(title.trim(), description.trim());
      setTitle("");
      setDescription("");
      onCreated();
    } catch {
      setError("Failed to create goal.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm mb-10 border border-gray-100">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Add New Goal</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Goal title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-gray-200 rounded-lg p-3 mb-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-gray-200 rounded-lg p-3 mb-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? "Creating…" : "Create Goal"}
        </button>
      </form>
    </div>
  );
}
