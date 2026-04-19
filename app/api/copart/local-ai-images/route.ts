import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
	const lotId = request.nextUrl.searchParams.get('lotId');

	if (!lotId || !/^\d+$/.test(lotId)) {
		return NextResponse.json({ error: 'Invalid lotId' }, { status: 400 });
	}

	const lotDir = path.join(process.cwd(), 'public', 'lot-images', 'copart', lotId);

	if (!fs.existsSync(lotDir)) {
		return NextResponse.json({ images: [] });
	}

	const files = fs.readdirSync(lotDir);
	const aiImages = files
		.filter((f) => f.endsWith('-ai.png'))
		.sort()
		.map((f) => `/lot-images/copart/${lotId}/${f}`);

	return NextResponse.json({ images: aiImages });
}
