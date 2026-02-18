"use client";
import { LayoutGrid, List } from "lucide-react";
interface FilterProps {
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
  filter: string;
  setFilter: (val: string) => void;
}

export default function TournamentFilters({
  viewMode,
  setViewMode,
  filter,
  setFilter,
}: FilterProps) {
  const categories = [
    { id: "upcoming", label: "Upcoming" },
    { id: "ongoing", label: "Ongoing" },
    { id: "completed", label: "Completed" },
    { id: "all", label: "All Events" },
  ];

  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
      {/* LEFT SIDE: Status Filters */}
      <div className="flex gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setFilter(category.id)} // This triggers the API fetch!
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              filter === category.id
                ? "bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]"
                : "text-slate-500 hover:text-slate-300"
            }`}>
            {category.label}
          </button>
        ))}
      </div>

      {/* RIGHT SIDE: Layout Toggle */}
      <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 self-center">
        <button
          onClick={() => setViewMode("grid")}
          className={`p-2 rounded-lg transition-all duration-300 flex items-center justify-center ${
            viewMode === "grid"
              ? "bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]"
              : "text-slate-500 hover:text-slate-300"
          }`}
          aria-label="Grid View">
          <LayoutGrid size={20} />
        </button>

        <button
          onClick={() => setViewMode("list")}
          className={`p-2 rounded-lg transition-all duration-300 flex items-center justify-center ${
            viewMode === "list"
              ? "bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]"
              : "text-slate-500 hover:text-slate-300"
          }`}
          aria-label="List View">
          <List size={20} />
        </button>
      </div>
    </div>
  );
}
