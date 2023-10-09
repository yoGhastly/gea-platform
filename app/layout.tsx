import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Footer } from './components'
import { Providers } from './components/providers'
import { Navigation } from './components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'GEA | FIME',
  description: 'Una plataforma para los grupos estudiantiles | GEA',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Navigation />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
