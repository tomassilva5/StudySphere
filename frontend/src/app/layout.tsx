'use client'; // Necessário para detetar a rota atual

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./providers/AuthContext";
import { TaskProvider } from "./providers/TaskContext";
import BottomTabs from "./components/BottomTabs";
import { usePathname } from "next/navigation";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const hideTabsPaths = ["/login", "/register", "/development"];
  const shouldHideTabs = hideTabsPaths.includes(pathname);

  return (
    <html lang="pt" suppressHydrationWarning>
      <body 
        className={`
          ${geistSans.variable} ${geistMono.variable} antialiased 
          min-h-screen
        `}
      >
        <AuthProvider>
          <TaskProvider>
            {children}
            {!shouldHideTabs && <BottomTabs />}
          </TaskProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

export default LayoutContent;