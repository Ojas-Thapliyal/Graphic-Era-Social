import { useState, useEffect } from "react";
import { fetchReels, toggleLikeReel, createReel } from "../services/api";

function Reels() {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newCaption, setNewCaption] = useState("");
  const [newAudio, setNewAudio] = useState("");
  const [showUpload, setShowUpload] = useState(false);

  const loadReels = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchReels();
      if (data && data.reels) {
        setReels(data.reels);
      }
    } catch (err) {
      console.error("Error fetching reels:", err);
      try {
        const res = await fetch("http://localhost:8000/reels");
        const json = await res.json();
        setReels(json.reels || []);
      } catch (fallbackErr) {
        setError("Could not load reels from backend.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReels();
  }, []);

  const handleLike = async (reelId) => {
    try {
      const res = await toggleLikeReel(reelId);
      if (res && res.reel) {
        setReels((prev) =>
          prev.map((r) => (r.id === reelId ? res.reel : r))
        );
      }
    } catch (err) {
      console.error("Failed to like reel:", err);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!newCaption.trim()) return;

    try {
      const res = await createReel({
        caption: newCaption,
        audio: newAudio || "Campus Beats - GEU",
      });
      if (res && res.reel) {
        setReels((prev) => [res.reel, ...prev]);
        setNewCaption("");
        setNewAudio("");
        setShowUpload(false);
      }
    } catch (err) {
      alert("Error posting reel: " + err.message);
    }
  };

  return (
    <section className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-pink-400 dark:via-rose-300 dark:to-amber-300">
            Campus Reels & Shorts
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
            Trending moments, Grafest highlights, dance battles & campus life
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowUpload(!showUpload)}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white transition shadow-md shadow-rose-600/20"
          >
            {showUpload ? "Cancel" : "➕ Upload Reel"}
          </button>
          <button
            onClick={loadReels}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-sm dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 dark:border-slate-700 transition"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {showUpload && (
        <form
          onSubmit={handleUpload}
          className="bg-white dark:bg-slate-800/80 border border-pink-200 dark:border-pink-500/30 rounded-2xl p-5 mb-8 shadow-sm dark:shadow-xl space-y-3 transition-colors"
        >
          <h3 className="text-sm font-semibold text-pink-700 dark:text-pink-300">Post a Campus Reel</h3>
          <input
            type="text"
            value={newCaption}
            onChange={(e) => setNewCaption(e.target.value)}
            placeholder="Reel caption (e.g. Flashmob vibes at Central Lawn 🔥)..."
            className="w-full bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 text-sm rounded-xl p-3 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-pink-500"
          />
          <input
            type="text"
            value={newAudio}
            onChange={(e) => setNewAudio(e.target.value)}
            placeholder="Audio track title (e.g. Grafest Theme 2026)"
            className="w-full bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 text-sm rounded-xl p-3 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-pink-500"
          />
          <button
            type="submit"
            className="px-5 py-2 text-sm font-semibold rounded-xl bg-pink-600 hover:bg-pink-500 text-white transition shadow-md shadow-pink-600/20"
          >
            Publish Reel
          </button>
        </form>
      )}

      {loading && (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-3">Loading reels...</p>
        </div>
      )}

      {error && (
        <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 rounded-xl p-4 mb-6 text-rose-800 dark:text-rose-200 text-sm">
          {error}
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reels.map((reel) => (
            <div
              key={reel.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-lg flex flex-col group hover:border-pink-500/50 transition"
            >
              {/* Media Container */}
              <div className="relative aspect-[9/14] bg-slate-900 overflow-hidden">
                <img
                  src={reel.thumbnail}
                  alt={reel.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-black/20 to-black/40"></div>

                {/* Top badge */}
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-full text-[11px] font-medium text-pink-300 border border-pink-500/30">
                  {reel.university}
                </div>

                {/* Floating Action Button */}
                <div className="absolute right-3 bottom-16 flex flex-col items-center gap-3">
                  <button
                    onClick={() => handleLike(reel.id)}
                    className="flex flex-col items-center bg-black/60 backdrop-blur-md p-2.5 rounded-full hover:scale-110 transition border border-white/20"
                  >
                    <span className="text-xl">{reel.is_liked ? "❤️" : "🤍"}</span>
                    <span className="text-[10px] font-bold text-white mt-0.5">{reel.likes}</span>
                  </button>

                  <div className="flex flex-col items-center bg-black/60 backdrop-blur-md p-2.5 rounded-full border border-white/20">
                    <span className="text-xl">💬</span>
                    <span className="text-[10px] font-bold text-white mt-0.5">{reel.comments_count || 0}</span>
                  </div>
                </div>

                {/* Bottom Caption & Audio */}
                <div className="absolute bottom-3 left-3 right-16 text-white space-y-1">
                  <p className="text-xs font-bold text-pink-300">{reel.handle} • {reel.creator}</p>
                  <p className="text-xs line-clamp-2 drop-shadow-md text-white font-medium">{reel.caption}</p>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-200 pt-1">
                    <span>🎵</span>
                    <span className="truncate">{reel.audio}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default Reels;