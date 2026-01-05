'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

type UIContextType = {
  isBottomTabsVisible: boolean;
  hideBottomTabs: () => void;
  showBottomTabs: () => void;
};

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: ReactNode }) {
  const [isBottomTabsVisible, setIsBottomTabsVisible] = useState(true);

  const hideBottomTabs = () => setIsBottomTabsVisible(false);
  const showBottomTabs = () => setIsBottomTabsVisible(true);

  return (
    <UIContext.Provider value={{ isBottomTabsVisible, hideBottomTabs, showBottomTabs }}>
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const context = useContext(UIContext);
  if (!context) throw new Error('useUI must be used within a UIProvider');
  return context;
}
