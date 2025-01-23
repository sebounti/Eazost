'use client';

import { useSession } from 'next-auth/react';

const TOKEN_NAMES = {
  ACCESS: 'auth.access_token',
  REFRESH: 'auth.refresh_token'
} as const;

export function TokenDebug() {
  const { data: session } = useSession();

  const cookies = document.cookie.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    acc[key.trim()] = value;
    return acc;
  }, {} as Record<string, string>);

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-sm">
      <h3 className="font-bold mb-2">Debug Tokens</h3>
      <div>
        <p>Session Tokens:</p>
        <ul className="ml-4">
          <li>Access: {session?.accessToken ? '✅' : '❌'}</li>
          <li>Refresh: {session?.refreshToken ? '✅' : '❌'}</li>
        </ul>
        <p className="mt-2">Cookies:</p>
        <ul className="ml-4">
          <li>Access: {cookies[TOKEN_NAMES.ACCESS] ? '✅' : '❌'}</li>
          <li>Refresh: {cookies[TOKEN_NAMES.REFRESH] ? '✅' : '❌'}</li>
        </ul>
      </div>
    </div>
  );
}
