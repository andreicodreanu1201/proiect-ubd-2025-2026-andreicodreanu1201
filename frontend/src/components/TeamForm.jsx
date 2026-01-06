import { useState, useEffect } from "react";

export default function TeamForm({ fetchTeams, editingTeam, setEditingTeam }) {
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (editingTeam) {
      setName(editingTeam.name);
      setImageUrl(editingTeam.imageUrl || "");
    } else {
      resetForm();
    }
  }, [editingTeam]);

  const resetForm = () => {
    setName(""); setImageUrl("");
    if (setEditingTeam) setEditingTeam(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const method = editingTeam ? "PUT" : "POST";
    const url = editingTeam 
        ? `http://localhost:8080/api/teams/${editingTeam.id}` 
        : "http://localhost:8080/api/teams";

    const payload = { name, imageUrl };

    fetch(url, { 
        method, 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify(payload) 
    })
    .then(() => {
      resetForm();
      fetchTeams();
    })
    .catch(err => console.error("Eroare la salvare:", err));
  };

  // Stil comun SOLID
  // ÃŽnlocuieÈ™te linia veche cu aceasta Ã®n toate fiÈ™ierele:
  const inputClass = "w-full !h-14 min-h-[56px] bg-[#171717] border border-[#333] text-[#fff] px-4 rounded focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-colors placeholder-slate-600 font-medium text-lg leading-[3.5rem]";

  return (
    <form onSubmit={handleSubmit} className="mb-10 bg-[#0a0a0a] p-6 border border-[#222] rounded-xl relative overflow-hidden shadow-xl">
        
        {/* Accent Stanga GOLD */}
        <div className="absolute left-0 top-0 h-full w-1.5 bg-[#D4AF37]"></div>

        {/* Header */}
        <div className="flex justify-between items-start mb-6 pl-2">
          <h3 className="text-lg font-black text-[#D4AF37] uppercase tracking-wider flex items-center gap-2">
            {editingTeam ? " Edit Team" : " Register Team"}
          </h3>
        </div>

        {/* Grid Input-uri */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
            <div className="min-w-0">
                <label className="text-[10px] font-bold text-[#666] uppercase mb-1 block tracking-wider">Team Name</label>
                <input 
                    type="text" 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    placeholder="Ex: Natus Vincere" 
                    className={inputClass}
                    required
                />
            </div>
            
            <div className="min-w-0">
                <label className="text-[10px] font-bold text-[#666] uppercase mb-1 block tracking-wider">Logo URL</label>
                <input 
                    type="text" 
                    value={imageUrl} 
                    onChange={e => setImageUrl(e.target.value)} 
                    placeholder="https://imgur.com/..." 
                    className={inputClass}
                />
            </div>
        </div>

        {/* Butoane */}
        <div className="flex gap-3">
            {editingTeam && (
                <button 
                    type="button" 
                    onClick={resetForm} 
                    className="w-1/3 bg-[#222] hover:bg-[#333] text-slate-300 font-bold py-3 rounded transition-colors uppercase text-sm border border-[#333]"
                >
                    Cancel
                </button>
            )}
            <button 
                type="submit" 
                className="w-full bg-[#D4AF37] hover:bg-[#b8952b] text-black font-black py-3 rounded uppercase tracking-widest text-sm transition-all hover:shadow-[0_0_15px_rgba(212,175,55,0.3)]"
            >
                {editingTeam ? "Update Team" : "Create Team"}
            </button>
        </div>
    </form>
  );
}