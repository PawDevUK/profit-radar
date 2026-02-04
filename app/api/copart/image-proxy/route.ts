import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
	const imageUrl = request.nextUrl.searchParams.get('url');

	if (!imageUrl) {
		return NextResponse.json({ error: 'Missing image URL' }, { status: 400 });
	}

	try {
		// Validate that it's a Copart image
		if (!imageUrl.includes('copart.com')) {
			return NextResponse.json({ error: 'Invalid image source' }, { status: 400 });
		}

		const response = await fetch(imageUrl, {
			headers: {
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
			},
		});

		if (!response.ok) {
			return NextResponse.json({ error: 'Failed to fetch image' }, { status: response.status });
		}

		const buffer = await response.arrayBuffer();
		const contentType = response.headers.get('content-type') || 'image/jpeg';

		return new NextResponse(buffer, {
			status: 200,
			headers: {
				'Content-Type': contentType,
				'Cache-Control': 'public, max-age=86400',
			},
		});
	} catch (error) {
		console.error('Image proxy error:', error);
		return NextResponse.json({ error: 'Failed to proxy image' }, { status: 500 });
	}
}
