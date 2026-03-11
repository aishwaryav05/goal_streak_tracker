export default function DashboardStats({ goals, completedToday, bestStreak }) {
  const total = goals.length;

  return (
    <div className="grid grid-cols-1 gap-4 mb-8 sm:grid-cols-3">
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <p className="text-gray-500 text-sm">Total Goals</p>
        <p className="text-2xl font-semibold text-indigo-600">{total}</p>
      </div>
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <p className="text-gray-500 text-sm">Completed Today</p>
        <p className="text-2xl font-semibold text-green-600">{completedToday}</p>
      </div>
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <p className="text-gray-500 text-sm">Best Streak</p>
        <p className="text-2xl font-semibold text-orange-500">{bestStreak}</p>
      </div>
    </div>
  );
}
