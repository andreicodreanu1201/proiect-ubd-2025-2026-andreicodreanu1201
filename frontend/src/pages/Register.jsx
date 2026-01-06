import { useState } from "react";
import { supabase } from "../supabaseClient";

export default function Register({ onSwitchToLogin }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMsg(null);

        if(password !== confirmPassword) {
            setError("PASSWORDS DO NOT MATCH");
            return;
        }

        setLoading(true);
        const { data, error } = await supabase.auth.signUp({ email, password });

        if (error) {
            setError(error.message);
        } else {
            setSuccessMsg("ACCOUNT CREATED. CHECK EMAIL FOR VERIFICATION.");
            setEmail(""); setPassword(""); setConfirmPassword("");
        }
        setLoading(false);
    };

    const inputClass = "w-full !h-[64px] bg-[#111] border border-[#333] text-[#fff] text-lg px-6 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-colors placeholder-zinc-600 font-bold tracking-wide";

    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 font-sans relative overflow-hidden">
            
            <div className="absolute inset-0 bg-[linear-gradient(rgba(212,175,55,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(212,175,55,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none"></div>
            
            <div className="w-full max-w-md relative z-10">
                {/* REMOVED: Top Left Label */}

                <div className="bg-[#0a0a0a] border border-[#222] p-8 md:p-12 shadow-2xl relative">
                    {/* REMOVED: Corner Bracket */}
                    
                    <div className="mb-8">
                        {/* REMOVED: Pulsing Dot */}
                        
                        <h1 className="text-4xl font-black text-[#fff] uppercase tracking-tighter">
                            CREATE <span className="text-[#D4AF37]">ACCOUNT</span>
                        </h1>
                    </div>

                    {error && <div className="mb-6 p-4 bg-red-900/10 border-l-4 border-[#ff0000] text-red-500 text-xs font-bold uppercase tracking-wide text-center">âš ï¸ {error}</div>}
                    {successMsg && <div className="mb-6 p-4 bg-[#D4AF37]/10 border-l-4 border-[#D4AF37] text-[#D4AF37] text-xs font-bold uppercase tracking-wide text-center">âœ… {successMsg}</div>}

                    <form onSubmit={handleRegister} className="flex flex-col gap-5">
                        <div>
                            <label className="text-[10px] font-bold text-[#666] uppercase mb-2 block tracking-widest">Email Address</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={inputClass} placeholder="USER@EXAMPLE.COM" />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-[#666] uppercase mb-2 block tracking-widest">Set Password</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className={inputClass} placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢" />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-[#666] uppercase mb-2 block tracking-widest">Confirm Password</label>
                            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className={inputClass} placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢" />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-16 bg-[#D4AF37] hover:bg-white hover:text-black text-black font-black text-sm uppercase tracking-[0.2em] transition-all duration-300 mt-4 border-2 border-[#D4AF37] disabled:opacity-50"
                        >
                            {loading ? "PROCESSING..." : "REGISTER USER"}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-[#222] text-center">
                        <p className="text-[#444] text-xs font-bold tracking-wider">
                            ALREADY REGISTERED? 
                            <button onClick={onSwitchToLogin} className="bg-[#D4AF37] text-black font-black py-3 px-8 text-xs uppercase tracking-widest hover:bg-white transition-colors">LOGIN HERE</button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}