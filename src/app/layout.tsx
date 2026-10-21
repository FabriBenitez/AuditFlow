import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AuditFlow | Director de Contenido & Auditoría para Redes",
  description: "Audita tus cuentas de Instagram y TikTok, y convierte cualquier foto de producto en un video viral paso a paso.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body className="bg-[#09090b] text-zinc-100 antialiased selection:bg-white/20 selection:text-white pb-24 md:pb-10 min-h-screen">
        {children}
      </body>
    </html>
  );
}
