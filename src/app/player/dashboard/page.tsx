'use client';

import { useState, useEffect } from 'react';
import { mockPlayer, mockCoaches, getPendingRequests, confirmAffiliation, declineAffiliation } from '@/lib/mockData';
import ChatPanel from '@/components/ChatPanel';
import { QRCodeSVG } from 'qrcode.react';

export default function PlayerDashboard() {
    const [aiSummary, setAiSummary] = useState<string | null>(null);
    const [aiTraining, setAiTraining] = useState<string[] | null>(null);
    const [aiVendors, setAiVendors] = useState<{ name: string, description: string, link: string }[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [showQR, setShowQR] = useState(false);
    const [pendingRequests, setPendingRequests] = useState<string[]>([]);

    useEffect(() => {
        // If this player is in the pending requests, show a notification
        const pending = getPendingRequests();
        if (pending.includes(mockPlayer.id)) {
            setPendingRequests([mockPlayer.id]); // Just mock for this user
        }
    }, []);

    const handleAccept = () => {
        confirmAffiliation(mockPlayer.id);
        setPendingRequests([]);
        alert("Affiliation accepted! Coach Carter has been added to your network.");
    };

    const handleDecline = () => {
        declineAffiliation(mockPlayer.id);
        setPendingRequests([]);
    };

    const generateAIInsights = async () => {
        setLoading(true);
        try {
            // Parallel API calls
            const [summaryRes, trainingRes, vendorRes] = await Promise.all([
                fetch('/api/ai/summary', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ player: mockPlayer })
                }),
                fetch('/api/ai/training', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ player: mockPlayer })
                }),
                fetch('/api/ai/vendor', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ player: mockPlayer })
                })
            ]);

            const summaryData = await summaryRes.json();
            const trainingData = await trainingRes.json();
            const vendorData = await vendorRes.json();

            setAiSummary(summaryData.summary);
            setAiTraining(trainingData.recommendations);
            setAiVendors(vendorData.vendors);
        } catch (error) {
            console.error(error);
            setAiSummary("Failed to load insights.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="container" style={{ padding: '2rem', paddingBottom: '6rem' }}>
            <header className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-4">
                    <h1>Player Dashboard</h1>
                    {pendingRequests.length > 0 && (
                        <div style={{ background: 'var(--danger-color)', color: 'white', padding: '0.25rem 0.75rem', borderRadius: 'full', fontSize: '0.875rem', fontWeight: 600 }}>
                            {pendingRequests.length} Notification
                        </div>
                    )}
                </div>
                <div className="flex gap-2">
                    <button className="btn btn-primary" onClick={() => setShowQR(true)}>QR Code</button>
                    <button className="btn btn-secondary">Edit Profile</button>
                </div>
            </header>

            {pendingRequests.length > 0 && (
                <div className="card mb-4" style={{ borderLeft: '4px solid var(--primary-color)' }}>
                    <div className="flex justify-between items-center flex-wrap gap-4">
                        <div>
                            <h3 style={{ margin: 0 }}>New Affiliation Request</h3>
                            <p style={{ margin: 0, marginTop: '0.25rem', color: 'var(--text-muted)' }}>
                                <span style={{ fontWeight: 600, color: 'var(--text-color)' }}>Coach Carter</span> wants to affiliate with you.
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <button className="btn btn-secondary" onClick={handleDecline}>Decline</button>
                            <button className="btn btn-primary" onClick={handleAccept}>Accept Request</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid" style={{ gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '2rem' }}>
                {/* Left Column: Profile & AI */}
                <section className="flex flex-col gap-4">
                    <div className="card">
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{mockPlayer.name}</h2>
                        <p style={{ color: 'var(--primary-color)', fontWeight: 600, marginBottom: '0.5rem' }}>
                            {mockPlayer.sport} - {mockPlayer.position}
                        </p>
                        <p>{mockPlayer.team}</p>
                        <p style={{ fontSize: '0.875rem', marginTop: '1rem' }}>{mockPlayer.bio}</p>

                        <hr style={{ borderColor: 'var(--border-color)', margin: '1.5rem 0' }} />

                        <button
                            className="btn btn-primary"
                            style={{ width: '100%' }}
                            onClick={generateAIInsights}
                            disabled={loading}
                        >
                            {loading ? 'Analyzing Data...' : '✨ Generate Full AI Analysis'}
                        </button>

                        {aiSummary && (
                            <div
                                style={{
                                    marginTop: '1.5rem',
                                    padding: '1rem',
                                    background: 'var(--surface-color-light)',
                                    borderRadius: '12px',
                                    fontSize: '0.875rem',
                                    borderLeft: '4px solid var(--primary-color)'
                                }}
                            >
                                <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>📊 Quick Summary</div>
                                <div style={{ color: 'var(--text-muted)' }}>{aiSummary}</div>
                            </div>
                        )}

                        {aiTraining && (
                            <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', borderLeft: '4px solid var(--success-color)' }}>
                                <div style={{ fontWeight: 600, marginBottom: '0.5rem', color: 'var(--success-color)' }}>🏋️‍♂️ Recommended Training</div>
                                <ul style={{ paddingLeft: '1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                    {aiTraining.map((rec, i) => <li key={i} style={{ marginBottom: '0.25rem' }}>{rec}</li>)}
                                </ul>
                            </div>
                        )}

                        {aiVendors && (
                            <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--surface-color-light)', borderRadius: '12px', borderLeft: '4px solid var(--secondary-color)' }}>
                                <div style={{ fontWeight: 600, marginBottom: '0.5rem', color: 'var(--secondary-color)' }}>🛒 Equipment Vendors</div>
                                <ul style={{ paddingLeft: '1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                    {aiVendors.map((vendor, i) => (
                                        <li key={i} style={{ marginBottom: '0.5rem' }}>
                                            <a href={vendor.link} style={{ fontWeight: 600, color: 'var(--text-color)' }}>{vendor.name}</a>
                                            <br />{vendor.description}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    <div className="card">
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Injury History</h3>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {mockPlayer.injuryHistory.map(inj => (
                                <li key={inj.id} style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                                    <div className="flex justify-between">
                                        <strong>{inj.type}</strong>
                                        <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>{inj.date}</span>
                                    </div>
                                    <div className="flex justify-between mt-1" style={{ fontSize: '0.875rem' }}>
                                        <span style={{ color: 'var(--text-muted)' }}>Recovery: {inj.recoveryTime}</span>
                                        <span style={{ color: inj.status === 'Cleared' ? 'var(--success-color)' : 'var(--danger-color)' }}>
                                            {inj.status}
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

                {/* Right Column: Stats & Game History */}
                <section className="flex flex-col gap-4">
                    <div className="card">
                        <div className="flex justify-between items-center mb-4">
                            <h3 style={{ fontSize: '1.25rem' }}>Season Averages</h3>
                            <select style={{ padding: '0.5rem', borderRadius: '4px', background: 'var(--surface-color-light)', color: 'var(--text-color)', border: '1px solid var(--border-color)', cursor: 'pointer' }}>
                                <option>2023-2024 Season</option>
                                <option>Career</option>
                            </select>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '1rem', textAlign: 'center' }}>
                            <div style={{ background: 'var(--surface-color-light)', padding: '1.5rem', borderRadius: '12px' }}>
                                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary-color)' }}>{mockPlayer.stats.ppg}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>PPG</div>
                            </div>
                            <div style={{ background: 'var(--surface-color-light)', padding: '1.5rem', borderRadius: '12px' }}>
                                <div style={{ fontSize: '2rem', fontWeight: 800 }}>{mockPlayer.stats.apg}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>APG</div>
                            </div>
                            <div style={{ background: 'var(--surface-color-light)', padding: '1.5rem', borderRadius: '12px' }}>
                                <div style={{ fontSize: '2rem', fontWeight: 800 }}>{mockPlayer.stats.rpg}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>RPG</div>
                            </div>
                            <div style={{ background: 'var(--surface-color-light)', padding: '1.5rem', borderRadius: '12px' }}>
                                <div style={{ fontSize: '2rem', fontWeight: 800 }}>{mockPlayer.stats.fgPercentage}%</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>FG%</div>
                            </div>
                            <div style={{ background: 'var(--surface-color-light)', padding: '1.5rem', borderRadius: '12px' }}>
                                <div style={{ fontSize: '2rem', fontWeight: 800 }}>{mockPlayer.stats.minutesPerGame}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>MIN</div>
                            </div>
                        </div>
                    </div>

                    <div className="card" style={{ flex: 1 }}>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Game History</h3>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                                        <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Date</th>
                                        <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Opponent</th>
                                        <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Result</th>
                                        <th style={{ padding: '1rem', color: 'var(--text-muted)', textAlign: 'right' }}>PTS</th>
                                        <th style={{ padding: '1rem', color: 'var(--text-muted)', textAlign: 'right' }}>AST</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {mockPlayer.gameHistory.map(game => (
                                        <tr key={game.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                            <td style={{ padding: '1rem', fontSize: '0.875rem' }}>{game.date}</td>
                                            <td style={{ padding: '1rem', fontWeight: 600 }}>{game.opponent}</td>
                                            <td style={{ padding: '1rem' }}>
                                                <span style={{
                                                    padding: '0.25rem 0.5rem',
                                                    borderRadius: '4px',
                                                    fontSize: '0.75rem',
                                                    background: game.result.startsWith('W') ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                                    color: game.result.startsWith('W') ? 'var(--success-color)' : 'var(--danger-color)'
                                                }}>
                                                    {game.result}
                                                </span>
                                            </td>
                                            <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 600 }}>{game.points}</td>
                                            <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 600 }}>{game.assists}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            </div>

            {/* Floating Chat Panel */}
            <ChatPanel recipientName="Coach Carter" />

            {/* QR Code Modal */}
            {showQR && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
                    <div className="card" style={{ background: 'var(--surface-color)', textAlign: 'center', minWidth: '300px' }}>
                        <h3 style={{ marginBottom: '1.5rem' }}>Your Profile QR Code</h3>
                        <div style={{ background: 'white', padding: '1rem', borderRadius: '12px', display: 'inline-block' }}>
                            <QRCodeSVG value={typeof window !== 'undefined' ? window.location.href : 'https://gima.app/player/dashboard'} size={200} />
                        </div>
                        <div style={{ marginTop: '1.5rem', color: 'var(--text-muted)' }}>Scan to view your public profile</div>
                        <button onClick={() => setShowQR(false)} className="btn btn-primary mt-4" style={{ width: '100%' }}>Close</button>
                    </div>
                </div>
            )}
        </main>
    );
}
