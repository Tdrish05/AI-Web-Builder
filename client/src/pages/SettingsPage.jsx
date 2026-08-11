import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import {
  UserIcon,
  LockIcon,
  LogOutIcon,
  UploadIcon,
  TagIcon,
  Loader2Icon,
  CameraIcon
} from "lucide-react";
import toast from "react-hot-toast";

const SettingsPage = () => {
  const navigate = useNavigate();
  const {
    user,
    logout,
    updateProfile,
    changePassword,
    theme,
  } = useAppContext();

  // Profile Form States
  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [interestsInput, setInterestsInput] = useState(
    (user?.interests || []).join(", ")
  );
  const [profileImage, setProfileImage] = useState(user?.profileImage || "");
  const [updatingProfile, setUpdatingProfile] = useState(false);

  // Password Form States
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPasswordState, setChangingPasswordState] = useState(false);

  const [activeTab, setActiveTab] = useState("profile"); // 'profile' | 'security'

  // Convert uploaded image to base64
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }

    setUpdatingProfile(true);
    try {
      // Split interests by commas and clean spaces
      const interests = interestsInput
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      await updateProfile({
        name,
        bio,
        interests,
        profileImage,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("All password fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    setChangingPasswordState(true);
    try {
      await changePassword(oldPassword, newPassword);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(err);
    } finally {
      setChangingPasswordState(false);
    }
  };

  const handleSwitchAccount = () => {
    logout();
  };

  return (
    <div className={`h-screen overflow-y-auto font-sans p-6 md:p-10 transition-colors duration-200 ${
      theme === "dark" ? "bg-zinc-950 text-white" : "bg-zinc-50 text-zinc-900"
    }`}>
      {/* Subtle Grid Background */}
      <div
        className="fixed inset-0 bg-[linear-gradient(to_right,var(--grid-color)_1px,transparent_1px),linear-gradient(to_bottom,var(--grid-color)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0"
        style={{
          "--grid-color": theme === "dark" ? "rgba(255, 255, 255, 0.04)" : "rgba(0, 0, 0, 0.04)"
        }}
      />

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Header */}
        <div className="border-b border-zinc-200 dark:border-zinc-800 pb-6 mb-8">
          <h1 className="text-2xl font-bold tracking-tight">Account Settings</h1>
          <p className={`text-sm mt-1 ${theme === "dark" ? "text-zinc-400" : "text-zinc-500"}`}>
            Update your public profile, account security, and active session.
          </p>
        </div>

        {/* Settings Tab Navigation */}
        <div className="flex gap-2 border-b border-zinc-200 dark:border-zinc-800 mb-8 pb-px">
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold tracking-wide transition border-b-2 cursor-pointer ${
              activeTab === "profile"
                ? "border-red-500 text-zinc-950 dark:text-white"
                : "border-transparent text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
            }`}
          >
            <UserIcon size={16} />
            <span>Profile details</span>
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold tracking-wide transition border-b-2 cursor-pointer ${
              activeTab === "security"
                ? "border-red-500 text-zinc-950 dark:text-white"
                : "border-transparent text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
            }`}
          >
            <LockIcon size={16} />
            <span>Security</span>
          </button>
        </div>

        {/* Tab Contents */}
        {activeTab === "profile" ? (
          <form onSubmit={handleUpdateProfile} className="space-y-6">
            {/* Avatar Selector/Upload Card */}
            <div className={`p-6 border rounded-2xl bg-white dark:bg-zinc-900/50 ${
              theme === "dark" ? "border-zinc-850" : "border-zinc-200"
            }`}>
              <h3 className="text-base font-semibold mb-4">Profile Image</h3>
              <div className="flex items-center gap-6">
                <div className="relative group size-20 rounded-full border border-zinc-200 dark:border-zinc-700 overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Avatar"
                      className="size-full object-cover"
                    />
                  ) : (
                    <UserIcon size={32} className="text-zinc-400" />
                  )}
                  <label
                    htmlFor="avatar-upload"
                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center text-white text-[10px] font-semibold cursor-pointer"
                  >
                    <CameraIcon size={16} className="mb-0.5" />
                    <span>Upload</span>
                  </label>
                  <input
                    type="file"
                    id="avatar-upload"
                    onChange={handleImageUpload}
                    accept="image/*"
                    hidden
                  />
                </div>
                <div>
                  <p className="text-sm font-medium">Upload a custom picture</p>
                  <p className={`text-xs mt-1 ${theme === "dark" ? "text-zinc-500" : "text-zinc-450"}`}>
                    Supports PNG, JPG, or GIF. Max size 2MB.
                  </p>
                  {profileImage && (
                    <button
                      type="button"
                      onClick={() => setProfileImage("")}
                      className="text-xs text-red-500 hover:underline mt-2 inline-block cursor-pointer"
                    >
                      Remove picture
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* General details Card */}
            <div className={`p-6 border rounded-2xl space-y-4 bg-white dark:bg-zinc-900/50 ${
              theme === "dark" ? "border-zinc-850" : "border-zinc-200"
            }`}>
              <h3 className="text-base font-semibold mb-4">Public Info</h3>
              
              <div>
                <label className={`block text-xs font-semibold mb-1 uppercase tracking-wide ${
                  theme === "dark" ? "text-zinc-400" : "text-zinc-500"
                }`}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full p-2.5 rounded-lg border text-sm outline-none bg-transparent ${
                    theme === "dark"
                      ? "border-zinc-800 focus:border-zinc-700 text-white"
                      : "border-zinc-200 focus:border-zinc-300 text-zinc-900"
                  }`}
                  placeholder="e.g. John Doe"
                />
              </div>

              <div>
                <label className={`block text-xs font-semibold mb-1 uppercase tracking-wide ${
                  theme === "dark" ? "text-zinc-400" : "text-zinc-500"
                }`}>
                  Bio
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  className={`w-full p-2.5 rounded-lg border text-sm outline-none bg-transparent resize-none ${
                    theme === "dark"
                      ? "border-zinc-800 focus:border-zinc-700 text-white"
                      : "border-zinc-200 focus:border-zinc-300 text-zinc-900"
                  }`}
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div>
                <label className={`block text-xs font-semibold mb-1 uppercase tracking-wide ${
                  theme === "dark" ? "text-zinc-400" : "text-zinc-500"
                }`}>
                  Interests (comma separated)
                </label>
                <input
                  type="text"
                  value={interestsInput}
                  onChange={(e) => setInterestsInput(e.target.value)}
                  className={`w-full p-2.5 rounded-lg border text-sm outline-none bg-transparent ${
                    theme === "dark"
                      ? "border-zinc-800 focus:border-zinc-700 text-white"
                      : "border-zinc-200 focus:border-zinc-300 text-zinc-900"
                  }`}
                  placeholder="e.g. React, SaaS, AI, Web Design"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                type="submit"
                disabled={updatingProfile}
                className="px-5 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-100 rounded-lg text-sm font-semibold cursor-pointer shadow flex items-center gap-2"
              >
                {updatingProfile && <Loader2Icon size={16} className="animate-spin" />}
                <span>Save Changes</span>
              </button>

              <button
                type="button"
                onClick={handleSwitchAccount}
                className="inline-flex items-center gap-2 px-4 py-2 border border-red-500/30 hover:border-red-500 text-red-500 rounded-lg text-sm font-medium transition cursor-pointer hover:bg-red-50 dark:hover:bg-red-950/10"
              >
                <LogOutIcon size={15} />
                <span>Switch Account</span>
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleChangePassword} className="space-y-6">
            {/* Password Update Card */}
            <div className={`p-6 border rounded-2xl space-y-4 bg-white dark:bg-zinc-900/50 ${
              theme === "dark" ? "border-zinc-850" : "border-zinc-200"
            }`}>
              <h3 className="text-base font-semibold mb-4 text-zinc-900 dark:text-white">Change Password</h3>

              <div>
                <label className={`block text-xs font-semibold mb-1 uppercase tracking-wide ${
                  theme === "dark" ? "text-zinc-400" : "text-zinc-500"
                }`}>
                  Current Password
                </label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className={`w-full p-2.5 rounded-lg border text-sm outline-none bg-transparent ${
                    theme === "dark"
                      ? "border-zinc-800 focus:border-zinc-700 text-white"
                      : "border-zinc-200 focus:border-zinc-300 text-zinc-900"
                  }`}
                  placeholder="Enter current password"
                />
              </div>

              <div>
                <label className={`block text-xs font-semibold mb-1 uppercase tracking-wide ${
                  theme === "dark" ? "text-zinc-400" : "text-zinc-500"
                }`}>
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={`w-full p-2.5 rounded-lg border text-sm outline-none bg-transparent ${
                    theme === "dark"
                      ? "border-zinc-800 focus:border-zinc-700 text-white"
                      : "border-zinc-200 focus:border-zinc-300 text-zinc-900"
                  }`}
                  placeholder="Enter new password"
                />
              </div>

              <div>
                <label className={`block text-xs font-semibold mb-1 uppercase tracking-wide ${
                  theme === "dark" ? "text-zinc-400" : "text-zinc-500"
                }`}>
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full p-2.5 rounded-lg border text-sm outline-none bg-transparent ${
                    theme === "dark"
                      ? "border-zinc-800 focus:border-zinc-700 text-white"
                      : "border-zinc-200 focus:border-zinc-300 text-zinc-900"
                  }`}
                  placeholder="Re-type new password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={changingPasswordState}
              className="px-5 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-100 rounded-lg text-sm font-semibold cursor-pointer shadow flex items-center gap-2"
            >
              {changingPasswordState && <Loader2Icon size={16} className="animate-spin" />}
              <span>Change Password</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;
