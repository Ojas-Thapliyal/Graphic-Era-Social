function Navbar({ activeTab, setActiveTab, theme, toggleTheme }) {
  const navItems = [
    { id: "feed", label: "Feed", icon: "📰" },
    { id: "reels", label: "Reels", icon: "🎬" },
    { id: "clubs", label: "Clubs", icon: "🏛️" },
    { id: "messages", label: "Messages", icon: "💬" },
    { id: "notes", label: "Notes", icon: "📚" },
    { id: "pyqs", label: "PYQs", icon: "📑" },
    { id: "questions", label: "Q&A", icon: "❓" },
    { id: "ai", label: "GEU AI", icon: "🤖" },
    { id: "profile", label: "Profile", icon: "👤" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <div
            onClick={() => setActiveTab && setActiveTab("feed")}
            className="flex items-center gap-3 cursor-pointer select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-500 to-sky-400 flex items-center justify-center font-black text-white text-lg shadow-md shadow-indigo-900/20">
              GE
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white block">
                Graphic Era <span className="text-indigo-600 dark:text-indigo-400 font-medium">Social</span>
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium -mt-1 block">
                Deemed & Hill University
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab && setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800"
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Actions: Theme Switcher & Auth */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 dark:text-slate-300 dark:hover:text-white dark:bg-slate-800 dark:hover:bg-slate-700 transition flex items-center justify-center border border-slate-200 dark:border-slate-700"
            >
              {theme === "dark" ? (
                <span className="text-sm">☀️</span>
              ) : (
                <span className="text-sm">🌙</span>
              )}
            </button>

            <button
              onClick={() => setActiveTab && setActiveTab("login")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                activeTab === "login"
                  ? "bg-slate-800 text-white dark:bg-slate-700"
                  : "text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800 dark:border-slate-700"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setActiveTab && setActiveTab("signup")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                activeTab === "signup"
                  ? "bg-indigo-700 text-white"
                  : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm"
              }`}
            >
              Sign Up
            </button>
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="md:hidden flex overflow-x-auto py-2 gap-1 border-t border-slate-200 dark:border-slate-800/80 no-scrollbar">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab && setActiveTab(item.id)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                activeTab === item.id
                  ? "bg-indigo-600 text-white"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}

export default Navbar;