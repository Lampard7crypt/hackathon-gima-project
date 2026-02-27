'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();

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
            <nav className="flex gap-4">
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
