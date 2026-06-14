import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Travel Right — Find the Right Destination at the Right Time",
  description:
    "Discover the best places to travel in India, month by month. 60 destinations, curated travel intel, hidden gems, ratings and getting-there guides.",
  keywords: "India travel, best time to visit India, travel destinations India, hidden gems India, travel guide",
  openGraph: {
    title: "Travel Right — Find the Right Destination at the Right Time",
    description:
      "Discover the best places to travel in India, month by month. 60 destinations, curated travel intel, hidden gems, ratings and getting-there guides.",
    url: "https://travel-right.vercel.app",
    siteName: "Travel Right",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Travel Right — Find the Right Destination at the Right Time",
    description:
      "Discover the best places to travel in India, month by month. 60 destinations, curated travel intel, hidden gems and ratings.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
