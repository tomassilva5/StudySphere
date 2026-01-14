'use client'; 

import { useEffect } from "react"; 
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./providers/AuthContext";
import { TaskProvider } from "./providers/TaskContext";
import { UIProvider } from "./providers/UIContext";
import { NotificationProvider } from "./providers/NotificationContext";
import BottomTabs from "./components/BottomTabs";
import NotificationToast from "./components/NotificationToast"; 
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
  const shouldHide = hideTabsPaths.includes(pathname);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((reg) => console.log("PWA ativo!", reg.scope))
          .catch((err) => console.error("Erro no PWA:", err));
      });
    }
  }, []);

  return (
    <html lang="pt" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="StudySphere" />
        <link rel="apple-touch-icon" href="/Logo/Logo.jpg" />
        <meta name="theme-color" content="#06141F" />
      </head>
      <body 
        className={`
          ${geistSans.variable} ${geistMono.variable} antialiased 
          min-h-screen
        `}
      >
        <svg width="0" height="0" className="absolute pointer-events-none">
          <defs>
            <linearGradient id="blue-green-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop stopColor="#57F177" offset="0%" />
              <stop stopColor="#4CB2D8" offset="100%" />
            </linearGradient>
          </defs>
        </svg>
        <AuthProvider>
          <TaskProvider>
            <NotificationProvider>
              <UIProvider>
                {!shouldHide && <NotificationToast />} 
                
                {children}
                
                {!shouldHide && <BottomTabs />}
              </UIProvider>
            </NotificationProvider>
          </TaskProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

export default LayoutContent;