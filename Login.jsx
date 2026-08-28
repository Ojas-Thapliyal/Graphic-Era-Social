import { useState } from "react";
import { loginUser } from "../services/api";

function Login({ onNavigateToSignup, onLoginSuccess }) {
  const [formData, setFormData] = useState({
    email: "devansh.220110892@geu.ac.in",
    password: "password123",
  });
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg(null);
    setErrorMsg(null);

    try {
      const res = await loginUser(formData);
      if (res && res.status === "success") {
        setStatusMsg(res.message || "Login successful! Redirecting to feed...");
        setTimeout(() => {
          if (onLoginSuccess) onLoginSuccess();
        }, 1200);
      }
    } catch (err) {
      console.error("Login error:", err);
      try {
        const directRes = await fetch("http://localhost:8000/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const directJson = await directRes.json();
        if (directRes.ok) {
          setStatusMsg(directJson.message || "Login successful!");
          setTimeout(() => {
            if (onLoginSuccess) onLoginSuccess();
          }, 1200);
        } else {
          setErrorMsg(directJson.detail || "Invalid credentials");
        }
      } catch (fallbackErr) {
        setErrorMsg(err.message || "Could not connect to authentication server.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-3xl p-8 shadow-sm dark:shadow-2xl backdrop-blur-sm transition-colors">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-blue-400 dark:to-indigo-300">
            Student Login
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Access your Graphic Era portal, clubs, notes & messenger
          </p>
        </div>

        {statusMsg && (
          <div className="bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-600/70 rounded-xl p-3.5 mb-5 text-emerald-800 dark:text-emerald-200 text-xs font-semibold">
            ✓ {statusMsg}
          </div>
        )}

        {errorMsg && (
          <div className="bg-rose-50 dark:bg-rose-950/80 border border-rose-300 dark:border-rose-600/70 rounded-xl p-3.5 mb-5 text-rose-800 dark:text-rose-200 text-xs">
            ⚠️ {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">College Email ID</label>
            <input
              type="email"
              placeholder="e.g. yourname@geu.ac.in"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-xl p-3 border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-xl p-3 border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold transition shadow-md shadow-blue-600/20 disabled:opacity-50"
          >
            {loading ? "Authenticating..." : "Login to Campus Portal"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Don't have an account?{" "}
            <button
              onClick={() => onNavigateToSignup && onNavigateToSignup()}
              className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
            >
              Sign up here
            </button>
          </p>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700/60 text-center text-slate-600 dark:text-slate-400 text-xs">
          <p>Demo Account: <span className="text-slate-900 dark:text-slate-200 font-mono">devansh.220110892@geu.ac.in</span></p>
          <p>Password: <span className="text-slate-900 dark:text-slate-200 font-mono">password123</span></p>
        </div>
      </div>
    </section>
  );
}

export default Login;