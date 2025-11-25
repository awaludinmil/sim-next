'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

function NavItem({ href, label, icon, active }) {
  return (
    <Link
      href={href}
      className={`flex flex-col items-center justify-center gap-1 flex-1 py-2 ${
        active ? 'text-blue-700' : 'text-gray-500'
      }`}
      aria-label={label}
    >
      <span className={`w-6 h-6 ${active ? 'opacity-100' : 'opacity-80'}`}>{icon}</span>
      <span className="text-[11px] leading-none">{label}</span>
    </Link>
  );
}

export default function DashboardLayout({ children }) {
  const pathname = usePathname();

  const items = [
    {
      href: '/dashboard',
      label: 'Home',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-full h-full">
          <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 10.5L12 4l9 6.5V20a2 2 0 01-2 2h-4a2 2 0 01-2-2v-4H9v4a2 2 0 01-2 2H3v-9.5z" />
        </svg>
      ),
    },
    {
      href: '/dashboard/new',
      label: 'Baru',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-full h-full">
          <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m7-7H5" />
        </svg>
      ),
    },
    {
      href: '/dashboard/renew',
      label: 'Perpanjang',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-full h-full">
          <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 4v6h6M20 20v-6h-6M20 8a8 8 0 00-15.5 2M4 16a8 8 0 0015.5-2" />
        </svg>
      ),
    },
    {
      href: '/dashboard/lost',
      label: 'Kehilangan',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-full h-full">
          <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      href: '/dashboard/profile',
      label: 'Profil',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-full h-full">
          <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 14c3.866 0 7 3.134 7 7H5c0-3.866 3.134-7 7-7zm0-3a4 4 0 100-8 4 4 0 000 8z" />
        </svg>
      ),
    },
  ];

  const isActive = (href) => {
    if (href === '/dashboard') return pathname === href;
    return pathname?.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 pb-20">
        {children}
      </div>

      {/* Bottom Navbar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="max-w-md mx-auto px-2">
          <div className="flex items-center justify-between">
            {items.map((item) => (
              <NavItem key={item.href} href={item.href} label={item.label} icon={item.icon} active={isActive(item.href)} />
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
}
