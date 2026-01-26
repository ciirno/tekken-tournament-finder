import { ITournament } from "@/models/Tournament";
import { Calendar, MapPin, ExternalLink } from "lucide-react";

export default function TournamentCard({
  tournament,
}: {
  tournament: ITournament;
}) {
  const isOngoing =
    new Date(tournament.date) <= new Date() && tournament.isOngoing;

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 hover:border-red-500 transition-all shadow-xl group flex flex-col h-full">
      <div className="flex justify-between items-start mb-4 gap-4">
        <h3 className="text-xl font-bold text-white group-hover:text-red-400 transition-colors line-clamp-2">
          {tournament.title}
        </h3>
        <span
          className={`shrink-0 px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest ${
            isOngoing ? "bg-green-500 text-black" : "bg-red-600 text-white"
          }`}>
          {isOngoing ? "Live" : "Upcoming"}
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
