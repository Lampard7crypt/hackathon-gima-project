'use client';

import { use, useState } from 'react';
import { notFound } from 'next/navigation';
import { mockPlayers } from '@/lib/mockData';

interface PageProps {
    params: Promise<{ id: string }>;
}

// ── Sub-components ──────────────────────────────────────────────────────────

function StatKPI({ label, value, sub, trend }: { label: string; value: string | number; sub?: string; trend?: 'up' | 'down' | 'stable' }) {
    const trendIcon = trend === 'up' ? '↑' : trend === 'down' ? '↓' : null;
    const trendColor = trend === 'up' ? 'var(--success-color)' : trend === 'down' ? 'var(--danger-color)' : '';
    return (
        <div style={{ background: 'var(--surface-color-light)', padding: '1.25rem', borderRadius: '12px', textAlign: 'center', position: 'relative' }}>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-color)' }}>
                {value}
                {trendIcon && <span style={{ fontSize: '0.9rem', color: trendColor, marginLeft: '4px' }}>{trendIcon}</span>}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '4px' }}>{label}</div>
            {sub && <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '2px' }}>{sub}</div>}
        </div>
    );
}

function SkillBar({ label, value }: { label: string; value: number }) {
    const color = value >= 8 ? 'var(--success-color)' : value >= 6 ? 'var(--primary-color)' : 'var(--text-muted)';
    return (
        <div style={{ marginBottom: '1rem' }}>
            <div className="flex justify-between" style={{ marginBottom: '6px', fontSize: '0.875rem' }}>
                <span style={{ fontWeight: 600 }}>{label}</span>
                <span style={{ fontWeight: 700, color }}>{value}/10</span>
            </div>
            <div style={{ background: 'var(--bg-color)', borderRadius: '999px', height: '8px', overflow: 'hidden' }}>
                <div style={{ width: `${value * 10}%`, height: '100%', background: color, borderRadius: '999px', transition: 'width 0.6s ease' }} />
            </div>
        </div>
    );
}

function ShotZoneBar({ zone, pct, attempts, isBestZone }: { zone: string; pct: number; attempts: number; isBestZone?: boolean }) {
    const color = pct >= 50 ? 'var(--success-color)' : pct >= 40 ? 'var(--primary-color)' : pct >= 35 ? '#f59e0b' : 'var(--danger-color)';
    return (
        <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr 60px', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                {isBestZone && <span title="Best Zone" style={{ color: '#f59e0b' }}>★</span>}
                {zone}
            </div>
            <div style={{ background: 'var(--bg-color)', borderRadius: '999px', height: '8px', overflow: 'hidden' }}>
                <div style={{ width: `${Math.min(pct, 100)}%`, height: '100%', background: color, borderRadius: '999px' }} />
            </div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color, textAlign: 'right' }}>
                {pct.toFixed(1)}%
            </div>
        </div>
    );
}

// ── Main Page ────────────────────────────────────────────────────────────────

