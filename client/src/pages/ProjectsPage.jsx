import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import {
  Trash2Icon,
  ClockIcon,
  SearchIcon,
  PlusIcon,
  Loader2Icon,
  ArrowRightIcon,
  FileIcon
} from "lucide-react";

// Helper to format relative time (e.g. "3 hours ago")
const timeAgo = (dateStr) => {
  if (!dateStr) return "recently";
  const date = new Date(dateStr);
  const seconds = Math.floor((new Date() - date) / 1000);

  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} ${minutes === 1 ? "min" : "mins"} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} ${days === 1 ? "day" : "days"} ago`;
  return date.toLocaleDateString();
};

const ProjectsPage = () => {
  const navigate = useNavigate();
  const {
    projects,
    loadingProjects,
    loadProjects,
    handleDelete,
    theme,
  } = useAppContext();

  const [search, setSearch] = useState("");

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const filteredProjects = (projects || []).filter((project) => {
    const name = project.name || project.title || project.prompt || "";
    return name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className={`h-screen overflow-y-auto font-sans p-6 md:p-10 relative transition-colors duration-200 bg-transparent ${
      theme === "dark" ? "text-white" : "text-zinc-900"
    }`}>
      {/* Subtle Grid Background */}
      <div
        className="fixed inset-0 bg-[linear-gradient(to_right,var(--grid-color)_1px,transparent_1px),linear-gradient(to_bottom,var(--grid-color)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0"
        style={{
          "--grid-color": theme === "dark" ? "rgba(255, 255, 255, 0.04)" : "rgba(0, 0, 0, 0.04)"
        }}
      />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-6 mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Your Projects</h1>
            <p className={`text-sm mt-1 ${theme === "dark" ? "text-zinc-400" : "text-zinc-500"}`}>
              Manage, review, and delete all of your generated websites.
            </p>
          </div>
          <button
            onClick={() => navigate("/?focus=true")}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white rounded-lg text-sm font-semibold shadow-md transition cursor-pointer"
          >
            <PlusIcon size={16} />
            <span>New Project</span>
          </button>
        </div>

        {/* Search Input Bar */}
        <div className="mb-6 relative max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-400 dark:text-zinc-500">
            <SearchIcon size={18} />
          </span>
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm outline-none transition bg-white dark:bg-zinc-900 ${
              theme === "dark"
                ? "border-zinc-800 text-white focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700"
                : "border-zinc-200 text-zinc-800 focus:border-zinc-300 focus:ring-1 focus:ring-zinc-300"
            }`}
          />
        </div>

        {/* Projects List Grid */}
        {loadingProjects ? (
          <div className="flex justify-center py-20">
            <Loader2Icon className="animate-spin text-zinc-500" size={32} />
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className={`text-center py-20 border rounded-2xl ${
            theme === "dark"
              ? "bg-zinc-900/50 border-zinc-800 text-zinc-500"
              : "bg-white border-zinc-200 text-zinc-400"
          }`}>
            <p className="text-sm font-medium">
              {search ? "No projects matched your search." : "You haven't created any projects yet."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredProjects.map((project) => {
              const projName = project.name || project.title || project.prompt || "Untitled Project";
              return (
                <div
                  key={project._id}
                  onClick={() => navigate(`/builder/${project._id}`)}
                  className={`group relative p-5 border rounded-2xl flex flex-col justify-between cursor-pointer transition shadow-sm bg-white dark:bg-zinc-900 hover:shadow-md ${
                    theme === "dark"
                      ? "border-zinc-850 hover:border-zinc-700 bg-zinc-900/50"
                      : "border-zinc-200/80 hover:border-zinc-300"
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className={`font-semibold text-lg truncate group-hover:text-red-500 dark:group-hover:text-red-400 transition`}>
                        {projName}
                      </h3>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(project._id);
                        }}
                        className={`p-1.5 rounded-lg border text-zinc-400 hover:text-red-500 dark:border-zinc-800 dark:hover:bg-zinc-850 transition-colors bg-transparent opacity-0 group-hover:opacity-100`}
                        title="Delete project"
                      >
                        <Trash2Icon size={16} />
                      </button>
                    </div>

                    <p className={`text-xs mt-2 line-clamp-2 ${
                      theme === "dark" ? "text-zinc-450" : "text-zinc-500"
                    }`}>
                      {project.description || "No description provided."}
                    </p>

                    {/* Display uploaded file chip if attached */}
                    {project.uploadedFile && (
                      <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-100 dark:bg-zinc-800 text-[10px] font-medium text-zinc-650 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 max-w-full">
                        <FileIcon size={10} className="shrink-0" />
                        <span className="truncate max-w-[150px]">{project.uploadedFile.name}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-850 flex items-center justify-between text-xs">
                    <div className={`flex items-center gap-1.5 ${
                      theme === "dark" ? "text-zinc-500" : "text-zinc-400"
                    }`}>
                      <ClockIcon size={12} />
                      <span>{timeAgo(project.createdAt)}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded border uppercase text-[10px] font-semibold tracking-wider ${
                        theme === "dark"
                          ? "bg-zinc-800 border-zinc-700 text-zinc-300"
                          : "bg-zinc-100 border-zinc-200 text-zinc-600"
                      }`}>
                        {project.status || "completed"}
                      </span>
                      <ArrowRightIcon size={14} className="text-zinc-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;
