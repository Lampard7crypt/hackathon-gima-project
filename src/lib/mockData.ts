// ── Interfaces ──────────────────────────────────────────────────────────────

export interface PlayerStats {
    ppg: number;
    apg: number;
    rpg: number;
    fgPercentage: number;
    threePointPct: number;
    ftPct: number;
    turnovers: number;
    plusMinus: number;
    efficiencyRating: number;
    minutesPerGame: number;
    trend: 'up' | 'down' | 'stable'; // Last 5 games form
}

export interface PlayerInjury {
    id: number;
    type: string;
    date: string;
    recoveryTime: string;
    status: string;
}

export interface PlayerGame {
    id: number;
    opponent: string;
    competition: string;
    date: string;
    result: string;
    points: number;
    assists: number;
    rebounds: number;
    fgPct: number;
    plusMinus: number;
    minutes: number;
}

export interface ShotZone {
    zone: string;
    attempts: number;
    makes: number;
    pct: number;
    isBestZone?: boolean;
}

export interface OffensiveAnalytics {
    shotZones: ShotZone[];
    catchAndShootPts: number;
    pullUpPts: number;
    paintPts: number;
    usageRate: number;
    astToTovRatio: number;
    pointsPerPossession: number;
    clutchRating: number; // Performance in last 5 mins of close games
}

export interface DefensiveAnalytics {
    defRating: number;
    steals: number;
    deflections: number;
    rimContestPct: number;
    oppFgPctWhenGuarded: number;
}

export interface SkillRatings {
    shooting: number; // out of 10
    defense: number;
    courtIQ: number;
    athleticism: number;
    ballHandling: number;
}

export interface PhysicalData {
    sprintSpeed: number; // km/h
    fatigueIndex: number; // out of 100
    trainingAttendance: number; // percentage
    workload: 'High' | 'Medium' | 'Low';
}

export interface TacticalData {
    bestLineups: string[];
    bestPlayTypes: string[];
    bestPosition: string;
    recommendedRole: string;
    aiInsight: string;
}

export interface PlayerData {
    id: string;
    name: string;
    sport: string;
    position: string;
    jerseyNumber: number;
    age: number;
    dob: string;
    height: string;
    weight: string;
    team: string;
    yearsInProgram: number;
    strongHand: 'Left' | 'Right';
    playerRole: 'Shooter' | 'Playmaker' | 'Defender' | 'Rim Protector';
    developmentTier: 'Elite' | 'Developing' | 'Beginner';
    bio: string;
    avatarUrl?: string;
    stats: PlayerStats;
    offensiveAnalytics: OffensiveAnalytics;
    defensiveAnalytics: DefensiveAnalytics;
    skillRatings: SkillRatings;
    physicalData: PhysicalData;
    tacticalData: TacticalData;
    weaknesses: string[];
    injuryHistory: PlayerInjury[];
    gameHistory: PlayerGame[];
}

// ── Mock Data ────────────────────────────────────────────────────────────────

