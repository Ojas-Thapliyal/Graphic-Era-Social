import { useState, useRef, useEffect } from "react";
import { sendAiChatMessage } from "../services/api";

const INITIAL_MESSAGES = [
  {
    role: "assistant",
    content:
      "Hello! I'm GEU AI, your personal student assistant for Graphic Era Deemed to be University and Graphic Era Hill University. How can I help you today with academics, exam prep, clubs, or campus life?",
    timestamp: "Just now",
  },
];

const SUGGESTIONS = [
  "What core subjects are in B.Tech CSE 4th Sem at GEU?",
  "How can I prepare for Grafest 2026 hackathon?",
  "Explain Operating Systems semaphores in simple terms.",
  "Which tech clubs are active on Graphic Era campus?",
];

function GeuAi() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    setError(null);
    const userTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = { role: "user", content: query.trim(), timestamp: userTimestamp };
    
    // Prepare updated message list for UI and history
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    if (!textToSend) setInput("");
    setLoading(true);

    try {
      // Build conversation_history array expected by FastAPI endpoint
      const conversationHistory = updatedMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await sendAiChatMessage(query.trim(), conversationHistory);

      if (res && res.response) {
        const aiTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: res.response, timestamp: aiTimestamp },
        ]);
      } else {
        throw new Error("No response content returned from GEU AI backend.");
      }
    } catch (err) {
      console.error("GEU AI Error:", err);
      setError(err.message || "Unable to reach GEU AI backend server.");
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        role: "assistant",
        content:
          "Conversation cleared! I'm GEU AI. What academic, PYQ, or campus question can I help you with now?",
        timestamp: "Just now",
      },
    ]);
    setError(null);
  };

  return (
    <section className="max-w-4xl mx-auto px-4 py-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-indigo-600 flex items-center justify-center font-black text-white text-2xl shadow-lg shadow-teal-500/20">
            🤖
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-emerald-400 dark:via-teal-300 dark:to-cyan-400">
                GEU AI Assistant
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/50">
                v1.0 Live
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Academic tutor, campus guide & career mentor for Graphic Era University
            </p>
          </div>
        </div>

        <button
          onClick={handleClearChat}
          className="self-start sm:self-auto px-3.5 py-2 text-xs font-semibold rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-sm dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 dark:border-slate-700 transition flex items-center gap-1.5"
        >
          <span>🗑️</span>
          <span>Clear Chat</span>
        </button>
      </div>

      {/* Error Alert Header if API Key is missing or backend fails */}
      {error && (
        <div className="bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800/80 rounded-2xl p-4 mb-6 text-rose-800 dark:text-rose-200 text-xs shadow-sm">
          <div className="flex items-start gap-2.5">
            <span className="text-base">⚠️</span>
            <div>
              <p className="font-bold text-sm">GEU AI Service Alert</p>
              <p className="mt-1 text-xs text-rose-700 dark:text-rose-300/90 leading-relaxed">{error}</p>
              {error.includes("API Key") && (
                <div className="mt-2.5 p-2.5 bg-rose-100/70 dark:bg-rose-900/50 rounded-xl font-mono text-[11px] text-rose-900 dark:text-rose-100 border border-rose-300 dark:border-rose-700/60">
                  Tip: Add OPENAI_API_KEY=your_key or GEMINI_API_KEY=your_key to backend/.env and restart FastAPI.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Chat Container Card */}
      <div className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/70 rounded-3xl overflow-hidden shadow-sm dark:shadow-2xl flex flex-col h-[550px] transition-colors">
        {/* Messages Scroll Area */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/50 dark:bg-slate-900/40">
          {messages.map((msg, idx) => {
            const isUser = msg.role === "user";
            return (
              <div
                key={idx}
                className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-sm mt-0.5">
                    🤖
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-sm ${
                    isUser
                      ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-br-none"
                      : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/70 rounded-bl-none"
                  }`}
                >
                  <div className="flex items-center justify-between gap-4 mb-1">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider ${
                        isUser ? "text-indigo-200" : "text-emerald-600 dark:text-emerald-400"
                      }`}
                    >
                      {isUser ? "You (GEU Student)" : "GEU AI Assistant"}
                    </span>
                    {msg.timestamp && (
                      <span
                        className={`text-[10px] ${
                          isUser ? "text-indigo-200/80" : "text-slate-400"
                        }`}
                      >
                        {msg.timestamp}
                      </span>
                    )}
                  </div>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm mt-0.5">
                    👤
                  </div>
                )}
              </div>
            );
          })}

          {/* Animated Loading Indicator */}
          {loading && (
            <div className="flex gap-3 items-center">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-sm">
                🤖
              </div>
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/70 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex items-center gap-2">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">GEU AI is thinking</span>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Chips */}
        {messages.length < 5 && !loading && (
          <div className="px-4 py-2 bg-slate-100/70 dark:bg-slate-900/80 border-t border-slate-200/80 dark:border-slate-800 overflow-x-auto flex gap-2 no-scrollbar">
            <span className="text-[11px] font-bold text-slate-400 self-center flex-shrink-0">
              💡 Suggested:
            </span>
            {SUGGESTIONS.map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(s)}
                className="flex-shrink-0 text-[11px] font-medium bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-300 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1 transition shadow-sm"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Text Input Footer Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 sm:p-4 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700/70 flex gap-2 items-center"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask GEU AI about subjects, PYQs, labs, fests, or career advice..."
            className="flex-1 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-xs sm:text-sm rounded-xl px-4 py-3 border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs sm:text-sm transition disabled:opacity-50 shadow-md shadow-emerald-600/20 flex items-center gap-1.5"
          >
            <span>{loading ? "Thinking..." : "Send"}</span>
            <span>🚀</span>
          </button>
        </form>
      </div>
    </section>
  );
}

export default GeuAi;
