'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Label } from '@/components/ui/Label';

interface RoleSelectionProps {
    onNext: (data: { role: string; experienceLevel: string; targetRole: string }) => void;
}

const ROLES = [
    'UI/UX Designer',
    'Product Designer',
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'Product Manager',
    'Marketing Specialist',
    'Other',
];

const EXPERIENCE_LEVELS = ['Student', 'Junior', 'Mid-Level', 'Senior', 'Lead/Manager'];

export function RoleSelection({ onNext }: RoleSelectionProps) {
    const [role, setRole] = useState('');
    const [experienceLevel, setExperienceLevel] = useState('');
    const [targetRole, setTargetRole] = useState('');

    const handleNext = () => {
        if (role && experienceLevel) {
            onNext({ role, experienceLevel, targetRole: targetRole || role });
        }
    };

    return (
        <div className="max-w-xl mx-auto space-y-8">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-slate-800">Which role are you creating this resume for?</h2>
                <p className="text-slate-600 mt-2">We'll tailor the structure and AI suggestions based on your choice.</p>
            </div>

            <div className="space-y-6 bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                <div className="space-y-2">
                    <Label htmlFor="role">Primary Role</Label>
                    <Select
                        id="role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <option value="">Select a role...</option>
                        {ROLES.map((r) => (
                            <option key={r} value={r}>{r}</option>
                        ))}
                    </Select>
                </div>

                {role === 'Other' && (
                    <div className="space-y-2">
                        <Label htmlFor="targetRole">Specific Role Title</Label>
                        <input
                            id="targetRole"
                            type="text"
                            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-[#2B2B2B] placeholder:text-[#2B2B2B]/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                            placeholder="e.g. Data Scientist"
                            value={targetRole}
                            onChange={(e) => setTargetRole(e.target.value)}
                        />
                    </div>
                )}

                <div className="space-y-2">
                    <Label htmlFor="experienceLevel">Experience Level</Label>
                    <Select
                        id="experienceLevel"
                        value={experienceLevel}
                        onChange={(e) => setExperienceLevel(e.target.value)}
                    >
                        <option value="">Select level...</option>
                        {EXPERIENCE_LEVELS.map((l) => (
                            <option key={l} value={l}>{l}</option>
                        ))}
                    </Select>
                </div>

                <Button
                    onClick={handleNext}
                    disabled={!role || !experienceLevel}
                    className="w-full"
                >
                    Continue
                </Button>
            </div>

            <div className="bg-blue-50 p-4 rounded-md border border-blue-100 text-blue-800 text-sm">
                <p><strong>AI Agent:</strong> "Great — I’ll tailor this resume perfectly for the selected role. Let’s move ahead."</p>
            </div>
        </div>
    );
}
