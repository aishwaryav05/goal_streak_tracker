const API = "https://goalstreaktracker-production.up.railway.app/";

export async function getGoals() {
  const res = await fetch(`${API}/goals`);
  if (!res.ok) throw new Error("Failed to fetch goals");
  return res.json();
}

export async function createGoal(title, description) {
  const res = await fetch(`${API}/goals`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, description }),
  });
  if (!res.ok) throw new Error("Failed to create goal");
  return res.json();
}

export async function deleteGoal(goalId) {
  const res = await fetch(`${API}/goals/${goalId}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete goal");
  return res.json();
}

export async function completeGoal(goalId) {
  const res = await fetch(`${API}/goals/${goalId}/complete`, { method: "POST" });
  if (!res.ok) throw new Error("Failed to mark goal complete");
  return res.json();
}

export async function getStreak(goalId) {
  const res = await fetch(`${API}/goals/${goalId}/streak`);
  if (!res.ok) throw new Error("Failed to fetch streak");
  return res.json();
}

export async function getHistory(goalId) {
  const res = await fetch(`${API}/goals/${goalId}/history`);
  if (!res.ok) throw new Error("Failed to fetch history");
  return res.json();
}

export async function completeYesterday(goalId, completed, reason = null) {
  const res = await fetch(`${API}/goals/${goalId}/yesterday`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed, reason }),
  });
  if (!res.ok) throw new Error("Failed to update yesterday");
  return res.json();
}

