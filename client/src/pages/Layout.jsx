import React, { useState } from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import Loading from '../components/Loading';
import {
  SparklesIcon,
  FolderIcon,
  SettingsIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  LogOutIcon,
  UserIcon
} from 'lucide-react';

export function AuthLayout() {
  const { user, loadingUser } = useAppContext();

  if (loadingUser) return <Loading />;
  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
}

export function GuestLayout() {
  const { user, loadingUser } = useAppContext();

  if (loadingUser) return <Loading />;
  if (user) return <Navigate to="/" replace />;
  return <Outlet />;
}

export function SidebarLayout() {
  const { user, logout, theme } = useAppContext();
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const navItems = [
    {
      name: 'New Project',
      path: '/?focus=true',
      icon: SparklesIcon,
    },
    {
      name: 'Projects',
      path: '/projects',
      icon: FolderIcon,
    },
    {
      name: 'Settings',
      path: '/settings',
      icon: SettingsIcon,
    },
  ];

  const isActive = (path) => {
    if (path.startsWith('/?focus=')) {
      return location.pathname === '/' && location.search.includes('focus');
    }
    return location.pathname === path;
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 transition-colors duration-200">
      {/* Sidebar Layout */}
      <aside
        className={`shrink-0 flex flex-col justify-between border-r border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 transition-all duration-300 relative z-20 shadow-sm ${
          collapsed ? 'w-16' : 'w-64'
        }`}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`absolute -right-3 top-6 w-6 h-6 border rounded-full bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-100 transition shadow-sm z-30 cursor-pointer`}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRightIcon size={12} /> : <ChevronLeftIcon size={12} />}
        </button>

        {/* Top Section */}
        <div className="flex flex-col flex-1 pt-6 px-3">
          {/* Logo and Brand */}
          <div className={`flex items-center gap-3 px-2 mb-8 ${collapsed ? 'justify-center' : ''}`}>
            <img src="/logo.svg" alt="logo" className="w-6 h-6" />
            {!collapsed && (
              <span className="text-lg font-semibold tracking-tight truncate bg-gradient-to-r from-red-500 via-rose-500 to-amber-500 bg-clip-text text-transparent">
                AI Web Builder
              </span>
            )}
          </div>

          {/* Navigation Items */}
          <nav className="flex flex-col gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition cursor-pointer ${
                    active
                      ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-950 dark:text-white'
                      : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 hover:text-zinc-800 dark:hover:text-zinc-200'
                  } ${collapsed ? 'justify-center' : ''}`}
                  title={collapsed ? item.name : undefined}
                >
                  <Icon size={18} className={active ? 'text-red-500' : ''} />
                  {!collapsed && <span className="truncate">{item.name}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section - User Profile details */}
        <div className="border-t border-zinc-200/80 dark:border-zinc-800 p-3">
          <Link
            to="/settings"
            className={`flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition cursor-pointer ${
              collapsed ? 'justify-center' : ''
            }`}
            title="Open Settings & Profile"
          >
            {user?.profileImage ? (
              <img
                src={user.profileImage}
                alt={user.name}
                className="w-8 h-8 rounded-full border border-zinc-200 dark:border-zinc-700 object-cover shrink-0"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 shrink-0">
                <UserIcon size={16} />
              </div>
            )}
            {!collapsed && (
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-semibold truncate text-zinc-800 dark:text-zinc-200">
                  {user?.name}
                </p>
                <p className="text-xs truncate text-zinc-450 dark:text-zinc-500">
                  {user?.email}
                </p>
              </div>
            )}
          </Link>
          {!collapsed && (
            <button
              onClick={logout}
              className="mt-2 w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition cursor-pointer"
            >
              <LogOutIcon size={14} />
              <span>Sign out</span>
            </button>
          )}
        </div>
      </aside>

      {/* Main Panel Content */}
      <main className={`flex-1 overflow-hidden relative transition-colors duration-200 ${
        theme === "dark"
          ? "bg-gradient-to-b from-black via-red-950 via-red-800 to-amber-600 text-white"
          : "bg-gradient-to-b from-[#eae6e1] via-[#ebdcd0] to-[#dfcbb5] text-zinc-900"
      }`}>
        <Outlet />
      </main>
    </div>
  );
}