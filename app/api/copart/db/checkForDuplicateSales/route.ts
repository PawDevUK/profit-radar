import { getDuplicateSales } from '@/lib/db/db';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const duplicates = await getDuplicateSales();

        return NextResponse.json({
            message: duplicates.length ? 'Duplicates found' : 'No duplicates found',
            count: duplicates.length,
            data: duplicates,
        });
    } catch (error) {
        console.error('Duplicate sales check failed:', error);

        return NextResponse.json(
            { error: 'Failed to check duplicate sales' },
            { status: 500 },
        );
    }
}
