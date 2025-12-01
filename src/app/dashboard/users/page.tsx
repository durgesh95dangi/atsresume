'use client';

import { User, Loader2, MapPin, Briefcase } from 'lucide-react';
import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { fetchWithTimeout } from '@/lib/utils';

interface UserData {
    id: string;
    name: string;
    email: string;
    headline?: string;
    location?: string;
    createdAt: string;
}

export default function UsersPage() {
    const [users, setUsers] = useState<UserData[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetchWithTimeout('/api/users');
                if (res.ok) {
                    const data = await res.json();
                    setUsers(data);
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUsers();
    }, []);

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Users</h1>
                <p className="text-sm text-slate-500">Manage and view all registered users.</p>
            </div>

            {/* Users List */}
            <div className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
                {isLoading ? (
                    <div className="p-12 text-center text-slate-500">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                        <p>Loading users...</p>
                    </div>
                ) : users.length === 0 ? (
                    <div className="p-12 text-center text-slate-500">
                        No users found.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4">Name</th>
                                    <th className="px-6 py-4">Contact</th>
                                    <th className="px-6 py-4">Details</th>
                                    <th className="px-6 py-4">Joined</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {users.map((user) => (
                                    <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                                                    <User className="h-5 w-5" />
                                                </div>
                                                <span className="font-medium text-slate-900">{user.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">
                                            {user.email}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                {user.headline && (
                                                    <div className="flex items-center gap-2 text-slate-600">
                                                        <Briefcase className="h-3 w-3" />
                                                        <span>{user.headline}</span>
                                                    </div>
                                                )}
                                                {user.location && (
                                                    <div className="flex items-center gap-2 text-slate-500 text-xs">
                                                        <MapPin className="h-3 w-3" />
                                                        <span>{user.location}</span>
                                                    </div>
                                                )}
                                                {!user.headline && !user.location && (
                                                    <span className="text-slate-400 italic">No details</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500">
                                            {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
