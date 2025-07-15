import './globals.css'
import { Inter } from 'next/font/google'
import CookieConsent from '../components/CookieConsent'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'ISDB - Internet Sports Data Base',
  description: 'The ultimate AI-powered graph of sports data - connecting players, teams, and history',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <CookieConsent />
      </body>
    </html>
  )
} 