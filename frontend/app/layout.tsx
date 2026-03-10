// frontend/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import ConditionalHeader from "@/components/ConditionalHeader";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "The Local Kitchen",
  description: "Discover local restaurants",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ConditionalHeader />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
