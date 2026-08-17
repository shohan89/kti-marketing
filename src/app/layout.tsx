import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { prisma } from '@/lib/prisma'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://ktimarketing.com'),
  title: {
    template: '%s | KTI Marketing',
    default: 'KTI Marketing — Bold Strategy. Real Revenue.',
  },
  description:
    'KTI Marketing is a full-service digital marketing agency in Dhaka, Bangladesh — specialising in social media management, paid ads, content creation, and brand growth.',
  openGraph: {
    siteName: 'KTI Marketing',
    locale: 'en_US',
    type: 'website',
  },
  twitter: { card: 'summary_large_image' },
}

async function getHeadSettings(): Promise<{ faviconUrl: string; gscVerification: string }> {
  try {
    const rows = await prisma.siteSetting.findMany({
      where: { key: { in: ['site_favicon_url', 'integrations_gsc_verification'] } },
    })
    const map = Object.fromEntries(rows.map(r => [r.key, r.value]))
    return {
      faviconUrl: map['site_favicon_url'] ?? '',
      gscVerification: map['integrations_gsc_verification'] ?? '',
    }
  } catch {
    return { faviconUrl: '', gscVerification: '' }
  }
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { faviconUrl, gscVerification } = await getHeadSettings()

  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');document.documentElement.setAttribute('data-theme',t==='light'?'light':'dark')}catch(e){document.documentElement.setAttribute('data-theme','dark')}})()`,
          }}
        />
        {faviconUrl
          ? <link rel="icon" href={faviconUrl} />
          : <link rel="icon" href="/favicon.svg" />
        }
        {gscVerification && <meta name="google-site-verification" content={gscVerification} />}
      </head>
      <body>{children}</body>
    </html>
  )
}
