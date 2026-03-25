import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";


import {
  Roboto,
  Poppins,
  Inter,
  Lato,
  Montserrat,
  Oswald,
  Raleway,
  Nunito,
} from "next/font/google";

import "./globals.css";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


const roboto = Roboto({ subsets: ["latin"], weight: ["400", "700"] });
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "600"] });
const inter = Inter({ subsets: ["latin"], weight: ["400", "600"] });
const lato = Lato({ subsets: ["latin"], weight: ["400", "700"] });
const montserrat = Montserrat({ subsets: ["latin"], weight: ["400", "600"] });
const oswald = Oswald({ subsets: ["latin"], weight: ["400", "600"] });
const raleway = Raleway({ subsets: ["latin"], weight: ["400", "600"] });
const nunito = Nunito({ subsets: ["latin"], weight: ["400", "600"] });

export const metadata: Metadata = {
  title: "Form Builder",
  description: "Dynamic Form Builder",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`
          ${geistSans.variable}
          ${geistMono.variable}
          ${roboto.className}   
          antialiased
        `}
      >
        {children}
      </body>
    </html>
  );
}