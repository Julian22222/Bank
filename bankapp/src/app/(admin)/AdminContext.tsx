"use client";

import React from "react";
import { createContext, useContext, useState } from "react";
import { IUserWithAccount } from "../../shared/types/userWithAccount.interface";
import { AdminReturn } from "../../shared/types/adminReturn.interface";
import { INewUserRegister } from "../../../../shared/types/newUserRegister.interface";

interface UserContextType {
  activeAdmin: AdminReturn | null;
  setActiveAdmin: React.Dispatch<React.SetStateAction<AdminReturn | null>>;
  adminPage_UserData: IUserWithAccount | null;
  setAdminPage_userData: React.Dispatch<
    React.SetStateAction<IUserWithAccount | null>
  >;
  newUserRegister: INewUserRegister;
  setNewUserRegister: React.Dispatch<React.SetStateAction<INewUserRegister>>;
}

const AdminContext = createContext<UserContextType | null>(null);

export function AdminProvider({
  initialAdmin,
  children,
}: {
  initialAdmin: AdminReturn | null;
  children: React.ReactNode;
}) {
  const [activeAdmin, setActiveAdmin] = useState(initialAdmin);
  const [adminPage_UserData, setAdminPage_userData] =
    React.useState<IUserWithAccount | null>(null);
  const [newUserRegister, setNewUserRegister] = useState<INewUserRegister>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    customer_address: "",
    dob: "",
  });

  return (
    <AdminContext.Provider
      value={{
        activeAdmin,
        setActiveAdmin,
        adminPage_UserData,
        setAdminPage_userData,
        newUserRegister,
        setNewUserRegister,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) throw new Error("useAdmin must be used inside AdminProvider");
  return context;
}
