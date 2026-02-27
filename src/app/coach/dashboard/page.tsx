'use client';

import { useState, useEffect, useRef } from 'react';
import { mockPlayers, mockCoaches, getPendingRequests, addPendingRequest, getConfirmedAffiliations, PlayerData } from '@/lib/mockData';
import Link from 'next/link';

import { getChatMessages, sendChatMessage, ChatMessage } from '@/lib/chatStore';

const COACH_ID = 'c1';

interface InlineChatProps {
    player: PlayerData;
}

function InlineChat({ player }: InlineChatProps) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const bottomRef = useRef<HTMLDivElement>(null);

    const loadMessages = () => {
        setMessages(getChatMessages(player.id, COACH_ID));
    };

    useEffect(() => {
        loadMessages();

        // Listen for messages from player (cross-tab storage event)
        const onStorage = (e: StorageEvent) => {
            if (e.key === `chat_${player.id}_${COACH_ID}`) {
                loadMessages();
            }
        };
        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
    }, [player.id]);

    // Auto-scroll on new messages
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const send = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;
        sendChatMessage(player.id, COACH_ID, 'coach', input.trim());
        setInput('');
        loadMessages();
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '300px', borderTop: '1px solid var(--border-color)', marginTop: '1rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-color)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0.75rem 0 0.5rem' }}>
                💬 Chat with {player.name}
            </div>
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.65rem', background: 'var(--bg-color)', borderRadius: '10px', padding: '0.75rem', marginBottom: '0.5rem' }}>
                {messages.length === 0 && (
                    <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '1.5rem' }}>
                        No messages yet. Start a conversation! 👋
                    </div>
                )}
                {messages.map(m => (
                    <div key={m.id} style={{ alignSelf: m.sender === 'coach' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                        <div style={{
                            background: m.sender === 'coach' ? 'var(--primary-color)' : 'var(--surface-color-light)',
                            color: m.sender === 'coach' ? '#fff' : 'var(--text-color)',
                            padding: '0.55rem 0.8rem',
                            borderRadius: '12px',
                            borderBottomRightRadius: m.sender === 'coach' ? 0 : '12px',
                            borderBottomLeftRadius: m.sender === 'player' ? 0 : '12px',
                            fontSize: '0.85rem', lineHeight: 1.5,
                        }}>
                            {m.text}
                        </div>
                        <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', marginTop: '2px', textAlign: m.sender === 'coach' ? 'right' : 'left' }}>
                            {m.sender === 'player' ? player.name : 'You'} · {m.time}
                        </div>
                    </div>
                ))}
                <div ref={bottomRef} />
            </div>
            <form onSubmit={send} style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder={`Message ${player.name}...`}
                    style={{ flex: 1, padding: '0.55rem 0.875rem', borderRadius: '999px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-color)', fontSize: '0.875rem' }}
                />
                <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem 1rem', borderRadius: '999px', fontSize: '0.875rem' }}>Send</button>
            </form>
        </div>
    );
}


