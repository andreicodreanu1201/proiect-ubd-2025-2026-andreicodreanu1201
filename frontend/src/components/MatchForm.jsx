import { useState, useEffect } from "react";

export default function MatchForm({ fetchMatches, editingMatch, setEditingMatch }) {
  const [tournamentId, setTournamentId] = useState("");
  const [team1Id, setTeam1Id] = useState("");
  const [team2Id, setTeam2Id] = useState("");
  const [scoreTeam1, setScoreTeam1] = useState(0);
  const [scoreTeam2, setScoreTeam2] = useState(0);
  const [matchDate, setMatchDate] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  
  const [tournaments, setTournaments] = useState([]);
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/tournaments").then(res => res.json()).then(setTournaments);
    fetch("http://localhost:8080/api/teams").then(res => res.json()).then(setTeams);
  }, []);

  useEffect(() => {
    if (editingMatch) {
      setTournamentId(editingMatch.tournament?.id || "");
      setTeam1Id(editingMatch.team1?.id || "");
      setTeam2Id(editingMatch.team2?.id || "");
      setScoreTeam1(editingMatch.scoreTeam1);
      setScoreTeam2(editingMatch.scoreTeam2);
      setMatchDate(editingMatch.matchDate || "");
    }
  }, [editingMatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    const method = editingMatch ? "PUT" : "POST";
    const url = editingMatch ? `http://localhost:8080/api/matches/${editingMatch.id}` : "http://localhost:8080/api/matches";
    const payload = { scoreTeam1, scoreTeam2, matchDate, tournament: { id: tournamentId }, team1: { id: team1Id }, team2: { id: team2Id } };

    try {
      const response = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!response.ok) { const txt = await response.text(); throw new Error(txt); }
      setScoreTeam1(0); setScoreTeam2(0); setMatchDate(""); setEditingMatch(null); fetchMatches();
    } catch (err) { setErrorMessage(err.message); }
  };

  // 1. Stil de bazÄƒ
  const baseStyle = "bg-[#171717] border border-[#333] text-[#fff] rounded focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-colors placeholder-slate-600 font-medium text-lg !h-14 min-h-[56px] px-3";

  return (
    <form onSubmit={handleSubmit} className="mb-8 bg-[#0a0a0a] p-6 border border-[#222] rounded-xl relative overflow-hidden shadow-xl">
      
      {/* Accent StÃ¢nga GOLD */}
      <div className="absolute left-0 top-0 h-full w-1.5 bg-[#D4AF37]"></div>

      {/* Header */}
      <div className="flex justify-between items-start mb-6 pl-2">
          <h3 className="text-lg font-black text-[#D4AF37] uppercase tracking-wider flex items-center gap-2">
            {editingMatch ? " Update Match" : "New Match Entry"}
          </h3>
          {errorMessage && <span className="text-red-400 text-xs font-bold border border-red-900 bg-red-900/10 px-2 py-1 rounded">{errorMessage}</span>}
      </div>
      
      {/* RÃ¢ndul 1: Turneu & Data */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="min-w-0">
            <label className="text-[10px] font-bold text-[#666] uppercase mb-2 block tracking-wider">Tournament</label>
            <select value={tournamentId} onChange={(e) => setTournamentId(e.target.value)} required className={`${baseStyle} w-full`}>
                <option value="">-- Select Tournament --</option>
                {tournaments.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
        </div>
        <div className="min-w-0">
             <label className="text-[10px] font-bold text-[#666] uppercase mb-2 block tracking-wider">Date & Time</label>
            <input 
                type="datetime-local" 
                value={matchDate} 
                onChange={(e) => setMatchDate(e.target.value)} 
                required 
                className={`${baseStyle} w-full [color-scheme:dark] cursor-pointer uppercase tracking-wide text-sm`}
            />
        </div>
      </div>
{/* RÃ¢ndul 2: ECHIPE & SCOR (TABLE LAYOUT) */}
<div className="bg-[#111] border border-[#222] rounded-lg p-4 mb-6">
        <table className="w-full table-fixed border-separate" style={{borderSpacing: '8px 0'}}>
          <tbody>
            <tr>
              {/* HOME TEAM */}
              <td className="w-[30%]">
                <label className="text-[10px] font-bold text-[#666] uppercase mb-2 block text-center tracking-wider h-5">Home Team</label>
                <select value={team1Id} onChange={(e) => setTeam1Id(e.target.value)} required className={`${baseStyle} w-full`}>
                    <option value="">Select Team</option>
                    {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </td>

              {/* SCORE 1 */}
              <td className="w-[15%]">
                <label className="text-[10px] font-bold text-[#666] uppercase mb-2 block text-center tracking-wider h-5">Score</label>
                <input 
                    type="number" 
                    value={scoreTeam1} 
                    onChange={(e) => setScoreTeam1(e.target.value)} 
                    className={`${baseStyle} w-full text-center font-bold text-xl`}
                    placeholder="0"
                />
              </td>

              {/* VS */}
              <td className="w-[10%] align-bottom pb-[14px]">
                <span className="text-[#D4AF37] font-black text-2xl italic opacity-80 block text-center leading-none">VS</span>
              </td>

              {/* SCORE 2 */}
              <td className="w-[15%]">
                <label className="text-[10px] font-bold text-[#666] uppercase mb-2 block text-center tracking-wider h-5">Score</label>
                <input 
                    type="number" 
                    value={scoreTeam2} 
                    onChange={(e) => setScoreTeam2(e.target.value)} 
                    className={`${baseStyle} w-full text-center font-bold text-xl`}
                    placeholder="0"
                />
              </td>

              {/* AWAY TEAM */}
              <td className="w-[30%]">
                <label className="text-[10px] font-bold text-[#666] uppercase mb-2 block text-center tracking-wider h-5">Away Team</label>
                <select value={team2Id} onChange={(e) => setTeam2Id(e.target.value)} required className={`${baseStyle} w-full`}>
                    <option value="">Select Team</option>
                    {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Butoane */}
      <div className="flex gap-3">
          {editingMatch && (
            <button 
                type="button" 
                onClick={() => setEditingMatch(null)} 
                className="w-1/3 !h-14 min-h-[56px] bg-[#222] hover:bg-[#333] text-slate-300 font-bold rounded transition-colors uppercase text-sm border border-[#333]"
            >
                Cancel
            </button>
          )}
          <button 
            type="submit" 
            className="w-full !h-14 min-h-[56px] bg-[#D4AF37] hover:bg-[#b8952b] text-black font-black rounded uppercase tracking-widest text-sm transition-all hover:shadow-[0_0_15px_rgba(212,175,55,0.3)]"
          >
            {editingMatch ? "Update Match" : "Confirm Match"}
          </button>
      </div>
    </form>
  );
}