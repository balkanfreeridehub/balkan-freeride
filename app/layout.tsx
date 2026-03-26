import { Providers } from "../components/Providers";
import "./globals.css";

export const metadata = {
  title: "Balkan Freeride Hub",
  description: "Snow forecast and live cams for Balkan ski resorts",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased transition-colors duration-300">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}