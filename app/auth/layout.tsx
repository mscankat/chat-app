import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Github OAuth",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
