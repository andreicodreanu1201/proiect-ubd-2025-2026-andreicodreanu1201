import { useEffect, useState } from "react";
import TournamentForm from "../components/TournamentForm"; // AsigurÄƒ-te cÄƒ importul e corect

export default function Tournaments({ userRole}) {
  const [tournaments, setTournaments] = useState([]);
  const [editingTournament, setEditingTournament] = useState(null);

  // FuncÈ›ia de fetch (o trimitem È™i la Formular ca sÄƒ dea refresh dupÄƒ save)
  const fetchTournaments = () => {
    fetch("http://localhost:8080/api/tournaments")
      .then(res => res.json())
      .then(setTournaments)
      .catch(err => console.error(err));
  };

  useEffect(() => { 
    fetchTournaments(); 
  }, []);

  const deleteTournament = (id) => {
    if(window.confirm("Are you sure you want to cancel this event?")) {
        fetch(`http://localhost:8080/api/tournaments/${id}`, { method: "DELETE" })
        .then(() => fetchTournaments())
        .catch(err => console.error(err));
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      
      {/* 1. COMPONENTA FORMULAR (IntegratÄƒ aici) */}
      {userRole === "ADMIN" && (
      <TournamentForm 
        fetchTournaments={fetchTournaments} 
        editingTournament={editingTournament} 
        setEditingTournament={setEditingTournament} 
      />
        )}

      {/* 2. LISTA EVENIMENTE */}
      <div className="grid gap-4">
        {tournaments.map(t => (
            <div 
                key={t.id} 
                className="group relative bg-[#0a0a0a] border border-[#222] p-6 rounded-xl flex justify-between items-center hover:border-[#D4AF37]/50 transition-all shadow-lg"
            >
                {/* Accent StÃ¢nga (Gold) */}
                <div className="absolute left-0 top-4 bottom-4 w-1 bg-[#D4AF37] rounded-r opacity-50 group-hover:opacity-100 group-hover:shadow-[0_0_8px_#D4AF37] transition-all"></div>
                
                <div className="pl-4">
                    <h3 className="text-xl font-black text-[#D4AF37] uppercase tracking-wide group-hover:text-white transition-colors">
                        {t.name}
                    </h3>
                    <div className="text-slate-500 text-xs font-mono mt-1 flex gap-3 font-bold uppercase tracking-wider">
                        <span className="flex items-center gap-1">
                            <span className="text-[#666]">START:</span> {t.startDate}
                        </span>
                        <span className="text-[#444]">|</span>
                        <span className="flex items-center gap-1">
                            <span className="text-[#666]">END:</span> {t.endDate}
                        </span>
                    </div>
                </div>

                {/* Butoane AcÈ›iune (Apar la hover) */}
                <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 duration-300">
                    {userRole === "ADMIN" && (
                    <>
                    <button 
                        onClick={() => setEditingTournament(t)} 
                        className="text-xs font-bold text-slate-400 hover:text-[#D4AF37] border border-transparent hover:border-[#D4AF37] px-4 py-2 rounded transition-all uppercase tracking-widest"
                    >
                        Edit
                    </button>
                    <button 
                        onClick={() => deleteTournament(t.id)} 
                        className="text-xs font-bold text-[#ff0000] hover:text-[#e53935] border border-transparent hover:border-[#e53935] hover:bg-red-900/10 px-4 py-2 rounded transition-all uppercase tracking-widest"
                    >
                        Delete
                    </button>
                    </>
                    )}
                </div>
            </div>
        ))}
      
        {tournaments.length === 0 && (
            <div className="text-center py-10 opacity-50 italic text-slate-500">
                No tournaments found. Create one above!
            </div>
        )}
      </div>
    </div>
  );
}