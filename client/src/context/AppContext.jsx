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
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      setLoadingUser(false);
      return;
    }

    try {
      const { data } = await api.get("/api/auth/me");
      setUser(data.user);
    } catch {
      setUser(null);
      localStorage.removeItem("token");
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
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
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
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
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
    } catch (err) {
      console.error("Logout failed on server:", err);
    } finally {
      localStorage.removeItem("token");
      setUser(null);
      setProjects([]);
      setActiveProject(null);
      toast.success("Logged out successfully");
      navigate("/login");
    }
  }, [navigate]);

  const updateProfile = useCallback(async (profileData) => {
    try {
      const { data } = await api.put("/api/auth/profile", profileData);
      setUser(data.user);
      toast.success("Profile updated successfully!");
      return data.user;
    } catch (err) {
      console.error("Profile update failed:", err);
      const errMsg = err?.response?.data?.error || "Failed to update profile";
      toast.error(errMsg);
      throw new Error(errMsg);
    }
  }, []);

  const changePassword = useCallback(async (oldPassword, newPassword) => {
    try {
      await api.put("/api/auth/change-password", { oldPassword, newPassword });
      toast.success("Password changed successfully!");
    } catch (err) {
      console.error("Password change failed:", err);
      const errMsg = err?.response?.data?.error || "Failed to change password";
      toast.error(errMsg);
      throw new Error(errMsg);
    }
  }, []);

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
      if (!user) return;
      try {
        if (!silent) setLoadingActiveProject(true);
        const { data } = await api.get(`/api/projects/${id}`);
        setActiveProject(data);
      } catch (err) {
        console.error(`Failed to load project ${id}:`, err);
        toast.error("Failed to load project details");
        navigate("/");
      } finally {
        if (!silent) setLoadingActiveProject(false);
      }
    },
    [navigate, user],
  );

  useEffect(() => {
    if (
      !activeProject ||
      activeProject.status === "completed" ||
      activeProject.status === "failed"
    ) {
      setChatLoading(false);
      return;
    }

    if (
      activeProject.status === "pending" ||
      activeProject.status === "generating" ||
      activeProject.status === "revising"
    ) {
      setChatLoading(true);
      const interval = setInterval(() => {
        const projId = activeProject._id || activeProject.id;
        if (projId) loadProject(projId, true);
      }, 2000);
      return () => clearInterval(interval);
    } else {
      setChatLoading(false);
    }
  }, [activeProject?._id, activeProject?.id, activeProject?.status, loadProject]);

  const handleGenerate = useCallback(
    async (prompt, uploadedFile = null) => {
      if (!user) return;

      setGeneratingProject(true);
      try {
        const { data } = await api.post("/api/projects", { prompt, uploadedFile });
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
  const debouncedSaveFiles = useMemo(
    () =>
      debounce(async (projectId, updatedFiles) => {
        try {
          await api.put(`/api/projects/${projectId}/files`, {
            files: updatedFiles,
          });
        } catch (err) {
          console.error("Autosave failed:", err);
        }
      }, 1000),
    [],
  );

  const updateProjectFiles = useCallback(
    (filePath, codeContent) => {
      if (!activeProject) return;

      const projectId = activeProject._id || activeProject.id;
      if (!projectId) return;

      const updatedFiles = {
        ...activeProject.files,
        [filePath]: codeContent,
      };

      setActiveProject((prev) => ({
        ...prev,
        files: updatedFiles,
      }));

      debouncedSaveFiles(projectId, updatedFiles);
    },
    [activeProject, debouncedSaveFiles],
  );

  const handleDelete = useCallback(
    async (id) => {
      if (!window.confirm("Are you sure you want to delete this project?"))
        return;
      try {
        await api.delete(`/api/projects/${id}`);
        setProjects((prev) => prev.filter((p) => p._id !== id));
        toast.success("Project deleted successfully");
        if (activeProject && (activeProject._id === id || activeProject.id === id)) {
          setActiveProject(null);
          navigate("/");
        }
      } catch (err) {
        console.error("Failed to delete project:", err);
        toast.error("Failed to delete project");
      }
    },
    [activeProject, navigate],
  );

  const contextValue = useMemo(
    () => ({
      user,
      loadingUser,
      login,
      register,
      logout,
      updateProfile,
      changePassword,
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
      updateProfile,
      changePassword,
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
      handleDelete,
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