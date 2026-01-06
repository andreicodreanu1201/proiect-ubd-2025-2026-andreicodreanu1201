import { useState } from "react";
import { supabase } from "../supabaseClient";

export default function Login({ onLogin, onSwitchToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Login with Supabase Auth
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      // 2. Get the authenticated user
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setError("User not found");
        setLoading(false);
        return;
      }

      // 3. Check if user exists in users table
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('id, role')
        .eq('id', user.id)
        .single();

      let userRole = 'USER';

      // 4. If user doesn't exist in table, create with default role
      if (checkError && checkError.code === 'PGRST116') {
        // User doesn't exist, insert it
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: user.id,
            email: user.email,
            role: 'USER'
          });

        if (insertError) {
          console.error("Insert error:", insertError);
          userRole = 'USER';
        }
      } else if (existingUser) {
        // User exists, get their role
        userRole = existingUser.role || 'USER';
      }

      // 5. Call onLogin with session and role
      onLogin(data.session, userRole);
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred during login");
      setLoading(false);
    }
  };

  const inputClass = "w-full !h-[64px] bg-[#111] border border-[#333] text-[#fff] text-lg px-6 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-colors placeholder-zinc-600 font-bold tracking-wide";

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505]">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-black text-[#D4AF37] mb-8 text-center">Authorized Personnel Only</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500 text-red-400 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 mb-6">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className={inputClass}
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className={inputClass}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full h-[64px] bg-[#D4AF37] text-black font-bold text-lg uppercase tracking-wider hover:bg-white transition-all disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="text-center">
          <p className="text-slate-400 mb-2">NEED ACCESS?</p>
          <button
            onClick={onSwitchToRegister}
            className="text-[#D4AF37] hover:text-white transition-colors font-bold"
          >
            Register here
          </button>
        </div>
      </div>
    </div>
  );
}