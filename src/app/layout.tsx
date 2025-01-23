"use client";

import React from 'react';
import '@/app/globals.css';
import { Toaster } from 'sonner';
import { Poppins, Nunito } from "next/font/google";
import { SessionProvider } from "next-auth/react";

const poppins = Poppins({
	subsets: ['latin'],
	weight: ['400', '700'],
	display: 'swap',
	preload: true,
	variable: '--font-poppins'
});

const nunito = Nunito({
	subsets: ['latin'],
	weight: ['400', '700'],
	display: 'swap',
	preload: true,
	variable: '--font-nunito'
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" className={`${poppins.variable} ${nunito.variable}`} suppressHydrationWarning>
			<head>
				<link
					rel="icon"
					href="/favicon.ico"
					sizes="any"
				/>
			</head>
			<body suppressHydrationWarning>
				<SessionProvider>
					{children}
					<Toaster richColors position="bottom-right" />
				</SessionProvider>
			</body>
		</html>
	);
}
