import { useState, useEffect } from "react";
import { fetchSettings, updateSettings } from "../services/api";

function Settings({ theme, toggleTheme }) {
  const [settings, setSettings] = useState({
    email_notifications: true,
    campus_updates: true,
    show_profile_to_other_campuses: true,
    private_account: false,
    dark_theme: theme === "dark",
    auto_play_reels: false,
    preferred_campus: "GEU Dehradun (Deemed)",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [error, setError] = useState(null);

  const loadSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchSettings();
      if (data && data.settings) {
        setSettings({
          ...data.settings,
          dark_theme: theme === "dark",
        });
      }
    } catch (err) {
      console.error("Error fetching settings:", err);
      try {
        const res = await fetch("http://localhost:8000/settings");
        const json = await res.json();
        if (json.settings) {
          setSettings({
            ...json.settings,
            dark_theme: theme === "dark",
          });
        }
      } catch (fallbackErr) {
        setError("Could not connect to settings backend.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, [theme]);

  const handleToggle = (key) => {
    if (key === "dark_theme" && toggleTheme) {
      toggleTheme();
    }
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setStatusMsg("");
      const res = await updateSettings(settings);
      if (res && res.settings) {
        setSettings(res.settings);
        setStatusMsg("Preferences saved successfully!");
        setTimeout(() => setStatusMsg(""), 4000);
      }
    } catch (err) {
      alert("Error saving settings: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-teal-400 dark:via-emerald-300 dark:to-blue-400">
            Account Settings
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
            Manage your campus privacy, alerts, and platform experience
          </p>
        </div>
      </div>

      {loading && (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-3">Loading user settings...</p>
        </div>
      )}

      {error && (
        <div className="bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/60 rounded-xl p-4 mb-6 text-teal-800 dark:text-teal-200 text-sm">
          {error}
        </div>
      )}

      {statusMsg && (
        <div className="bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-600 rounded-xl p-3 mb-6 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2">
          <span>✓</span> {statusMsg}
        </div>
      )}

      {!loading && (
        <form onSubmit={handleSave} className="space-y-6">
          {/* Appearance & Theme Card */}
          <div className="bg-white dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/70 rounded-2xl p-6 shadow-sm dark:shadow-xl space-y-4 transition-colors">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              🎨 Appearance & Theme
            </h3>

            <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-700/50">
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-200">Dark Mode</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {theme === "dark" ? "Dark theme active (Sleek dark palette)" : "Light theme active (Crisp clean palette)"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleToggle("dark_theme")}
                className={`w-12 h-6 rounded-full transition p-1 flex items-center ${
                  theme === "dark" ? "bg-teal-600 justify-end" : "bg-slate-300 justify-start"
                }`}
              >
                <span className="w-4 h-4 bg-white rounded-full shadow-md"></span>
              </button>
            </div>
          </div>

          {/* Notifications Card */}
          <div className="bg-white dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/70 rounded-2xl p-6 shadow-sm dark:shadow-xl space-y-4 transition-colors">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              🔔 Notifications & Campus Alerts
            </h3>

            <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-700/50">
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-200">Email Notifications</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Receive exam notices, club invitations & important updates</p>
              </div>
              <button
                type="button"
                onClick={() => handleToggle("email_notifications")}
                className={`w-12 h-6 rounded-full transition p-1 flex items-center ${
                  settings.email_notifications ? "bg-teal-600 justify-end" : "bg-slate-300 dark:bg-slate-700 justify-start"
                }`}
              >
                <span className="w-4 h-4 bg-white rounded-full shadow-md"></span>
              </button>
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-200">Campus Fest & Event Alerts</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Live announcements regarding Grafest, TechFest, and Hackathons</p>
              </div>
              <button
                type="button"
                onClick={() => handleToggle("campus_updates")}
                className={`w-12 h-6 rounded-full transition p-1 flex items-center ${
                  settings.campus_updates ? "bg-teal-600 justify-end" : "bg-slate-300 dark:bg-slate-700 justify-start"
                }`}
              >
                <span className="w-4 h-4 bg-white rounded-full shadow-md"></span>
              </button>
            </div>
          </div>

          {/* Privacy Card */}
          <div className="bg-white dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/70 rounded-2xl p-6 shadow-sm dark:shadow-xl space-y-4 transition-colors">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              🛡️ Privacy & Campus Visibility
            </h3>

            <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-700/50">
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-200">🔒 Private Campus ID</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Keep Campus ID / Student Roll Number private (visible only to you on your profile)</p>
              </div>
              <button
                type="button"
                onClick={() => handleToggle("private_campus_id")}
                className={`w-12 h-6 rounded-full transition p-1 flex items-center ${
                  settings.private_campus_id !== false ? "bg-teal-600 justify-end" : "bg-slate-300 dark:bg-slate-700 justify-start"
                }`}
              >
                <span className="w-4 h-4 bg-white rounded-full shadow-md"></span>
              </button>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-700/50">
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-200">Cross-Campus Visibility</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Allow students from GEHU (Hill) & GEU (Deemed) to view your profile</p>
              </div>
              <button
                type="button"
                onClick={() => handleToggle("show_profile_to_other_campuses")}
                className={`w-12 h-6 rounded-full transition p-1 flex items-center ${
                  settings.show_profile_to_other_campuses ? "bg-teal-600 justify-end" : "bg-slate-300 dark:bg-slate-700 justify-start"
                }`}
              >
                <span className="w-4 h-4 bg-white rounded-full shadow-md"></span>
              </button>
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-200">Private Profile</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Only approved classmates can see your posts and notes</p>
              </div>
              <button
                type="button"
                onClick={() => handleToggle("private_account")}
                className={`w-12 h-6 rounded-full transition p-1 flex items-center ${
                  settings.private_account ? "bg-teal-600 justify-end" : "bg-slate-300 dark:bg-slate-700 justify-start"
                }`}
              >
                <span className="w-4 h-4 bg-white rounded-full shadow-md"></span>
              </button>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-white dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/70 rounded-2xl p-6 shadow-sm dark:shadow-xl space-y-4 transition-colors">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              🏫 Campus Affiliation
            </h3>

            <div>
              <label className="text-xs text-slate-700 dark:text-slate-300 block mb-1.5 font-medium">Primary Campus Affiliation</label>
              <select
                value={settings.preferred_campus}
                onChange={(e) => setSettings({ ...settings, preferred_campus: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-200 text-xs rounded-xl p-3 border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-teal-500"
              >
                <option value="GEU Dehradun (Deemed)">Graphic Era Deemed to be University (Dehradun)</option>
                <option value="GEHU Dehradun (Hill)">Graphic Era Hill University (Dehradun Campus)</option>
                <option value="GEHU Bhimtal">Graphic Era Hill University (Bhimtal Campus)</option>
                <option value="GEHU Haldwani">Graphic Era Hill University (Haldwani Campus)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-semibold text-sm rounded-xl transition shadow-lg shadow-teal-600/20 disabled:opacity-50"
            >
              {saving ? "Saving Changes..." : "Save Preferences"}
            </button>
          </div>
        </form>
      )}
    </section>
  );
}

export default Settings;