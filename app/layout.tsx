import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ET Saathi - Financial Decision Engine',
  description: 'AI-powered financial intelligence platform for personalized financial decisions',
  keywords: ['finance', 'AI', 'portfolio', 'investment', 'decision engine'],
  authors: [{ name: 'ET Saathi' }],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <div className="min-h-screen bg-black">
          {children}
        </div>
      </body>
    </html>
  )
}
