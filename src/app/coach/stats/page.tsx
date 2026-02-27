'use client';

import { useState, useEffect } from 'react';
import { mockPlayers, getConfirmedAffiliations, PlayerData } from '@/lib/mockData';
import Link from 'next/link';

// ─── Types ───────────────────────────────────────────────────────────────────

interface ShotRecord {
    zone: string;
    made: boolean;
    timestamp: number;
}

interface LiveStats {
    pts: number;
    ast: number;
    reb: number;
    stl: number;
    blk: number;
    tov: number;
    fgm: number;
    fga: number;
    tpm: number;
    tpa: number;
    ftm: number;
    fta: number;
    plusMinus: number;
    minutes: number;
    fouls: number;
}

interface SavedGame {
    id: string;
    playerId: string;
    playerName: string;
    opponent: string;
    date: string;
    competition: string;
    stats: LiveStats;
    shots: ShotRecord[];
}

const defaultStats = (): LiveStats => ({
    pts: 0, ast: 0, reb: 0, stl: 0, blk: 0, tov: 0,
    fgm: 0, fga: 0, tpm: 0, tpa: 0, ftm: 0, fta: 0,
    plusMinus: 0, minutes: 0, fouls: 0,
});

// ─── Shot zones (SVG positions for a half-court view) ───────────────────────

const SHOT_ZONES = [
    { id: 'paint', label: 'Paint', x: 185, y: 175, w: 90, h: 110 },
    { id: 'left_c3', label: 'Left Corner', x: 20, y: 210, w: 55, h: 75 },
    { id: 'right_c3', label: 'Right Corner', x: 385, y: 210, w: 55, h: 75 },
    { id: 'left_wing', label: 'Left Wing', x: 60, y: 130, w: 80, h: 75 },
    { id: 'right_wing', label: 'Right Wing', x: 320, y: 130, w: 80, h: 75 },
    { id: 'left_elbow', label: 'Left Elbow', x: 100, y: 175, w: 80, h: 75 },
    { id: 'right_elbow', label: 'Right Elbow', x: 280, y: 175, w: 80, h: 75 },
    { id: 'top_key', label: 'Top of Key', x: 165, y: 75, w: 130, h: 75 },
    { id: 'mid_range', label: 'Mid Range', x: 140, y: 140, w: 180, h: 60 },
];

// ─── Storage helpers ─────────────────────────────────────────────────────────

const STORAGE_KEY = 'gimaGameLog';

const getSavedGames = (): SavedGame[] => {
    if (typeof window === 'undefined') return [];
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
};

const saveGame = (game: SavedGame) => {
    const games = getSavedGames();
    const idx = games.findIndex(g => g.id === game.id);
    if (idx >= 0) games[idx] = game;
    else games.unshift(game);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(games));
};

// ─── Sub-components ──────────────────────────────────────────────────────────

