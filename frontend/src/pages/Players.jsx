import { useEffect, useState } from "react";
import PlayerForm from "../components/PlayerForm";

export default function Players({ userRole}) {
  const [players, setPlayers] = useState([]);
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [flippedPlayer, setFlippedPlayer] = useState(null);
  const [tournaments, setTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState(null);

  const fetchPlayers = () => {
    fetch("http://localhost:8080/api/players") 
        .then(res => res.json())
        .then(setPlayers)
        .catch(err => console.error(err));
  };

  const fetchTournaments = () => {
    fetch("http://localhost:8080/api/tournaments")
        .then(res => res.json())
        .then(setTournaments)
        .catch(err => console.error(err));
  };

  useEffect(() => { 
    fetchPlayers();
    fetchTournaments();
  }, []);

  const deletePlayer = (id) => {
    if(confirm("Kick player?")) {
        fetch(`http://localhost:8080/api/players/${id}`, { method: "DELETE" })
        .then(fetchPlayers);
    }
  };

  const toggleFlip = (id) => {
    setFlippedPlayer(flippedPlayer === id ? null : id);
  };

  const getPlayerStats = (player) => {
    if (!player.stats || player.stats.length === 0) return null;
    
    if (selectedTournament) {
      return player.stats.find(s => s.tournament.id === selectedTournament);
    }
    
    return player.stats[0];
  };

  const formatKD = (kd) => {
    if (typeof kd !== 'number') return "0.00";
    return kd.toFixed(2);
  };

  return (
    <div className="max-w-[1800px] mx-auto p-6">
      
      {/* ADMIN ONLY: Player Form */}
      {userRole === 'ADMIN' && (
        <PlayerForm 
          fetchPlayers={fetchPlayers} 
          editingPlayer={editingPlayer} 
          setEditingPlayer={setEditingPlayer} 
        />
      )}

      <h2 className="text-2xl font-bold text-white mb-6 border-l-4 border-[#D4AF37] pl-4">
        Active Roster <span className="text-slate-500 text-sm font-normal ml-2">({players.length} Players)</span>
      </h2>

      {/* Tournament Filter */}
      {tournaments.length > 0 && (
        <div className="mb-6 flex gap-2 items-center">
          <label className="text-white font-bold">Filter by Tournament:</label>
          <select 
            value={selectedTournament || ""}
            onChange={(e) => setSelectedTournament(e.target.value ? parseInt(e.target.value) : null)}
            className="px-4 py-2 bg-slate-800 text-white border border-slate-700 rounded"
          >
            <option value="">All Tournaments</option>
            {tournaments.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
          <span className="text-slate-400 text-sm ml-2">
            {selectedTournament ? `Showing stats for selected tournament` : `Showing latest stats`}
          </span>
        </div>
      )}

      {/* --- GRID LAYOUT: 5-column grid --- */}
      <div className="grid grid-cols-5 gap-8 w-full">
        
        {players.map(p => {
          const displayStats = getPlayerStats(p);
          return (
            <div key={p.id} className={`group [perspective:1000px] h-[420px] px-2 ${flippedPlayer === p.id ? 'relative z-50' : 'relative z-0'}`}>
                
                {/* ROTATING WRAPPER */}
                <div 
                    className={`relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] origin-center ${
                        flippedPlayer === p.id ? "[transform:rotateY(180deg)]" : ""
                    }`}
                >
                    
                    {/* ================= FRONT SIDE ================= */}
                    <div className="absolute w-full h-full box-border [backface-visibility:hidden] bg-slate-950 border border-slate-800 rounded-xl p-5 flex flex-col items-center text-center shadow-xl hover:border-[#D4AF37]/30 transition-colors overflow-hidden">
                        
                        {/* Action Buttons - Hover Only */}
                        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-30">
                            {/* ADMIN BUTTONS */}
                            {userRole === 'ADMIN' && (
                                <>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); setEditingPlayer(p); }} 
                                    className="text-[10px] font-bold text-gray-400 hover:text-[#D4AF37] border border-transparent hover:border-[#D4AF37] px-2 py-1 uppercase tracking-wider"
                                >
                                    Edit
                                </button>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); deletePlayer(p.id); }} 
                                    className="text-[10px] font-bold text-[#ff0000] hover:text-[#e53935] border border-transparent hover:border-[#e53935] px-2 py-1 uppercase tracking-wider"
                                >
                                    Delete
                                </button>
                                </>
                            )}

                            {/* STATS BUTTON - FOR ALL USERS */}
                            <button 
                                onClick={() => toggleFlip(p.id)}
                                className="text-[10px] font-bold text-[#050505] bg-[#D4AF37] px-3 py-1 hover:bg-white transition-all uppercase tracking-wider"
                            >
                                Stats
                            </button>
                        </div>

                        {/* Player Info */}
                        <div className="mt-8 mb-2 w-full flex-grow flex flex-col justify-center">
                            <h4 className="text-2xl font-bold text-[#D4AF37] mb-3 truncate tracking-tight">{p.name}</h4>
                            
                            <div className="flex flex-col gap-3 text-sm text-slate-400">
                                <div className="flex justify-center items-center gap-2">
                                    <span className="text-xs uppercase tracking-wider text-slate-500 font-bold">Role:  </span>
                                    <span className="font-bold text-white text-sm ">   {p.role}</span>
                                </div>
                                <div className="flex justify-center items-center gap-2">
                                    <span className="text-xs uppercase tracking-wider text-slate-500 font-bold">Age: </span>
                                    <span className="text-slate-300 font-medium text-sm">{p.age} yrs</span>
                                </div>
                                <div className="flex justify-center items-center gap-2">
                                    <span className="text-xs uppercase tracking-wider text-slate-500 font-bold">Team: </span>
                                    <span className="font-bold text-[#D4AF37] text-sm">{p.team ? p.team.name : 'Free Agent'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Team Footer - Removed since team is now in info */}
                        <div className="mt-auto w-full pt-3 border-t border-slate-800">
                        </div>
                    </div>

                    {/* ================= BACK SIDE (DETAILED STATS) ================= */}
                    <div className="absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] bg-gradient-to-b from-slate-900 to-slate-950 outline border-box border-[#D4AF37] rounded-xl p-5 flex flex-col shadow-2xl overflow-hidden">
                        
                        {/* Header */}
                        <div className="flex justify-between items-start mb-3 pb-3 border-b border-slate-700">
                            <div>
                                <h5 className="text-[#D4AF37] font-black text-sm leading-none">{p.name}</h5>
                                <span className="text-[9px] text-slate-500 uppercase tracking-[0.15em] font-bold">
                                  {displayStats ? displayStats.tournament.name : "No Stats"}
                                </span>
                            </div>
                        
                        </div>

                        {displayStats ? (
                          <>
                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 gap-2 flex-grow">
                                 <div className="bg-slate-950 rounded border border-slate-800 flex flex-col justify-center items-center p-2">
                                    <span className="text-3xl font-black text-white">{displayStats.kills}</span>
                                    <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">Kills</span>
                                 </div>
                                 <div className="bg-slate-950 rounded border border-slate-800 flex flex-col justify-center items-center p-2">
                                    <span className="text-3xl font-black text-red-500">{displayStats.deaths}</span>
                                    <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">Deaths</span>
                                 </div>
                                 <div className="bg-slate-950 rounded border border-slate-800 flex flex-col justify-center items-center p-2">
                                    <span className="text-3xl font-black text-blue-400">{displayStats.assists}</span>
                                    <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">Assists</span>
                                 </div>
                                 <div className="bg-slate-950 rounded border border-slate-800 flex flex-col justify-center items-center p-2">
                                    <span className="text-3xl font-black text-green-400">{formatKD(displayStats.kd)}</span>
                                    <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">K/D</span>
                                 </div>
                            </div>

                            {/* All Stats for this player (other tournaments) */}
                            {p.stats && p.stats.length > 1 && (
                              <div className="mt-3 pt-3 border-t border-slate-700 text-xs text-slate-400 overflow-y-auto max-h-16">
                                <span className="text-slate-500 font-bold block mb-1">Other Tournaments:</span>
                                {p.stats.filter(s => !selectedTournament || s.tournament.id !== selectedTournament).map(stat => (
                                  <div key={stat.id} className="text-[8px] py-1 border-b border-slate-800">
                                    <span className="font-bold text-slate-400">{stat.tournament.name}:</span> {stat.kills}K {stat.deaths}D {stat.assists}A ({formatKD(stat.kd)} KD)
                                  </div>
                                ))}
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="flex-grow flex items-center justify-center text-slate-400 text-sm">
                            No stats available for this tournament
                          </div>
                        )}

                        {/* Return Button */}
                        <button 
                            onClick={() => toggleFlip(p.id)}
                            className="w-full mt-3 py-2 bg-[#D4AF37] text-black text-xs font-black tracking-[0.1em] uppercase hover:bg-white transition-all rounded"
                        >
                            Back
                        </button>
                    </div>

                </div>
            </div>
          );
        })}
      </div>

      {players.length === 0 && (
          <div className="text-center py-20 text-slate-600">
              <p className="text-xl">No players found.</p>
          </div>
      )}
    </div>
  );
}