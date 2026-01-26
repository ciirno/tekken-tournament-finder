import TournamentCard from "@/components/TournamentCard";
import { ITournament } from "@/models/Tournament";

async function getTournaments() {
  // We fetch from our internal API route
  // 'no-store' ensures we always get fresh scraped data for now
  const res = await fetch("http://localhost:3000/api/tournaments", {
    cache: "no-store",
  });
  if (!res.ok) return [];
  const json = await res.json();
  return json.data as ITournament[];
}

export default async function Home() {
  const tournaments = await getTournaments();

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <header className="max-w-6xl mx-auto mb-12">
        <h1 className="text-5xl font-extrabold italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400">
          TEKKEN TOURNAMENT FINDER
        </h1>
        <p className="text-slate-400 mt-2 text-lg">
          Find the next battleground.
        </p>
      </header>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tournaments.length > 0 ? (
          tournaments.map((t, i) => <TournamentCard key={i} tournament={t} />)
        ) : (
          <p className="text-slate-500 col-span-full text-center py-20">
            No tournaments found. Trying to scrape some now...
          </p>
        )}
      </div>
    </main>
  );
}
