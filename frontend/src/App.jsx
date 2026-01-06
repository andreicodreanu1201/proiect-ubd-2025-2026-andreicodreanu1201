import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login"; 
import Register from "./pages/Register"; 

export default function App() {
  const [session, setSession] = useState(null);
  const [currentView, setCurrentView] = useState("login");
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Check active session on load
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSession(session);
        // Fetch user role
        fetchUserRole(session.user.id);
      }
      setLoading(false);
    });

    // 2. Listen for auth changes (Login/Logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchUserRole(session.user.id);
      } else {
        setUserRole(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserRole = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .single();

      if (error) {
        console.error("Error fetching role:", error);
        setUserRole('USER');
        return;
      }

      const role = data?.role || 'USER';
      setUserRole(role);
      localStorage.setItem('userRole', role);
    } catch (err) {
      console.error("Error:", err);
      setUserRole('USER');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUserRole(null);
    localStorage.removeItem('userRole');
    setCurrentView("login");
  };

  const handleLogin = (newSession, role) => {
    setSession(newSession);
    const userRole = role || 'USER';
    setUserRole(userRole);
    localStorage.setItem('userRole', userRole);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505]">
        <p className="text-[#D4AF37] text-xl font-bold">Loading...</p>
      </div>
    );
  }

  // --- TRAFFIC CONTROL LOGIC ---

  // 1. If User is Logged In -> Show Dashboard
  if (session) {
    return (
      <Dashboard 
        key={session.user.id} 
        session={session} 
        userRole={userRole} 
        onLogout={handleLogout} 
      />
    );
  }

  // 2. If User is NOT Logged In + View is 'register' -> Show Register
  if (currentView === "register") {
    return <Register onSwitchToLogin={() => setCurrentView("login")} />;
  }

  // 3. Default: Show Login
  return (
    <Login 
      onLogin={handleLogin}
      onSwitchToRegister={() => setCurrentView("register")}
    />
  );
}