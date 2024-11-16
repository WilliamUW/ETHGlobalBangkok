"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface AppContextProviderProps {
  children: ReactNode; // This defines the type of children
}

export const AppContextProvider = ({ children }: AppContextProviderProps) => {
  const [records, setRecords] = useState<Record[]>([]);

  return (
    <AppContext.Provider value={{ records: records, setRecords: setRecords }}>
      {children}
    </AppContext.Provider>
  );
};

export interface Record {
  ipfsCid: string;
  latitude: string;
  longitude: string;
  recordType: string;
  timestamp: bigint;
  isDeleted: boolean;
  rating: number;
}

export interface IPFSRecord extends Record {
  image: string;
  description: string;
}

// Define the context value type
interface AppContextType {
  records: Record[];
  setRecords: React.Dispatch<React.SetStateAction<Record[]>>;
}

// Initialize context with null and then cast it
const AppContext = createContext<AppContextType | null>(null);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within a AppContextProvider");
  }
  return context;
};
