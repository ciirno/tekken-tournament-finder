import { ITournament } from "@/models/Tournament";
import { Calendar, MapPin, ExternalLink } from "lucide-react";
import { startOfDay, endOfDay } from "@/app/helpers/date";
export default function TournamentCard({
  tournament,
  viewMode,
}: {
  tournament: ITournament;
  viewMode: "grid" | "list";
}) {
  const tDate = new Date(tournament.date);

  const getStatus = () => {
    if (tDate < startOfDay) return "completed";
    if (tDate >= startOfDay && tDate <= endOfDay) return "ongoing";
    return "upcoming";
  };

  const status = getStatus();
  if (viewMode === "list") {
    return (
      <div className="group relative bg-slate-900/40 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-center gap-4 hover:border-red-600/50 hover:bg-slate-900/80 transition-all">
        {/* 1. Date Section */}
        <div className="flex flex-row md:flex-col items-center justify-center min-w-[80px] border-r border-slate-800 pr-4">
          <span className="text-2xl font-black text-white group-hover:text-red-500 transition-colors">
            {new Date(tournament.date).getDate()}
          </span>
          <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500 ml-2 md:ml-0">
            {new Date(tournament.date).toLocaleString("default", {
              month: "short",
            })}
          </span>
        </div>

        {/* 2. Game Icon (Tekken 8) */}
        <div className="hidden sm:flex items-center justify-center w-12 h-12 bg-black rounded-lg border border-slate-700">
          <span className="text-red-600 font-black text-xl italic">T8</span>
        </div>

        {/* 3. Info Section */}
        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center gap-2">
            <h3 className="font-bold text-lg leading-tight">
              {tournament.title}
            </h3>

            {status === "ongoing" && (
              <span className="bg-green-500 text-black px-2 py-0.5 rounded text-[10px] font-black animate-pulse">
                LIVE NOW
              </span>
            )}
            {status === "completed" && (
              <span className="bg-slate-700 text-slate-400 px-2 py-0.5 rounded text-[10px] font-black uppercase">
                Finished
              </span>
            )}
          </div>
          <p className="text-slate-500 text-sm font-medium">
            {tournament.location}
          </p>
        </div>

        {/* 4. Action Button */}
        <div className="w-full md:w-auto">
          <a
            href={tournament.registrationLink}
            target="_blank"
            className="block text-center bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2 rounded-lg font-black text-sm uppercase tracking-tighter hover:bg-red-600 hover:text-white transition-all transform active:scale-95">
            VIEW BRACKET
          </a>
        </div>
      </div>
    );
  }

  // Grid view (Standard card)
  // Inside TournamentCard.tsx (Grid View Section)

  return (
    <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6 hover:border-red-500 transition-all shadow-xl group flex flex-col h-full">
      <div className="flex justify-between items-start mb-4 gap-4">
        <h3 className="text-xl font-bold text-white group-hover:text-red-400 transition-colors line-clamp-2">
          {tournament.title}
        </h3>
        <span
          className={`shrink-0 px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest ${
            status === "ongoing"
              ? "bg-green-500 text-black animate-pulse"
              : status === "completed"
                ? "bg-slate-800 text-slate-500"
                : "bg-red-600 text-white"
          }`}>
          {status === "ongoing"
            ? "Live"
            : status === "completed"
              ? "Completed"
              : "Upcoming"}
        </span>
      </div>

      <div className="space-y-3 text-slate-400 flex-grow">
        <div className="flex items-center gap-2 text-sm">
          <Calendar size={16} className="text-red-500" />
          {new Date(tournament.date).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </div>
        <div className="flex items-center gap-2 text-sm">
          <MapPin size={16} className="text-red-500" />
          {tournament.location}
        </div>
        <div className="inline-block bg-slate-800 text-slate-300 text-[10px] px-2 py-0.5 rounded border border-slate-700 font-mono">
          {tournament.gameVersion}
        </div>
      </div>

      {tournament.registrationLink && (
        <a
          href={tournament.registrationLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 flex items-center justify-center gap-2 w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-all transform active:scale-95 shadow-lg shadow-red-900/20">
          View Bracket <ExternalLink size={16} />
        </a>
      )}
    </div>
  );
}
