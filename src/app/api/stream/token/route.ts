import { StreamChat } from 'stream-chat';
import { NextResponse } from 'next/server';

const API_KEY = process.env.NEXT_PUBLIC_STREAM_KEY ?? '';
const API_SECRET = process.env.NEXT_PUBLIC_STREAM_SECRET ?? '';

if (!API_KEY || !API_SECRET) {
  throw new Error('Les clés Stream sont requises');
}

const serverClient = StreamChat.getInstance(API_KEY, API_SECRET);

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'userId est requis' }, { status: 400 });
    }

    const token = serverClient.createToken(userId);
    return NextResponse.json({ token });
  } catch (error) {
    console.error('Erreur lors de la génération du token:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la génération du token' },
      { status: 500 }
    );
  }
}
