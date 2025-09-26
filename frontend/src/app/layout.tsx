import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "sonner";

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
        <AuthProvider>
          {children}
          <Toaster
            position="top-center"
            expand
            closeButton
            visibleToasts={5}
            richColors
          />
        </AuthProvider>
      </body>
    </html>
  );
}
