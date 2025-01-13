import './globals.css'
import { Inter } from 'next/font/google'
import RootLayoutClient from './RootLayoutClient'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Blood Donation App',
  description: 'Find and register as blood donors',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-gray-50`}>
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  )
}

