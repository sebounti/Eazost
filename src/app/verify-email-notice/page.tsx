'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function VerifyEmailNoticePage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [requestStatus, setRequestStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
            return;
        }

        async function checkEmailVerification() {
            if (session?.user?.email) {
                try {
                    const response = await fetch(`/api/auth/validationEmail?email=${session.user.email}`);
                    const data = await response.json();
                    if (data.verified) {
                        router.push('/dashboard');
                    }
                } catch (error) {
                    console.error('Erreur vérification:', error);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setIsLoading(false);
            }
        }

        checkEmailVerification();
    }, [session, router, status]);

    if (isLoading || status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-amber-600 border-t-transparent"></div>
            </div>
        );
    }

    const resendVerificationEmail = async () => {
        try {
            setRequestStatus('loading');
            const response = await fetch('/api/auth/verify-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: session?.user?.email
                })
            });

            const data = await response.json();

            if (response.ok) {
                setRequestStatus('success');
                setMessage('Un nouveau lien de vérification a été envoyé à votre email.');
            } else {
                setRequestStatus('error');
                setMessage(data.error || 'Une erreur est survenue.');
            }
        } catch (error) {
            setRequestStatus('error');
            setMessage('Une erreur est survenue lors de l\'envoi du lien.');
            console.error('Erreur:', error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Vérification d'email requise</h2>
                <p className="text-gray-600 mb-6">
                    Pour accéder à cette page, vous devez d'abord vérifier votre adresse email ({session?.user?.email}).
                    Veuillez consulter votre boîte de réception et cliquer sur le lien de vérification.
                </p>

                {requestStatus === 'idle' && (
                    <button
                        onClick={resendVerificationEmail}
                        className="w-full py-2 px-4 bg-amber-600 text-white rounded-lg hover:bg-amber-500 transition-colors"
                    >
                        Renvoyer le lien de vérification
                    </button>
                )}

                {requestStatus === 'loading' && (
                    <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-4 border-amber-600 border-t-transparent"></div>
                    </div>
                )}

                {(requestStatus === 'success' || requestStatus === 'error') && (
                    <div className={`p-4 rounded-lg ${requestStatus === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        <p>{message}</p>
                        {requestStatus === 'error' && (
                            <button
                                onClick={() => setRequestStatus('idle')}
                                className="mt-4 text-sm underline hover:no-underline"
                            >
                                Réessayer
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
