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

async function getFaviconUrl(): Promise<string> {
  try {
    const setting = await prisma.siteSetting.findUnique({ where: { key: 'site_favicon_url' } })
    return setting?.value ?? ''
  } catch {
    return ''
  }
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const faviconUrl = await getFaviconUrl()

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
      </head>
      <body>{children}</body>
    </html>
  )
}
