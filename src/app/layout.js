import { Inter } from 'next/font/google'
import "./globals.css";
import { GoogleAnalytics } from '@next/third-parties/google'


const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: "Greecubes",
  description: "A cubic meter of life",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={inter.className}
      >
        {children}
      </body>
      <GoogleAnalytics gaId="G-99MM7CP0F6" />
    </html>
  );
}
