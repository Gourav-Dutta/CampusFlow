import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Campus Flow",
  description: "School Management System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}