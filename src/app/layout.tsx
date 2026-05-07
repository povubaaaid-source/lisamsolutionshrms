import type { Metadata } from "next";
import "./globals.css";
import NextTopLoader from "nextjs-toploader";
import { ToastProvider } from "@/context/ToastContext";

export const metadata: Metadata = {
  title: "Worksuite - HR & Project Management",
  description: "HR & Project Management Tool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        <NextTopLoader color="#03a9f3" showSpinner={false} />
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}

