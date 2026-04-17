"use client";
import { usePathname } from "next/navigation";
import Footer from "./Footer";

export default function ConditionalFooter() {
  const pathname = usePathname();
  const hideOn = ["/auth/login", "/auth/select-account", "/auth/register-member", "/auth/register-restaurant", "/posts/create-post"];

  if (hideOn.includes(pathname)) return null;
  return <Footer />;
}
