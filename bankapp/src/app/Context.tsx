"use client";

import React from "react";
import { createContext, useContext, useState } from "react";
import { User } from "../shared/types/user.interface";

interface GlobalContextType {
  allUsers: User[];
  setAllUsers: React.Dispatch<React.SetStateAction<User[]>>;
  activeUser: User | null;
  setActiveUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const Context = createContext<GlobalContextType | null>(null);

export function GlobalProvider({ children }: { children: React.ReactNode }) {
  const [allUsers, setAllUsers] = React.useState<User[]>([]);
  const [activeUser, setActiveUser] = React.useState<User | null>(null);

  return (
    <Context.Provider
      value={{ allUsers, setAllUsers, activeUser, setActiveUser }}
    >
      {children}
    </Context.Provider>
  );
}

export function useGlobal() {
  const context = useContext(Context);
  if (!context) throw new Error("useGlobal must be used inside GlobalProvider");
  return context;
}
