'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function RegisterForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialRole = searchParams.get('role') as 'player' | 'coach' || 'player';

    const [role, setRole] = useState<'player' | 'coach'>(initialRole);

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock register: redirect to dashboard
        router.push(`/${role}/dashboard`);
    };

    return (
        <div className="card text-center" style={{ maxWidth: '400px', width: '100%' }}>
            <h2>Create Account</h2>
            <p>Join the premier wheelchair sports platform</p>

            <form onSubmit={handleRegister} className="flex flex-col gap-3 mt-4 text-left">
                <div className="flex flex-col gap-1 mt-2">
                    <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>I am joining as a:</label>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => setRole('player')}
                            className={`btn ${role === 'player' ? 'btn-primary' : 'btn-secondary'}`}
                            style={{ flex: 1 }}
                        >Athlete
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole('coach')}
                            className={`btn ${role === 'coach' ? 'btn-primary' : 'btn-secondary'}`}
                            style={{ flex: 1 }}
                        >Coach
                        </button>
                    </div>
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="name" style={{ fontSize: '0.875rem', fontWeight: 600 }}>Full Name</label>
                    <input
                        id="name"
                        type="text"
                        required
                        placeholder="John Doe"
                        style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-color)' }}
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="email" style={{ fontSize: '0.875rem', fontWeight: 600 }}>Email Address</label>
                    <input
                        id="email"
                        type="email"
                        required
                        placeholder="you@example.com"
                        style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-color)' }}
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="password" style={{ fontSize: '0.875rem', fontWeight: 600 }}>Password</label>
                    <input
                        id="password"
                        type="password"
                        required
                        placeholder="••••••••"
                        style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-color)' }}
                    />
                </div>

                <button type="submit" className="btn btn-primary mt-4" style={{ width: '100%' }}>
                    Create Account
                </button>
            </form>

            <p className="mt-4" style={{ fontSize: '0.875rem' }}>
                Already have an account? <a href="/login" style={{ color: 'var(--primary-color)', fontWeight: 600 }}>Log in</a>
            </p>
        </div>
    );
}

export default function Register() {
    return (
        <main className="container flex justify-center items-center" style={{ minHeight: '80vh' }}>
            <Suspense fallback={<div style={{ textAlign: 'center' }}>Loading...</div>}>
                <RegisterForm />
            </Suspense>
        </main>
    );
}
