'use client';

import { useState, useRef, useEffect } from 'react';
import { Menu, Bell, ChevronDown, User, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface HeaderProps {
    onMobileMenuClick: () => void;
    onDesktopCollapseClick: () => void;
    isCollapsed: boolean;
}

export function Header({ onMobileMenuClick, onDesktopCollapseClick, isCollapsed }: HeaderProps) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            router.push('/auth/sign-in');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm">
            <div className="flex items-center gap-4">
                {/* Mobile Menu Button */}
                <button
                    onClick={onMobileMenuClick}
                    className="md:hidden p-2 rounded-md text-slate-600 hover:bg-slate-100"
                >
                    <Menu className="h-6 w-6" />
                </button>

                {/* Desktop Collapse Button */}
                <button
                    onClick={onDesktopCollapseClick}
                    className="hidden md:block p-2 rounded-md text-slate-600 hover:bg-slate-100"
                    title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                >
                    <Menu className="h-6 w-6" />
                </button>

                <h1 className="text-lg font-semibold text-slate-800">Dashboard</h1>
            </div>

            <div className="flex items-center gap-4">
                <button className="p-2 rounded-full text-slate-500 hover:bg-slate-100">
                    <Bell className="h-5 w-5" />
                </button>

                <div className="relative pl-4 border-l border-slate-200" ref={dropdownRef}>
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-sm text-slate-700 shadow-sm transition-colors"
                        aria-expanded={isDropdownOpen}
                        aria-haspopup="true"
                    >
                        <div className="h-8 w-8 rounded-full bg-slate-300 flex items-center justify-center text-slate-600 font-medium text-sm">
                            JD
                        </div>
                        <span className="hidden sm:block font-medium">John Doe</span>
                        <ChevronDown className="h-4 w-4 text-slate-500" />
                    </button>

                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 rounded-md bg-white shadow-lg border border-slate-200 z-50 py-1 transition ease-out duration-100 origin-top-right">
                            <Link
                                href="/settings/profile"
                                className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                                onClick={() => setIsDropdownOpen(false)}
                            >
                                <User className="h-4 w-4" />
                                Edit Profile
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                                <LogOut className="h-4 w-4" />
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
