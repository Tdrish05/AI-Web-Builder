import React, { useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import PromptInput from "../components/PromptInput";
import { useNavigate } from "react-router-dom";
import { Trash2Icon, ClockIcon, Loader2Icon } from "lucide-react";

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
  const {
    user,
    projects,
    loadingProjects,
    generatingProject,
    loadProjects,
    handleGenerate,
    handleDelete,
    logout,
  } = useAppContext();

  useEffect(() => {
    loadProjects();
  }, []);

  return (
    <div className="h-screen overflow-y-scroll text-white font-sans bg-[url('/bg-img.png')] bg-cover bg-center bg-no-repeat">
      {/* Nav */}
      <nav className="sticky top-0 z-10 flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <img src="/logo.svg" alt="logo" className="size-6" />
          <span className="text-xl font-semibold tracking-tight">
            BuilderAI
          </span>
        </div>
        <div className="flex items-center gap-4 text-sm font-medium text-zinc-300">
          <span>{user?.name}</span>
          <button
            onClick={logout}
            className="py-1.5 px-3 border border-white/20 text-white hover:bg-white/10 text-xs rounded-md cursor-pointer bg-transparent transition"
          >
            Sign out
          </button>
        </div>
      </nav>

      {/* Hero Container */}
      <div className="flex flex-col items-center justify-start px-6 pb-20 mt-8 xl:mt-16">
        <div className="w-full max-w-2xl flex flex-col items-center">

          {/* Promo Badge */}
          <div className="flex items-center gap-2 p-1.5 pr-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-[13px] text-white/90">
            <span className="px-2.5 py-0.5 text-[11px] bg-red-600 rounded-full font-medium tracking-wider">
              PROMO
            </span>
            <span>Create your first project for free.</span>
          </div>

          {/* Title */}
          <h1 className="text-center text-4xl md:text-6xl font-medium mt-4 max-w-2xl text-white">
            Let's build your app together
          </h1>

          <p className="text-center text-sm md:text-base max-w-xl mt-4 text-white/65 leading-relaxed">
            Describe your idea and watch AI design, structure and launch your website
            instantly. No coding required.
          </p>

          {/* Prompt input */}
          <div className="w-full mt-6">
            <PromptInput
              onSubmit={handleGenerate}
              loading={generatingProject}
              placeholder="Create a portfolio website..."
              variant="glass"
              autoFocus
            />
          </div>

          {/* Scrolling Marquee tags */}
          <div className="masked-marquee w-full mt-4 max-w-2xl overflow-hidden py-1">
            <div className="flex animate-marquee gap-3">
              {homeTags.map((tag, i) => (
                <button
                  key={i}
                  onClick={() => handleGenerate(tag)}
                  disabled={generatingProject}
                  className="px-4 py-1.5 border rounded-full text-sm text-white bg-white/10 border-white/25 hover:bg-white/20 transition cursor-pointer shrink-0 font-medium"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* All Projects Section */}
          <div className="w-full mt-12">
            <div className="flex items-center justify-between border-b border-white/15 pb-2 mb-4">
              <span className="text-xs font-semibold tracking-wider text-white/80 uppercase">
                ALL PROJECTS
              </span>
              <span className="text-xs text-white/60 font-medium">
                {projects?.length || 0} {projects?.length === 1 ? "project" : "projects"}
              </span>
            </div>

            {loadingProjects ? (
              <div className="flex justify-center py-8">
                <Loader2Icon className="animate-spin text-white/50" size={20} />
              </div>
            ) : !projects || projects.length === 0 ? (
              <div className="text-center py-8 text-white/40 text-sm bg-white/5 rounded-xl border border-white/10">
                No projects created yet.
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {projects.map((project) => (
                  <div
                    key={project._id}
                    onClick={() => navigate(`/builder/${project._id}`)}
                    className="group flex items-center justify-between p-4 bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/15 rounded-xl cursor-pointer transition"
                  >
                    <div className="flex flex-col text-left">
                      <h3 className="font-semibold text-white text-base group-hover:text-orange-400 transition">
                        {project.name || project.title || project.prompt || "Untitled Project"}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-white/60 mt-1">
                        <ClockIcon size={12} />
                        <span>{timeAgo(project.createdAt)}</span>
                        <span className="px-1 py-0.2 text-[10px] bg-white/10 rounded border border-white/10 text-white/80 uppercase">
                          {project.status || "v1"}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(project._id);
                      }}
                      className="p-1.5 text-white/40 hover:text-red-400 hover:bg-white/10 rounded-md transition opacity-0 group-hover:opacity-100"
                      title="Delete Project"
                    >
                      <Trash2Icon size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default HomePage;