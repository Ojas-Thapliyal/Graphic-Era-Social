import { useState, useEffect } from "react";
import { fetchProfile, updateProfile } from "../services/api";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [bioInput, setBioInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [courseInput, setCourseInput] = useState("");
  const [branchInput, setBranchInput] = useState("");
  const [semesterInput, setSemesterInput] = useState("");
  const [isAlumniInput, setIsAlumniInput] = useState(false);
  const [activeTab, setActiveTab] = useState("reels"); // Default tab when opening profile: 'reels'
  const [activeVideoModal, setActiveVideoModal] = useState(null);
  const [likedReels, setLikedReels] = useState({});
  const [likedPosts, setLikedPosts] = useState({});
  const [showCampusId, setShowCampusId] = useState(false);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchProfile();
      if (data && data.profile) {
        setProfile(data.profile);
        setBioInput(data.profile.bio || "");
        setNameInput(data.profile.name || "");
        setCourseInput(data.profile.course || "B.Tech");
        setBranchInput(data.profile.branch || "Computer Science & Engineering");
        setSemesterInput(data.profile.semester || "6th Semester");
        setIsAlumniInput(data.profile.is_alumni || data.profile.semester === "Alumni" || data.profile.semester === "Passed Out" || false);
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      try {
        const res = await fetch("http://localhost:8000/profile");
        const json = await res.json();
        setProfile(json.profile);
        setBioInput(json.profile?.bio || "");
        setNameInput(json.profile?.name || "");
        setCourseInput(json.profile?.course || "B.Tech");
        setBranchInput(json.profile?.branch || "Computer Science & Engineering");
        setSemesterInput(json.profile?.semester || "6th Semester");
        setIsAlumniInput(json.profile?.is_alumni || json.profile?.semester === "Alumni" || json.profile?.semester === "Passed Out" || false);
      } catch (fallbackErr) {
        setError("Could not connect to profile backend.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const res = await updateProfile({
        name: nameInput,
        bio: bioInput,
        course: courseInput,
        branch: branchInput,
        semester: isAlumniInput ? "Alumni" : semesterInput,
        is_alumni: isAlumniInput,
      });
      if (res && res.profile) {
        setProfile(res.profile);
        setIsEditing(false);
      }
    } catch (err) {
      alert("Failed to update profile: " + err.message);
    }
  };

  const toggleReelLike = (reelId) => {
    setLikedReels((prev) => ({
      ...prev,
      [reelId]: !prev[reelId],
    }));
  };

  const togglePostLike = (postId) => {
    setLikedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  // Fallback mock reels if none returned from server
  const defaultReels = [
    {
      id: 101,
      creator: profile?.name || "Devansh Rawat",
      handle: `@${profile?.username || "devansh_geu"}`,
      caption: "Building an autonomous drone at the GERC lab! 🤖🚁 ROS2 + OpenCV working smoothly!",
      thumbnail: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=600&auto=format&fit=crop&q=80",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      likes: 284,
      comments_count: 19,
      audio: "Original Sound - Devansh Tech Lab",
      tags: ["#GERC", "#Robotics", "#DroneNav", "#GEU"]
    },
    {
      id: 102,
      creator: profile?.name || "Devansh Rawat",
      handle: `@${profile?.username || "devansh_geu"}`,
      caption: "Grafest 2026 night vibes at Graphic Era lawns! 🎸🔥 Best 3 days of college life!",
      thumbnail: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      likes: 512,
      comments_count: 48,
      audio: "Grafest EDM Remix 2026",
      tags: ["#Grafest2026", "#GEUCampus", "#FestLife"]
    },
    {
      id: 103,
      creator: profile?.name || "Devansh Rawat",
      handle: `@${profile?.username || "devansh_geu"}`,
      caption: "Late night coding session at the CS Department Library 💻⚡ #CodeChefGEU",
      thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
      likes: 193,
      comments_count: 14,
      audio: "Lofi Code Beats",
      tags: ["#Coding", "#BTechCSE", "#GEU"]
    }
  ];

  // Fallback mock posts if none returned from server
  const defaultPosts = [
    {
      id: 201,
      author: profile?.name || "Devansh Rawat",
      branch: profile?.branch || "B.Tech CSE, 3rd Year",
      university: profile?.university || "Graphic Era Deemed University",
      avatar: profile?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      content: "Excited to share that our team won 1st Place at the annual GEU Hackathon 2026! Big thanks to our faculty mentors and teammates! 🏆💻🚀",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80",
      timestamp: "2 days ago",
      likes: 148,
      comments: [
        { author: "Priya Verma", text: "Congrats Devansh! Fantastic project 🎉", time: "1 day ago" }
      ],
      tags: ["#GEU", "#Hackathon2026", "#TechLife"]
    },
    {
      id: 202,
      author: profile?.name || "Devansh Rawat",
      branch: profile?.branch || "B.Tech CSE, 3rd Year",
      university: profile?.university || "Graphic Era Deemed University",
      avatar: profile?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      content: "Uploaded complete handwritten notes for DAA (Design & Analysis of Algorithms) Unit 1 to Unit 4! Check out the Notes section. 📚",
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80",
      timestamp: "5 days ago",
      likes: 95,
      comments: [],
      tags: ["#DAANotes", "#StudyResources", "#GEUCSE"]
    }
  ];

  const userReelsList = profile?.user_reels || defaultReels;
  const userPostsList = profile?.user_posts || defaultPosts;

  return (
    <section className="max-w-5xl mx-auto px-4 py-8">
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-3">Loading student profile...</p>
        </div>
      )}

      {error && (
        <div className="bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 rounded-xl p-4 mb-6 text-indigo-800 dark:text-indigo-200 text-sm">
          {error}
        </div>
      )}

      {!loading && profile && (
        <div className="bg-white dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/70 rounded-3xl overflow-hidden shadow-sm dark:shadow-2xl transition-colors">
          {/* Cover Banner */}
          <div className="h-44 md:h-56 relative bg-gradient-to-r from-indigo-800 via-purple-800 to-slate-900">
            {profile.cover_image && (
              <img
                src={profile.cover_image}
                alt="Profile Cover"
                className="w-full h-full object-cover opacity-60"
              />
            )}
            <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-white border border-white/20">
              {profile.campus || "Dehradun Campus"}
            </div>
          </div>

          {/* Profile Header Card */}
          <div className="px-6 md:px-8 pb-8 relative">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-16 sm:-mt-20 gap-4 mb-6">
              <div className="flex items-end gap-4">
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl object-cover ring-4 ring-white dark:ring-slate-800 shadow-xl bg-slate-100 dark:bg-slate-900"
                />
                <div className="mb-2">
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{profile.name}</h1>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
                    @{profile.username}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{profile.university}</p>
                </div>
              </div>

              <button
                onClick={() => setIsEditing(!isEditing)}
                className="self-start sm:self-auto px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200 dark:border-slate-600 transition"
              >
                {isEditing ? "Cancel Edit" : "✏️ Edit Profile"}
              </button>
            </div>

            {/* Edit Mode Form */}
            {isEditing && (
              <form onSubmit={handleSave} className="bg-slate-50 dark:bg-slate-900/80 rounded-2xl p-5 mb-6 border border-slate-200 dark:border-slate-700 space-y-3">
                <h3 className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">Update Profile Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-600 dark:text-slate-400 block mb-1">Full Name</label>
                    <input
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-200 text-xs rounded-xl p-2.5 border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-600 dark:text-slate-400 block mb-1">Course (e.g. B.Tech, M.Tech, BCA)</label>
                    <input
                      type="text"
                      value={courseInput}
                      onChange={(e) => setCourseInput(e.target.value)}
                      className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-200 text-xs rounded-xl p-2.5 border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-600 dark:text-slate-400 block mb-1">Branch (e.g. Computer Science & Engineering)</label>
                    <input
                      type="text"
                      value={branchInput}
                      onChange={(e) => setBranchInput(e.target.value)}
                      className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-200 text-xs rounded-xl p-2.5 border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-600 dark:text-slate-400 block mb-1">Academic Status</label>
                    <select
                      value={isAlumniInput ? "Alumni" : semesterInput}
                      onChange={(e) => {
                        if (e.target.value === "Alumni") {
                          setIsAlumniInput(true);
                        } else {
                          setIsAlumniInput(false);
                          setSemesterInput(e.target.value);
                        }
                      }}
                      className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-200 text-xs rounded-xl p-2.5 border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-indigo-500"
                    >
                      <option value="1st Semester">1st Semester (1st Year)</option>
                      <option value="2nd Semester">2nd Semester (1st Year)</option>
                      <option value="3rd Semester">3rd Semester (2nd Year)</option>
                      <option value="4th Semester">4th Semester (2nd Year)</option>
                      <option value="5th Semester">5th Semester (3rd Year)</option>
                      <option value="6th Semester">6th Semester (3rd Year)</option>
                      <option value="7th Semester">7th Semester (4th Year)</option>
                      <option value="8th Semester">8th Semester (4th Year)</option>
                      <option value="Alumni">🎓 Graduated / Passed Out (Alumni)</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-[11px] text-slate-600 dark:text-slate-400 block mb-1">Bio</label>
                  <textarea
                    value={bioInput}
                    onChange={(e) => setBioInput(e.target.value)}
                    rows={2}
                    className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-200 text-xs rounded-xl p-2.5 border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl transition"
                >
                  Save Changes
                </button>
              </form>
            )}

            {/* Student Info & Bio (Course, Branch, Semester/Alumni display) */}
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-5 mb-6 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div className="bg-white dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700/60">
                  <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Course & Branch</p>
                  <p className="font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                    {profile.course || "B.Tech"} • {profile.branch || "CSE"}
                  </p>
                </div>

                <div className="bg-white dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700/60">
                  <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Academic Status / Semester</p>
                  <div className="mt-1">
                    {profile.is_alumni || profile.semester === "Alumni" || profile.semester === "Passed Out" ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 px-2.5 py-0.5 rounded-md border border-emerald-300 dark:border-emerald-800">
                        🎓 Alumni (Passed Out)
                      </span>
                    ) : (
                      <span className="font-semibold text-slate-900 dark:text-slate-200">
                        {profile.semester || "6th Semester"}
                      </span>
                    )}
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700/60">
                  <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">University</p>
                  <p className="font-semibold text-slate-900 dark:text-slate-200 truncate mt-0.5">{profile.university}</p>
                </div>

                {/* Private Campus ID Card */}
                <div className="bg-gradient-to-br from-indigo-50/80 to-purple-50/80 dark:from-slate-800 dark:to-indigo-950/40 p-3 rounded-xl border border-indigo-200 dark:border-indigo-800/60 relative">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1">
                      <span>🔒 Campus ID</span>
                    </span>
                    <span className="text-[9px] bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 px-1.5 py-0.5 rounded font-semibold border border-amber-300/40">
                      Private
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between mt-1">
                    <span className="font-mono font-bold text-indigo-700 dark:text-indigo-300 text-xs">
                      {showCampusId ? (profile.campus_id || profile.roll_no || "GEU-220110892") : "GEU-••••" + (profile.campus_id || profile.roll_no || "220110892").slice(-4)}
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowCampusId(!showCampusId)}
                      className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold hover:underline px-1 py-0.5 rounded bg-white/60 dark:bg-slate-900/60"
                    >
                      {showCampusId ? "👁️ Hide" : "👁️ View"}
                    </button>
                  </div>
                  <p className="text-[9px] text-slate-500 dark:text-slate-400 mt-0.5">Private to you (hidden on public profiles)</p>
                </div>
              </div>

              <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed pt-2">
                {profile.bio}
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
              <div
                onClick={() => setActiveTab("reels")}
                className={`p-4 rounded-2xl text-center border transition cursor-pointer ${
                  activeTab === "reels"
                    ? "bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800/60 shadow-sm"
                    : "bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300"
                }`}
              >
                <p className="text-2xl font-bold text-rose-600 dark:text-rose-400">{userReelsList.length}</p>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 font-semibold">🎬 Posted Reels</p>
              </div>
              <div
                onClick={() => setActiveTab("posts")}
                className={`p-4 rounded-2xl text-center border transition cursor-pointer ${
                  activeTab === "posts"
                    ? "bg-indigo-50 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-800/60 shadow-sm"
                    : "bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300"
                }`}
              >
                <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{userPostsList.length}</p>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 font-semibold">📰 Feed Posts</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl text-center border border-slate-200 dark:border-slate-800 shadow-sm">
                <p className="text-2xl font-bold text-sky-600 dark:text-sky-400">{profile.stats?.followers || 412}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">Followers</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl text-center border border-slate-200 dark:border-slate-800 shadow-sm">
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{profile.stats?.following || 195}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">Following</p>
              </div>
            </div>

            {/* Interactive Tab Navigation for User Content & Media */}
            <div className="flex border-b border-slate-200 dark:border-slate-800 mb-6 gap-2">
              <button
                onClick={() => setActiveTab("reels")}
                className={`pb-3 px-4 text-xs font-bold transition border-b-2 flex items-center gap-2 ${
                  activeTab === "reels"
                    ? "border-rose-600 text-rose-600 dark:border-rose-400 dark:text-rose-400"
                    : "border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                }`}
              >
                <span>🎬 My Posted Reels ({userReelsList.length})</span>
              </button>
              <button
                onClick={() => setActiveTab("posts")}
                className={`pb-3 px-4 text-xs font-bold transition border-b-2 flex items-center gap-2 ${
                  activeTab === "posts"
                    ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
                    : "border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                }`}
              >
                <span>📰 My Feed Posts ({userPostsList.length})</span>
              </button>
              <button
                onClick={() => setActiveTab("skills")}
                className={`pb-3 px-4 text-xs font-bold transition border-b-2 flex items-center gap-2 ${
                  activeTab === "skills"
                    ? "border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400"
                    : "border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                }`}
              >
                <span>⚡ Skills & Achievements</span>
              </button>
            </div>

            {/* TAB CONTENT 1: USER'S POSTED REELS */}
            {activeTab === "reels" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {userReelsList.map((reel) => {
                  const isLiked = likedReels[reel.id] ?? reel.is_liked;
                  const likeCount = reel.likes + (isLiked && !reel.is_liked ? 1 : !isLiked && reel.is_liked ? -1 : 0);

                  return (
                    <div
                      key={reel.id}
                      className="group relative bg-slate-900 rounded-2xl overflow-hidden shadow-lg border border-slate-800 transition hover:scale-[1.02] duration-200"
                    >
                      {/* Reel Thumbnail with Play Button */}
                      <div className="relative aspect-[9/14] bg-slate-950 overflow-hidden">
                        <img
                          src={reel.thumbnail}
                          alt={reel.caption}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300 opacity-90"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>

                        {/* Play Reel Button */}
                        <button
                          onClick={() => setActiveVideoModal(reel)}
                          className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-white text-xl shadow-2xl group-hover:scale-110 transition duration-200"
                        >
                          ▶️
                        </button>

                        {/* Top Creator info */}
                        <div className="absolute top-3 left-3 right-3 flex justify-between items-center text-white text-xs">
                          <span className="bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-semibold border border-white/10">
                            {reel.handle}
                          </span>
                          <span className="bg-rose-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                            REEL
                          </span>
                        </div>

                        {/* Bottom Overlay info */}
                        <div className="absolute bottom-3 left-3 right-3 text-white space-y-2">
                          <p className="text-xs font-medium line-clamp-2 drop-shadow-md">
                            {reel.caption}
                          </p>

                          <p className="text-[10px] text-slate-300 flex items-center gap-1 font-mono">
                            <span>🎵</span> <span className="truncate">{reel.audio}</span>
                          </p>

                          <div className="flex items-center justify-between pt-1 border-t border-white/10">
                            <button
                              onClick={() => toggleReelLike(reel.id)}
                              className={`flex items-center gap-1 text-xs font-bold transition ${
                                isLiked ? "text-rose-400" : "text-slate-200 hover:text-white"
                              }`}
                            >
                              <span>{isLiked ? "❤️" : "🤍"}</span>
                              <span>{likeCount}</span>
                            </button>

                            <span className="text-[11px] text-slate-300 flex items-center gap-1">
                              💬 {reel.comments_count}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* TAB CONTENT 2: USER'S FEED POSTS */}
            {activeTab === "posts" && (
              <div className="space-y-6">
                {userPostsList.map((post) => {
                  const isLiked = likedPosts[post.id] ?? false;
                  const likeCount = post.likes + (isLiked ? 1 : 0);

                  return (
                    <div
                      key={post.id}
                      className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={post.avatar}
                            alt={post.author}
                            className="w-10 h-10 rounded-xl object-cover"
                          />
                          <div>
                            <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{post.author}</p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400">{post.branch} • {post.timestamp}</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-semibold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 px-2.5 py-1 rounded-lg">
                          Post
                        </span>
                      </div>

                      <p className="text-slate-800 dark:text-slate-200 text-xs leading-relaxed">
                        {post.content}
                      </p>

                      {post.image && (
                        <div className="rounded-xl overflow-hidden max-h-80 border border-slate-200 dark:border-slate-800">
                          <img src={post.image} alt="Post media" className="w-full h-full object-cover" />
                        </div>
                      )}

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {post.tags &&
                          post.tags.map((tag, idx) => (
                            <span key={idx} className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">
                              {tag}
                            </span>
                          ))}
                      </div>

                      <div className="flex items-center gap-4 pt-2 border-t border-slate-200 dark:border-slate-800 text-xs">
                        <button
                          onClick={() => togglePostLike(post.id)}
                          className={`flex items-center gap-1 font-semibold transition ${
                            isLiked ? "text-rose-500" : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                          }`}
                        >
                          <span>{isLiked ? "❤️" : "🤍"}</span>
                          <span>{likeCount} Likes</span>
                        </button>
                        <span className="text-slate-600 dark:text-slate-400 font-medium flex items-center gap-1">
                          💬 {post.comments ? post.comments.length : 0} Comments
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* TAB CONTENT 3: SKILLS & BADGES */}
            {activeTab === "skills" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Skills */}
                <div className="bg-slate-50 dark:bg-slate-900/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <h3 className="text-xs font-bold text-slate-800 dark:text-slate-300 uppercase tracking-wider mb-3">
                    ⚡ Technical Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills &&
                      profile.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 rounded-xl text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-950/70 dark:text-indigo-300 dark:border-indigo-800/40"
                        >
                          {skill}
                        </span>
                      ))}
                  </div>
                </div>

                {/* Badges */}
                <div className="bg-slate-50 dark:bg-slate-900/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <h3 className="text-xs font-bold text-slate-800 dark:text-slate-300 uppercase tracking-wider mb-3">
                    🏅 Campus Achievements
                  </h3>
                  <div className="space-y-2">
                    {profile.badges &&
                      profile.badges.map((badge, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between bg-white dark:bg-slate-800/50 p-2.5 rounded-xl text-xs text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700/50 shadow-sm"
                        >
                          <span className="flex items-center gap-2">
                            <span>{badge.icon}</span>
                            <span className="font-semibold">{badge.name}</span>
                          </span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400">{badge.year}</span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIDEO PLAYER MODAL WHEN CLICKING REELS */}
      {activeVideoModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative bg-slate-900 rounded-3xl overflow-hidden max-w-sm w-full border border-slate-700 shadow-2xl">
            <button
              onClick={() => setActiveVideoModal(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center text-sm font-bold border border-white/20 hover:bg-rose-600 transition"
            >
              ✕
            </button>

            <div className="aspect-[9/16] w-full bg-black relative">
              <video
                src={activeVideoModal.videoUrl}
                controls
                autoPlay
                className="w-full h-full object-cover"
                poster={activeVideoModal.thumbnail}
              />
            </div>

            <div className="p-4 bg-slate-900 text-white space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-400">{activeVideoModal.handle}</span>
                <span className="text-[10px] text-slate-400">🎵 {activeVideoModal.audio}</span>
              </div>
              <p className="text-xs text-slate-200">{activeVideoModal.caption}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Profile;