export const mockPlayer: PlayerData = {
    id: 'p1',
    name: 'Alex Mercer',
    sport: 'Wheelchair Basketball',
    position: 'Point Guard',
    jerseyNumber: 7,
    age: 22,
    dob: '2002-03-14',
    height: '5\'11"',
    weight: '78 kg',
    team: 'Metro Rollers',
    yearsInProgram: 5,
    strongHand: 'Right',
    playerRole: 'Playmaker',
    developmentTier: 'Elite',
    bio: 'Paralympic hopeful. 5 years of competitive experience with a natural ability to read the game. Known for elite court vision and clutch performances.',
    stats: {
        ppg: 18.5,
        apg: 8.2,
        rpg: 4.1,
        fgPercentage: 45.2,
        threePointPct: 36.8,
        ftPct: 82.0,
        turnovers: 2.1,
        plusMinus: +12.4,
        efficiencyRating: 24.7,
        minutesPerGame: 32,
        trend: 'up',
    },
    offensiveAnalytics: {
        shotZones: [
            { zone: 'Paint', attempts: 120, makes: 72, pct: 60.0, isBestZone: true },
            { zone: 'Mid-Range', attempts: 85, makes: 38, pct: 44.7 },
            { zone: 'Left Wing 3', attempts: 60, makes: 19, pct: 31.7 },
            { zone: 'Right Wing 3', attempts: 72, makes: 30, pct: 41.7, isBestZone: true },
            { zone: 'Top of Arc', attempts: 48, makes: 18, pct: 37.5 },
            { zone: 'Left Corner 3', attempts: 22, makes: 5, pct: 22.7 },
            { zone: 'Right Corner 3', attempts: 30, makes: 14, pct: 46.7 },
        ],
        catchAndShootPts: 8.2,
        pullUpPts: 5.1,
        paintPts: 5.2,
        usageRate: 28.4,
        astToTovRatio: 3.9,
        pointsPerPossession: 1.14,
        clutchRating: 78,
    },
    defensiveAnalytics: {
        defRating: 102.1,
        steals: 1.8,
        deflections: 3.2,
        rimContestPct: 64.0,
        oppFgPctWhenGuarded: 38.5,
    },
    skillRatings: { shooting: 8, defense: 7, courtIQ: 9, athleticism: 8, ballHandling: 9 },
    physicalData: {
        sprintSpeed: 22.5,
        fatigueIndex: 72,
        trainingAttendance: 96,
        workload: 'High',
    },
    tacticalData: {
        bestLineups: ['Alex + Marcus (pick-and-roll)', 'Alex + Sarah (transition offense)'],
        bestPlayTypes: ['Pick & Roll', 'Transition', 'ISO Late Clock'],
        bestPosition: 'Point Guard',
        recommendedRole: 'Lead Initiator',
        aiInsight: 'Performs best in high pick-and-roll offense. Struggles against full-court press — recommend dedicated press-break drills.',
    },
    weaknesses: [
        'Low 3PT efficiency from left wing (31.7%)',
        'Turnover rate increases under full-court pressure',
        'Needs improvement in off-ball movement without possession',
    ],
    injuryHistory: [
        { id: 1, type: 'Shoulder Strain', date: '2023-10-15', recoveryTime: '3 weeks', status: 'Cleared' },
        { id: 2, type: 'Wrist Sprain', date: '2022-04-10', recoveryTime: '2 weeks', status: 'Cleared' }
    ],
    gameHistory: [
        { id: 1, opponent: 'City Hawks', competition: 'State League', date: '2023-11-20', result: 'W 78-72', points: 22, assists: 10, rebounds: 5, fgPct: 52, plusMinus: +14, minutes: 34 },
        { id: 2, opponent: 'Westside Kings', competition: 'State League', date: '2023-11-15', result: 'L 65-70', points: 15, assists: 6, rebounds: 3, fgPct: 38, plusMinus: -5, minutes: 30 },
        { id: 3, opponent: 'North Stars', competition: 'State League', date: '2023-11-10', result: 'W 82-60', points: 18, assists: 8, rebounds: 4, fgPct: 48, plusMinus: +22, minutes: 31 },
        { id: 4, opponent: 'Eastside Bulls', competition: 'Cup', date: '2023-11-05', result: 'W 91-80', points: 25, assists: 9, rebounds: 6, fgPct: 55, plusMinus: +11, minutes: 35 },
        { id: 5, opponent: 'Raiders', competition: 'State League', date: '2023-10-30', result: 'W 74-69', points: 20, assists: 7, rebounds: 4, fgPct: 46, plusMinus: +8, minutes: 33 },
    ]
};

