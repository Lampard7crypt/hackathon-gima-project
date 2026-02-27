import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GIMA - Wheelchair Sports Platform",
  description: "Connect physical handicapped athletes with coaches and track stats using AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="main-content">
          <header className="navbar container flex justify-between items-center" style={{ paddingTop: '1.5rem', paddingBottom: '1.5rem' }}>
            <div className="logo" style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.05em', color: 'var(--primary-color)' }}>
              GIMA.
            </div>
            <nav className="flex gap-4">
              <a href="/login" className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>Log in</a>
            </nav>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
