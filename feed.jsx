import { useState, useEffect } from "react";
import { fetchFeed, createFeedPost, toggleLikePost, addPostComment } from "../services/api";

function Feed() {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostTags, setNewPostTags] = useState("#GEU #CampusLife");
  const [commentInputs, setCommentInputs] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Load feed from backend FastAPI endpoint /feed
  const loadFeed = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchFeed();
      if (data && data.feed) {
        setFeed(data.feed);
      }
    } catch (err) {
      console.error("Error fetching feed:", err);
      try {
        const res = await fetch("http://localhost:8000/feed");
        const json = await res.json();
        setFeed(json.feed || []);
      } catch (fallbackErr) {
        setError("Failed to connect to backend feed. Please make sure FastAPI server is running on port 8000.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeed();
  }, []);

  // Handle creating a new post
  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    try {
      setSubmitting(true);
      const tagsArray = newPostTags
        .split(" ")
        .map((t) => (t.startsWith("#") ? t : `#${t}`))
        .filter(Boolean);

      const res = await createFeedPost({
        content: newPostContent,
        tags: tagsArray,
      });

      if (res && res.post) {
        setFeed((prev) => [res.post, ...prev]);
        setNewPostContent("");
      }
    } catch (err) {
      alert("Error posting: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle like toggle
  const handleLike = async (postId) => {
    try {
      const res = await toggleLikePost(postId);
      if (res && res.post) {
        setFeed((prev) =>
          prev.map((item) => (item.id === postId ? res.post : item))
        );
      }
    } catch (err) {
      console.error("Failed to like post:", err);
    }
  };

  // Handle comment submit
  const handleCommentSubmit = async (postId, e) => {
    e.preventDefault();
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;

    try {
      const res = await addPostComment(postId, { text });
      if (res && res.post) {
        setFeed((prev) =>
          prev.map((item) => (item.id === postId ? res.post : item))
        );
        setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
      }
    } catch (err) {
      console.error("Failed to add comment:", err);
    }
  };

  return (
    <section className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-blue-400 dark:via-indigo-300 dark:to-purple-400">
            Campus Feed
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
            Real-time buzz from Graphic Era Deemed & Hill University
          </p>
        </div>
        <button
          onClick={loadFeed}
          className="self-start md:self-auto px-4 py-2 text-xs font-semibold rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-sm dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 dark:border-slate-700 transition"
        >
          🔄 Refresh Feed
        </button>
      </div>

      {/* Create Post Box */}
      <div className="bg-white dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700/60 rounded-2xl p-5 mb-8 shadow-sm dark:shadow-xl transition-colors duration-200">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-300 mb-3 flex items-center gap-2">
          <span>✍️</span> Share an update with the campus
        </h3>
        <form onSubmit={handleCreatePost} className="space-y-3">
          <textarea
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            placeholder="What's happening on campus? Club events, hackathons, exam prep, or Grafest excitement..."
            rows={3}
            className="w-full bg-slate-50 dark:bg-slate-900/90 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-xl p-3 text-sm border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none transition-colors"
          />
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <input
              type="text"
              value={newPostTags}
              onChange={(e) => setNewPostTags(e.target.value)}
              placeholder="Tags (e.g. #GEU #Grafest #CSE)"
              className="bg-slate-50 dark:bg-slate-900/90 text-slate-800 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500 rounded-lg px-3 py-1.5 text-xs border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={submitting || !newPostContent.trim()}
              className="px-5 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white disabled:opacity-50 transition shadow-md shadow-indigo-600/20"
            >
              {submitting ? "Posting..." : "Post Update"}
            </button>
          </div>
        </form>
      </div>

      {/* Loading & Error States */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-3">Loading campus posts from FastAPI backend...</p>
        </div>
      )}

      {error && (
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl p-4 mb-6 text-amber-800 dark:text-amber-200 text-sm">
          <p className="font-semibold">⚠️ Connection Notice</p>
          <p className="mt-1 text-xs text-amber-700 dark:text-amber-300/80">{error}</p>
        </div>
      )}

      {/* Feed List */}
      {!loading && (
        <div className="space-y-6">
          {feed.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <p className="text-slate-500 dark:text-slate-400">No posts in feed yet. Be the first to share!</p>
            </div>
          ) : (
            feed.map((post) => (
              <article
                key={post.id}
                className="bg-white dark:bg-slate-800/60 hover:bg-slate-50/60 dark:hover:bg-slate-800/90 transition border border-slate-200 dark:border-slate-700/60 rounded-2xl p-5 shadow-sm dark:shadow-lg space-y-4"
              >
                {/* Author Info */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={post.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"}
                      alt={post.author}
                      className="w-11 h-11 rounded-full object-cover ring-2 ring-indigo-500/30"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">{post.author}</h4>
                        {(post.is_alumni || String(post.branch || "").includes("Alumni") || String(post.semester || "").includes("Alumni")) && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300/40">
                            🎓 Alumni
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-indigo-600 dark:text-indigo-300 font-medium">
                        {post.course ? `${post.course} • ` : ""}{post.branch || "B.Tech CSE"} {post.semester && post.semester !== "Alumni" ? `(${post.semester})` : ""}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{post.university} • {post.timestamp}</p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <p className="text-slate-800 dark:text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">
                  {post.content}
                </p>

                {/* Optional Image */}
                {post.image && (
                  <div className="rounded-xl overflow-hidden max-h-96 border border-slate-200 dark:border-slate-700/50">
                    <img
                      src={post.image}
                      alt="Post attachment"
                      className="w-full h-full object-cover hover:scale-[1.02] transition duration-300"
                    />
                  </div>
                )}

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {post.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-xs font-medium text-indigo-700 bg-indigo-50 border border-indigo-200 dark:text-indigo-400 dark:bg-indigo-950/60 px-2.5 py-0.5 rounded-full dark:border-indigo-800/40"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Actions: Likes & Comments Bar */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700/60 text-xs">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition font-medium ${
                        post.is_liked
                          ? "text-rose-600 bg-rose-50 border border-rose-200 dark:text-rose-400 dark:bg-rose-950/40 dark:border-rose-800/50"
                          : "text-slate-600 hover:text-rose-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-rose-400 dark:hover:bg-slate-700/50"
                      }`}
                    >
                      <span>{post.is_liked ? "❤️" : "🤍"}</span>
                      <span>{post.likes || 0} Likes</span>
                    </button>

                    <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                      <span>💬</span>
                      <span>{post.comments ? post.comments.length : 0} Comments</span>
                    </span>
                  </div>
                </div>

                {/* Comments List */}
                {post.comments && post.comments.length > 0 && (
                  <div className="space-y-2 pt-2">
                    {post.comments.map((c, cIdx) => (
                      <div
                        key={cIdx}
                        className="bg-slate-50 dark:bg-slate-900/60 rounded-xl p-2.5 text-xs text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800/70"
                      >
                        <div className="flex items-center justify-between font-semibold text-indigo-700 dark:text-indigo-300 text-[11px] mb-1">
                          <span>{c.author}</span>
                          <span className="text-slate-500 font-normal">{c.time}</span>
                        </div>
                        <p>{c.text}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Comment Input */}
                <form
                  onSubmit={(e) => handleCommentSubmit(post.id, e)}
                  className="flex gap-2 pt-1"
                >
                  <input
                    type="text"
                    value={commentInputs[post.id] || ""}
                    onChange={(e) =>
                      setCommentInputs((prev) => ({
                        ...prev,
                        [post.id]: e.target.value,
                      }))
                    }
                    placeholder="Write a comment..."
                    className="flex-1 bg-slate-50 dark:bg-slate-900/90 text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 text-xs rounded-xl px-3 py-2 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 text-xs font-semibold rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200 transition"
                  >
                    Reply
                  </button>
                </form>
              </article>
            ))
          )}
        </div>
      )}
    </section>
  );
}

export default Feed;