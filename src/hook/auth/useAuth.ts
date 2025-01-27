import { useEffect } from 'react';
import { useSession } from 'next-auth/react';

//----- useAuth -----//
// Hook pour vérifier les tokens d'authentification //


export function useAuth() {
    const { data: session } = useSession();

	// Vérification des tokens d'authentification
    useEffect(() => {
        const checkTokens = async () => {
            const cookies = document.cookie.split(';').reduce((acc, cookie) => {
                const [key, value] = cookie.trim().split('=');
                acc[key] = value;
                return acc;
            }, {} as Record<string, string>);

			// Vérification si les cookies sont disponibles

            console.log('🍪 Cookies disponibles:', Object.keys(cookies));
        };

        checkTokens();
    }, [session]);

    return session;
}
