import { useState, useEffect } from "react";
import { fetchMessages, sendMessage } from "../services/api";

function Messages() {
  const [conversations, setConversations] = useState([]);
  const [activeConvId, setActiveConvId] = useState(1);
  const [textInput, setTextInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);

  const loadMessages = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchMessages();
      if (data && data.conversations) {
        setConversations(data.conversations);
        if (data.conversations.length > 0 && !activeConvId) {
          setActiveConvId(data.conversations[0].id);
        }
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
      try {
        const res = await fetch("http://localhost:8000/messages");
        const json = await res.json();
        setConversations(json.conversations || []);
      } catch (fallbackErr) {
        setError("Could not load messages from backend.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!textInput.trim() || !activeConvId) return;

    try {
      setSending(true);
      const res = await sendMessage(activeConvId, textInput);
      if (res && res.conversation) {
        setConversations((prev) =>
          prev.map((c) => (c.id === activeConvId ? res.conversation : c))
        );
        setTextInput("");
      }
    } catch (err) {
      alert("Error sending message: " + err.message);
    } finally {
      setSending(false);
    }
  };

  const currentChat = conversations.find((c) => c.id === activeConvId);

  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-sky-400 dark:via-indigo-300 dark:to-violet-400">
            Campus Messenger
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
            Connect and chat with classmates, club members & project partners
          </p>
        </div>
        <button
          onClick={loadMessages}
          className="px-4 py-2 text-xs font-semibold rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-sm dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 dark:border-slate-700 transition"
        >
          🔄 Refresh
        </button>
      </div>

      {loading && (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-3">Connecting to campus chats...</p>
        </div>
      )}

      {error && (
        <div className="bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/60 rounded-xl p-4 mb-6 text-sky-800 dark:text-sky-200 text-sm">
          {error}
        </div>
      )}

      {!loading && (
        <div className="bg-white dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/70 rounded-2xl overflow-hidden shadow-sm dark:shadow-2xl grid grid-cols-1 md:grid-cols-3 min-h-[550px] transition-colors">
          {/* Conversations List */}
          <div className="border-r border-slate-200 dark:border-slate-700/60 flex flex-col bg-slate-50/70 dark:bg-slate-900/50">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700/60">
              <input
                type="text"
                placeholder="Search students, groups..."
                className="w-full bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 rounded-xl px-3.5 py-2 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-200/70 dark:divide-slate-800/60">
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => setActiveConvId(conv.id)}
                  className={`p-4 cursor-pointer transition flex items-start gap-3 ${
                    activeConvId === conv.id
                      ? "bg-indigo-50/80 dark:bg-slate-800/90 border-l-4 border-sky-500"
                      : "hover:bg-slate-100/80 dark:hover:bg-slate-800/40"
                  }`}
                >
                  <img
                    src={conv.avatar}
                    alt={conv.user}
                    className="w-11 h-11 rounded-full object-cover ring-2 ring-sky-500/20"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-slate-900 dark:text-slate-200 text-sm truncate">{conv.user}</h4>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">{conv.time}</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 truncate mt-0.5">{conv.lastMessage}</p>
                    <p className="text-[10px] text-sky-700 dark:text-sky-400/80 mt-1 truncate font-medium">{conv.branch}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Thread */}
          <div className="md:col-span-2 flex flex-col bg-white/40 dark:bg-slate-900/30">
            {currentChat ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-slate-200 dark:border-slate-700/60 bg-white/80 dark:bg-slate-800/40 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={currentChat.avatar}
                      alt={currentChat.user}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-sky-500/40"
                    />
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">{currentChat.user}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{currentChat.branch} • {currentChat.university}</p>
                    </div>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                </div>

                {/* Messages List */}
                <div className="flex-1 p-5 overflow-y-auto space-y-3">
                  {currentChat.chat &&
                    currentChat.chat.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${
                          msg.isMe ? "items-end" : "items-start"
                        }`}
                      >
                        <div
                          className={`max-w-md rounded-2xl px-4 py-2.5 text-xs shadow-sm ${
                            msg.isMe
                              ? "bg-gradient-to-r from-sky-600 to-blue-600 text-white rounded-br-none"
                              : "bg-slate-100 text-slate-800 border border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 rounded-bl-none"
                          }`}
                        >
                          <p>{msg.text}</p>
                        </div>
                        <span className="text-[10px] text-slate-500 mt-1 px-1">{msg.time}</span>
                      </div>
                    ))}
                </div>

                {/* Send Box */}
                <form
                  onSubmit={handleSend}
                  className="p-4 border-t border-slate-200 dark:border-slate-700/60 bg-white/80 dark:bg-slate-800/40 flex gap-2"
                >
                  <input
                    type="text"
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="Type a message to your college peer..."
                    className="flex-1 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-xs rounded-xl px-4 py-2.5 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-sky-500"
                  />
                  <button
                    type="submit"
                    disabled={sending || !textInput.trim()}
                    className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs rounded-xl transition disabled:opacity-50 shadow-md shadow-sky-600/20"
                  >
                    {sending ? "Sending..." : "Send ✈️"}
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-500 dark:text-slate-400 text-sm">
                Select a conversation to start messaging
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

export default Messages;