import React, { useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import PromptInput from "../components/PromptInput";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Trash2Icon, ClockIcon, Loader2Icon, SunIcon, MoonIcon } from "lucide-react";

const homeTags = [
  "Landing Page",
  "Resume Website",
  "Personal Website",
  "Business Website",
  "Marketing Website",
  "Educational Website",
];

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

const HomePage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    projects,
    loadingProjects,
    generatingProject,
    loadProjects,
    handleGenerate,
    handleDelete,
    theme,
    toggleTheme,
  } = useAppContext();

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const shouldFocus = searchParams.get("focus") === "true";

  useEffect(() => {
    if (shouldFocus) {
      // Clear query parameter to enable subsequent clicks to trigger the effect
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("focus");
      setSearchParams(newParams, { replace: true });
    }
  }, [shouldFocus, searchParams, setSearchParams]);

  return (
    <div className={`h-screen overflow-y-scroll font-sans relative transition-colors duration-200 ${
      theme === "dark" ? "text-white" : "text-zinc-900"
    }`}>
      {/* Subtle Grid Pattern for premium aesthetics */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,var(--grid-color)_1px,transparent_1px),linear-gradient(to_bottom,var(--grid-color)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0"
        style={{
          "--grid-color": theme === "dark" ? "rgba(255, 255, 255, 0.04)" : "rgba(0, 0, 0, 0.04)"
        }}
      />
      
      {/* Header theme toggle */}
      <div className="flex items-center justify-end px-6 py-4 z-10 relative">
        <button
          onClick={toggleTheme}
          className={`p-2 border rounded-lg cursor-pointer bg-transparent transition ${
            theme === "dark"
              ? "border-white/20 text-white hover:bg-white/10"
              : "border-zinc-300 text-zinc-700 hover:bg-zinc-100"
          }`}
          title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
        >
          {theme === "light" ? <MoonIcon size={16} /> : <SunIcon size={16} />}
        </button>
      </div>

      {/* Hero Container */}
      <div className="flex flex-col items-center justify-start px-6 pb-20 mt-4 xl:mt-8 relative z-10">
        <div className="w-full max-w-2xl flex flex-col items-center">

          {/* Title */}
          <h1 className="text-center text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium mt-4 max-w-2xl leading-tight font-sans">
            Let's build your app together
          </h1>

          <p className={`text-center text-sm md:text-base max-w-xl mt-4 leading-relaxed ${
            theme === "dark" ? "text-white/65" : "text-zinc-600"
          }`}>
            Describe your idea and watch AI design, structure and launch your website
            instantly. No coding required.
          </p>

          {/* Prompt input with auto-focus option */}
          <div className="w-full mt-6">
            <PromptInput
              onSubmit={handleGenerate}
              loading={generatingProject}
              placeholder="Create a portfolio website..."
              variant="glass"
              autoFocus={shouldFocus}
            />
          </div>

          {/* Infinite Moving Marquee Tags */}
          <div className="masked-marquee w-full mt-4 max-w-2xl overflow-hidden py-1 select-none">
            <div className="flex animate-marquee gap-3 flex-nowrap">
              {[...homeTags, ...homeTags, ...homeTags].map((tag, i) => (
                <button
                  key={i}
                  onClick={() => handleGenerate(tag)}
                  disabled={generatingProject}
                  className={`px-4 py-1.5 border rounded-full text-sm transition cursor-pointer shrink-0 font-medium ${
                    theme === "dark"
                      ? "text-white bg-white/10 border-white/25 hover:bg-white/20"
                      : "text-zinc-700 bg-zinc-100 border-zinc-200 hover:bg-zinc-200"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* All Projects Section */}
          <div className="w-full mt-12">
            <div className={`flex items-center justify-between border-b pb-2 mb-4 ${
              theme === "dark" ? "border-white/15" : "border-zinc-200"
            }`}>
              <span className={`text-xs font-semibold tracking-wider uppercase ${
                theme === "dark" ? "text-white/80" : "text-zinc-500"
              }`}>
                ALL PROJECTS
              </span>
              <span className={`text-xs font-medium ${
                theme === "dark" ? "text-white/60" : "text-zinc-400"
              }`}>
                {projects?.length || 0} {projects?.length === 1 ? "project" : "projects"}
              </span>
            </div>

            {loadingProjects ? (
              <div className="flex justify-center py-8">
                <Loader2Icon className="animate-spin text-zinc-500" size={20} />
              </div>
            ) : !projects || projects.length === 0 ? (
              <div className={`text-center py-8 text-sm rounded-xl border backdrop-blur-md ${
                theme === "dark"
                  ? "text-white/40 bg-white/5 border-white/10"
                  : "text-zinc-400 bg-white/25 border-white/35"
              }`}>
                No projects created yet.
              </div>
            ) : projects.length <= 2 ? (
              <div className="flex flex-col gap-3">
                {projects.map((project) => (
                  <div
                    key={project._id}
                    onClick={() => navigate(`/builder/${project._id}`)}
                    className={`group flex items-center justify-between p-4 backdrop-blur-md border rounded-xl cursor-pointer transition ${
                      theme === "dark"
                        ? "bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20"
                        : "bg-white/25 hover:bg-white/40 border-white/35 hover:border-white/60 shadow-sm shadow-zinc-300/10"
                    }`}
                  >
                    <div className="flex flex-col text-left">
                      <h3 className={`font-semibold text-base transition ${
                        theme === "dark"
                          ? "text-white group-hover:text-red-200"
                          : "text-zinc-800 group-hover:text-red-600"
                      }`}>
                        {project.name || project.title || project.prompt || "Untitled Project"}
                      </h3>
                      <div className={`flex items-center gap-2 text-xs mt-1 ${
                        theme === "dark" ? "text-white/60" : "text-zinc-500"
                      }`}>
                        <ClockIcon size={12} />
                        <span>{timeAgo(project.createdAt)}</span>
                        <span className={`px-1 py-0.2 text-[10px] rounded border uppercase ${
                          theme === "dark"
                            ? "bg-white/10 border-white/10 text-white/80"
                            : "bg-zinc-100 border-zinc-200 text-zinc-600"
                        }`}>
                          {project.status || "v1"}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(project._id);
                      }}
                      className={`p-1.5 rounded-md transition opacity-0 group-hover:opacity-100 ${
                        theme === "dark"
                          ? "text-white/40 hover:text-red-400 hover:bg-white/10"
                          : "text-zinc-400 hover:text-red-500 hover:bg-zinc-100"
                      }`}
                      title="Delete Project"
                    >
                      <Trash2Icon size={16} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center py-6">
                <p className={`text-sm mb-4 ${
                  theme === "dark" ? "text-zinc-400" : "text-zinc-500"
                }`}>
                  You have {projects.length} projects created.
                </p>
                <button
                  onClick={() => navigate("/projects")}
                  className="px-6 py-2.5 bg-gradient-to-br from-red-600 to-amber-600 text-white font-semibold rounded-lg shadow-md cursor-pointer hover:opacity-95 transition-all text-sm"
                >
                  View All Projects
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default HomePage;