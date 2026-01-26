"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function TournamentFilters() {
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
    <div className="flex gap-3 mb-8">
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
  );
}
