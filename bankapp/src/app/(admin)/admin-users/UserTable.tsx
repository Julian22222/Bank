"use client";

import { useRouter } from "next/navigation";
import { IUserWithAccount } from "@/src/shared/types/userWithAccount.interface";
import { useEffect, useMemo } from "react";
import styles from "../../../styles/Admin/admin.module.css";
import { useAdmin } from "../AdminContext";

type Props = {
  usersData: IUserWithAccount[];
  option: string;
  search: string;
};

export default function UserTable({ usersData, option, search }: Props) {
  const { activeAdmin } = useAdmin();
  const router = useRouter();

  useEffect(() => {
    if (!activeAdmin) {
      router.push("/admin-login");
    }
  }, [activeAdmin, router]);

  const handleUserClick = (user: IUserWithAccount) => {
    router.push(`/admin/${user.customer_id}`);
  };

  const filteredUsersData = useMemo(() => {
    if (!search.length) return usersData;

    const query = search.trim().toLowerCase();

    return usersData.filter((user) => {
      if (option === "name")
        return user.first_name.toLowerCase().includes(query);

      if (option === "surname")
        return user.last_name.toLowerCase().includes(query);

      if (option === "email") return user.email.toLowerCase().includes(query);

      if (option === "phone") return user.phone.toLowerCase().includes(query);

      return true;
    });
  }, [option, search, usersData]);

  return (
    <div className="container-fluid p-3 overflow-auto">
      <table className={`table table-hover align-middle ${styles.adminTable}`}>
        <thead className="table-light">
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Account Type</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
          </tr>
        </thead>

        <tbody>
          {filteredUsersData.map((user: IUserWithAccount) => (
            <tr
              key={user.account_nr}
              onClick={() => handleUserClick(user)}
              style={{ cursor: "pointer" }}
            >
              <td>{user.first_name}</td>
              <td>{user.last_name}</td>
              <td>{user.account_type}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>{user.customer_address}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
