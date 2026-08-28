import { useState, useEffect } from "react";
import { fetchQuestionPapers, uploadQuestionPaper } from "../services/api";

function QuestionPaper() {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSem, setSelectedSem] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const [activeViewerModal, setActiveViewerModal] = useState(null);
  
  const [formData, setFormData] = useState({
    subject: "",
    subject_code: "",
    exam_type: "End-Term Examination",
    year: "2025",
    semester: "3rd Semester",
    branch: "B.Tech CSE",
    category: "Computer Science & Data Science",
    drive_url: "",
  });

  const categories = [
    { name: "All", label: "All Disciplines", icon: "📚" },
    { name: "Engineering Mathematics", label: "Math & Basic Science", icon: "📐" },
    { name: "Computer Science & Data Science", label: "Computer Science & AI", icon: "💻" },
    { name: "Electronics & Electrical", label: "Electronics & Electrical", icon: "⚡" },
    { name: "Mechanical & Aerospace", label: "Mechanical & Aerospace", icon: "⚙️" },
    { name: "Petroleum & Geology", label: "Petroleum & Geology", icon: "🛢️" },
    { name: "Biotechnology", label: "Biotechnology", icon: "🧬" },
    { name: "Civil Engineering", label: "Civil Engineering", icon: "🏗️" },
    { name: "General & Humanities", label: "Humanities & General", icon: "🏛️" },
  ];

  // Helper function to derive embedded Google Drive preview and direct download links
  const getEmbedUrls = (url) => {
    if (!url) {
      return {
        previewUrl: "https://drive.google.com/file/d/1F6BBGNH3G4Pr49eCPXym1G6cF_9k2xao/preview",
        downloadUrl: "#",
        openUrl: "#",
      };
    }
    const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      const fileId = match[1];
      return {
        fileId,
        previewUrl: `https://drive.google.com/file/d/${fileId}/preview`,
        downloadUrl: `https://drive.google.com/uc?export=download&id=${fileId}`,
        openUrl: `https://drive.google.com/file/d/${fileId}/view`,
      };
    }
    return { previewUrl: url, downloadUrl: url, openUrl: url };
  };

  const loadPapers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchQuestionPapers(selectedSem);
      if (data && data.question_papers && data.question_papers.length > 0) {
        setPapers(data.question_papers);
      }
    } catch (err) {
      console.warn("Error fetching question papers from backend:", err);
      try {
        const res = await fetch(
          `http://localhost:8000/question_paper${selectedSem ? `?semester=${selectedSem}` : ""}`
        );
        const json = await res.json();
        if (json && json.question_papers && json.question_papers.length > 0) {
          setPapers(json.question_papers);
        }
      } catch (fallbackErr) {
        console.warn("Backend unavailable for question papers:", fallbackErr);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPapers();
  }, [selectedSem]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!formData.subject.trim() || !formData.subject_code.trim()) return;

    try {
      const res = await uploadQuestionPaper(formData);
      if (res && res.question_paper) {
        setPapers((prev) => [res.question_paper, ...prev]);
        setFormData({
          subject: "",
          subject_code: "",
          exam_type: "End-Term Examination",
          year: "2025",
          semester: "3rd Semester",
          branch: "B.Tech CSE",
          category: "Computer Science & Data Science",
          drive_url: "",
        });
        setShowUpload(false);
      }
    } catch (err) {
      alert("Error adding paper: " + err.message);
    }
  };

  const handleDirectDownload = (qp) => {
    const urls = getEmbedUrls(qp.drive_url);
    if (urls.downloadUrl && urls.downloadUrl !== "#") {
      const link = document.createElement("a");
      link.href = urls.downloadUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert(`Downloading Question Paper: ${qp.subject} (${qp.subject_code})`);
    }
  };

  const filteredPapers = papers.filter((qp) => {
    if (selectedCategory !== "All") {
      if (
        !qp.category ||
        !qp.category.toLowerCase().includes(selectedCategory.toLowerCase())
      ) {
        return false;
      }
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchSubject = qp.subject && qp.subject.toLowerCase().includes(q);
      const matchCode = qp.subject_code && qp.subject_code.toLowerCase().includes(q);
      const matchBranch = qp.branch && qp.branch.toLowerCase().includes(q);
      const matchCategory = qp.category && qp.category.toLowerCase().includes(q);
      if (!matchSubject && !matchCode && !matchBranch && !matchCategory) {
        return false;
      }
    }

    return true;
  });

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-xs font-bold border border-purple-200 dark:border-purple-800">
              Official Academic Repository • 41+ Papers
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800">
              Online Document Viewer & Download Ready
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-purple-400 dark:via-pink-300 dark:to-indigo-300">
            Graphic Era Previous Year Question Papers (PYQs)
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
            View question papers directly online inside the app, preview solutions, and download PDFs in 1-click
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowUpload(!showUpload)}
            className="px-4 py-2.5 text-xs font-bold rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white transition shadow-md shadow-purple-600/20 flex items-center gap-1.5"
          >
            <span>📑</span>
            <span>{showUpload ? "Cancel" : "Upload PYQ Link"}</span>
          </button>
          <button
            onClick={loadPapers}
            className="px-4 py-2.5 text-xs font-semibold rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-sm dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 dark:border-slate-700 transition"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Upload Form Box */}
      {showUpload && (
        <form
          onSubmit={handleUpload}
          className="bg-white dark:bg-slate-800/90 border border-purple-200 dark:border-purple-500/30 rounded-2xl p-6 mb-8 shadow-md dark:shadow-2xl space-y-4 transition-colors"
        >
          <h3 className="text-sm font-bold text-purple-700 dark:text-purple-300 flex items-center gap-2">
            <span>📑 Add Exam Question Paper (Google Drive or PDF Link)</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <input
              type="text"
              placeholder="Subject Name (e.g. Python Programming)"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 rounded-xl p-3 border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-purple-500"
              required
            />
            <input
              type="text"
              placeholder="Course Code (e.g. TCS 307)"
              value={formData.subject_code}
              onChange={(e) => setFormData({ ...formData, subject_code: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 rounded-xl p-3 border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-purple-500"
              required
            />
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-200 text-xs rounded-xl p-3 border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-purple-500"
            >
              {categories.slice(1).map((c) => (
                <option key={c.name} value={c.name} className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">
                  {c.label}
                </option>
              ))}
            </select>

            <select
              value={formData.exam_type}
              onChange={(e) => setFormData({ ...formData, exam_type: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-200 text-xs rounded-xl p-3 border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-purple-500"
            >
              <option value="End-Term Examination">End-Term Examination</option>
              <option value="Mid-Term Examination">Mid-Term Examination</option>
              <option value="Special Improvement Exam">Special Improvement Exam</option>
            </select>

            <select
              value={formData.semester}
              onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-200 text-xs rounded-xl p-3 border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-purple-500"
            >
              <option value="1st Semester">1st Semester</option>
              <option value="2nd Semester">2nd Semester</option>
              <option value="3rd Semester">3rd Semester</option>
              <option value="4th Semester">4th Semester</option>
              <option value="5th Semester">5th Semester</option>
              <option value="6th Semester">6th Semester</option>
              <option value="7th Semester">7th Semester</option>
              <option value="8th Semester">8th Semester</option>
            </select>

            <input
              type="text"
              placeholder="Branch (e.g. B.Tech CSE / ECE)"
              value={formData.branch}
              onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 rounded-xl p-3 border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-purple-500"
            />

            <input
              type="url"
              placeholder="Google Drive URL (https://drive.google.com/file/d/...)"
              value={formData.drive_url}
              onChange={(e) => setFormData({ ...formData, drive_url: e.target.value })}
              className="w-full md:col-span-3 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 rounded-xl p-3 border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-purple-500 font-mono"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs rounded-xl transition shadow-md shadow-purple-600/20"
          >
            Submit & Publish Question Paper
          </button>
        </form>
      )}

      {/* Search Bar & Filters Section */}
      <div className="space-y-4 mb-8">
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="🔍 Search question papers by Subject (e.g. Python, Thermodynamics), Course Code (e.g. TCS 307), or Branch..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-2xl px-5 py-3.5 pl-11 text-xs border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-purple-500 shadow-sm transition"
          />
          <span className="absolute left-4 top-3.5 text-base">🔍</span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-3.5 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              Clear ✖
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex overflow-x-auto py-1 gap-2 no-scrollbar">
          {categories.map((c) => {
            const count =
              c.name === "All"
                ? papers.length
                : papers.filter((p) =>
                    p.category?.toLowerCase().includes(c.name.toLowerCase())
                  ).length;
            const isActive = selectedCategory === c.name;

            return (
              <button
                key={c.name}
                onClick={() => setSelectedCategory(c.name)}
                className={`flex-shrink-0 px-3.5 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                  isActive
                    ? "bg-purple-600 text-white shadow-md shadow-purple-600/20"
                    : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 shadow-sm dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:border-slate-700"
                }`}
              >
                <span>{c.icon}</span>
                <span>{c.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    isActive ? "bg-white/20 text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Semester Quick Filter */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200 dark:border-slate-800 text-xs">
          <span className="text-slate-500 font-semibold">Filter Semester:</span>
          {[
            { id: "", label: "All Semesters" },
            { id: "1st", label: "Sem 1" },
            { id: "2nd", label: "Sem 2" },
            { id: "3rd", label: "Sem 3" },
            { id: "4th", label: "Sem 4" },
            { id: "5th", label: "Sem 5" },
            { id: "6th", label: "Sem 6" },
            { id: "7th", label: "Sem 7" },
            { id: "8th", label: "Sem 8" },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedSem(f.id)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                selectedSem === f.id
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-3">Loading 41+ engineering question papers...</p>
        </div>
      )}

      {error && (
        <div className="bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 rounded-xl p-4 mb-6 text-purple-800 dark:text-purple-200 text-sm">
          {error}
        </div>
      )}

      {!loading && filteredPapers.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
          <p className="text-2xl mb-2">🔎</p>
          <p className="text-slate-700 dark:text-slate-300 font-bold">No question papers found</p>
          <p className="text-slate-500 text-xs mt-1">Try selecting 'All Disciplines' or clearing your search filter.</p>
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPapers.map((qp) => {
            const urls = getEmbedUrls(qp.drive_url);

            return (
              <div
                key={qp.id}
                className="bg-white dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/70 hover:border-purple-500/50 rounded-2xl p-5 shadow-sm dark:shadow-xl flex flex-col justify-between transition group hover:shadow-md"
              >
                <div>
                  {/* Header Tag */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800/50">
                      {qp.exam_type}
                    </span>
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 rounded-md border border-indigo-200 dark:border-indigo-800/40">
                      {qp.year}
                    </span>
                  </div>

                  {/* Subject Title */}
                  <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 group-hover:text-purple-600 dark:group-hover:text-purple-300 transition mb-1 leading-snug">
                    {qp.subject}
                  </h3>

                  {/* Course Code & Discipline */}
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {qp.subject_code}
                    </span>
                    <span className="text-slate-300 dark:text-slate-600">•</span>
                    <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                      {qp.semester || "3rd Semester"}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                    {qp.branch} • <span className="text-slate-600 dark:text-slate-300">{qp.university}</span>
                  </p>

                  {/* Solutions & Drive Tag */}
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    {qp.solutions_included && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-lg border border-emerald-200 dark:border-emerald-800/40">
                        <span>✓</span> Verified Solutions
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 text-[10px] text-blue-700 dark:text-blue-300 font-semibold bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-lg border border-blue-200 dark:border-blue-800/40">
                      <span>☁️</span> PDF Ready
                    </span>
                  </div>
                </div>

                {/* Dual Action Buttons: View Online + Direct Download */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 space-y-2">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                      📁 {qp.file_size || "2.5 MB"} • {qp.downloads || 450} views
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {/* View Online Modal Button */}
                    <button
                      onClick={() => setActiveViewerModal(qp)}
                      className="px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition shadow-sm shadow-purple-600/20 flex items-center justify-center gap-1.5"
                    >
                      <span>👁️</span>
                      <span>View Online</span>
                    </button>

                    {/* Direct Download Button */}
                    <button
                      onClick={() => handleDirectDownload(qp)}
                      className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition shadow-sm shadow-emerald-600/20 flex items-center justify-center gap-1.5"
                    >
                      <span>⬇️</span>
                      <span>Download PDF</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* IN-APP ONLINE PDF VIEWER MODAL */}
      {activeViewerModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
          <div className="relative bg-slate-900 text-white rounded-3xl overflow-hidden w-full max-w-5xl h-[92vh] flex flex-col border border-slate-700 shadow-2xl">
            {/* Viewer Header Bar */}
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-lg font-bold shadow-md">
                  📄
                </div>
                <div className="truncate">
                  <h3 className="font-bold text-sm sm:text-base text-white truncate">
                    {activeViewerModal.subject}
                  </h3>
                  <p className="text-xs text-purple-400 font-semibold truncate">
                    {activeViewerModal.subject_code} • {activeViewerModal.year} • {activeViewerModal.branch}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => handleDirectDownload(activeViewerModal)}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-md flex items-center gap-1"
                >
                  <span>⬇️</span>
                  <span className="hidden sm:inline">Download PDF</span>
                </button>

                {activeViewerModal.drive_url && (
                  <a
                    href={getEmbedUrls(activeViewerModal.drive_url).openUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition hidden md:flex items-center gap-1"
                  >
                    <span>🔗</span>
                    <span>Google Drive ↗</span>
                  </a>
                )}

                <button
                  onClick={() => setActiveViewerModal(null)}
                  className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-rose-600 text-white flex items-center justify-center font-bold text-sm transition border border-slate-700"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Viewer Body: Embedded Iframe PDF Renderer */}
            <div className="flex-1 bg-slate-950 relative overflow-hidden">
              <iframe
                src={getEmbedUrls(activeViewerModal.drive_url).previewUrl}
                title={activeViewerModal.subject}
                className="w-full h-full border-0"
                allow="autoplay"
              ></iframe>
            </div>

            {/* Viewer Footer Bar */}
            <div className="px-5 py-2.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Graphic Era Online Document Reader Active</span>
              </span>
              <span className="text-[11px] text-slate-500">
                Press Esc or ✕ to return to list
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default QuestionPaper;
