"use client";

import React, { createContext, useContext, useState } from "react";

interface AppContextType {
  isConnected: boolean;
  setIsConnected: React.Dispatch<React.SetStateAction<boolean>>;
}
interface AppProviderProps {
  children: React.ReactNode;
}

const AppContext = createContext<AppContextType>({
  isConnected: false,
  setIsConnected: () => {},
});

export const useAppContext = () => useContext(AppContext);
export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);

  return (
    <AppContext.Provider value={{ isConnected, setIsConnected }}>
      {children}
    </AppContext.Provider>
  );
};
