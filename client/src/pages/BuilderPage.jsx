import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { useNavigate, useParams } from "react-router-dom";
import { Loader2Icon, MessageSquareIcon, FolderTreeIcon, EyeIcon } from "lucide-react";
import toast from "react-hot-toast";

import BuilderHeader from "../components/BuilderHeader";
import ChatPanel from "../components/ChatPanel";
import FileExplorer from "../components/FileExplorer";
import PreviewPanel from "../components/PreviewPanel";
import AgentProgressDashboard from "../components/AgentProgressDashboard";
import PublishModal from "../components/PublishModal";
import api from "../api/api";
import { exportProjectZip } from "../utils/exportProject";

const BuilderPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [leftTab, setLeftTab] = useState("chat");
  const [publishing, setPublishing] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [publishUrl, setPublishUrl] = useState(null);

  const {
    activeProject,
    loadingActiveProject,
    activeFile,
    showCode,
    setActiveFile,
    setShowCode,
    loadProject,
    logout,
    sendChatMessage,
  } = useAppContext();

  // Load project on mount / ID change
  useEffect(() => {
    if (!id) return;
    loadProject(id);
  }, [id, loadProject]);

  useEffect(() => {
    if (!id || !activeProject) return;
    if (
      activeProject.status === "pending" ||
      activeProject.status === "generating"
    ) {
      const interval = setInterval(() => {
        loadProject(id, true);
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [id, loadProject, activeProject]);

  const handleOpenPreview = () => {
    if (!id) return;
    window.open(`/preview/${id}`, "_blank");
  };

  const handlePublish = async () => {
    if (!id) return;
    setPublishing(true);
    try {
      await api.post(`/api/projects/${id}/publish`);

      const url = `${window.location.origin}/publish/${id}`;

      setPublishUrl(url);
      toast.success("Website published successfully!");
    } catch (err) {
      console.error("Publish failed:", err);
      toast.error(err?.response?.data?.error || "Publish failed");
    } finally {
      setPublishing(false);
    }
  };

  const handleDownload = () => {
    if (!activeProject) return;
    exportProjectZip(activeProject);
  };

  // Handle chat messages sent from ChatPanel
  const handleChat = async (message) => {
    if (!message || chatLoading) return;
    try {
      setChatLoading(true);
      if (sendChatMessage) {
        await sendChatMessage(message);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setChatLoading(false);
    }
  };

  // Loading Screen Fallback
  if (loadingActiveProject || !activeProject) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-zinc-950 text-white gap-3">
        <Loader2Icon size={28} className="animate-spin text-red-500" />
        <p className="text-xs text-zinc-400">Loading project data...</p>
      </div>
    );
  }  return (
    <div className="h-screen flex flex-col bg-white dark:bg-zinc-950 overflow-hidden text-zinc-900 dark:text-zinc-100 relative transition-colors">
      {/* Top Bar Header */}
      <BuilderHeader
        projectName={activeProject.name || activeProject.prompt}
        version={activeProject.version || "1.0"}
        showCode={showCode}
        publishing={publishing}
        onToggleShowCode={() => setShowCode(!showCode)}
        onOpenPreview={handleOpenPreview}
        onPublish={handlePublish}
        onDownload={handleDownload}
        onBack={() => navigate("/")}
        onLogout={logout}
      />
      {/* Mobile Tab Switcher (Visible on mobile/tablet, hidden on desktop) */}
      <div className="lg:hidden flex border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/30">
        <button
          onClick={() => setLeftTab("chat")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-semibold border-b-2 cursor-pointer transition ${
            leftTab === "chat"
              ? "border-zinc-900 dark:border-zinc-100 text-zinc-900 dark:text-zinc-100"
              : "border-transparent text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
          }`}
        >
          <MessageSquareIcon size={14} />
          <span>Chat</span>
        </button>

        <button
          onClick={() => setLeftTab("files")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-semibold border-b-2 cursor-pointer transition ${
            leftTab === "files"
              ? "border-zinc-900 dark:border-zinc-100 text-zinc-900 dark:text-zinc-100"
              : "border-transparent text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
          }`}
        >
          <FolderTreeIcon size={14} />
          <span>Files</span>
        </button>

        <button
          onClick={() => setLeftTab("preview")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-semibold border-b-2 cursor-pointer transition ${
            leftTab === "preview"
              ? "border-zinc-900 dark:border-zinc-100 text-zinc-900 dark:text-zinc-100"
              : "border-transparent text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
          }`}
        >
          <EyeIcon size={14} />
          <span>Preview</span>
        </button>
      </div>

      {/* Main Layout Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <div className={`w-full lg:w-[320px] lg:shrink-0 flex flex-col border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 transition-colors ${
          leftTab === "preview" ? "hidden lg:flex" : "flex"
        }`}>
          {/* Sidebar Tabs (Desktop Only) */}
          <div className="hidden lg:flex border-b border-zinc-100 dark:border-zinc-800">
            <button
              onClick={() => setLeftTab("chat")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium cursor-pointer ${
                leftTab === "chat" || leftTab === "preview"
                  ? "text-zinc-900 dark:text-zinc-100 border-b-2 border-zinc-900 dark:border-zinc-100"
                  : "text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
              }`}
            >
              <MessageSquareIcon size={13} /> Chat
            </button>

            <button
              onClick={() => setLeftTab("files")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium cursor-pointer ${
                leftTab === "files"
                  ? "text-zinc-900 dark:text-zinc-100 border-b-2 border-zinc-900 dark:border-zinc-100"
                  : "text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
              }`}
            >
              <FolderTreeIcon size={13} /> Files
            </button>
          </div>

          <div className="flex-1 overflow-hidden">
            {leftTab === "files" ? (
              <FileExplorer
                files={activeProject.files}
                activeFile={activeFile}
                onFileSelect={(path) => {
                  setActiveFile(path);
                  setShowCode(true);
                  if (window.innerWidth < 1024) {
                    setLeftTab("preview");
                  }
                }}
              />
            ) : (
              <ChatPanel
                messages={activeProject.messages || []}
                onSend={handleChat}
                loading={chatLoading}
              />
            )}
          </div>
        </div>

        {/* Preview / Code Area */}
        <div className={`flex-1 overflow-hidden ${
          leftTab === "preview" ? "flex flex-col" : "hidden lg:flex"
        }`}>
          {activeProject.status === "pending" ||
          activeProject.status === "generating" ||
          activeProject.status === "failed" ? (
            <AgentProgressDashboard project={activeProject} />
          ) : (
            <PreviewPanel
              project={activeProject}
              activeFile={activeFile}
              showCode={showCode}
            />
          )}
        </div>
      </div>
      {publishUrl && (
        <PublishModal
          publishUrl={publishUrl}
          onClose={() => setPublishUrl(null)}
        />
      )}
    </div>
  );
};

export default BuilderPage;