import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const vendors = [
            { name: "ProActive Adaptive Athletics", description: "Specializes in tailor-made titanium sports chairs mapped to your specific seated measurements.", link: "#" },
            { name: "Performance Rim Co.", description: "Carbon-fiber ergonomic push rims optimized for long-duration match stamina.", link: "#" }
        ];

        return NextResponse.json({ vendors });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to find vendors' }, { status: 500 });
    }
}
