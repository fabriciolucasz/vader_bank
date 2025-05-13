import type { Metadata } from "next";
import { Providers } from './providers';
import "./globals.css";

export const metadata: Metadata = {
  title: "Malvader Bank",
  description: "Bem-vindo ao Malvader Bank",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode,
}) {
  return (
    <html lang='pt-BR'>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
