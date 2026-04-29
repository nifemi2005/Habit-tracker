import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import ServiceWorkerRegister from '../components/shared/ServiceWorkerRegister'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Habit Tracker — Build Better Habits Daily',
  description: 'Track your daily habits, build streaks, and stay consistent. A simple and beautiful habit tracking app.',
  manifest: '/manifest.json',
  icons: {
    icon: '/icons/icon-192.png',
    apple: '/icons/icon-192.png',
  },
  keywords: ['habit tracker', 'daily habits', 'streak', 'productivity'],
  authors: [{ name: 'Your Name' }],
  openGraph: {
    title: 'Habit Tracker — Build Better Habits Daily',
    description: 'Track your daily habits and build streaks.',
    type: 'website',
    url: 'https://your-deployed-url.com',
    images: [
      {
        url: '/icons/icon-512.png',
        width: 512,
        height: 512,
        alt: 'Habit Tracker',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'Habit Tracker',
    description: 'Track your daily habits and build streaks.',
    images: ['/icons/icon-512.png'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#111111" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ServiceWorkerRegister />
        {children}
      </body>
    </html>
  )
}