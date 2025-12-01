import { NextResponse } from 'next/server';
import { getFormConfig } from '@/lib/form-config';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role') || '';

    const config = getFormConfig(role);

    return NextResponse.json(config);
}
