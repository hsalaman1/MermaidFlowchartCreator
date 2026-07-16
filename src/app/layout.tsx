import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Flowchart Builder",
  description:
    "Interactive flowchart builder with visual node management, Mermaid diagram rendering, and export options.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