export const mockPlayers: PlayerData[] = [
    mockPlayer,
    {
        id: 'p2',
        name: 'Sarah Jenkins',
        sport: 'Wheelchair Rugby',
        position: 'Attacker',
        jerseyNumber: 3,
        age: 24,
        dob: '2000-07-22',
        height: '5\'7"',
        weight: '72 kg',
        team: 'Volt Rollers',
        yearsInProgram: 3,
        strongHand: 'Left',
        playerRole: 'Defender',
        developmentTier: 'Developing',
        bio: 'Aggressive forward with excellent court vision and defensive instincts.',
        stats: {
            ppg: 12.0, apg: 5.5, rpg: 3.2,
            fgPercentage: 41.0, threePointPct: 28.0, ftPct: 74.0,
            turnovers: 2.8, plusMinus: +4.2, efficiencyRating: 15.3,
            minutesPerGame: 28, trend: 'stable',
        },
        offensiveAnalytics: {
            shotZones: [
                { zone: 'Paint', attempts: 90, makes: 48, pct: 53.3, isBestZone: true },
                { zone: 'Mid-Range', attempts: 60, makes: 22, pct: 36.7 },
                { zone: 'Left Wing 3', attempts: 30, makes: 8, pct: 26.7 },
                { zone: 'Right Wing 3', attempts: 25, makes: 7, pct: 28.0 },
                { zone: 'Top of Arc', attempts: 20, makes: 6, pct: 30.0 },
                { zone: 'Left Corner 3', attempts: 10, makes: 2, pct: 20.0 },
                { zone: 'Right Corner 3', attempts: 12, makes: 4, pct: 33.3 },
            ],
            catchAndShootPts: 4.5, pullUpPts: 3.2, paintPts: 4.3,
            usageRate: 22.1, astToTovRatio: 1.96, pointsPerPossession: 0.98, clutchRating: 55,
        },
        defensiveAnalytics: {
            defRating: 108.4, steals: 2.1, deflections: 4.0, rimContestPct: 70.0, oppFgPctWhenGuarded: 35.0,
        },
        skillRatings: { shooting: 6, defense: 8, courtIQ: 7, athleticism: 7, ballHandling: 6 },
        physicalData: { sprintSpeed: 20.1, fatigueIndex: 65, trainingAttendance: 88, workload: 'Medium' },
        tacticalData: {
            bestLineups: ['Sarah + Alex (defensive lineup)'],
            bestPlayTypes: ['Man-to-Man Press', 'Help Defense', 'Fast Break'],
            bestPosition: 'Small Forward',
            recommendedRole: 'Defensive Anchor',
            aiInsight: 'Excels in defensive schemes. Offensive game can be improved with better catch-and-shoot mechanics.',
        },
        weaknesses: ['Low three-point efficiency (28%)', 'Needs to improve assist-to-turnover ratio'],
        injuryHistory: [],
        gameHistory: [
            { id: 1, opponent: 'Titans', competition: 'National Cup', date: '2023-11-18', result: 'W 50-45', points: 14, assists: 6, rebounds: 3, fgPct: 44, plusMinus: +5, minutes: 28 }
        ],
    },
    {
        id: 'p3',
        name: 'Marcus Thorne',
        sport: 'Wheelchair Basketball',
        position: 'Shooting Guard',
        jerseyNumber: 23,
        age: 26,
        dob: '1998-01-05',
        height: '6\'2"',
        weight: '85 kg',
        team: 'Metro Rollers',
        yearsInProgram: 7,
        strongHand: 'Right',
        playerRole: 'Shooter',
        developmentTier: 'Elite',
        bio: 'Elite 3-point specialist with deadly accuracy from the right wing. Veteran of 7 seasons.',
        stats: {
            ppg: 22.5, apg: 3.2, rpg: 2.1,
            fgPercentage: 48.2, threePointPct: 42.1, ftPct: 91.0,
            turnovers: 1.3, plusMinus: +9.8, efficiencyRating: 22.1,
            minutesPerGame: 34, trend: 'up',
        },
        offensiveAnalytics: {
            shotZones: [
                { zone: 'Paint', attempts: 40, makes: 22, pct: 55.0 },
                { zone: 'Mid-Range', attempts: 70, makes: 34, pct: 48.6 },
                { zone: 'Left Wing 3', attempts: 50, makes: 18, pct: 36.0 },
                { zone: 'Right Wing 3', attempts: 95, makes: 44, pct: 46.3, isBestZone: true },
                { zone: 'Top of Arc', attempts: 60, makes: 26, pct: 43.3, isBestZone: true },
                { zone: 'Left Corner 3', attempts: 25, makes: 9, pct: 36.0 },
                { zone: 'Right Corner 3', attempts: 40, makes: 18, pct: 45.0 },
            ],
            catchAndShootPts: 12.1, pullUpPts: 6.4, paintPts: 4.0,
            usageRate: 25.8, astToTovRatio: 2.46, pointsPerPossession: 1.22, clutchRating: 85,
        },
        defensiveAnalytics: {
            defRating: 105.8, steals: 1.2, deflections: 2.1, rimContestPct: 48.0, oppFgPctWhenGuarded: 41.0,
        },
        skillRatings: { shooting: 10, defense: 6, courtIQ: 8, athleticism: 7, ballHandling: 7 },
        physicalData: { sprintSpeed: 21.8, fatigueIndex: 80, trainingAttendance: 95, workload: 'High' },
        tacticalData: {
            bestLineups: ['Marcus + Alex (two-man game)', 'Marcus off Alex screen'],
            bestPlayTypes: ['Catch & Shoot', 'Off-Screen', 'Spot Up'],
            bestPosition: 'Shooting Guard',
            recommendedRole: 'Primary Scorer / Floor Spacer',
            aiInsight: 'Most dangerous off screens from the right wing. Pair with a ball-dominant PG to maximize efficiency.',
        },
        weaknesses: [
            'Below-average defense (Def Rating: 105.8)',
            'Can be exploited off the dribble in isolation',
        ],
        injuryHistory: [
            { id: 1, type: 'Finger Dislocation', date: '2023-08-10', recoveryTime: '4 weeks', status: 'Cleared' }
        ],
        gameHistory: [
            { id: 1, opponent: 'City Hawks', competition: 'State League', date: '2023-11-20', result: 'W 78-72', points: 28, assists: 2, rebounds: 2, fgPct: 56, plusMinus: +14, minutes: 35 },
            { id: 2, opponent: 'North Stars', competition: 'State League', date: '2023-11-10', result: 'W 82-60', points: 24, assists: 3, rebounds: 1, fgPct: 51, plusMinus: +22, minutes: 33 },
        ],
    }
];

