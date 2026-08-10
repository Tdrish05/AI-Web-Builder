import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import toast from "react-hot-toast";
import debounce from "lodash.debounce";

const AppContext = createContext(undefined);

export function AppContextProvider({ children }) {
  const navigate = useNavigate();

  // Auth states
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // Project states
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [activeProject, setActiveProject] = useState(null);
  const [loadingActiveProject, setLoadingActiveProject] = useState(true);
  const [chatLoading, setChatLoading] = useState(false);
  const [generatingProject, setGeneratingProject] = useState(false);
  const [activeFile, setActiveFile] = useState("/App.js");
  const [showCode, setShowCode] = useState(false);

  // Theme states
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  // Auth actions
  const checkSession = useCallback(async () => {
    try {
      const { data } = await api.get("/api/auth/me");
      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setLoadingUser(false);
    }
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  const login = useCallback(async (email, password) => {
    try {
      const { data } = await api.post("/api/auth/login", { email, password });
      setUser(data.user);
      toast.success("Welcome back!");
      navigate("/");
    } catch (err) {
      console.error("Login failed:", err);
      const errMsg = err?.response?.data?.error || "Invalid email or password";
      toast.error(errMsg);
      throw new Error(errMsg);
    }
  }, [navigate]);

  const register = useCallback(async (name, email, password) => {
    try {
      const { data } = await api.post("/api/auth/register", {
        name,
        email,
        password,
      });
      setUser(data.user);
      toast.success("Account created successfully!");
      navigate("/");
    } catch (err) {
      console.error("Registration failed:", err);
      const errMsg = err?.response?.data?.error || "Registration failed";
      toast.error(errMsg);
      throw new Error(errMsg);
    }
  }, [navigate]);

  const logout = useCallback(async () => {
    try {
      await api.post("/api/auth/logout");
      setUser(null);
      setProjects([]);
      setActiveProject(null);
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
      toast.error("Logout failed");
    }
  }, [navigate]);

  // Projects Actions
  const loadProjects = useCallback(async () => {
    if (!user) return;
    try {
      setLoadingProjects(true);
      const { data } = await api.get("/api/projects");
      setProjects(data);
    } catch (err) {
      console.error("Failed to list projects:", err);
      toast.error("Failed to load projects list");
    } finally {
      setLoadingProjects(false);
    }
  }, [user]);

  const loadProject = useCallback(
    async (id, silent = false) => {
      // FIX: Ensure we don't stay stuck in a loading state if user is missing
      if (!user) {
        if (!silent) setLoadingActiveProject(false);
        return;
      }
      
      if (!silent) setLoadingActiveProject(true);

      try {
        const { data } = await api.get(`/api/projects/${id}`);
        setActiveProject(data);

        const files = Object.keys(data.files || {});
        if (files.length > 0) {
          setActiveFile((prev) => {
            if (files.includes(prev)) return prev;
            if (files.includes("/App.js")) return "/App.js";
            return files[0];
          });
        }
      } catch (err) {
        console.error("Failed to load project:", err);
        if (!silent) {
          toast.error("Failed to load project details");
          navigate("/");
        }
      } finally {
        if (!silent) setLoadingActiveProject(false);
      }
    },
    [navigate, user],
  );

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/projects/${id}`);
      setProjects((prev) => prev.filter((p) => p._id !== id));
      toast.success("Project deleted");
    } catch (err) {
      console.error("Failed to delete project:", err);
      toast.error("Failed to delete project");
    }
  };

  // Poll active project status if pending/generating/revising
  useEffect(() => {
    if (!activeProject || !user) return;
    const projectId = activeProject._id || activeProject.id;
    if (!projectId) return;

    const isOngoing =
      activeProject.status === "generating" ||
      activeProject.status === "pending" ||
      activeProject.status === "revising";

    if (isOngoing) {
      setChatLoading(true);
      const interval = setInterval(() => {
        loadProject(projectId, true);
      }, 2000);
      return () => clearInterval(interval);
    } else {
      setChatLoading(false);
    }
  }, [activeProject?._id, activeProject?.id, activeProject?.status, loadProject, user]);

  const handleGenerate = useCallback(
    async (prompt) => {
      if (!user) return;

      setGeneratingProject(true);
      try {
        const { data } = await api.post("/api/projects", { prompt });
        toast.success("AI Agent is planning structure...");
        navigate(`/builder/${data.id}`);
      } catch (err) {
        console.error("Failed to generate project:", err);
        toast.error(err?.response?.data?.error || "Failed to generate project");
      } finally {
        setGeneratingProject(false);
      }
    },
    [navigate, user],
  );

  const handleChat = useCallback(
    async (prompt) => {
      if (!activeProject || !user) return;

      const projectId = activeProject._id || activeProject.id;
      if (!projectId) return;

      setChatLoading(true);

      try {
        const { data } = await api.post(
          `/api/projects/${projectId}/chat`,
          { prompt },
        );

        setActiveProject(data);

        if (data.errors && data.errors.length > 0) {
          toast.error(`${data.errors.length} revision patch(es) failed`);
        } else {
          toast.success(
            `Project updated successfully to version ${data.version}`,
          );
        }
      } catch (err) {
        console.error("Failed to send chat:", err);
        toast.error(err?.response?.data?.error || "Failed to update project");
      } finally {
        setChatLoading(false);
      }
    },
    [activeProject, user],
  );

  // Debounced API call for file saving
  const debouncedSave = useMemo(
    () =>
      debounce(async (files, id) => {
        try {
          await api.put(`/api/projects/${id}/files`, { files });
        } catch (err) {
          console.error("Failed to auto-save files:", err);
          toast.error("Failed to save code modifications");
        }
      }, 1000),
    [],
  );

  useEffect(() => {
    return () => {
      debouncedSave.flush();
    };
  }, [debouncedSave]);

  const updateProjectFiles = useCallback(
    async (files) => {
      if (!activeProject || !user) return;

      // Optimistically update local state so UI reacts instantly
      setActiveProject((prev) => (prev ? { ...prev, files } : prev));

      // Save to backend with debounce
      const projectId = activeProject._id || activeProject.id;
      debouncedSave(files, projectId);
    },
    [activeProject, user, debouncedSave],
  );

  // Memoize Context Value to prevent unnecessary re-render cascades
  const contextValue = useMemo(
    () => ({
      user,
      loadingUser,
      login,
      register,
      logout,
      projects,
      loadingProjects,
      activeProject,
      loadingActiveProject,
      chatLoading,
      generatingProject,
      activeFile,
      setActiveFile,
      showCode,
      setShowCode,
      loadProjects,
      loadProject,
      handleGenerate,
      handleDelete,
      updateProjectFiles,
      theme,
      toggleTheme,
      sendChatMessage: handleChat,
    }),
    [
      user,
      loadingUser,
      login,
      register,
      logout,
      projects,
      loadingProjects,
      activeProject,
      loadingActiveProject,
      chatLoading,
      generatingProject,
      activeFile,
      showCode,
      loadProjects,
      loadProject,
      handleGenerate,
      updateProjectFiles,
      theme,
      toggleTheme,
      handleChat,
    ],
  );

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }
  return context;
}