import { useState, useEffect } from "react";

export default function TournamentForm({ fetchTournaments, editingTournament, setEditingTournament }) {
    const [name, setName] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [errorMessage, setErrorMessage] = useState(null);

    // Populare form la editare
    useEffect(() => {
        if (editingTournament) {
            setName(editingTournament.name);
            setStartDate(editingTournament.startDate || "");
            setEndDate(editingTournament.endDate || "");
        } else {
            setName("");
            setStartDate("");
            setEndDate("");
        }
    }, [editingTournament]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const method = editingTournament ? "PUT" : "POST";
        const url = editingTournament 
            ? `http://localhost:8080/api/tournaments/${editingTournament.id}` 
            : "http://localhost:8080/api/tournaments";

        const payload = { name, startDate, endDate };

        fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        })
        .then (() => {
            if (setEditingTournament) setEditingTournament(null);
            fetchTournaments();
        })
        .catch(err => console.error("Error saving tournament:", err));
    
        console.log("Submit:", { name, startDate, endDate });
    };

  
    const inputClass = "w-full !h-14 min-h-[56px] bg-[#171717] border border-[#333] text-[#fff] px-4 rounded focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-colors placeholder-slate-600 font-medium text-lg leading-[3.5rem]";

    return (
        <form onSubmit={handleSubmit} className="mb-8 bg-[#0a0a0a] p-6 border border-[#222] rounded-xl relative overflow-hidden shadow-xl">
            
            {/* Accent Stanga GOLD */}
            <div className="absolute left-0 top-0 h-full w-1.5 bg-[#D4AF37]"></div>

            {/* Header */}
            <div className="flex justify-between items-start mb-6 pl-2">
                <h3 className="text-lg font-black text-[#D4AF37] uppercase tracking-wider flex items-center gap-2">
                    {editingTournament ? " Reschedule Event" : " Create Tournament"}
                </h3>
            </div>

            {/* Grid Input-uri */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                
                {/* Nume Turneu */}
                <div className="min-w-0">
                    <label className="text-[10px] font-bold text-[#666] uppercase mb-2 block tracking-wider">Tournament Name</label>
                    <input 
                        type="text" 
                        value={name} 
                        onChange={e => setName(e.target.value)} 
                        placeholder="Ex: Winter Championship" 
                        className={inputClass} 
                        required 
                    />
                </div>

                {/* Start Date */}
                <div className="min-w-0">
                    <label className="text-[10px] font-bold text-[#666] uppercase mb-2 block tracking-wider">Start Date</label>
                    <input 
                        type="date" 
                        value={startDate} 
                        onChange={e => setStartDate(e.target.value)} 
                        required 
                        className={`
                            ${inputClass} 
                            [color-scheme:dark] 
                            cursor-pointer
                            uppercase
                            tracking-wide
                            text-sm
                            [&::-webkit-calendar-picker-indicator]:opacity-50
                            [&::-webkit-calendar-picker-indicator]:hover:opacity-100
                            [&::-webkit-calendar-picker-indicator]:cursor-pointer
                            [&::-webkit-calendar-picker-indicator]:p-1
                        `}
                    />
                </div>

                {/* End Date */}
                <div className="min-w-0">
                    <label className="text-[10px] font-bold text-[#666] uppercase mb-2 block tracking-wider">End Date</label>
                    <input 
                        type="date" 
                        value={endDate} 
                        onChange={e => setEndDate(e.target.value)} 
                        required 
                        className={`
                            ${inputClass} 
                            [color-scheme:dark] 
                            cursor-pointer
                            uppercase
                            tracking-wide
                            text-sm
                            [&::-webkit-calendar-picker-indicator]:opacity-50
                            [&::-webkit-calendar-picker-indicator]:hover:opacity-100
                            [&::-webkit-calendar-picker-indicator]:cursor-pointer
                            [&::-webkit-calendar-picker-indicator]:p-1
                        `}
                    />
                </div>
            </div>

            {/* Butoane */}
            <div className="flex gap-3">
                {editingTournament && (
                    <button 
                        type="button" 
                        onClick={() => setEditingTournament(null)} 
                        className="w-1/3 h-12 bg-[#222] hover:bg-[#333] text-slate-300 font-bold rounded transition-colors uppercase text-sm border border-[#333]"
                    >
                        Cancel
                    </button>
                )}
                <button 
                    type="submit" 
                    className="w-full h-12 bg-[#D4AF37] hover:bg-[#b8952b] text-black font-black rounded uppercase tracking-widest text-sm transition-all hover:shadow-[0_0_15px_rgba(212,175,55,0.3)]"
                >
                    {editingTournament ? "Update Event" : "Launch Event"}
                </button>
            </div>
        </form>
    );
}