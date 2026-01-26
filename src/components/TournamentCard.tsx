import { ITournament } from "@/models/Tournament";

export default function TournamentCard({
  tournament,
}: {
  tournament: ITournament;
}) {
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 hover:border-red-500 transition-colors shadow-lg">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-white">{tournament.title}</h3>
        <span
          className={`px-2 py-1 rounded text-xs font-bold ${tournament.isOngoing ? "bg-green-500 text-black" : "bg-blue-500 text-white"}`}>
          {tournament.isOngoing ? "ONGOING" : "UPCOMING"}
        </span>
      </div>

      <div className="space-y-2 text-slate-400">
        <p className="flex items-center gap-2">
          <span className="text-red-500">📅</span>{" "}
          {new Date(tournament.date).toLocaleDateString()}
        </p>
        <p className="flex items-center gap-2">
          <span className="text-red-500">📍</span> {tournament.location}
        </p>
        <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">
          {tournament.gameVersion}
        </p>
      </div>

      <button className="mt-6 w-full py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-all transform active:scale-95">
        View Bracket
      </button>
    </div>
  );
}
