'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock login: coaches have @coach.gima.app emails, else player
        const role = email.includes('coach') ? 'coach' : 'player';
        router.push(`/${role}/dashboard`);
    };

    return (
        <main className="container flex justify-center items-center" style={{ minHeight: '80vh' }}>
            <div className="card text-center" style={{ maxWidth: '400px', width: '100%' }}>
                <h2>Welcome Back</h2>
                <p>Log in to your GIMA account</p>

                <form onSubmit={handleLogin} className="flex flex-col gap-3 mt-4 text-left">
                    <div className="flex flex-col gap-1">
                        <label htmlFor="email" style={{ fontSize: '0.875rem', fontWeight: 600 }}>Email Address</label>
                        <input
                            id="email"
                            type="email"
                            required
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                        Log In
                    </button>
                </form>

                <p className="mt-4" style={{ fontSize: '0.875rem' }}>
                    Don't have an account? <a href="/register" style={{ color: 'var(--primary-color)', fontWeight: 600 }}>Sign up</a>
                </p>
            </div>
        </main>
    );
}
