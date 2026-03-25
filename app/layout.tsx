import { Providers } from "../components/Providers"
import "./globals.css"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-slate-50 dark:bg-[#020617] transition-colors duration-300">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}