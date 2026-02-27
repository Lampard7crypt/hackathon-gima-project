import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { player } = await req.json();

        // In a real implementation we would call OpenAI API here.

        const summary = `${player.name} exhibits a balanced and aggressive offensive style, averaging ${player.stats.ppg} points and ${player.stats.apg} assists per game. Over the last season, their shooting efficiency (${player.stats.fgPercentage}%) has stabilized, indicating improved shot selection. Analyzing their ${player.injuryHistory[0]?.type || 'past injury'} recovery pattern shows no long-term biomechanical impact. They remain a high-value asset in transition strategies.`;

        return NextResponse.json({ summary });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to generate summary' }, { status: 500 });
    }
}
