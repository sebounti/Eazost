import { NextResponse } from 'next/server';

//----- route dashboard -----//
// route pour le dashboard //

//----- GET -----//
// Route pour le dashboard //
export async function GET() {
  return NextResponse.json({ message: 'Dashboard API fonctionne' });
}
