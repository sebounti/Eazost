'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function VerifyEmailPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const token = searchParams.get('token');
                console.log('Token reçu:', token); // Debug log

                if (!token) {
                    setStatus('error');
                    setMessage('Token manquant');
                    return;
                }

                // Décodez le token pour obtenir l'email
                const response = await fetch('/api/auth/verify-email', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ token }) // Envoyez le token au lieu de l'email
                });

                const data = await response.json();
                console.log('Réponse API:', data); // Debug log

                if (response.ok) {
                    setStatus('success');
                    setMessage('Email vérifié avec succès');
                    setTimeout(() => router.push('/login'), 3000);
                } else {
                    setStatus('error');
                    setMessage(data.error || 'Une erreur est survenue');
                }
            } catch (error) {
                console.error('Erreur de vérification:', error);
                setStatus('error');
                setMessage('Une erreur est survenue lors de la vérification');
            }
        };

        verifyEmail();
    }, [searchParams, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
                {status === 'loading' && (
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-600 border-t-transparent mx-auto"></div>
                        <p className="mt-4 text-gray-600">Vérification de votre email...</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="text-center">
                        <div className="text-amber-600 text-5xl mb-4">✓</div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Email vérifié !</h2>
                        <p className="text-gray-600">{message}</p>
                        <p className="text-sm text-gray-500 mt-4">Redirection vers la page de connexion...</p>
                    </div>
                )}

                {status === 'error' && (
                    <div className="text-center">
                        <div className="text-red-600 text-5xl mb-4">✗</div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Erreur</h2>
                        <p className="text-gray-600">{message}</p>
                        <button
                            onClick={() => router.push('/login')}
                            className="mt-4 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-500"
                        >
                            Retour à la connexion
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
