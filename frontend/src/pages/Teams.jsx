import { useEffect, useState } from "react";
// IMPORTÄ‚M componenta formular separatÄƒ
// AsigurÄƒ-te cÄƒ calea este corectÄƒ (dacÄƒ e Ã®n acelaÈ™i folder pune "./TeamForm")
import TeamForm from "../components/TeamForm";

export default function Teams({ userRole }) {
  const [teams, setTeams] = useState([]);
  const [editingTeam, setEditingTeam] = useState(null);

  // FuncÈ›ia care aduce echipele din Backend
  const fetchTeams = () => {
    fetch("http://localhost:8080/api/teams")
        .then(res => res.json())
        .then(setTeams)
        .catch(err => console.error("Eroare la fetch:", err));
  };

  // ÃŽncÄƒrcÄƒm echipele la pornirea paginii
  useEffect(() => { fetchTeams(); }, []);

  // FuncÈ›ia de È™tergere (Disband)
  const deleteTeam = (id) => {
    if(confirm("Are you sure you want to disband this team?")) {
        fetch(`http://localhost:8080/api/teams/${id}`, { method: "DELETE" })
        .then(fetchTeams);
    }
  };

  return (
    <div className="max-w-[1800px] mx-auto p-6">
      
      {/* 1. FORMULARUL */}
      {userRole === "ADMIN" && (
      <TeamForm 
        fetchTeams={fetchTeams} 
        editingTeam={editingTeam} 
        setEditingTeam={setEditingTeam} 
      />
      )}

      {/* 2. TITLUL  */}
      <h2 className="text-2xl font-bold text-white mb-6 border-l-4 border-[#D4AF37] pl-4 flex items-center gap-5">
        Active Organizations: 
        <span className="text-slate-500 text-sm font-normal bg-slate-900 px-2 py-1 rounded-md ">
            {teams.length} Teams
        </span>
      </h2>

      {/* 3. GRIDUL DE ECHIPE */}
      <div className="grid grid-cols-5 gap-6">
        
        {teams.map(team => (
          <div key={team.id} className="group relative bg-slate-950 border border-slate-800 rounded-xl p-6 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-2 hover:bg-slate-900 hover:border-[#D4AF37]/50 hover:shadow-xl hover:shadow-[#D4AF37]/10 overflow-hidden h-full">
            
            {/* --- BUTOANELE EDIT/DELETE --- */}
            <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
              {userRole === "ADMIN" && (
                <>
                  <button
                    onClick={() => setEditingTeam(team)}
                    className="bg-slate-900 border border-slate-700 p-2 rounded hover:border-D4AF37 hover:text-D4AF37 text-slate-400 transition-all shadow-lg text-xs font-bold"
                    title="Edit Team"
                  >
                    EDIT
                  </button>

                  <button
                    onClick={() => deleteTeam(team.id)}
                    className="text-ff0000 bg-slate-900 border border-slate-700 p-2 rounded hover:border-e53935 hover:text-e53935 text-slate-400 transition-all shadow-lg text-xs font-bold"
                    title="Disband Team"
                  >
                    DELETE
                  </button>
                </>
              )}
            </div>


            {/* --- ZONA LOGO --- */}
            <div className="w-full h-32 mb-4 shrink-0 flex items-center justify-center relative">
                {team.imageUrl ? (
                    <img 
                        src={team.imageUrl} 
                        alt={team.name} 
                        className="max-h-[80px] w-auto max-w-full object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => { 
                            e.target.style.display = 'none'; 
                            e.target.nextSibling.style.display = 'flex'; 
                        }}
                    />
                ) : null}
                
                {/* Fallback */}
                <div 
                    className={`w-24 h-24 rounded-full bg-slate-900 border border-slate-700 items-center justify-center group-hover:border-[#D4AF37] transition-colors shadow-inner ${team.imageUrl ? 'hidden' : 'flex'}`}
                >
                    <span className="text-4xl font-black text-[#D4AF37]">
                        {team.name.charAt(0).toUpperCase()}
                    </span>
                </div>
            </div>

            {/* --- ZONA NUME --- */}
            <div className="h-14 w-full shrink-0 flex items-start justify-center">
                <h3 className="text-xl font-black text-[#D4AF37] mb-2 uppercase tracking-wider truncate w-full">
                    {team.name}
                </h3>
            </div>
            
            {/* Linie decorativÄƒ */}
            <div className="w-12 h-1 bg-slate-800 mt-auto group-hover:bg-[#D4AF37] group-hover:w-24 transition-all duration-500"></div>

          </div>
        ))}
      </div>

      {teams.length === 0 && (
          <div className="text-center py-20 text-slate-600">
              <p className="text-xl">No teams found.</p>
              <p className="text-sm">Register a new organization above.</p>
          </div>
      )}
    </div>
  );
}