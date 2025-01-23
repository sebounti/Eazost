import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function GET(request: NextRequest) {
    try {
        const token = await getToken({
            req: request,
            secret: process.env.NEXTAUTH_SECRET
        });

        if (!token?.accessToken || !token?.refreshToken) {
            return NextResponse.json({ success: false, message: 'No tokens found' });
        }

        const response = NextResponse.json({ success: true });

        // Définir les cookies
        response.cookies.set('auth.access_token', token.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 15 * 60 // 15 minutes
        });

        response.cookies.set('auth.refresh_token', token.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 7 * 24 * 60 * 60 // 7 jours
        });

        return response;
    } catch (error) {
        console.error('❌ Erreur set-cookies:', error);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
