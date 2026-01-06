import { useState, useEffect } from "react";

export default function PlayerForm({ fetchPlayers, editingPlayer, setEditingPlayer, userRole }) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [age, setAge] = useState("");
  const [teamId, setTeamId] = useState("");
  const [teams, setTeams] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const [tournaments, setTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState("");
  const [kills, setKills] = useState(0);
  const [deaths, setDeaths] = useState(0);
  const [assists, setAssists] = useState(0);

  useEffect(() => {
    fetch("http://localhost:8080/api/teams")
      .then(res => res.json())
      .then(setTeams)
      .catch(err => console.error("Err teams:", err));

    fetch("http://localhost:8080/api/tournaments")
      .then(res => res.json())
      .then(setTournaments)
      .catch(err => console.error("Err tournaments:", err));
  }, []);

  useEffect(() => {
    if (editingPlayer) {
      setName(editingPlayer.name);
      setRole(editingPlayer.role);
      setAge(editingPlayer.age);
      setTeamId(editingPlayer.team ? editingPlayer.team.id.toString() : "");
      
      if (editingPlayer.stats && editingPlayer.stats.length > 0) {
        const latest = editingPlayer.stats[0];
        setSelectedTournament(latest.tournament.id.toString());
        setKills(latest.kills);
        setDeaths(latest.deaths);
        setAssists(latest.assists);
      } else {
        resetStats();
      }
    } else {
      resetForm();
    }
  }, [editingPlayer]);

  const resetStats = () => {
    setSelectedTournament("");
    setKills(0);
    setDeaths(0);
    setAssists(0);
  };

  const resetForm = () => {
    setName("");
    setRole("");
    setAge("");
    setTeamId("");
    setErrorMessage(null);
    resetStats();
    if(setEditingPlayer) setEditingPlayer(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!selectedTournament) {
      setErrorMessage("Please select a tournament");
      return;
    }

    setLoading(true);

    const method = editingPlayer ? "PUT" : "POST";
    const url = editingPlayer 
      ? `http://localhost:8080/api/players/${editingPlayer.id}` 
      : "http://localhost:8080/api/players";

    const payload = {
      name: name,
      role: role,
      age: parseInt(age) || 0,
      teamId: teamId && teamId !== "" ? parseInt(teamId) : null
    };

    console.log("Sending payload:", payload);

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || `Error: ${res.status}`);
      }

      const savedPlayer = await res.json();
      console.log("Saved player:", savedPlayer);

      await submitStats(savedPlayer.id);

      resetForm();
      fetchPlayers();
    } catch (err) {
      console.error("Submit error:", err);
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const submitStats = async (playerId) => {
    const statsData = {
      playerId: parseInt(playerId),
      tournamentId: parseInt(selectedTournament),
      kills: parseInt(kills) || 0,
      deaths: parseInt(deaths) || 0,
      assists: parseInt(assists) || 0
    };

    console.log("Sending stats:", statsData);

    try {
      const res = await fetch("http://localhost:8080/api/stats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(statsData)
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error("Stats error response:", errText);
        throw new Error(errText || "Failed to save stats");
      }

      console.log("Stats saved successfully");
    } catch (err) {
      console.error("Stats submit error:", err);
      setErrorMessage("Could not save stats: " + err.message);
      throw err;
    }
  };

  const calculateKD = () => {
    if (deaths === 0) return kills.toString();
    return (kills / deaths).toFixed(2);
  };

  const inputClass = "w-full h-12 bg-[#171717] border border-[#333] text-[#fff] px-4 rounded focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-colors placeholder-slate-600 font-medium text-base";

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 mb-8">
      <h2 className="text-2xl font-bold text-[#D4AF37] mb-6">
        {editingPlayer ? "Edit Player" : "Add New Player"}
      </h2>

      {errorMessage && (
        <div className="mb-4 p-4 bg-red-500/20 border border-red-500 text-red-400 rounded">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Player Info Section */}
        <div>
          <h3 className="text-lg font-bold text-slate-400 mb-4 uppercase tracking-wider">Player Information</h3>
          
          <div className="space-y-4">
            {/* Row 1: Name & Role */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-slate-400 text-sm uppercase tracking-wider font-bold block mb-2">Player Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="Enter player name" 
                  className={inputClass} 
                  required 
                />
              </div>

              <div className="flex flex-col">
                <label className="text-slate-400 text-sm uppercase tracking-wider font-bold block mb-2">Role</label>
                <select 
                  value={role} 
                  onChange={(e) => setRole(e.target.value)} 
                  className={inputClass} 
                  required
                >
                  <option value="">Select Role</option>
                  <option value="ADC">ADC</option>
                  <option value="Support">Support</option>
                  <option value="Mid">Mid</option>
                  <option value="Jungle">Jungle</option>
                  <option value="Top">Top</option>
                </select>
              </div>
            </div>

            {/* Row 2: Age & Team */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-slate-400 text-sm uppercase tracking-wider font-bold block mb-2">Age</label>
                <input 
                  type="number" 
                  value={age} 
                  onChange={(e) => setAge(e.target.value)} 
                  placeholder="Enter age" 
                  className={inputClass} 
                  required 
                />
              </div>

              <div className="flex flex-col">
                <label className="text-slate-400 text-sm uppercase tracking-wider font-bold block mb-2">Team</label>
                <select 
                  value={teamId} 
                  onChange={(e) => setTeamId(e.target.value)} 
                  className={inputClass}
                >
                  <option value="">Free Agent</option>
                  {teams.map(team => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div>
          <h3 className="text-lg font-bold text-slate-400 mb-4 uppercase tracking-wider">Player Stats (Required)</h3>
          
          <div className="space-y-4">
            {/* Tournament Selection */}
            <div className="flex flex-col">
              <label className="text-slate-400 text-sm uppercase tracking-wider font-bold block mb-2">Tournament *</label>
              <select 
                value={selectedTournament} 
                onChange={(e) => setSelectedTournament(e.target.value)} 
                className={inputClass} 
                required
              >
                <option value="">Select Tournament</option>
                {tournaments.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Stats Inputs: Kills, Deaths, Assists */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col">
                <label className="text-slate-400 text-sm uppercase tracking-wider font-bold block mb-2">Kills</label>
                <input 
                  type="number" 
                  value={kills} 
                  onChange={(e) => setKills(parseInt(e.target.value) || 0)} 
                  placeholder="0" 
                  className={inputClass} 
                  min="0" 
                />
              </div>

              <div className="flex flex-col">
                <label className="text-slate-400 text-sm uppercase tracking-wider font-bold block mb-2">Deaths</label>
                <input 
                  type="number" 
                  value={deaths} 
                  onChange={(e) => setDeaths(parseInt(e.target.value) || 0)} 
                  placeholder="0" 
                  className={inputClass} 
                  min="0" 
                />
              </div>

              <div className="flex flex-col">
                <label className="text-slate-400 text-sm uppercase tracking-wider font-bold block mb-2">Assists</label>
                <input 
                  type="number" 
                  value={assists} 
                  onChange={(e) => setAssists(parseInt(e.target.value) || 0)} 
                  placeholder="0" 
                  className={inputClass} 
                  min="0" 
                />
              </div>
            </div>

            {/* K/D Ratio Display */}
            <div className="bg-slate-800/50 border border-slate-700 rounded p-4 text-center mt-4">
              <span className="text-slate-400 text-sm">K/D Ratio: </span>
              <span className="text-[#D4AF37] font-bold text-xl">{calculateKD()}</span>
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4 pt-6 border-t border-slate-800">
          <button 
            type="submit" 
            disabled={loading} 
            className="flex-1 py-3 bg-[#D4AF37] text-black font-bold text-lg uppercase tracking-wider rounded hover:bg-white transition-all disabled:opacity-50"
          >
            {loading ? "Saving..." : (editingPlayer ? "Update Player & Stats" : "Add Player & Stats")}
          </button>
          {editingPlayer && (
            <button 
              type="button" 
              onClick={() => resetForm()} 
              className="flex-1 py-3 bg-slate-800 text-white font-bold text-lg uppercase tracking-wider rounded border border-slate-700 hover:border-slate-600 transition-all"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}