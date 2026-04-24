import type { Metadata } from "next";
import "./globals.css";
import ConditionalHeader from "@/components/ConditionalHeader";
import ConditionalFooter from "@/components/ConditionalFooter";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
// import Chatbot from "@/components/Chatbot";

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

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
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className="flex flex-col min-h-screen">
        <ConditionalHeader />
        <TooltipProvider>
          <main className="flex-grow">{children}</main>
          {/* <Chatbot /> */}
        </TooltipProvider>
        <ConditionalFooter />
      </body>
    </html>
  );
}
