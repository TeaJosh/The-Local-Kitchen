// frontend/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import ConditionalHeader from "@/components/ConditionalHeader";
import ConditionalFooter from "@/components/ConditionalFooter";

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
      <body className="flex flex-col min-h-screen">
        <ConditionalHeader />
        <main className="flex-grow">{children}</main>
        <ConditionalFooter />
      </body>
    </html>
  );
}