export default function PlayerProfile({ params }: PageProps) {
    const resolvedParams = use(params);
    const player = mockPlayers.find(p => p.id === resolvedParams.id);
    const [gameFilter, setGameFilter] = useState('');

    if (!player) notFound();

    const filteredGames = player.gameHistory.filter(g =>
        g.opponent.toLowerCase().includes(gameFilter.toLowerCase()) ||
        g.competition.toLowerCase().includes(gameFilter.toLowerCase())
    );

    const tierColor = player.developmentTier === 'Elite' ? 'var(--primary-color)' : player.developmentTier === 'Developing' ? '#f59e0b' : 'var(--text-muted)';

    return (
        <main style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto', paddingBottom: '6rem' }}>

            {/* ── Section 1: Profile Overview ── */}
            <div className="card" style={{ marginBottom: '2rem', padding: '2rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr auto', gap: '2rem', alignItems: 'start' }}>
                    {/* Avatar */}
                    <div style={{
                        width: '120px', height: '120px', borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--primary-color), #ff8c00)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '2.5rem', fontWeight: 900, color: 'white', flexShrink: 0
                    }}>
                        {player.name.charAt(0)}
                    </div>

                    {/* Identity */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                            <h1 style={{ fontSize: '2rem', margin: 0 }}>{player.name}</h1>
                            <span style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--primary-color)' }}>#{player.jerseyNumber}</span>
                            <span style={{ background: tierColor, color: 'white', padding: '0.2rem 0.75rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 700 }}>
                                {player.developmentTier}
                            </span>
                        </div>
                        <p style={{ color: 'var(--primary-color)', fontWeight: 700, marginBottom: '0.75rem', fontSize: '1.1rem' }}>
                            {player.sport} · {player.position}
                        </p>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '600px' }}>{player.bio}</p>
                    </div>

                    {/* Role Badge */}
                    <div style={{ textAlign: 'center', background: 'var(--surface-color-light)', padding: '1rem 1.5rem', borderRadius: '12px', flexShrink: 0 }}>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Player Role</div>
                        <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--primary-color)' }}>{player.playerRole}</div>
                    </div>
                </div>

                {/* Identity Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
                    {[
                        { label: 'Team', value: player.team },
                        { label: 'Age', value: `${player.age} yrs` },
                        { label: 'DOB', value: player.dob },
                        { label: 'Height', value: player.height },
                        { label: 'Weight', value: player.weight },
                        { label: 'Strong Hand', value: player.strongHand },
                        { label: 'Years in Program', value: player.yearsInProgram },
                    ].map(item => (
                        <div key={item.label} style={{ background: 'var(--bg-color)', padding: '0.75rem', borderRadius: '8px' }}>
                            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{item.label}</div>
                            <div style={{ fontWeight: 700, marginTop: '2px' }}>{item.value}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Section 2: Performance Snapshot ── */}
            <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>📊 Performance Snapshot</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '1rem' }}>
                    <StatKPI label="PPG" value={player.stats.ppg} trend={player.stats.trend} />
                    <StatKPI label="APG" value={player.stats.apg} />
                    <StatKPI label="RPG" value={player.stats.rpg} />
                    <StatKPI label="FG%" value={`${player.stats.fgPercentage}%`} />
                    <StatKPI label="3PT%" value={`${player.stats.threePointPct}%`} />
                    <StatKPI label="FT%" value={`${player.stats.ftPct}%`} />
                    <StatKPI label="TOV" value={player.stats.turnovers} sub="per game" />
                    <StatKPI label="+/- Rating" value={player.stats.plusMinus > 0 ? `+${player.stats.plusMinus}` : player.stats.plusMinus} trend={player.stats.plusMinus > 0 ? 'up' : 'down'} />
                    <StatKPI label="EFF Rating" value={player.stats.efficiencyRating} />
                    <StatKPI label="MIN" value={player.stats.minutesPerGame} sub="per game" />
                </div>
            </div>

            {/* ── Section 3: Advanced Analytics ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                {/* Offensive */}
                <div className="card">
                    <h3 style={{ margin: '0 0 1.5rem 0', color: 'var(--primary-color)' }}>🧠 Offensive Analytics</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                        {[
                            { l: 'Usage Rate', v: `${player.offensiveAnalytics.usageRate}%` },
                            { l: 'AST/TOV Ratio', v: player.offensiveAnalytics.astToTovRatio },
                            { l: 'Pts/Possession', v: player.offensiveAnalytics.pointsPerPossession },
                            { l: 'Clutch Rating', v: `${player.offensiveAnalytics.clutchRating}/100` },
                        ].map(x => (
                            <div key={x.l} style={{ background: 'var(--bg-color)', padding: '0.85rem', borderRadius: '10px' }}>
                                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{x.l}</div>
                                <div style={{ fontWeight: 800, fontSize: '1.25rem', marginTop: '4px' }}>{x.v}</div>
                            </div>
                        ))}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Points by Shot Type</div>
                    {[
                        { label: 'Catch & Shoot', ppg: player.offensiveAnalytics.catchAndShootPts },
                        { label: 'Pull-Up', ppg: player.offensiveAnalytics.pullUpPts },
                        { label: 'Paint', ppg: player.offensiveAnalytics.paintPts },
                    ].map(s => (
                        <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border-color)', fontSize: '0.875rem' }}>
                            <span>{s.label}</span>
                            <strong>{s.ppg} PPG</strong>
                        </div>
                    ))}
                </div>

                {/* Defensive */}
                <div className="card">
                    <h3 style={{ margin: '0 0 1.5rem 0', color: 'var(--secondary-color)' }}>🛡 Defensive Analytics</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        {[
                            { l: 'Def Rating', v: player.defensiveAnalytics.defRating },
                            { l: 'Steals/PG', v: player.defensiveAnalytics.steals },
                            { l: 'Deflections/PG', v: player.defensiveAnalytics.deflections },
                            { l: 'Rim Contest %', v: `${player.defensiveAnalytics.rimContestPct}%` },
                            { l: 'Opp FG% (Guarded)', v: `${player.defensiveAnalytics.oppFgPctWhenGuarded}%` },
                        ].map(x => (
                            <div key={x.l} style={{ background: 'var(--bg-color)', padding: '0.85rem', borderRadius: '10px' }}>
                                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{x.l}</div>
                                <div style={{ fontWeight: 800, fontSize: '1.25rem', marginTop: '4px' }}>{x.v}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Section 4: Shot Chart / Zone Breakdown ── */}
            <div className="card" style={{ marginBottom: '2rem' }}>
                <h3 style={{ margin: '0 0 1.5rem 0' }}>🎯 Shot Zone Breakdown</h3>
                <p style={{ marginTop: '-1rem', marginBottom: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    ★ = Best Scoring Zone (auto-detected)
                </p>
                {player.offensiveAnalytics.shotZones.map(zone => (
                    <ShotZoneBar key={zone.zone} zone={zone.zone} pct={zone.pct} attempts={zone.attempts} isBestZone={zone.isBestZone} />
                ))}
            </div>

            {/* ── Section 5: Game Log ── */}
            <div className="card" style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <h3 style={{ margin: 0 }}>📋 Game Log</h3>
                    <input
                        placeholder="Filter by opponent or competition..."
                        value={gameFilter}
                        onChange={e => setGameFilter(e.target.value)}
                        style={{ padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-color)', fontSize: '0.875rem', width: '240px' }}
                    />
                </div>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', whiteSpace: 'nowrap' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid var(--border-color)', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                                <th style={{ padding: '0.75rem 1rem' }}>Date</th>
                                <th style={{ padding: '0.75rem 1rem' }}>Opponent</th>
                                <th style={{ padding: '0.75rem 1rem' }}>Comp.</th>
                                <th style={{ padding: '0.75rem 1rem' }}>Result</th>
                                <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>PTS</th>
                                <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>AST</th>
                                <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>REB</th>
                                <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>FG%</th>
                                <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>+/-</th>
                                <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>MIN</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredGames.map(game => (
                                <tr key={game.id} style={{ borderBottom: '1px solid var(--border-color)', fontSize: '0.875rem' }}>
                                    <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>{game.date}</td>
                                    <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>{game.opponent}</td>
                                    <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>{game.competition}</td>
                                    <td style={{ padding: '0.75rem 1rem' }}>
                                        <span style={{
                                            padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem',
                                            background: game.result.startsWith('W') ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                                            color: game.result.startsWith('W') ? 'var(--success-color)' : 'var(--danger-color)',
                                        }}>{game.result}</span>
                                    </td>
                                    <td style={{ padding: '0.75rem 1rem', textAlign: 'right', fontWeight: 700 }}>{game.points}</td>
                                    <td style={{ padding: '0.75rem 1rem', textAlign: 'right', fontWeight: 700 }}>{game.assists}</td>
                                    <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>{game.rebounds}</td>
                                    <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>{game.fgPct}%</td>
                                    <td style={{ padding: '0.75rem 1rem', textAlign: 'right', fontWeight: 700, color: game.plusMinus >= 0 ? 'var(--success-color)' : 'var(--danger-color)' }}>
                                        {game.plusMinus > 0 ? `+${game.plusMinus}` : game.plusMinus}
                                    </td>
                                    <td style={{ padding: '0.75rem 1rem', textAlign: 'right', color: 'var(--text-muted)' }}>{game.minutes}</td>
                                </tr>
                            ))}
                            {filteredGames.length === 0 && (
                                <tr><td colSpan={10} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No games match your filter.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── Section 6: Development & Skill Ratings ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                <div className="card">
                    <h3 style={{ margin: '0 0 1.5rem 0' }}>📈 Skill Ratings</h3>
                    <SkillBar label="Shooting" value={player.skillRatings.shooting} />
                    <SkillBar label="Defense" value={player.skillRatings.defense} />
                    <SkillBar label="Court IQ" value={player.skillRatings.courtIQ} />
                    <SkillBar label="Athleticism" value={player.skillRatings.athleticism} />
                    <SkillBar label="Ball Handling" value={player.skillRatings.ballHandling} />
                </div>

                <div className="card">
                    <h3 style={{ margin: '0 0 1.5rem 0' }}>⚠️ Weakness Detection</h3>
                    {player.weaknesses.map((w, i) => (
                        <div key={i} style={{
                            display: 'flex', gap: '0.75rem', padding: '0.875rem',
                            background: 'rgba(239,68,68,0.08)', borderRadius: '10px',
                            marginBottom: '0.75rem', borderLeft: '3px solid var(--danger-color)',
                        }}>
                            <span style={{ color: 'var(--danger-color)', fontWeight: 700, flexShrink: 0 }}>!</span>
                            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{w}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Section 7: Physical & Health Data ── */}
            <div className="card" style={{ marginBottom: '2rem' }}>
                <h3 style={{ margin: '0 0 1.5rem 0' }}>🏃 Physical & Health Data</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                    <StatKPI label="Sprint Speed" value={`${player.physicalData.sprintSpeed} km/h`} />
                    <StatKPI label="Fatigue Index" value={`${player.physicalData.fatigueIndex}/100`} trend={player.physicalData.fatigueIndex > 75 ? 'down' : 'stable'} />
                    <StatKPI label="Training Attendance" value={`${player.physicalData.trainingAttendance}%`} trend={player.physicalData.trainingAttendance >= 90 ? 'up' : 'stable'} />
                    <StatKPI label="Workload" value={player.physicalData.workload} />
                </div>
                {player.injuryHistory.length > 0 && (
                    <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
                        <h4 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Injury History</h4>
                        {player.injuryHistory.map(inj => (
                            <div key={inj.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'var(--bg-color)', borderRadius: '8px', marginBottom: '0.5rem' }}>
                                <div>
                                    <strong style={{ fontSize: '0.9rem' }}>{inj.type}</strong>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{inj.date} · Recovery: {inj.recoveryTime}</div>
                                </div>
                                <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: '999px', background: inj.status === 'Cleared' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)', color: inj.status === 'Cleared' ? 'var(--success-color)' : 'var(--danger-color)', fontWeight: 700 }}>
                                    {inj.status}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ── Section 8: Tactical Fit ── */}
            <div className="card">
                <h3 style={{ margin: '0 0 1.5rem 0' }}>♟ Tactical Fit</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Best Lineup Combinations</div>
                        {player.tacticalData.bestLineups.map((l, i) => (
                            <div key={i} style={{ padding: '0.5rem 0.75rem', background: 'var(--bg-color)', borderRadius: '8px', marginBottom: '0.5rem', fontSize: '0.875rem' }}>👥 {l}</div>
                        ))}
                    </div>
                    <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Best Play Types</div>
                        {player.tacticalData.bestPlayTypes.map((p, i) => (
                            <div key={i} style={{ padding: '0.5rem 0.75rem', background: 'var(--bg-color)', borderRadius: '8px', marginBottom: '0.5rem', fontSize: '0.875rem' }}>🏀 {p}</div>
                        ))}
                    </div>
                </div>
                <div style={{ marginTop: '1.5rem', padding: '1.25rem', background: 'rgba(255,69,0,0.07)', borderRadius: '12px', borderLeft: '4px solid var(--primary-color)' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--primary-color)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                        🤖 AI Recommended Role: {player.tacticalData.recommendedRole}
                    </div>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>{player.tacticalData.aiInsight}</p>
                </div>
            </div>
        </main>
    );
}
