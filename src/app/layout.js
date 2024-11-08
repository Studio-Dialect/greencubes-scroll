import { Inter } from 'next/font/google'
import "./globals.css";
import { GoogleAnalytics } from '@next/third-parties/google'
import LargeScreen from './components/LargeScreen';
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
        <div className='md:hidden'>
        {children}
        </div>
        <div className='hidden md:block'><LargeScreen/></div>
      </body>
      <GoogleAnalytics gaId="G-99MM7CP0F6" />
    </html>
  );
}