export const mockCoaches = [
    { id: 'c1', name: 'Coach Carter', team: 'State Warriors', specialty: 'Offensive Strategy' },
    { id: 'c2', name: 'Coach Davis', team: 'National Team Dev', specialty: 'Strength & Conditioning' },
];

// ── localStorage helpers ─────────────────────────────────────────────────────

export const getPendingRequests = (): string[] => {
    if (typeof window === 'undefined') return [];
    try { return JSON.parse(localStorage.getItem('pendingAffiliations') || '[]'); } catch { return []; }
};

export const addPendingRequest = (playerId: string) => {
    if (typeof window === 'undefined') return;
    const current = getPendingRequests();
    if (!current.includes(playerId)) {
        localStorage.setItem('pendingAffiliations', JSON.stringify([...current, playerId]));
    }
};

export const getConfirmedAffiliations = (): string[] => {
    if (typeof window === 'undefined') return [];
    try { return JSON.parse(localStorage.getItem('confirmedAffiliations') || '[]'); } catch { return []; }
};

export const confirmAffiliation = (playerId: string) => {
    if (typeof window === 'undefined') return;
    const pending = getPendingRequests();
    localStorage.setItem('pendingAffiliations', JSON.stringify(pending.filter(id => id !== playerId)));
    const confirmed = getConfirmedAffiliations();
    if (!confirmed.includes(playerId)) {
        localStorage.setItem('confirmedAffiliations', JSON.stringify([...confirmed, playerId]));
    }
};

export const declineAffiliation = (playerId: string) => {
    if (typeof window === 'undefined') return;
    const pending = getPendingRequests();
    localStorage.setItem('pendingAffiliations', JSON.stringify(pending.filter(id => id !== playerId)));
};
