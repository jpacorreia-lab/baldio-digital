import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Baldio Digital",
  description: "Gestão administrativa multi-baldio"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <body>{children}</body>
    </html>
  );
}
