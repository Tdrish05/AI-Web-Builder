import React, { useEffect, useRef, useState } from "react";
import { ArrowRightIcon, CloudUploadIcon, Loader2Icon, MicIcon } from "lucide-react";
import { useAppContext } from "../context/AppContext";

const PromptInput = ({
  onSubmit,
  loading = false,
  placeholder = "Describe the website you want to build ...",
  large = false,
  autoFocus = false,
  variant = "default",
}) => {
  const [value, setValue] = useState("");
  const textareaRef = useRef(null);

  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || loading) return;
    onSubmit(trimmed);
    setValue("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const { theme } = useAppContext();

  if (variant === "glass") {
    return (
      <form
        onSubmit={handleSubmit}
        className={`max-w-2xl w-full backdrop-blur-xl rounded-xl ring-1 overflow-hidden mt-6 transition duration-200 z-10 relative ${
          theme === "dark"
            ? "bg-zinc-950/25 ring-white/20 focus-within:ring-white/40 shadow-2xl shadow-black/45"
            : "bg-white/75 ring-zinc-200 focus-within:ring-zinc-400 shadow-lg shadow-zinc-300/40"
        }`}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={loading}
          rows={3}
          className={`w-full p-4 pb-2 resize-none outline-none bg-transparent text-base transition-colors ${
            theme === "dark"
              ? "text-white placeholder:text-white/60"
              : "text-zinc-800 placeholder:text-zinc-400"
          }`}
        />

        <div className="flex items-center justify-between pb-3 px-3 gap-2">
          <label
            htmlFor="file"
            className={`border p-2 rounded-lg cursor-pointer flex items-center justify-center transition-colors ${
              theme === "dark"
                ? "border-white/20 text-white/80 hover:text-white hover:border-white/30"
                : "border-zinc-200 text-zinc-500 hover:text-zinc-800 hover:border-zinc-300"
            }`}
          >
            <input type="file" id="file" hidden />
            <CloudUploadIcon size={18} />
          </label>

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              className={`flex items-center justify-center p-2 cursor-pointer transition-colors ${
                theme === "dark"
                  ? "text-white/70 hover:text-white"
                  : "text-zinc-500 hover:text-zinc-800"
              }`}
            >
              <MicIcon size={18} />
            </button>

            <button
              type="submit"
              disabled={!value.trim() || loading}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-red-600 text-white hover:bg-red-700 disabled:opacity-40 cursor-pointer transition-all shrink-0"
            >
              {loading ? (
                <Loader2Icon size={16} className="animate-spin" />
              ) : (
                <ArrowRightIcon size={16} />
              )}
            </button>
          </div>
        </div>
      </form>
    );
  }

  return (
    <div
      className={`bg-white border border-zinc-200 rounded-xl flex items-end gap-2 focus-within:ring-1 focus-within:ring-zinc-300 transition ${
        large ? "p-4" : "p-3"
      }`}
    >
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={loading}
        rows={large ? 5 : 1}
        className={`flex-1 bg-transparent border-none outline-none resize-none text-zinc-900 placeholder:text-zinc-400 ${
          large ? "text-base" : "text-sm"
        }`}
      />

      <button
        onClick={() => handleSubmit()}
        disabled={!value.trim() || loading}
        className="inline-flex items-center justify-center bg-zinc-950 text-white hover:bg-zinc-800 disabled:opacity-40 cursor-pointer rounded-full shrink-0"
        style={{
          width: large ? 36 : 24,
          height: large ? 36 : 24,
        }}
      >
        {loading ? (
          <Loader2Icon
            size={large ? 20 : 15}
            className="animate-spin"
          />
        ) : (
          <ArrowRightIcon size={large ? 20 : 15} />
        )}
      </button>
    </div>
  );
};

export default PromptInput;