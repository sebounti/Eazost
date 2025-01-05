'use client';

import { useEffect } from 'react';
import LogRocket from 'logrocket';
import '@/app/globals.css';
import { UserProvider } from '@/context/userContext';


export default function RootLayout({ children }: { children: React.ReactNode }): JSX.Element {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      LogRocket.init('8gslhi/eazost');
      console.log('LogRocket initialized');
    }
  }, []);

  return (
    <html lang="en">
      <body>
		<UserProvider>
		{children}

		</body>
    </html>
  );
}
