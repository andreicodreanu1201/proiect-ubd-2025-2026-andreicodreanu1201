import { useState } from "react";
import Teams from "./Teams";
import Players from "./Players";
import Tournaments from "./Tournaments";
import Matches from "./Matches";

export default function Dashboard({ session, onLogout, userRole }) {
  const [page, setPage] = useState("teams");

  // Stil Buton Meniu - TOATE sunt Galbene (Vizibile)
  const navBtn = (id, label) => (
    <button
      onClick={() => setPage(id)}
      className={`flex-1 md:flex-none px-6 py-4 font-black text-sm uppercase tracking-wider transition-all duration-300 border-2 ${
        page === id
          ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.6)] scale-105" // ACTIV
          : "bg-[#D4AF37] text-black border-[#D4AF37] hover:bg-[#111] hover:text-[#D4AF37] hover:border-[#D4AF37]" // INACTIV
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white pb-20 font-sans">
        
        {/* HEADER BAR */}
        <header className="border-b border-[#222] bg-[#0a0a0a] sticky top-0 z-50 shadow-xl">
            <div className="max-w-7xl mx-auto px-4 md:px-6 h-auto md:h-24 flex flex-col md:flex-row items-center justify-between py-4 md:py-0 gap-4">
                
                {/* LOGO AREA */}
                <div className="flex flex-col justify-center items-center md:items-start">
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mb-1">System Active</span>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-[#D4AF37] rounded-sm animate-pulse"></div>
                        <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter">
                          HELLO, {userRole?.toUpperCase() || 'USER'}
                        </h2>
                    </div>
                </div>

                {/* NAVIGARE CENTRALA */}
                <div className="flex flex-wrap justify-center gap-3 w-full md:w-auto">
                    {navBtn("teams", "Teams")}
                    {navBtn("players", "Players")}
                    {navBtn("tournaments", "Events")}
                    {navBtn("matches", "Matches")}
                </div>

                <button 
                    onClick={onLogout}
                    className="px-6 py-2 bg-[#ff0000] border border-[#550000] text-red-500 font-bold text-[15px] uppercase hover:bg-red-600 hover:text-white hover:border-red-600 transition-all rounded-sm shadow-[0_0_10px_rgba(255,0,0,0.1)] hover:shadow-[0_0_20px_rgba(255,0,0,0.5)]"
                >
                    Log Out
                </button>
            </div>
        </header>

        <main className="max-w-6xl mx-auto p-4 md:p-8 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-end gap-2 md:gap-4 mb-10 border-b border-[#222] pb-6">
                <h1 className="text-4xl md:text-5xl font-black text-white uppercase outline-text">{page}</h1>
                <span className="text-[#D4AF37] font-bold mb-2 text-sm tracking-widest">/// DATABASE MANAGER</span>
            </div>

            <div className="bg-[#0a0a0a] border border-[#222] p-4 md:p-8 min-h-[500px] relative shadow-2xl">
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#D4AF37]"></div>
                {page === "teams" && <Teams userRole={userRole} />}
                {page === "players" && <Players userRole={userRole} />}
                {page === "tournaments" && <Tournaments userRole={userRole} />}
                {page === "matches" && <Matches userRole={userRole} />}
            </div>
        </main>
    </div>
  );
}