"use client"; // Required for useState and onClick

import { useState, useEffect } from "react";
import TournamentCard from "@/components/TournamentCard";
import TournamentFilters from "@/components/TournamentFilters";
import { ITournament } from "@/models/Tournament";
import { Suspense } from "react";

export default function Home({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [data, setData] = useState<ITournament[]>([]);
  const status = searchParams.status;

  // Since we are now a client component, we fetch data inside useEffect
  useEffect(() => {
    const fetchData = async () => {
      // This now hits Scenario B (MongoDB)
      const res = await fetch("/api/tournaments");
      const json = await res.json();
      setData(json.data);
    };
    fetchData();
  }, []);

  const filteredTournaments = data.filter((t) => {
    // Basic logic for filtering - ensure ITournament has these fields
    const isOngoing = t.isOngoing;
    if (status === "ongoing") return isOngoing;
    if (status === "upcoming") return !isOngoing;
    return true;
  });

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-6xl font-black italic tracking-tighter text-red-600 mb-2">
              TEKKEN PH
              <span className="text-white"> TOURNAMENT FINDER</span>
            </h1>
            <p className="text-slate-500 font-medium">
              Aggregated battles from Start.gg &#40;Challonge Soon&#41;
            </p>
          </div>
        </header>

        <Suspense
          fallback={
            <div className="h-10 w-full animate-pulse bg-slate-900 rounded-xl" />
          }>
          <TournamentFilters viewMode={viewMode} setViewMode={setViewMode} />
        </Suspense>
        {/* Dynamic Grid/List Container */}
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "flex flex-col gap-3" // Thinner gap for List View
          }>
          {filteredTournaments.length > 0 ? (
            filteredTournaments.map((t, i) => (
              <TournamentCard
                key={i}
                tournament={t}
                viewMode={viewMode} // Pass the mode to the card
              />
            ))
          ) : (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-800 rounded-3xl">
              <p className="text-slate-500 text-lg">
                No {status} tournaments found.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
