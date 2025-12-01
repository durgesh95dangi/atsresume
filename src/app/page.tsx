import Link from 'next/link';

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24">
            <h1 className="text-4xl font-bold mb-8">Resume Builder</h1>
            <div className="space-x-4">
                <Link
                    href="/auth/sign-in"
                    className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                    Sign In
                </Link>
                <Link
                    href="/auth/sign-up"
                    className="rounded-md bg-white border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                    Sign Up
                </Link>
            </div>
        </main>
    );
}
