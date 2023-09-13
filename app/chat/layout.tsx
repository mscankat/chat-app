import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chat Room",
  description: "Chat room",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
