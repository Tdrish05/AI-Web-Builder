import React, { useEffect, useRef, useState } from "react";
import { ArrowRightIcon, CloudUploadIcon, Loader2Icon, MicIcon, XIcon, FileIcon } from "lucide-react";
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
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || loading) return;
    onSubmit(trimmed, selectedFile);
    setValue("");
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedFile({
        name: file.name,
        size: file.size,
        type: file.type,
        data: reader.result, // base64 string
      });
      setFilePreview(file.type.startsWith("image/") ? reader.result : null);
    };
    reader.readAsDataURL(file);
  };

  const removeFile = (e) => {
    e?.preventDefault();
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
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
        {/* Render Uploaded File Preview */}
        {selectedFile && (
          <div className="flex items-center gap-3 p-3 border-b border-zinc-200/50 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-zinc-900/10">
            {filePreview ? (
              <img
                src={filePreview}
                alt="Upload Preview"
                className="w-12 h-12 object-cover rounded-lg border border-zinc-200 dark:border-zinc-800"
              />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500">
                <FileIcon size={20} />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate text-zinc-800 dark:text-zinc-200">
                {selectedFile.name}
              </p>
              <p className="text-xs text-zinc-400 dark:text-zinc-500">
                {(selectedFile.size / 1024).toFixed(1)} KB
              </p>
            </div>
            <button
              type="button"
              onClick={removeFile}
              className="p-1.5 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-400 hover:text-red-500 transition cursor-pointer"
              title="Remove file"
            >
              <XIcon size={16} />
            </button>
          </div>
        )}

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
            htmlFor="file-upload"
            className={`border p-2 rounded-lg cursor-pointer flex items-center justify-center transition-colors ${
              theme === "dark"
                ? "border-white/20 text-white/80 hover:text-white hover:border-white/30"
                : "border-zinc-200 text-zinc-500 hover:text-zinc-800 hover:border-zinc-300"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              id="file-upload"
              onChange={handleFileChange}
              hidden
            />
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
    <div className="w-full flex flex-col gap-2">
      {selectedFile && (
        <div className="flex items-center gap-2 p-2 border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/10 rounded-xl max-w-sm">
          {filePreview ? (
            <img
              src={filePreview}
              alt="Preview"
              className="w-10 h-10 object-cover rounded border border-zinc-200 dark:border-zinc-800"
            />
          ) : (
            <div className="w-10 h-10 rounded bg-zinc-100 dark:bg-zinc-850 flex items-center justify-center text-zinc-400">
              <FileIcon size={16} />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium truncate text-zinc-700 dark:text-zinc-300">
              {selectedFile.name}
            </p>
            <p className="text-[10px] text-zinc-400">
              {(selectedFile.size / 1024).toFixed(1)} KB
            </p>
          </div>
          <button
            type="button"
            onClick={removeFile}
            className="text-zinc-450 hover:text-red-500 p-1 cursor-pointer rounded-full"
          >
            <XIcon size={14} />
          </button>
        </div>
      )}

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
    </div>
  );
};

export default PromptInput;