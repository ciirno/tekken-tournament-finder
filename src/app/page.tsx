"use client"; // Required for useState and onClick

import { useState, useEffect } from "react";
import TournamentCard from "@/components/TournamentCard";
import TournamentFilters from "@/components/TournamentFilters";
import { ITournament } from "@/models/Tournament";
import { Suspense } from "react";

export default function Home() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [data, setData] = useState<ITournament[]>([]);
  const [loading, setLoading] = useState(false);
  // Since we are now a client component, we fetch data inside useEffect
  const [filter, setFilter] = useState("upcoming");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/tournaments?status=${filter}`);
        const json = await res.json();

        // CRITICAL FIX: Ensure json.data exists before setting it
        if (json.success && Array.isArray(json.data)) {
          setData(json.data);
        } else {
          console.error("API Error:", json.error);
          setData([]); // Set to empty array to prevent .filter() crash
        }
      } catch (err) {
        console.error("Fetch failed:", err);
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [filter]); // Re-runs when 'filter' changes!

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
          <TournamentFilters
            viewMode={viewMode}
            setViewMode={setViewMode}
            setFilter={setFilter}
            filter={filter}
          />
        </Suspense>
        {/* Dynamic Grid/List Container */}
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "flex flex-col gap-3" // Thinner gap for List View
          }>
          {loading ? (
            <div className="flex flex-row col-span-full py-20 text-center border-2 border-dashed border-slate-800 rounded-3xl justify-center">
              <p className="text-slate-500 text-xl animate-pulse mr-2">
                Fetching Tournaments
              </p>
              <div role="status">
                <svg
                  aria-hidden="true"
                  className="inline w-8 h-8 text-neutral-tertiary animate-spin fill-slate-800"
                  viewBox="0 0 100 101"
                  fill="slate-900"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="slate-700"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="red"
                  />
                </svg>
              </div>
            </div>
          ) : data.length > 0 ? (
            data.map((t, i) => (
              <TournamentCard
                key={i}
                tournament={t}
                viewMode={viewMode} // Pass the mode to the card
              />
            ))
          ) : (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-800 rounded-3xl">
              <p className="text-slate-500 text-lg">
                No {filter} tournaments found.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
