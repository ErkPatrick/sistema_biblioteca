import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";

export const metadata: Metadata = {
  title: "Sistema Biblioteca",
  description: "Servidor frontend para um sistema de biblioteca pública",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
