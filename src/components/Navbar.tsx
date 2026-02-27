'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const [theme, setTheme] = useState('dark');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const savedTheme = localStorage.getItem('theme') || 'dark';
        setTheme(savedTheme);
        document.documentElement.setAttribute('data-theme', savedTheme);
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    };

    // Hide login button if on dashboard
    const isDashboard = pathname?.includes('/dashboard');

    const handleLogout = () => {
        if (window.confirm("Are you sure you want to log out of GIMA?")) {
            router.push('/');
        }
    };

    return (
        <header className="navbar flex justify-between items-center" style={{ width: '100%', padding: '1.5rem 2rem' }}>
            <Link href="/" className="logo" style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.05em', color: 'var(--primary-color)', textDecoration: 'none' }}>
                GIMA.
            </Link>
            <nav className="flex gap-4 items-center">
                <Link
                    href="/shop"
                    style={{
                        fontWeight: 600, fontSize: '0.95rem', textDecoration: 'none',
                        color: pathname === '/shop' ? 'var(--primary-color)' : 'var(--text-muted)',
                        transition: 'color 0.2s'
                    }}
                >
                    🛍 Shop
                </Link>

                <button
                    onClick={toggleTheme}
                    className="btn btn-secondary"
                    style={{ padding: '0.5rem', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}
                    aria-label="Toggle Dark Mode"
                    title="Toggle Dark Mode"
                >
                    {mounted ? (theme === 'dark' ? '☀️' : '🌙') : '☀️'}
                </button>
                {!isDashboard ? (
                    <Link href="/login" className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>
                        Log in
                    </Link>
                ) : (
                    <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>
                        Log out
                    </button>
                )}
            </nav>
        </header>
    );
}
