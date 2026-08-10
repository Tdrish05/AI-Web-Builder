import React, { useEffect, useRef, useState } from "react";
import { UserIcon, BotMessageSquareIcon, BotIcon, SendIcon } from "lucide-react";

const ChatPanel = ({ messages = [], onSend, loading }) => {
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    onSend(input);
    setInput("");
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-950 transition-colors">
      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4 hide-scrollbar">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <p className="text-zinc-400 dark:text-zinc-500 text-sm text-center">
              Ask AI to modify your website
            </p>
          </div>
        )}

        {/* Render Chat Messages */}
        {messages.map((msg, i) => (
          <div key={i} className="flex gap-2.5 items-start">
            <div className="shrink-0 w-6 h-6 rounded-md flex items-center justify-center mt-0.5 bg-zinc-50 dark:bg-zinc-900 transition-colors">
              {msg.role === "user" ? (
                <UserIcon size={14} className="text-zinc-500 dark:text-zinc-400" />
              ) : (
                <BotMessageSquareIcon size={14} className="text-zinc-700 dark:text-zinc-300" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1 uppercase tracking-wider">
                {msg.role === "user" ? "You" : "AI"}
              </p>
              <p className="text-[13px] text-zinc-700 dark:text-zinc-300 leading-relaxed tracking-wider whitespace-pre-wrap wrap-break-word">
                {(msg.content || msg.text || "").split("- ").map((text, index) => (
                  <span key={index} className="block mt-3">
                    <span className={index === 0 ? "hidden" : ""}>- </span>
                    {text}
                  </span>
                ))}
              </p>
            </div>
          </div>
        ))}

        {/* AI Loading State (Dot Loader) */}
        {loading && (
          <div className="flex gap-2.5 items-start">
            <div className="shrink-0 w-6 h-6 rounded-md flex items-center justify-center mt-0.5 bg-zinc-50 dark:bg-zinc-900 transition-colors">
              <BotIcon size={13} className="text-zinc-900 dark:text-zinc-100" />
            </div>
            <div className="flex-1">
              <p className="text-[11px] font-medium text-zinc-400 mb-2 uppercase tracking-wider">
                AI
              </p>
              <div className="dot-loader">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 transition-colors">
        <div className="flex items-center gap-2 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 focus-within:border-zinc-400 dark:focus-within:border-zinc-600 transition bg-transparent">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AI to modify..."
            className="flex-1 text-xs outline-none bg-transparent text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-1 rounded-md bg-zinc-900 dark:bg-zinc-800 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-800 dark:hover:bg-zinc-700 transition cursor-pointer"
          >
            <SendIcon size={12} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatPanel;