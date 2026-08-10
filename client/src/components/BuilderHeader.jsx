import React from "react";
import {
  ArrowLeftIcon,
  Code2Icon,
  DownloadIcon,
  ExternalLinkIcon,
  EyeIcon,
  GlobeIcon,
  Loader2Icon,
  LogOutIcon,
  SunIcon,
  MoonIcon,
} from "lucide-react";
import { useAppContext } from "../context/AppContext";

const BuilderHeader = ({
  projectName,
  version = "1.0",
  showCode,
  publishing,
  onToggleShowCode,
  onOpenPreview,
  onPublish,
  onDownload,
  onBack,
  onLogout,
}) => {
  const { theme, toggleTheme } = useAppContext();

  return (
    <header className="h-12 shrink-0 flex items-center justify-between px-3 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors">
      <div className="flex items-center gap-2">
        <button
          onClick={onBack}
          className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-900 cursor-pointer transition"
        >
          <ArrowLeftIcon size={16} />
        </button>

        <img src="/logo.svg" alt="logo" className="size-5" />

        <span className="text-sm font-semibold truncate max-w-38 md:max-w-50 text-zinc-800 dark:text-zinc-200">
          {projectName || "Untitled Project"}
        </span>

        <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 font-medium">
          v{version}
        </span>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={onToggleShowCode}
          className={`inline-flex items-center justify-center gap-1.5 py-1.5 px-2.5 sm:px-3 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100 text-xs font-medium rounded-lg cursor-pointer bg-white dark:bg-zinc-900 transition ${
            showCode ? "bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100" : ""
          }`}
          title={showCode ? "Show Preview" : "Show Code Editor"}
        >
          {showCode ? (
            <>
              <EyeIcon size={13} /> <span className="hidden sm:inline">Preview</span>
            </>
          ) : (
            <>
              <Code2Icon size={13} /> <span className="hidden sm:inline">Code</span>
            </>
          )}
        </button>

        <button
          onClick={onOpenPreview}
          className="inline-flex items-center justify-center gap-1.5 py-1.5 px-2.5 sm:px-3 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100 text-xs font-medium rounded-lg cursor-pointer bg-white dark:bg-zinc-900 transition"
          title="Open Live Preview"
        >
          <ExternalLinkIcon size={13} /> <span className="hidden sm:inline">Open Preview</span>
        </button>

        <button
          onClick={onPublish}
          disabled={publishing}
          className="inline-flex items-center justify-center gap-1.5 py-1.5 px-2.5 sm:px-3 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100 text-xs font-medium rounded-lg cursor-pointer bg-white dark:bg-zinc-900 disabled:opacity-50 transition"
          title="Publish Website"
        >
          {publishing ? (
            <Loader2Icon size={13} className="animate-spin" />
          ) : (
            <GlobeIcon size={13} />
          )}
          <span className="hidden sm:inline">Publish</span>
        </button>

        <button
          onClick={onDownload}
          className="inline-flex items-center justify-center gap-1.5 py-1.5 px-2.5 sm:px-3 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100 text-xs font-medium rounded-lg cursor-pointer bg-white dark:bg-zinc-900 transition"
          title="Export ZIP"
        >
          <DownloadIcon size={13} /> <span className="hidden sm:inline">Export</span>
        </button>

        <button
          onClick={toggleTheme}
          className="inline-flex items-center justify-center p-1.5 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-lg cursor-pointer bg-white dark:bg-zinc-900 transition"
          title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
        >
          {theme === "light" ? <MoonIcon size={13} /> : <SunIcon size={13} />}
        </button>

        <button
          onClick={onLogout}
          className="inline-flex items-center justify-center gap-1.5 py-1.5 px-2.5 sm:px-3 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100 text-xs font-medium rounded-lg cursor-pointer bg-white dark:bg-zinc-900 transition"
          title="Sign out"
        >
          <LogOutIcon size={13} /> <span className="hidden sm:inline">Signout</span>
        </button>
      </div>
    </header>
  );
};

export default BuilderHeader;