export default function CoachDashboard() {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<'discover' | 'affiliated'>('discover');
    const [requestedPlayers, setRequestedPlayers] = useState<string[]>([]);
    const [affiliatedPlayers, setAffiliatedPlayers] = useState<PlayerData[]>([]);
    const [openChatId, setOpenChatId] = useState<string | null>(null);

    useEffect(() => {
        setRequestedPlayers(getPendingRequests());
        const confirmedIds = getConfirmedAffiliations();
        setAffiliatedPlayers(mockPlayers.filter(p => confirmedIds.includes(p.id)));
    }, []);

    const affiliatedIds = affiliatedPlayers.map(p => p.id);

    // Discover tab: exclude affiliated players
    const discoverPlayers = mockPlayers.filter(player =>
        !affiliatedIds.includes(player.id) &&
        player.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleRequest = (playerId: string, playerName: string) => {
        addPendingRequest(playerId);
        setRequestedPlayers(prev => [...prev, playerId]);
        alert(`Affiliation request sent to ${playerName}!`);
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', minHeight: 'calc(100vh - 80px)' }}>
            {/* Left Sidebar */}
            <aside style={{ background: 'var(--surface-color)', borderRight: '1px solid var(--border-color)', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column' }}>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--text-muted)' }}>My Athletes</h2>
                {affiliatedPlayers.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No affiliated athletes yet.</p>
                ) : (
                    <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {affiliatedPlayers.map(athlete => (
                            <li key={athlete.id}>
                                <Link
                                    href={`/player/${athlete.id}`}
                                    style={{
                                        display: 'block', padding: '0.75rem',
                                        background: 'var(--bg-color)', borderRadius: '8px',
                                        textDecoration: 'none', color: 'inherit',
                                        border: '1px solid var(--border-color)'
                                    }}
                                >
                                    <div style={{ fontWeight: 600 }}>{athlete.name}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{athlete.sport}</div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </aside>

            {/* Main Content */}
            <main style={{ padding: '2rem', overflowY: 'auto' }}>
                <header className="flex justify-between items-center mb-4">
                    <h1>Coach Dashboard</h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <Link href="/coach/stats" className="btn btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.875rem' }}>
                            📊 Stats Tracker
                        </Link>
                        <div style={{ fontWeight: 600 }}>{mockCoaches[0].name}</div>
                    </div>
                </header>

                {/* Tabs */}
                <div className="flex gap-4 mb-4" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                    <button
                        className="btn"
                        style={{ background: activeTab === 'discover' ? 'var(--surface-color-light)' : 'transparent', color: activeTab === 'discover' ? 'var(--text-color)' : 'var(--text-muted)' }}
                        onClick={() => setActiveTab('discover')}
                    >
                        Discover Athletes
                    </button>
                    <button
                        className="btn"
                        style={{ background: activeTab === 'affiliated' ? 'var(--surface-color-light)' : 'transparent', color: activeTab === 'affiliated' ? 'var(--text-color)' : 'var(--text-muted)' }}
                        onClick={() => setActiveTab('affiliated')}
                    >
                        My Athletes ({affiliatedPlayers.length})
                    </button>
                </div>

                {/* Discover Tab */}
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
                            {discoverPlayers.map(player => {
                                const isRequested = requestedPlayers.includes(player.id);
                                return (
                                    <div key={player.id} className="card flex flex-col justify-between" style={{ padding: '1.5rem' }}>
                                        <div>
                                            <div className="flex justify-between items-start mb-2">
                                                <Link href={`/player/${player.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                    <h3 style={{ fontSize: '1.25rem', margin: 0, cursor: 'pointer' }}>
                                                        {player.name}
                                                    </h3>
                                                </Link>
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

                                        {/* Only show request button if NOT yet requested */}
                                        {!isRequested ? (
                                            <button
                                                className="btn btn-primary"
                                                style={{ width: '100%', padding: '0.75rem' }}
                                                onClick={() => handleRequest(player.id, player.name)}
                                            >
                                                Request Affiliation
                                            </button>
                                        ) : (
                                            <div style={{ textAlign: 'center', padding: '0.75rem', background: 'rgba(16,185,129,0.1)', borderRadius: '8px', color: 'var(--success-color)', fontWeight: 600, fontSize: '0.875rem' }}>
                                                ✓ Request Pending
                                            </div>
                                        )}
                                    </div>
                                );
                            })}

                            {discoverPlayers.length === 0 && (
                                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                                    {affiliatedIds.length > 0 && searchTerm === ''
                                        ? 'All available athletes are already on your team!'
                                        : 'No athletes found matching your search.'}
                                </div>
                            )}
                        </div>
                    </section>
                )}

                {/* My Athletes Tab */}
                {activeTab === 'affiliated' && (
                    <div style={{ padding: '0' }}>
                        {affiliatedPlayers.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                                <p>You have no affiliated athletes yet.</p>
                                <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>Discover athletes to request affiliation and unlock direct messaging and deep analytics.</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                {affiliatedPlayers.map(player => (
                                    <div key={player.id} className="card" style={{ padding: '1.5rem' }}>
                                        {/* Player Card Header */}
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'start', gap: '1rem' }}>
                                            <div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                                                    <div style={{
                                                        width: '44px', height: '44px', borderRadius: '50%',
                                                        background: 'linear-gradient(135deg, var(--primary-color), #ff8c00)',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        fontWeight: 900, color: 'white', fontSize: '1.1rem', flexShrink: 0
                                                    }}>
                                                        {player.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{player.name} <span style={{ color: 'var(--primary-color)' }}>#{player.jerseyNumber}</span></div>
                                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{player.sport} · {player.position} · {player.team}</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <Link href={`/player/${player.id}`} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                                                    View Profile
                                                </Link>
                                                <button
                                                    className="btn btn-primary"
                                                    style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                                                    onClick={() => setOpenChatId(openChatId === player.id ? null : player.id)}
                                                >
                                                    {openChatId === player.id ? 'Close Chat' : '💬 Open Chat'}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Quick Stats Row */}
                                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                                            {[
                                                { label: 'PPG', value: player.stats.ppg },
                                                { label: 'APG', value: player.stats.apg },
                                                { label: 'RPG', value: player.stats.rpg },
                                                { label: 'FG%', value: `${player.stats.fgPercentage}%` },
                                                { label: '+/-', value: player.stats.plusMinus > 0 ? `+${player.stats.plusMinus}` : player.stats.plusMinus },
                                            ].map(s => (
                                                <div key={s.label} style={{ background: 'var(--bg-color)', padding: '0.5rem 0.875rem', borderRadius: '8px', textAlign: 'center', minWidth: '60px' }}>
                                                    <div style={{ fontWeight: 800, fontSize: '1rem' }}>{s.value}</div>
                                                    <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{s.label}</div>
                                                </div>
                                            ))}
                                            <div style={{ background: 'rgba(16,185,129,0.1)', padding: '0.5rem 1rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <span style={{ color: 'var(--success-color)', fontWeight: 700, fontSize: '0.8rem' }}>✓ Affiliated</span>
                                            </div>
                                        </div>

                                        {/* Inline Chat — toggleable */}
                                        {openChatId === player.id && <InlineChat player={player} />}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
