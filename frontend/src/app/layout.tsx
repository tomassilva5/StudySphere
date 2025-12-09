import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./providers/AuthContext";
import { TaskProvider } from "./providers/TaskContext";
import BottomTabs from "./components/BottomTabs";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "StudySphere",
  description: "Gerencie suas tarefas e tempo de estudo",
};

function LayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt" suppressHydrationWarning>
      <body 
        className={`
          ${geistSans.variable} ${geistMono.variable} antialiased 
          min-h-screen 
          bg-gradient-to-b from-[#06141F] from-60% to-[#1C3B4F]
        `}
      >
        <AuthProvider>
          <TaskProvider>
            {children}
            <BottomTabs />
          </TaskProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

export default LayoutContent;