import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const token = request.cookies.get('accesstoken')?.value;
  return NextResponse.json({ token });
}
