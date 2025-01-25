import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { db } from '@/db/db';
import { usersVerification } from '@/db/authSchema';
import { eq } from 'drizzle-orm';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        console.log('Body reçu:', body); // Debug log

        // Vérifier si on reçoit un email ou un token
        if (body.email) {
            // Cas où on reçoit un email : générer un nouveau token
            const verificationToken = jwt.sign(
                { email: body.email },
                process.env.JWT_SECRET!,
                { expiresIn: '24h' }
            );

            await db
                .insert(usersVerification)
                .values({
                    email: body.email,
                    verification_token: verificationToken,
                    verified_at: null
                })
                .onDuplicateKeyUpdate({ set: {
                    verification_token: verificationToken,
                    verified_at: null
                }});

            return NextResponse.json({
                success: true,
                message: 'Nouveau token de vérification généré'
            });
        }
        else if (body.token) {
            // Cas où on reçoit un token : vérifier l'email
            const decoded = jwt.verify(body.token, process.env.JWT_SECRET!) as { email: string };

            if (!decoded.email) {
                throw new Error('Email manquant dans le token');
            }

            await db
                .update(usersVerification)
                .set({
                    verified_at: new Date()
                })
                .where(eq(usersVerification.email, decoded.email));

            return NextResponse.json({
                success: true,
                message: 'Email vérifié avec succès'
            });
        }
        else {
            return NextResponse.json(
                { error: 'Email ou token manquant' },
                { status: 400 }
            );
        }

    } catch (error) {
        console.error('Erreur de vérification:', error);
        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : 'Erreur lors de la vérification',
                details: error
            },
            { status: 400 }
        );
    }
}
