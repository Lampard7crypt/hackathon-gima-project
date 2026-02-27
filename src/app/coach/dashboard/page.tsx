'use client';

import { useState } from 'react';
import { mockPlayer, mockCoaches } from '@/lib/mockData';

export default function CoachDashboard() {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<'discover' | 'affiliated'>('discover');
    const [requestedPlayers, setRequestedPlayers] = useState<string[]>([]);

    // For MVC, just show the single mock player in discover
    const filteredPlayers = mockPlayer.name.toLowerCase().includes(searchTerm.toLowerCase())
        ? [mockPlayer]
        : [];

    const handleRequest = (playerId: string) => {
        setRequestedPlayers(prev => [...prev, playerId]);
        alert("Affiliation request sent to " + mockPlayer.name + "!");
    };

    return (
        <main className="container" style={{ padding: '2rem' }}>
            <header className="flex justify-between items-center mb-4">
                <h1>Coach Dashboard</h1>
                <div style={{ fontWeight: 600 }}>{mockCoaches[0].name}</div>
            </header>

            <div className="flex gap-4 mb-4" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                <button
                    className="btn"
                    style={{
                        background: activeTab === 'discover' ? 'var(--surface-color-light)' : 'transparent',
                        color: activeTab === 'discover' ? 'var(--text-color)' : 'var(--text-muted)'
                    }}
                    onClick={() => setActiveTab('discover')}
                >
                    Discover Athletes
                </button>
                <button
                    className="btn"
                    style={{
                        background: activeTab === 'affiliated' ? 'var(--surface-color-light)' : 'transparent',
                        color: activeTab === 'affiliated' ? 'var(--text-color)' : 'var(--text-muted)'
                    }}
                    onClick={() => setActiveTab('affiliated')}
                >
                    My Athletes (0)
                </button>
            </div>

            {activeTab === 'discover' && (
                <section className="flex flex-col gap-4">
                    <div className="card">
                        <h3 style={{ marginBottom: '1rem' }}>Search Filters</h3>
                        <div className="flex gap-4" style={{ flexWrap: 'wrap' }}>
                            <input
                                type="text"
                                placeholder="Search athletes by name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ flex: '1 1 300px', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-color)' }}
                            />
                            <select style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-color)' }}>
                                <option value="">All Sports</option>
                                <option value="basketball">Wheelchair Basketball</option>
                                <option value="rugby">Wheelchair Rugby</option>
                            </select>
                            <button className="btn btn-secondary">Filter</button>
                        </div>
                    </div>

                    <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                        {filteredPlayers.map(player => {
                            const isRequested = requestedPlayers.includes(player.id);

                            return (
                                <div key={player.id} className="card flex flex-col justify-between" style={{ padding: '1.5rem' }}>
                                    <div>
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 style={{ fontSize: '1.25rem', margin: 0 }}>{player.name}</h3>
                                            <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: 'var(--surface-color-light)', borderRadius: '4px' }}>
                                                {player.sport}
                                            </span>
                                        </div>
                                        <p style={{ color: 'var(--primary-color)', fontWeight: 600, fontSize: '0.875rem' }}>{player.position}</p>

                                        <div className="flex justify-between mt-4 mb-4" style={{ textAlign: 'center', background: 'var(--bg-color)', padding: '1rem', borderRadius: '8px' }}>
                                            <div>
                                                <div style={{ fontWeight: 800, fontSize: '1.25rem' }}>{player.stats.ppg}</div>
                                                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>PPG</div>
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 800, fontSize: '1.25rem' }}>{player.stats.apg}</div>
                                                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>APG</div>
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 800, fontSize: '1.25rem' }}>{player.stats.rpg}</div>
                                                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>RPG</div>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        className={`btn ${isRequested ? 'btn-secondary' : 'btn-primary'}`}
                                        style={{ width: '100%', padding: '0.75rem', opacity: isRequested ? 0.7 : 1 }}
                                        onClick={() => handleRequest(player.id)}
                                        disabled={isRequested}
                                    >
                                        {isRequested ? 'Request Pending' : 'Request Affiliation'}
                                    </button>
                                </div>
                            );
                        })}

                        {filteredPlayers.length === 0 && (
                            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                                No athletes found matching your search.
                            </div>
                        )}
                    </div>
                </section>
            )}

            {activeTab === 'affiliated' && (
                <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                    <p>You have no affiliated athletes yet.</p>
                    <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>Discover athletes to request affiliation and unlock direct messaging and deep analytics.</p>
                </div>
            )}
        </main>
    );
}
