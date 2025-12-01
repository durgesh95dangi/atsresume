'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    FileText,
    Settings,
    ChevronLeft,
    ChevronRight,
    X,
    User
} from 'lucide-react';

interface SidebarProps {
    isMobileOpen: boolean;
    setIsMobileOpen: (open: boolean) => void;
    isCollapsed: boolean;
    setIsCollapsed: (collapsed: boolean) => void;
}

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'My Resumes', href: '/dashboard/resumes', icon: FileText },
    { name: 'Users', href: '/dashboard/users', icon: User },
];

export function Sidebar({
    isMobileOpen,
    setIsMobileOpen,
    isCollapsed,
    setIsCollapsed,
}: SidebarProps) {
    const pathname = usePathname();

    return (
        <>
            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-gray-900/50 md:hidden"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Sidebar Container */}
            <aside
                className={cn(
                    'fixed inset-y-0 left-0 z-50 flex flex-col bg-slate-900 text-slate-100 transition-all duration-300 ease-in-out',
                    // Mobile: slide in/out
                    isMobileOpen ? 'translate-x-0' : '-translate-x-full',
                    // Desktop: static, width change
                    'md:translate-x-0 md:static',
                    isCollapsed ? 'md:w-20' : 'md:w-64'
                )}
            >
                {/* Sidebar Header */}
                <div className="flex h-16 items-center justify-between px-4 border-b border-slate-800">
                    <span
                        className={cn(
                            'text-xl font-bold transition-opacity duration-300',
                            isCollapsed ? 'md:opacity-0 md:hidden' : 'opacity-100'
                        )}
                    >
                        ATS Resume
                    </span>
                    {/* Mobile Close Button */}
                    <button
                        onClick={() => setIsMobileOpen(false)}
                        className="md:hidden p-1 rounded-md hover:bg-slate-800 text-slate-300"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    'flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
                                    isActive
                                        ? 'bg-slate-800 text-white'
                                        : 'text-slate-300 hover:bg-slate-800 hover:text-white',
                                    isCollapsed && 'md:justify-center md:px-2'
                                )}
                                title={isCollapsed ? item.name : undefined}
                            >
                                <item.icon
                                    className={cn(
                                        'h-6 w-6 flex-shrink-0',
                                        !isCollapsed && 'mr-3'
                                    )}
                                    aria-hidden="true"
                                />
                                <span
                                    className={cn(
                                        'transition-opacity duration-300',
                                        isCollapsed ? 'md:hidden' : 'block'
                                    )}
                                >
                                    {item.name}
                                </span>
                            </Link>
                        );
                    })}
                </nav>
            </aside>
        </>
    );
}
