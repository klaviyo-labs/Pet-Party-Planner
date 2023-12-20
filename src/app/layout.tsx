'use client'

import { Inter } from 'next/font/google'
import './globals.css'

import ThemeRegistry from '@/app/components/ThemeRegistry/ThemeRegistry';
import {CookiesProvider} from "react-cookie";
import dynamic from "next/dynamic";


const inter = Inter({ subsets: ['latin'] })

// export const metadata: Metadata = {
//   title: 'Pet Party Planner',
//   description: 'Created by Klaviyo',
// }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

const NoSSRNavBar = dynamic(() => import('@/app/components/Navigation/NavBar'), { ssr: false })


  return (
    <html lang="en">
      <body>
      <ThemeRegistry>
        <CookiesProvider>
          <NoSSRNavBar />
          {children}
        </CookiesProvider>
      </ThemeRegistry>
      </body>
    </html>
  )
}
