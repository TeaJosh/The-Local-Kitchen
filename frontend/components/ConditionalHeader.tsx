"use client";
import { usePathname } from "next/navigation";
import Header from "./Header";

export default function ConditionalHeader() {
  const pathname = usePathname();
  const hideOn = ["/auth/login", "/auth/register-member"];

  if (hideOn.includes(pathname)) return null;
  return <Header />;
}
