import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
});

export const metadata: Metadata = {
    title: {
        template: '%s | The International Press',
        default: 'The International Press',
    },
    description: 'Reliable international news and information.',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className={inter.variable}>
            <body className="antialiased min-h-screen bg-gray-50 text-gray-900 font-sans">
                {children}
            </body>
        </html>
    );
}
