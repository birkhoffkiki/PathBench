import type { Metadata } from "next";
import { EvaluationProvider } from "@/context/EvaluationContext";
import { Toaster } from "@/components/ui/sonner";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PathBench: A compensive benchmark for pathology foundation models with real practical data from the world.",
  description: "An interactive platform for evaluating pathology foundation models across various tasks and organs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning>
        <EvaluationProvider>
          {children}
          <Toaster />
        </EvaluationProvider>
      </body>
    </html>
  );
}
