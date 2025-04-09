import type { Metadata } from "next";
import { Geist, Geist_Mono, Inconsolata } from "next/font/google";
import "./globals.css";
import { OpenModalAssuranceProvider, OpenModalItemsProvider, OpenSideBarProvider } from "@/contexts";
import { OpenModalManageInvoiceProvider } from "@/contexts/OpenModalManageInvoiceContext";

const inconsolata = Inconsolata({
  variable: "--font-inconsolata",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FaturaFlow",
  description: "Personal finance app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <OpenModalAssuranceProvider>
      <OpenModalManageInvoiceProvider>
        <OpenModalItemsProvider>
          <OpenSideBarProvider>
            <html lang="en">
              <body
                className={`${geistSans.variable} ${geistMono.variable} ${inconsolata.variable} antialiased h-screen`}
              >
                {children}
              </body>
            </html>
          </OpenSideBarProvider>
        </OpenModalItemsProvider>
      </OpenModalManageInvoiceProvider>
    </OpenModalAssuranceProvider>
  );
}
