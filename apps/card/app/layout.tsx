import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "粤语知识卡片分享App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.png" type="image/png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
