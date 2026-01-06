import { useEffect, useState } from "react";
import MatchForm from "../components/MatchForm";

export default function Matches({ userRole }) {
  const [matches, setMatches] = useState([]);
  const [editingMatch, setEditingMatch] = useState(null);

  const fetchMatches = () => {
    fetch("http://localhost:8080/api/matches")
      .then((res) => res.json())
      .then(setMatches);
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const deleteMatch = (id) => {
    if (confirm("Delete match record?"))
      fetch(`http://localhost:8080/api/matches/${id}`, { method: "DELETE" }).then(fetchMatches);
  };

  return (
    <div>
      {userRole === "ADMIN" && (
      <MatchForm
        fetchMatches={fetchMatches}
        editingMatch={editingMatch}
        setEditingMatch={setEditingMatch}
      />
      )}

      <div className="mt-20">
        <h3 className="text-white font-black tracking-widest text-xl mb-8 flex items-center gap-4">
          <span className="w-12 h-1 bg-[#D4AF37]"></span>
          LATEST RESULTS
        </h3>

        <div className="flex flex-col gap-6">
          {matches.map((m) => {
            const w1 = m.scoreTeam1 > m.scoreTeam2;
            const w2 = m.scoreTeam2 > m.scoreTeam1;

            return (
              <div
                key={m.id}
                className="group relative w-full bg-[#080808] border-y border-[#222] hover:border-[#444] hover:bg-[#0c0c0c] py-8 px-6 transition-all duration-300"
              >
                {/* Background Glow la hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#D4AF37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

                {/* Layout Flexbox cu 3 zone clare */}
                <div className="relative z-10 flex items-center justify-between gap-6">
                  {/* ZONA 1: INFO MECI */}
                  <div className="w-44 flex-shrink-0 text-left">
                    <div className="text-[#666] text-[10px] font-bold tracking-[0.2em] mb-1">
                      Tournament
                    </div>
                    <div className="text-[#D4AF37] font-black text-xs tracking-wider truncate">
                      {m.tournament?.name || "N/A"}
                    </div>
                    <div className="text-[#444] text-[9px] font-bold tracking-wider mt-2">
                      {m.matchDate ? new Date(m.matchDate).toLocaleDateString() : ""}
                    </div>
                  </div>

                  {/* ZONA 2: MECIUL */}
                  <div className="flex-1 flex items-center justify-center min-w-0">
                    

                    {/* ECHIPA 1 */}
                    <div
                      className={`flex-1 max-w-[280px] text-left truncate transition-all duration-300
                        ${
                          w1
                            ? "!text-[#00FF7F] text-4xl font-black scale-105"
                            : "!text-[#ff0000] text-3xl font-bold opacity-80"
                        }
                      `}
                    >
                      {m.team1?.name || "Team 1"}
                    </div>

                    {/* SCOR */}
                    <div className="px-10 flex items-center gap-6 flex-shrink-0">
                      <span
                        className={`text-5xl font-black transition-all duration-300`}
                      >
                        {m.scoreTeam1}
                      </span>

                      <span className="text-zinc-500 text-3xl font-thin"> - </span>

                      <span
                        className={`text-5xl font-black transition-all duration-300 `}
                      >
                        {m.scoreTeam2}
                      </span>
                    </div>

                    {/* ECHIPA 2 */}
                    <div
                      className={`flex-1 max-w-[280px] text-right truncate transition-all duration-300
                        ${
                          w2
                            ? "!text-[#00FF7F] text-4xl font-black scale-105"
                            : "!text-[#ff0000] text-3xl font-bold opacity-80"
                        }
                      `}
                    >
                      {m.team2?.name || "Team 2"}
                    </div>

                  </div>

                  {/* ZONA 3: ACTIUNI */}
                  <div className="w-44 flex-shrink-0 flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {userRole === "ADMIN" && (
                    <>
                    <button
                      onClick={() => setEditingMatch(m)}
                      className="text-[12px] font-bold text-gray-400 hover:text-[#D4AF37] tracking-widest border border-transparent hover:border-[#D4AF37] px-3 py-1.5 transition-all whitespace-nowrap"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteMatch(m.id)}
                      className="text-[12px] font-bold text-[#ff0000] hover:text-[#e53935] tracking-widest border border-transparent hover:border-[#e53935] px-3 py-1.5 transition-all whitespace-nowrap"
                    >
                      Delete
                    </button>
                    </>
                    )}
                  </div>

                </div>
              </div>
            );
          })}

          {matches.length === 0 && (
            <div className="py-20 text-center border-y border-[#222] text-gray-800 tracking-[0.3em] font-black">
              No Data Found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}