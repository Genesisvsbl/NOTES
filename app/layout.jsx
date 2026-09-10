import "./globals.css";
import Script from "next/script";

export const metadata = {
  title: "NotesGene",
  description:
    "Cuaderno de escritura a mano con dictado por voz, tablas, cuadros comparativos, mapas mentales, mapas de proceso e instructivos paso a paso.",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "NotesGene", statusBarStyle: "default" },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#E0457B",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Condensed:wght@600;700&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&family=Caveat:wght@500;700&family=Patrick+Hand&family=Lora:ital,wght@0,400;0,600;1,400&display=swap"
        />
        <link rel="icon" href="/icon-192.png" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        {/* PDF: exportar (jsPDF) e importar (pdf.js) */}
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"
          strategy="beforeInteractive"
        />
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"
          strategy="beforeInteractive"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