function StatCounter({ label, value, color, onInc, onDec }: {
    label: string; value: number; color?: string; onInc: () => void; onDec: () => void;
}) {
    return (
        <div style={{ background: 'var(--surface-color-light)', borderRadius: '12px', padding: '1rem', textAlign: 'center', minWidth: '90px' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>{label}</div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: color || 'var(--text-color)', lineHeight: 1, marginBottom: '8px' }}>{value}</div>
            <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                <button onClick={onDec} style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                <button onClick={onInc} style={{ width: '32px', height: '32px', borderRadius: '50%', border: 'none', background: 'var(--primary-color)', color: 'white', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
            </div>
        </div>
    );
}

function ShotChart({ shots, onShot }: { shots: ShotRecord[]; onShot: (zone: string, made: boolean) => void }) {
    const [pendingZone, setPendingZone] = useState<string | null>(null);

    const zoneStats = (zoneId: string) => {
        const zoneShots = shots.filter(s => s.zone === zoneId);
        const makes = zoneShots.filter(s => s.made).length;
        return { attempts: zoneShots.length, makes, pct: zoneShots.length ? Math.round(makes / zoneShots.length * 100) : null };
    };

    const heatColor = (pct: number | null, attempts: number) => {
        if (attempts === 0) return 'rgba(255,255,255,0.05)';
        if (pct === null) return 'rgba(255,255,255,0.05)';
        if (pct >= 60) return 'rgba(16,185,129,0.35)';
        if (pct >= 40) return 'rgba(245,158,11,0.35)';
        return 'rgba(239,68,68,0.35)';
    };

    return (
        <div>
            <svg viewBox="0 0 460 330" style={{ width: '100%', maxWidth: '500px', display: 'block', margin: '0 auto' }}>
                {/* Court background */}
                <rect x="0" y="0" width="460" height="320" rx="8" fill="#1a1a1a" />

                {/* Baseline */}
                <line x1="10" y1="310" x2="450" y2="310" stroke="#444" strokeWidth="2" />
                <line x1="10" y1="10" x2="10" y2="310" stroke="#444" strokeWidth="2" />
                <line x1="450" y1="10" x2="450" y2="310" stroke="#444" strokeWidth="2" />

                {/* Paint (key) */}
                <rect x="163" y="170" width="134" height="140" fill="none" stroke="#555" strokeWidth="1.5" />
                <rect x="190" y="170" width="80" height="60" fill="none" stroke="#555" strokeWidth="1" />

                {/* Restricted area (small arc) */}
                <path d="M 185 310 A 25 25 0 0 1 275 310" fill="none" stroke="#555" strokeWidth="1.5" />

                {/* Backboard + Rim */}
                <rect x="205" y="163" width="50" height="4" fill="#888" />
                <circle cx="230" cy="180" r="12" fill="none" stroke="#e05200" strokeWidth="2.5" />

                {/* Free throw circle */}
                <circle cx="230" cy="170" r="40" fill="none" stroke="#555" strokeWidth="1" strokeDasharray="5,5" />

                {/* 3-point arc */}
                <path d="M 30 310 A 210 210 0 0 1 430 310" fill="none" stroke="#4a6fa5" strokeWidth="2" />
                <line x1="30" y1="240" x2="30" y2="310" stroke="#4a6fa5" strokeWidth="2" />
                <line x1="430" y1="240" x2="430" y2="310" stroke="#4a6fa5" strokeWidth="2" />

                {/* Center court label */}
                <text x="230" y="25" textAnchor="middle" fill="#555" fontSize="11">HALF COURT</text>
                <line x1="10" y1="18" x2="450" y2="18" stroke="#555" strokeWidth="1" strokeDasharray="4,4" />

                {/* Shot zone overlays */}
                {SHOT_ZONES.map(zone => {
                    const { attempts, makes, pct } = zoneStats(zone.id);
                    const isPending = pendingZone === zone.id;
                    return (
                        <g key={zone.id} onClick={() => setPendingZone(isPending ? null : zone.id)} style={{ cursor: 'pointer' }}>
                            <rect
                                x={zone.x} y={zone.y} width={zone.w} height={zone.h}
                                rx="6"
                                fill={isPending ? 'rgba(255,69,0,0.4)' : heatColor(pct, attempts)}
                                stroke={isPending ? 'var(--primary-color)' : attempts > 0 ? '#888' : '#333'}
                                strokeWidth={isPending ? 2 : 1}
                                strokeDasharray={isPending ? '0' : attempts === 0 ? '4,3' : '0'}
                            />
                            {/* Zone label */}
                            <text x={zone.x + zone.w / 2} y={zone.y + zone.h / 2 - (attempts > 0 ? 10 : 0)} textAnchor="middle" fill={attempts > 0 ? 'white' : '#777'} fontSize="9" fontWeight="600">
                                {zone.label}
                            </text>
                            {/* Attempt/pct overlay */}
                            {attempts > 0 && (
                                <>
                                    <text x={zone.x + zone.w / 2} y={zone.y + zone.h / 2 + 4} textAnchor="middle" fill="white" fontSize="11" fontWeight="800">
                                        {makes}/{attempts}
                                    </text>
                                    <text x={zone.x + zone.w / 2} y={zone.y + zone.h / 2 + 15} textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="9">
                                        {pct}%
                                    </text>
                                </>
                            )}
                        </g>
                    );
                })}

                {/* Shot dots */}
                {shots.map((shot, i) => {
                    const zone = SHOT_ZONES.find(z => z.id === shot.zone);
                    if (!zone) return null;
                    const x = zone.x + (i % 5) * 8 + 4;
                    const y = zone.y + zone.h - 10;
                    return (
                        <circle key={i} cx={x} cy={y} r="3.5" fill={shot.made ? '#10b981' : '#ef4444'} opacity="0.9" />
                    );
                })}
            </svg>

            {/* Zone selection buttons */}
            {pendingZone && (
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginTop: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ width: '100%', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                        Recording shot from: <strong style={{ color: 'var(--primary-color)' }}>{SHOT_ZONES.find(z => z.id === pendingZone)?.label}</strong>
                    </div>
                    <button
                        onClick={() => { onShot(pendingZone, true); setPendingZone(null); }}
                        style={{ padding: '0.75rem 2rem', borderRadius: '999px', border: 'none', background: '#10b981', color: 'white', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}
                    >
                        ✅ Made
                    </button>
                    <button
                        onClick={() => { onShot(pendingZone, false); setPendingZone(null); }}
                        style={{ padding: '0.75rem 2rem', borderRadius: '999px', border: 'none', background: '#ef4444', color: 'white', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}
                    >
                        ❌ Missed
                    </button>
                    <button
                        onClick={() => setPendingZone(null)}
                        style={{ padding: '0.75rem 1.5rem', borderRadius: '999px', border: '1px solid var(--border-color)', background: 'transparent', color: 'var(--text-muted)', fontWeight: 600, cursor: 'pointer' }}
                    >
                        Cancel
                    </button>
                </div>
            )}

            {!pendingZone && (
                <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
                    👆 Tap a court zone to record a shot
                </p>
            )}

            {/* Shot legend */}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                <span>🟢 Made &nbsp;|&nbsp; 🔴 Missed</span>
                <span style={{ color: '#10b981' }}>■ Hot (≥60%)</span>
                <span style={{ color: '#f59e0b' }}>■ Avg (40–59%)</span>
                <span style={{ color: '#ef4444' }}>■ Cold (&lt;40%)</span>
            </div>
        </div>
    );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function StatsTracker() {
    const [affiliatedPlayers, setAffiliatedPlayers] = useState<PlayerData[]>([]);
    const [selectedPlayer, setSelectedPlayer] = useState<PlayerData | null>(null);
    const [gameInfo, setGameInfo] = useState({ opponent: '', competition: '', date: new Date().toISOString().slice(0, 10) });
    const [stats, setStats] = useState<LiveStats>(defaultStats());
    const [shots, setShots] = useState<ShotRecord[]>([]);
    const [savedGames, setSavedGames] = useState<SavedGame[]>([]);
    const [view, setView] = useState<'tracker' | 'history'>('tracker');
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const ids = getConfirmedAffiliations();
        setAffiliatedPlayers(mockPlayers.filter(p => ids.includes(p.id)));
        setSavedGames(getSavedGames());
    }, []);

    const inc = (key: keyof LiveStats, by = 1) =>
        setStats(s => ({ ...s, [key]: Math.max(0, s[key] + by) }));

    const dec = (key: keyof LiveStats) =>
        setStats(s => ({ ...s, [key]: Math.max(0, s[key] - 1) }));

    const handleShot = (zone: string, made: boolean) => {
        const shot: ShotRecord = { zone, made, timestamp: Date.now() };
        setShots(prev => [...prev, shot]);
        // Auto-update FG stats
        setStats(s => ({
            ...s,
            fga: s.fga + 1,
            fgm: made ? s.fgm + 1 : s.fgm,
            pts: made ? s.pts + 2 : s.pts,
        }));
    };

    const handleThreePoint = (made: boolean) => {
        setShots(prev => [...prev, { zone: 'top_key', made, timestamp: Date.now() }]);
        setStats(s => ({
            ...s,
            tpa: s.tpa + 1,
            tpm: made ? s.tpm + 1 : s.tpm,
            fga: s.fga + 1,
            fgm: made ? s.fgm + 1 : s.fgm,
            pts: made ? s.pts + 3 : s.pts,
        }));
    };

    const fgPct = stats.fga > 0 ? ((stats.fgm / stats.fga) * 100).toFixed(1) : '—';
    const tpPct = stats.tpa > 0 ? ((stats.tpm / stats.tpa) * 100).toFixed(1) : '—';
    const ftPct = stats.fta > 0 ? ((stats.ftm / stats.fta) * 100).toFixed(1) : '—';

    const handleSave = () => {
        if (!selectedPlayer || !gameInfo.opponent) return;
        const game: SavedGame = {
            id: `${selectedPlayer.id}_${Date.now()}`,
            playerId: selectedPlayer.id,
            playerName: selectedPlayer.name,
            opponent: gameInfo.opponent,
            competition: gameInfo.competition,
            date: gameInfo.date,
            stats, shots,
        };
        saveGame(game);
        setSavedGames(getSavedGames());
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    const clearSession = () => {
        setStats(defaultStats());
        setShots([]);
        setSelectedPlayer(null);
    };

    return (
        <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem', paddingBottom: '6rem' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.75rem', margin: 0 }}>📊 Stats Tracker</h1>
                    <p style={{ color: 'var(--text-muted)', marginTop: '4px', fontSize: '0.9rem' }}>Record live game stats and shot locations for your athletes.</p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button onClick={() => setView('tracker')} className={`btn ${view === 'tracker' ? 'btn-primary' : 'btn-secondary'}`} style={{ padding: '0.5rem 1.25rem' }}>
                        📝 Tracker
                    </button>
                    <button onClick={() => setView('history')} className={`btn ${view === 'history' ? 'btn-primary' : 'btn-secondary'}`} style={{ padding: '0.5rem 1.25rem' }}>
                        📋 Game History ({savedGames.length})
                    </button>
                    <Link href="/coach/dashboard" className="btn btn-secondary" style={{ padding: '0.5rem 1.25rem' }}>
                        ← Dashboard
                    </Link>
                </div>
            </div>

            {/* No affiliated players warning */}
            {affiliatedPlayers.length === 0 && (
                <div style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid #f59e0b', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem', textAlign: 'center' }}>
                    <p style={{ color: '#f59e0b', fontWeight: 600 }}>⚠️ No affiliated players found.</p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.5rem' }}>Go to your <Link href="/coach/dashboard" style={{ color: 'var(--primary-color)' }}>Coach Dashboard</Link> and affiliate with players first.</p>
                </div>
            )}

            {view === 'tracker' && (
                <>
                    {/* Game Setup */}
                    <div className="card" style={{ marginBottom: '1.5rem' }}>
                        <h3 style={{ marginBottom: '1.25rem', fontSize: '1rem' }}>Game Setup</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                            <div>
                                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Player</label>
                                <select
                                    value={selectedPlayer?.id || ''}
                                    onChange={e => setSelectedPlayer(affiliatedPlayers.find(p => p.id === e.target.value) || null)}
                                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-color)' }}
                                >
                                    <option value="">Select player…</option>
                                    {affiliatedPlayers.map(p => <option key={p.id} value={p.id}>{p.name} #{p.jerseyNumber}</option>)}
                                </select>
                            </div>
                            <div>
                                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Opponent</label>
                                <input placeholder="e.g. City Hawks" value={gameInfo.opponent} onChange={e => setGameInfo(g => ({ ...g, opponent: e.target.value }))}
                                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-color)' }} />
                            </div>
                            <div>
                                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Competition</label>
                                <input placeholder="e.g. State League" value={gameInfo.competition} onChange={e => setGameInfo(g => ({ ...g, competition: e.target.value }))}
                                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-color)' }} />
                            </div>
                            <div>
                                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Date</label>
                                <input type="date" value={gameInfo.date} onChange={e => setGameInfo(g => ({ ...g, date: e.target.value }))}
                                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-color)' }} />
                            </div>
                        </div>

                        {/* Player preview bar */}
                        {selectedPlayer && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)' }}>
                                <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary-color), #c0392b)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: 'white', fontSize: '1.1rem' }}>
                                    {selectedPlayer.name[0]}
                                </div>
                                <div>
                                    <div style={{ fontWeight: 700 }}>{selectedPlayer.name} <span style={{ color: 'var(--primary-color)' }}>#{selectedPlayer.jerseyNumber}</span></div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{selectedPlayer.position} · {selectedPlayer.team}</div>
                                </div>
                                <div style={{ marginLeft: 'auto', display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                    <span>Season PPG: <strong style={{ color: 'var(--text-color)' }}>{selectedPlayer.stats.ppg}</strong></span>
                                    <span>APG: <strong style={{ color: 'var(--text-color)' }}>{selectedPlayer.stats.apg}</strong></span>
                                    <span>FG%: <strong style={{ color: 'var(--text-color)' }}>{selectedPlayer.stats.fgPercentage}%</strong></span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Live Score Summary */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
                        {[
                            { label: 'PTS', value: stats.pts, color: 'var(--primary-color)' },
                            { label: 'FG', value: `${stats.fgm}/${stats.fga}`, color: 'var(--text-color)' },
                            { label: 'FG%', value: fgPct + (fgPct !== '—' ? '%' : ''), color: 'var(--success-color)' },
                            { label: '3P%', value: tpPct + (tpPct !== '—' ? '%' : ''), color: '#f59e0b' },
                            { label: 'FT%', value: ftPct + (ftPct !== '—' ? '%' : ''), color: 'var(--secondary-color)' },
                        ].map(s => (
                            <div key={s.label} style={{ background: 'var(--surface-color)', borderRadius: '10px', padding: '0.875rem', textAlign: 'center' }}>
                                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: s.color }}>{s.value}</div>
                                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Main two-column layout */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                        {/* Shot Chart */}
                        <div className="card">
                            <h3 style={{ marginBottom: '1.25rem', fontSize: '1rem' }}>🎯 Shot Chart</h3>
                            <ShotChart shots={shots} onShot={handleShot} />

                            {/* Quick 3PT / FT buttons */}
                            <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)' }}>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>Quick Actions</div>
                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                    <button onClick={() => handleThreePoint(true)} style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', background: 'rgba(16,185,129,0.15)', color: '#10b981', fontWeight: 700, cursor: 'pointer', fontSize: '0.8rem' }}>✅ 3PT Made</button>
                                    <button onClick={() => handleThreePoint(false)} style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', background: 'rgba(239,68,68,0.15)', color: '#ef4444', fontWeight: 700, cursor: 'pointer', fontSize: '0.8rem' }}>❌ 3PT Miss</button>
                                    <button onClick={() => { setStats(s => ({ ...s, ftm: s.ftm + 1, fta: s.fta + 1, pts: s.pts + 1 })); }} style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', background: 'rgba(16,185,129,0.15)', color: '#10b981', fontWeight: 700, cursor: 'pointer', fontSize: '0.8rem' }}>✅ FT Made</button>
                                    <button onClick={() => { setStats(s => ({ ...s, fta: s.fta + 1 })); }} style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', background: 'rgba(239,68,68,0.15)', color: '#ef4444', fontWeight: 700, cursor: 'pointer', fontSize: '0.8rem' }}>❌ FT Miss</button>
                                </div>

                                {shots.length > 0 && (
                                    <button onClick={() => setShots(s => s.slice(0, -1))} style={{ marginTop: '0.5rem', padding: '0.4rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.75rem' }}>
                                        ↩ Undo last shot
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Stat Counters */}
                        <div className="card">
                            <h3 style={{ marginBottom: '1.25rem', fontSize: '1rem' }}>📈 Live Box Score</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                                <StatCounter label="Points" value={stats.pts} color="var(--primary-color)" onInc={() => inc('pts', 2)} onDec={() => dec('pts')} />
                                <StatCounter label="Assists" value={stats.ast} color="var(--secondary-color)" onInc={() => inc('ast')} onDec={() => dec('ast')} />
                                <StatCounter label="Rebounds" value={stats.reb} onInc={() => inc('reb')} onDec={() => dec('reb')} />
                                <StatCounter label="Steals" value={stats.stl} color="var(--success-color)" onInc={() => inc('stl')} onDec={() => dec('stl')} />
                                <StatCounter label="Blocks" value={stats.blk} color="var(--success-color)" onInc={() => inc('blk')} onDec={() => dec('blk')} />
                                <StatCounter label="Turnovers" value={stats.tov} color="var(--danger-color)" onInc={() => inc('tov')} onDec={() => dec('tov')} />
                                <StatCounter label="Fouls" value={stats.fouls} color="#f59e0b" onInc={() => inc('fouls')} onDec={() => dec('fouls')} />
                                <StatCounter label="+/-" value={stats.plusMinus} color={stats.plusMinus >= 0 ? 'var(--success-color)' : 'var(--danger-color)'} onInc={() => inc('plusMinus')} onDec={() => inc('plusMinus', -1)} />
                                <StatCounter label="Minutes" value={stats.minutes} onInc={() => inc('minutes')} onDec={() => dec('minutes')} />
                            </div>
                        </div>
                    </div>

                    {/* Save / Reset */}
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                        <button onClick={clearSession} className="btn btn-secondary" style={{ padding: '0.75rem 1.5rem' }}>
                            🗑 Clear Session
                        </button>
                        <button
                            onClick={handleSave}
                            className="btn btn-primary"
                            style={{ padding: '0.75rem 2rem', fontSize: '1rem', opacity: (!selectedPlayer || !gameInfo.opponent) ? 0.6 : 1 }}
                            disabled={!selectedPlayer || !gameInfo.opponent}
                        >
                            {saved ? '✅ Saved to Log!' : '💾 Save Game Stats'}
                        </button>
                    </div>
                </>
            )}

            {/* History Tab */}
            {view === 'history' && (
                <div>
                    <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Game Log History</h2>
                    {savedGames.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
                            <p>No games saved yet. Use the Tracker to record your first game!</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {savedGames.map(game => (
                                <div key={game.id} className="card" style={{ padding: '1.5rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                                        <div>
                                            <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{game.playerName} <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: '0.9rem' }}>vs {game.opponent}</span></div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>{game.competition} · {game.date}</div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--primary-color)', lineHeight: 1 }}>{game.stats.pts} PTS</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{game.shots.filter(s => s.made).length}/{game.shots.length} shots made</div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                                        {[
                                            ['AST', game.stats.ast], ['REB', game.stats.reb],
                                            ['STL', game.stats.stl], ['BLK', game.stats.blk],
                                            ['TOV', game.stats.tov], ['MIN', game.stats.minutes],
                                            ['FG%', game.stats.fga > 0 ? (game.stats.fgm / game.stats.fga * 100).toFixed(0) + '%' : '—'],
                                            ['+/-', game.stats.plusMinus > 0 ? `+${game.stats.plusMinus}` : game.stats.plusMinus],
                                        ].map(([l, v]) => (
                                            <div key={String(l)} style={{ background: 'var(--bg-color)', padding: '0.5rem 0.75rem', borderRadius: '8px', textAlign: 'center', minWidth: '56px' }}>
                                                <div style={{ fontWeight: 700, fontSize: '1rem' }}>{v}</div>
                                                <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{l}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </main>
    );
}
