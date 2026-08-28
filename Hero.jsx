function Hero({ setActiveTab }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50/80 via-white to-slate-100/50 dark:from-indigo-950/40 dark:via-slate-900 dark:to-slate-900 py-12 px-4 border-b border-slate-200 dark:border-slate-800/80 transition-colors duration-200">
      <div className="max-w-5xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200 dark:bg-indigo-950/90 dark:text-indigo-300 dark:border-indigo-700/50 text-xs font-semibold shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          FastAPI & Supabase Connected • Graphic Era University
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-white dark:via-slate-100 dark:to-indigo-200 tracking-tight">
          Graphic Era Campus Social & Academic Hub
        </h1>

        <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          The all-in-one community platform for students of Graphic Era Deemed to be University and Graphic Era Hill University (Dehradun, Bhimtal, Haldwani).
        </p>

        {/* Quick Shortcut Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => setActiveTab && setActiveTab("feed")}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition shadow-md shadow-indigo-600/20"
          >
            📰 Campus Feed
          </button>
          <button
            onClick={() => setActiveTab && setActiveTab("clubs")}
            className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-sm dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 dark:border-slate-700 font-semibold text-xs transition"
          >
            🏛️ Clubs & Societies
          </button>
          <button
            onClick={() => setActiveTab && setActiveTab("notes")}
            className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-sm dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 dark:border-slate-700 font-semibold text-xs transition"
          >
            📚 Study Notes
          </button>
          <button
            onClick={() => setActiveTab && setActiveTab("pyqs")}
            className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-sm dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 dark:border-slate-700 font-semibold text-xs transition"
          >
            📑 Exam PYQs
          </button>
          <button
            onClick={() => setActiveTab && setActiveTab("questions")}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md shadow-orange-500/20 font-semibold text-xs transition"
          >
            ❓ Campus Q&A
          </button>
        </div>
      </div>
    </section>
  );
}

export default Hero;