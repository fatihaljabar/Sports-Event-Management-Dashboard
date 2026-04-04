import type { Metadata } from "next";
import { Inter, Barlow_Condensed, JetBrains_Mono } from "next/font/google";
import { EventProvider } from "@/lib/stores/event-store";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { NotificationProvider } from "@/components/contexts/NotificationContext";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-barlow-condensed",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ISDN - Sports Event Management",
  description: "Professional sports event management dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${barlowCondensed.variable} ${jetbrainsMono.variable}`}>
        <QueryProvider>
          <NotificationProvider>
            <EventProvider>{children}</EventProvider>
          </NotificationProvider>
        </QueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
