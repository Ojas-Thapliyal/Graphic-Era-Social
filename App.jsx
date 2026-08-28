import { useState, useEffect } from "react";
import Navbar from "./Components/Navbar";
import Hero from "./Components/Hero";
import Footer from "./Components/Footer";
import Signup from "./Pages/Signup.jsx";
import Login from "./Pages/Login.jsx";
import Feed from "./Pages/feed.jsx";
import Clubs from "./Pages/Clubs.jsx";
import Messages from "./Pages/Message.jsx";
import Profile from "./Pages/Profile.jsx";
import Settings from "./Pages/Setting.jsx";
import Reels from "./Pages/Reels.jsx";
import Notes from "./Pages/Notes.jsx";
import QuestionPaper from "./Pages/Question_paper.jsx";
import Questions from "./Pages/Questions";
import GeuAi from "./Pages/GeuAi.jsx";

function App() {
  const [activeTab, setActiveTab] = useState("feed");
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("geu_theme") || "dark";
  });

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    }
    localStorage.setItem("geu_theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const renderActivePage = () => {
    switch (activeTab) {
      case "feed":
        return <Feed />;
      case "reels":
        return <Reels />;
      case "clubs":
        return <Clubs />;
      case "messages":
        return <Messages />;
      case "notes":
        return <Notes />;
      case "pyqs":
        return <QuestionPaper />;
      case "questions":
        return <Questions />;
      case "ai":
        return <GeuAi />;
      case "profile":
        return <Profile />;
      case "settings":
        return <Settings theme={theme} toggleTheme={toggleTheme} />;
      case "signup":
        return <Signup onNavigateToLogin={() => setActiveTab("login")} />;
      case "login":
        return (
          <Login
            onNavigateToSignup={() => setActiveTab("signup")}
            onLoginSuccess={() => setActiveTab("feed")}
          />
        );
      default:
        return <Feed />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100/70 text-slate-800 dark:bg-slate-900 dark:text-slate-100 selection:bg-indigo-500 selection:text-white transition-colors duration-200">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
        toggleTheme={toggleTheme}
      />
      
      <main className="flex-1">
        <Hero setActiveTab={setActiveTab} />
        {renderActivePage()}
      </main>

      <Footer />
    </div>
  );
}

export default App;
