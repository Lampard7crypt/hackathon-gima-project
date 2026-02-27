export const mockPlayer = {
    id: 'p1',
    name: 'Alex Mercer',
    sport: 'Wheelchair Basketball',
    position: 'Point Guard',
    team: 'Metro Rollers',
    bio: 'Paralympic hopeful. 5 years competitive experience.',
    stats: {
        ppg: 18.5,
        apg: 8.2,
        rpg: 4.1,
        fgPercentage: 45.2,
        minutesPerGame: 32,
    },
    injuryHistory: [
        { id: 1, type: 'Shoulder Strain', date: '2023-10-15', recoveryTime: '3 weeks', status: 'Cleared' },
        { id: 2, type: 'Wrist Sprain', date: '2022-04-10', recoveryTime: '2 weeks', status: 'Cleared' }
    ],
    gameHistory: [
        { id: 1, opponent: 'City Hawks', date: '2023-11-20', result: 'W 78-72', points: 22, assists: 10 },
        { id: 2, opponent: 'Westside Kings', date: '2023-11-15', result: 'L 65-70', points: 15, assists: 6 },
        { id: 3, opponent: 'North Stars', date: '2023-11-10', result: 'W 82-60', points: 18, assists: 8 }
    ]
};

export const mockCoaches = [
    { id: 'c1', name: 'Coach Carter', team: 'State Warriors', specialty: 'Offensive Strategy' },
    { id: 'c2', name: 'Sarah Jenkins', team: 'National Team Dev', specialty: 'Strength & Conditioning' },
];
