"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  let startPosition = "translate-y-10"; 

  if (pathname === '/register') {
    startPosition = "-translate-y-24"; 
  } else if (pathname === '/login') {
    startPosition = "translate-y-24"; 
  }

  useEffect(() => {
    setVisible(false);
    const t = setTimeout(() => setVisible(true), 20); 
    return () => clearTimeout(t);
  }, [pathname]); 

  return (
    <div className="w-full min-h-screen" style={{ background: 'var(--background)' }}>
      <div
        key={pathname} 
        className={`w-full h-full transition-all duration-500 ease-out transform ${
          visible 
            ? "opacity-100 translate-y-0" 
            : `opacity-0 ${startPosition}` 
        }`}
      >
        {children}
      </div>
    </div>
  );
}