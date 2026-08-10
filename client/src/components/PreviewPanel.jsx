import React, { useMemo, useState, useEffect, useRef } from "react";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  useSandpack,
} from "@codesandbox/sandpack-react";
import { detectDependencies } from "../utils/sandpackUtils";
import { useAppContext } from "../context/AppContext";

// Monitors Sandpack network errors
const SandpackErrorMonitor = ({ onErrorChange }) => {
  const { sandpack } = useSandpack();
  const { error } = sandpack;

  useEffect(() => {
    if (error) {
      const msg = error.message || "";

      const isNetworkError =
        msg.includes("Failed to fetch") ||
        msg.includes("col.csbops.io") ||
        msg.includes("ERR_CONNECTION_TIMED_OUT") ||
        msg.includes("net::ERR");

      if (isNetworkError) {
        onErrorChange(false);
        return;
      }
    }
    onErrorChange(true);
  }, [error, onErrorChange]);

  return null;
};

// Watches for file edits inside Sandpack editor and saves changes
function SandpackFileWatcher({ onLiveFilesChange }) {
  const { sandpack } = useSandpack();
  const { files } = sandpack;
  const { activeProject, updateProjectFiles } = useAppContext();

  const activeProjectRef = useRef(activeProject);

  useEffect(() => {
    activeProjectRef.current = activeProject;
  }, [activeProject]);

  useEffect(() => {
    const project = activeProjectRef.current;
    if (!project) return;

    const updatedFiles = {};
    let hasChanges = false;

    for (const [path, fileObj] of Object.entries(files)) {
      const fileCode = fileObj.code;
      updatedFiles[path] = fileCode;

      const originalContent =
        typeof project.files[path] === "string"
          ? project.files[path]
          : project.files[path]?.content;

      if (originalContent !== undefined && fileCode !== originalContent) {
        hasChanges = true;
      }
    }

    if (hasChanges) {
      onLiveFilesChange(updatedFiles);
      updateProjectFiles(updatedFiles);
    }
  }, [files, onLiveFilesChange, updateProjectFiles]);

  return null;
}

const PreviewPanel = ({ project, activeFile, showCode }) => {
  const { theme } = useAppContext();
  const [showErrorOverlay, setShowErrorOverlay] = useState(true);
  const [liveFiles, setLiveFiles] = useState(project?.files || {});

  const [prevProjectKey, setPrevProjectKey] = useState(
    `${project?._id}-${project?.version}`
  );

  const currentKey = `${project?._id}-${project?.version}`;
  if (prevProjectKey !== currentKey) {
    setPrevProjectKey(currentKey);
    setLiveFiles(project?.files || {});
  }

  const handleLiveFilesChange = (newFiles) => {
    setLiveFiles((prev) => {
      let changed = false;

      for (const [p, code] of Object.entries(newFiles)) {
        if (prev[p] !== code) {
          changed = true;
          break;
        }
      }

      return changed ? newFiles : prev;
    });
  };

  const sandpackFiles = useMemo(() => {
    const spFiles = {};

    for (const [path, content] of Object.entries(liveFiles)) {
      const fileCode =
        typeof content === "string" ? content : content?.content || "";

      spFiles[path] = {
        code: fileCode,
        active: path === activeFile,
      };
    }

    return spFiles;
  }, [liveFiles, activeFile]);

  const dependencies = useMemo(() => {
    return detectDependencies(liveFiles);
  }, [liveFiles]);

  return (
    <div className="h-full w-full">
      <SandpackProvider
        key={project?._id}
        template="react"
        files={sandpackFiles}
        customSetup={{ dependencies }}
        options={{
          externalResources: [
            "https://cdn.tailwindcss.com",
            "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css",
          ],
          classes: {
            "sp-wrapper": "sp-wrapper",
            "sp-layout": "sp-layout",
            "sp-preview": "sp-preview",
          },
          logLevel: 0,
        }}
        theme={{
          colors: {
            surface1: theme === "dark" ? "#09090b" : "#ffffff",
            surface2: theme === "dark" ? "#18181b" : "#f4f4f5",
            surface3: theme === "dark" ? "#27272a" : "#e4e4e7",
            clickable: theme === "dark" ? "#a1a1aa" : "#71717a",
            base: theme === "dark" ? "#f4f4f5" : "#09090b",
            disabled: theme === "dark" ? "#52525b" : "#a1a1aa",
            hover: theme === "dark" ? "#fafafa" : "#18181b",
            accent: theme === "dark" ? "#ef4444" : "#18181b",
            error: "#ef4444",
            errorSurface: theme === "dark" ? "#450a0a" : "#fef2f2",
          },
          font: {
            body: "'Urbanist', system-ui, -apple-system, sans-serif",
            mono: "'Geist Mono', ui-monospace, monospace",
            size: "13px",
            lineHeight: "1.6",
          },
        }}
      >
        <SandpackFileWatcher onLiveFilesChange={handleLiveFilesChange} />
        <SandpackErrorMonitor onErrorChange={setShowErrorOverlay} />

        <SandpackLayout
          style={{
            height: "100%",
            border: "none",
            borderRadius: 0,
            background: "transparent",
          }}
        >
          {showCode && (
            <SandpackCodeEditor
              showTabs
              showLineNumbers
              showInlineErrors
              wrapContent
              style={{
                height: "100%",
                flex: 1,
                minWidth: 0,
              }}
            />
          )}
          <SandpackPreview
            showNavigator={false}
            showRefreshButton
            showOpenInCodeSandbox={false}
            showSandpackErrorOverlay={showErrorOverlay}
            style={{
              height: "100%",
              flex: showCode ? 1 : 2,
              minWidth: 0,
            }}
          />
        </SandpackLayout>
      </SandpackProvider>
    </div>
  );
};

export default PreviewPanel;