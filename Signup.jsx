import { useState } from "react";
import { signupUser } from "../services/api";

function Signup({ onNavigateToLogin }) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    university: "Graphic Era Deemed University",
    branch: "B.Tech CSE",
  });
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg(null);
    setErrorMsg(null);

    const email = formData.email.trim().toLowerCase();
    if (!email.endsWith("@geu.ac.in") && !email.endsWith("@gehu.ac.in") && !email.includes("@")) {
      setErrorMsg("Please use your official Graphic Era college email (@geu.ac.in or @gehu.ac.in)");
      setLoading(false);
      return;
    }

    try {
      const res = await signupUser(formData);
      if (res && res.status === "success") {
        setStatusMsg(res.message || "Registration successful! You can now login.");
        setFormData({
          username: "",
          email: "",
          password: "",
          university: "Graphic Era Deemed University",
          branch: "B.Tech CSE",
        });
        setTimeout(() => {
          if (onNavigateToLogin) onNavigateToLogin();
        }, 1500);
      }
    } catch (err) {
      console.error("Signup error:", err);
      try {
        const directRes = await fetch("http://localhost:8000/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const directJson = await directRes.json();
        if (directRes.ok) {
          setStatusMsg(directJson.message || "Account created successfully!");
          setTimeout(() => {
            if (onNavigateToLogin) onNavigateToLogin();
          }, 1500);
        } else {
          setErrorMsg(directJson.detail || "Signup failed");
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
          <h2 className="text-2xl font-bold text-slate-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-indigo-400 dark:to-sky-300">
            Student Registration
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Join Graphic Era Deemed & Hill University Campus Network
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
            <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Student Username</label>
            <input
              type="text"
              placeholder="e.g. devansh_geu"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-xl p-3 border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">College Email Address</label>
            <input
              type="email"
              placeholder="name.rollno@geu.ac.in or @gehu.ac.in"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-xl p-3 border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Password</label>
            <input
              type="password"
              placeholder="Create a secure password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-xl p-3 border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">University Campus</label>
            <select
              value={formData.university}
              onChange={(e) => setFormData({ ...formData, university: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-200 rounded-xl p-3 border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-indigo-500"
            >
              <option value="Graphic Era Deemed University">Graphic Era Deemed to be University (Dehradun)</option>
              <option value="Graphic Era Hill University">Graphic Era Hill University (Dehradun Campus)</option>
              <option value="Graphic Era Hill University (Bhimtal)">Graphic Era Hill University (Bhimtal Campus)</option>
              <option value="Graphic Era Hill University (Haldwani)">Graphic Era Hill University (Haldwani Campus)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Branch / Degree</label>
            <input
              type="text"
              placeholder="e.g. B.Tech Computer Science & Engineering"
              value={formData.branch}
              onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-xl p-3 border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-white font-semibold transition shadow-md shadow-indigo-600/20 disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Create Student Account"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Already have an account?{" "}
            <button
              onClick={() => onNavigateToLogin && onNavigateToLogin()}
              className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
            >
              Login here
            </button>
          </p>
        </div>
      </div>
    </section>
  );
}

export default Signup;