import { useState, useEffect } from "react";
import { fetchClubs, toggleJoinClub } from "../services/api";

function Clubs() {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("all");

  const loadClubs = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchClubs();
      if (data && data.clubs) {
        setClubs(data.clubs);
      }
    } catch (err) {
      console.error("Error fetching clubs:", err);
      try {
        const res = await fetch("http://localhost:8000/clubs");
        const json = await res.json();
        setClubs(json.clubs || []);
      } catch (fallbackErr) {
        setError("Could not connect to backend clubs API.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClubs();
  }, []);

  const handleJoin = async (clubId) => {
    try {
      const res = await toggleJoinClub(clubId);
      if (res && res.club) {
        setClubs((prev) =>
          prev.map((c) => (c.id === clubId ? res.club : c))
        );
      }
    } catch (err) {
      console.error("Failed to toggle join club:", err);
    }
  };

  const filteredClubs = clubs.filter((c) => {
    if (selectedFilter === "deemed") return c.university.toLowerCase().includes("deemed");
    if (selectedFilter === "hill") return c.university.toLowerCase().includes("hill");
    if (selectedFilter === "joined") return c.joined;
    return true;
  });

  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-emerald-400 dark:via-teal-300 dark:to-cyan-400">
            Campus Societies & Clubs
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
            Explore technical, cultural, social & sports clubs across GEU Deemed & GEHU Hill University
          </p>
        </div>
        <button
          onClick={loadClubs}
          className="self-start md:self-auto px-4 py-2 text-xs font-semibold rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-sm dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 dark:border-slate-700 transition"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { id: "all", label: "All Clubs" },
          { id: "deemed", label: "GEU Deemed Univ" },
          { id: "hill", label: "GEHU Hill Univ" },
          { id: "joined", label: "My Clubs" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedFilter(tab.id)}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition ${
              selectedFilter === tab.id
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 shadow-sm dark:bg-slate-800/80 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200 dark:border-slate-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading && (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-3">Loading campus clubs...</p>
        </div>
      )}

      {error && (
        <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-xl p-4 mb-6 text-emerald-800 dark:text-emerald-200 text-sm">
          {error}
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClubs.map((club) => (
            <div
              key={club.id}
              className="bg-white dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/70 hover:border-emerald-500/50 rounded-2xl p-6 shadow-sm dark:shadow-xl flex flex-col justify-between transition group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="text-3xl bg-slate-100 dark:bg-slate-900/80 w-12 h-12 rounded-xl flex items-center justify-center border border-slate-200 dark:border-slate-700">
                    {club.logo || "🏛️"}
                  </div>
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800/50">
                    {club.badge || club.category}
                  </span>
                </div>

                <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition mb-1">
                  {club.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-3">
                  {club.university}
                </p>

                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed line-clamp-3 mb-4">
                  {club.description}
                </p>

                {/* Upcoming Event */}
                {club.upcoming_event && (
                  <div className="bg-emerald-50/70 dark:bg-slate-900/70 rounded-xl p-3 mb-4 border border-emerald-200/60 dark:border-slate-800 text-xs">
                    <p className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 mb-0.5">📅 Upcoming Event</p>
                    <p className="text-slate-700 dark:text-slate-300 text-xs">{club.upcoming_event}</p>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-900 dark:text-slate-200">
                    👥 {club.members_count} Members
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Lead: {club.lead}</p>
                </div>

                <button
                  onClick={() => handleJoin(club.id)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition ${
                    club.joined
                      ? "bg-slate-200 text-slate-700 hover:bg-rose-100 hover:text-rose-700 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-rose-900 dark:hover:text-rose-200"
                      : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md shadow-emerald-600/20"
                  }`}
                >
                  {club.joined ? "Joined ✓" : "Join Club"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default Clubs;