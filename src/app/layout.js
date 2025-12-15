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
  title: "SIM Online - Sistem Informasi Lalu Lintas",
  description: "Aplikasi manajemen sistem lalu lintas dengan keamanan berlapis. Ajukan SIM baru, perpanjang, atau laporkan kehilangan dengan mudah.",
  keywords: "SIM, Surat Izin Mengemudi, perpanjang SIM, buat SIM baru, lalu lintas",
  authors: [{ name: "SIM Online Team" }],
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
