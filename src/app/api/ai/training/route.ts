import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { player } = await req.json();

        const recommendations = [
            "Focus on dynamic stability drills to prevent recurrence of previous upper body strains.",
            "Increase transition push-speed training by 15% to capitalize on your high assist rates.",
            "Incorporate 2 days of guided Active Recovery post-game to maintain your high minutes-played efficiency."
        ];

        return NextResponse.json({ recommendations });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to generate recommendations' }, { status: 500 });
    }
}
