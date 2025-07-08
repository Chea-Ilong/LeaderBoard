import type React from 'react';
import type { Metadata } from 'next';
import { Navigation } from '@/components/layout/navigation';
import './globals.css';

export const metadata: Metadata = {
    title: 'CADT Freshman Coding Competition',
    description: 'Live leaderboard for CADT Freshman Coding Competition',
    generator: 'v0.dev',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin="anonymous"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body className="min-h-screen bg-gray-50">
                <Navigation />
                <main>{children}</main>
            </body>
        </html>
    );
}
