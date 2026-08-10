import React, { useState, useMemo } from "react";
import {
  FolderIcon,
  FolderOpenIcon,
  FileCode2Icon,
  FileJsonIcon,
  FileTextIcon,
  FileIcon,
  ChevronRightIcon,
  ChevronDownIcon,
} from "lucide-react";

function buildTree(paths = []) {
  const root = [];

  for (const filePath of paths.sort()) {
    const parts = filePath.split("/").filter(Boolean);
    let current = root;

    for (let i = 0; i < parts.length; i++) {
      const name = parts[i];
      const isLast = i === parts.length - 1;
      const fullPath = "/" + parts.slice(0, i + 1).join("/");

      let existing = current.find((n) => n.name === name);

      if (!existing) {
        existing = {
          name,
          path: fullPath,
          isDir: !isLast,
          children: [],
        };

        current.push(existing);
      }

      current = existing.children;
    }
  }

  return root;
}

function getFileIcon(name) {
  if (
    name.endsWith(".jsx") ||
    name.endsWith(".js") ||
    name.endsWith(".tsx") ||
    name.endsWith(".ts")
  ) {
    return <FileCode2Icon size={14} className="text-yellow-500 shrink-0" />;
  }

  if (name.endsWith(".css") || name.endsWith(".scss")) {
    return <FileTextIcon size={14} className="text-sky-400 shrink-0" />;
  }

  if (name.endsWith(".json")) {
    return <FileJsonIcon size={14} className="text-emerald-500 shrink-0" />;
  }

  if (name.endsWith(".html")) {
    return <FileCode2Icon size={14} className="text-orange-500 shrink-0" />;
  }

  return <FileIcon size={14} className="text-zinc-400 shrink-0" />;
}

function TreeItem({ node, activeFile, onFileSelect, depth = 0 }) {
  const [isOpen, setIsOpen] = useState(true);
  const isActive = node.path === activeFile;

  if (node.isDir) {
    return (
      <div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center gap-1.5 py-1 px-2 text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 select-none cursor-pointer font-medium transition-colors bg-transparent border-none outline-none"
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
        >
          {isOpen ? (
            <ChevronDownIcon size={13} className="text-zinc-400 shrink-0" />
          ) : (
            <ChevronRightIcon size={13} className="text-zinc-400 shrink-0" />
          )}

          {isOpen ? (
            <FolderOpenIcon size={14} className="text-amber-500 shrink-0" />
          ) : (
            <FolderIcon size={14} className="text-amber-500 shrink-0" />
          )}
          <span>{node.name}</span>
        </button>

        {isOpen &&
          node.children.map((child) => (
            <TreeItem
              key={child.path}
              node={child}
              activeFile={activeFile}
              onFileSelect={onFileSelect}
              depth={depth + 1}
            />
          ))}
      </div>
    );
  }

  return (
    <button
      onClick={() => onFileSelect(node.path)}
      className={`w-full flex items-center gap-2 py-1.5 px-2 text-xs transition-colors rounded-md cursor-pointer ${
        isActive
          ? "bg-zinc-100 dark:bg-zinc-900 text-zinc-950 dark:text-zinc-50 font-semibold"
          : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100"
      }`}
      style={{ paddingLeft: `${depth * 12 + 20}px` }}
    >
      {getFileIcon(node.name)}
      <span className="truncate">{node.name}</span>
    </button>
  );
}

const FileExplorer = ({ files = {}, activeFile, onFileSelect }) => {
  const fileKeys = useMemo(() => (files ? Object.keys(files) : []), [files]);
  const tree = useMemo(() => buildTree(fileKeys), [fileKeys]);

  return (
    <div className="py-2 overflow-y-auto hide-scrollbar">
      <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
        Files
      </p>

      {tree.map((node) => (
        <TreeItem
          key={node.path}
          node={node}
          activeFile={activeFile}
          onFileSelect={onFileSelect}
        />
      ))}
    </div>
  );
};

export default FileExplorer;