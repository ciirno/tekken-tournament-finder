import TournamentCard from "@/components/TournamentCard";
import TournamentFilters from "@/components/TournamentFilters";
import { ITournament } from "@/models/Tournament";

// We pass searchParams as a prop to the server component
export default async function Home({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const status = searchParams.status;

  // Fetch data (this calls your API route)
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/tournaments`,
    {
      cache: "no-store",
    },
  );
  const { data }: { data: ITournament[] } = await res.json();

  // Apply filtering logic based on the URL status
  const filteredTournaments = data.filter((t) => {
    const isOngoing = new Date(t.date) <= new Date() && t.isOngoing;
    if (status === "ongoing") return isOngoing;
    if (status === "upcoming") return !isOngoing;
    return true; // 'all'
  });

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12">
          <h1 className="text-6xl font-black italic tracking-tighter text-red-600 mb-2">
            TEKKEN PH
            <span className="text-white"> TOURNAMENT FINDER</span>
          </h1>
          <p className="text-slate-500 font-medium">
            Aggregated battles from Start.gg and Challonge.
          </p>
        </header>

        <TournamentFilters />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTournaments.length > 0 ? (
            filteredTournaments.map((t, i) => (
              <TournamentCard key={i} tournament={t} />
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
