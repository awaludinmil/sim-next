'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';

const navigationItems = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6">
        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    href: '/dashboard/new',
    label: 'SIM Baru',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6">
        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
  {
    href: '/dashboard/renew',
    label: 'Perpanjang',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6">
        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
  },
  {
    href: '/dashboard/lost',
    label: 'Kehilangan',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6">
        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
  },
  {
    href: '/dashboard/profile',
    label: 'Profil',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6">
        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
];

function SidebarNavItem({ href, label, icon, active, collapsed }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group
        ${active 
          ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30' 
          : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
        }
        ${collapsed ? 'justify-center' : ''}
      `}
    >
      <span className={`flex-shrink-0 transition-transform duration-300 ${active ? '' : 'group-hover:scale-110'}`}>
        {icon}
      </span>
      {!collapsed && (
        <span className={`font-medium whitespace-nowrap transition-opacity duration-300 ${collapsed ? 'opacity-0' : 'opacity-100'}`}>
          {label}
        </span>
      )}
    </Link>
  );
}

function BottomNavItem({ href, label, icon, active }) {
  return (
    <Link
      href={href}
      className={`flex flex-col items-center justify-center gap-1 py-2 px-3 rounded-xl transition-all duration-300
        ${active 
          ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/30' 
          : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
        }
      `}
    >
      <span className={`transition-transform duration-300 ${active ? 'scale-110' : ''}`}>{icon}</span>
      <span className="text-[10px] font-medium">{label}</span>
    </Link>
  );
}

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/20 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/30 mb-4">
          <span className="text-white text-2xl">🛡️</span>
        </div>
        <div className="flex items-center justify-center gap-2 text-gray-600">
          <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="font-medium">Memeriksa sesi...</span>
        </div>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { isLoading, isAuthenticated, user } = useAuth();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const isActive = (href) => {
    if (href === '/dashboard') return pathname === href;
    return pathname?.startsWith(href);
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/20 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
      {/* Desktop Sidebar */}
      <aside 
        className={`fixed left-0 top-0 h-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-700/50 z-40 transition-all duration-300 hidden lg:flex flex-col
          ${sidebarCollapsed ? 'w-20' : 'w-72'}
        `}
      >
        {/* Logo Header */}
        <div className={`p-6 border-b border-gray-200/50 dark:border-gray-700/50 ${sidebarCollapsed ? 'px-4' : ''}`}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 flex-shrink-0">
              <span className="text-white text-xl">🛡️</span>
            </div>
            {!sidebarCollapsed && (
              <div className="overflow-hidden">
                <h1 className="font-bold text-gray-900 dark:text-white text-lg leading-tight">SIM Online</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Lalu Lintas</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <p className={`text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 ${sidebarCollapsed ? 'text-center' : 'px-4'}`}>
            {sidebarCollapsed ? '•••' : 'Menu Utama'}
          </p>
          {navigationItems.map((item) => (
            <SidebarNavItem
              key={item.href}
              href={item.href}
              label={item.label}
              icon={item.icon}
              active={isActive(item.href)}
              collapsed={sidebarCollapsed}
            />
          ))}
        </nav>

        {/* Collapse Toggle */}
        <div className="p-4 border-t border-gray-200/50 dark:border-gray-700/50">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300"
          >
            <svg
              className={`w-5 h-5 transition-transform duration-300 ${sidebarCollapsed ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
            {!sidebarCollapsed && <span className="text-sm font-medium">Tutup Sidebar</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main 
        className={`min-h-screen transition-all duration-300 pb-20 lg:pb-0
          ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72'}
        `}
      >
        {/* Top Header for Desktop */}
        <header className="hidden lg:flex items-center justify-between px-8 py-6 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-30">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {navigationItems.find(item => isActive(item.href))?.label || 'Dashboard'}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Sistem Informasi Manajemen SIM</p>
          </div>
          
          {/* User Info */}
          <div className="flex items-center gap-4">
            <button className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-semibold shadow-lg shadow-blue-500/20">
              U
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="fade-in">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-700/50 z-50 safe-area-inset-bottom">
        <div className="flex items-center justify-around px-2 py-2">
          {navigationItems.map((item) => (
            <BottomNavItem
              key={item.href}
              href={item.href}
              label={item.label}
              icon={item.icon}
              active={isActive(item.href)}
            />
          ))}
        </div>
      </nav>
    </div>
  );
}
