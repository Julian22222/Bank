"use client";

import FindUsers from "./FindUsers";
import UserTable from "./UserTable";
import { useState } from "react";
import { IUserWithAccount } from "@/src/shared/types/userWithAccount.interface";

interface Props {
  usersData: IUserWithAccount[];
}

export default function AdminUsersDashboard({ usersData }: Props) {
  const [option, setOption] = useState<string>("");
  const [search, setSearch] = useState<string>("");

  return (
    <>
      <FindUsers
        option={option}
        setOption={setOption}
        search={search}
        setSearch={setSearch}
      />
      <UserTable usersData={usersData} option={option} search={search} />
    </>
  );
}
