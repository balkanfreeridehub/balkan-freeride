import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "next-themes";
import "./globals.css";

export const metadata: Metadata = {
  title: "Balkan Freeride",
  description: "Snow forecast for Balkan resorts",
};

// Optimizacija za mobilne uređaje (freeride dashboard stil)
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sr" suppressHydrationWarning>
      <body className="antialiased">
        {/* defaultTheme="light": Postavlja belu temu kao osnovnu.
          enableSystem={false}: Sprečava da sajt "pobegne" u tamnu temu 
          ako ti je Windows/macOS u dark modu.
        */}
        <ThemeProvider 
          attribute="class" 
          defaultTheme="light" 
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}