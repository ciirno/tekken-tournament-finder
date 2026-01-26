"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { LayoutGrid, List } from "lucide-react";

interface FilterProps {
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
}

export default function TournamentFilters({
  viewMode,
  setViewMode,
}: FilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentFilter = searchParams.get("status") || "all";

  const setFilter = (status: string) => {
    const params = new URLSearchParams(searchParams);
    if (status === "all") {
      params.delete("status");
    } else {
      params.set("status", status);
    }
    router.push(`?${params.toString()}`);
  };

  const btnClass = (status: string) => `
    px-4 py-2 rounded-full text-sm font-bold transition-all border
    ${
      currentFilter === status
        ? "bg-red-600 border-red-600 text-white shadow-lg shadow-red-900/40"
        : "bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500"
    }
  `;

  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
      {/* LEFT SIDE: Status Filters */}
      <div className="flex gap-2">
        {/* Removed mb-8 to keep it vertically centered with the layout icons */}
        <button onClick={() => setFilter("all")} className={btnClass("all")}>
          All
        </button>
        <button
          onClick={() => setFilter("ongoing")}
          className={btnClass("ongoing")}>
          Ongoing
        </button>
        <button
          onClick={() => setFilter("upcoming")}
          className={btnClass("upcoming")}>
          Upcoming
        </button>
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
