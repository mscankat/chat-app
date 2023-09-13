import { AuthProvider } from "@/utils/Context";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Chat Application",
  description: "Created by msc",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <html lang="en">
        <body className={inter.className + " text-black"}>{children}</body>
      </html>
    </AuthProvider>
  );
}
