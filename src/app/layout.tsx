import type { Metadata } from 'next'
import './globals.css'
import { Footer, Header, WhatsAppButton } from '@/components/site'

export const metadata: Metadata = {
  metadataBase: process.env.NEXT_PUBLIC_SITE_URL ? new URL(process.env.NEXT_PUBLIC_SITE_URL) : undefined,
  title: { default: 'Odyssey Travel — Travel, thoughtfully.', template: '%s — Odyssey Travel' },
  description: 'Discover meaningful journeys, considered travel inspiration, and places that stay with you. Start a conversation about your next trip with Odyssey Travel.',
  openGraph: { type: 'website', siteName: 'Odyssey Travel', title: 'Odyssey Travel — Travel, thoughtfully.', description: 'Not just somewhere to go. Somewhere that stays with you.' },
  alternates: { canonical: '/' },
  robots: { index: true, follow: true },
}
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><a className="skip-link" href="#main-content">Skip to content</a><Header/><div id="main-content">{children}</div><Footer/><WhatsAppButton/></body></html>}
