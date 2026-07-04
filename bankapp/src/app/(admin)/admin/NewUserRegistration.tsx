"use client";

import { useRouter } from "next/navigation";
import { INewUserRegister } from "../../../../../shared/types/newUserRegister.interface";
import styles from "../../../styles/Admin/admin.module.css";
import { useAdmin } from "../AdminContext";

interface Props {
  usersToRegister: INewUserRegister[];
}

export default function NewUserRegistration({ usersToRegister }: Props) {
  const { setNewUserRegister } = useAdmin();

  const router = useRouter();

  const handleUserClick = (user: INewUserRegister) => {
    setNewUserRegister(user);

    router.push("/registration");
  };

  return (
    <div className="container" style={{ maxWidth: "1600px" }}>
      {!usersToRegister.length ? (
        <div className="text-danger text-center mt-3">
          No pending registrations
        </div>
      ) : (
        <div className="container-fluid p-3 overflow-auto">
          <table
            className={`table table-hover align-middle w-100 ${styles.adminTable}`}
          >
            <thead className="table-light">
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Date of Birth</th>
              </tr>
            </thead>

            <tbody>
              {usersToRegister.map((user: INewUserRegister) => (
                <tr
                  key={user.registration_id}
                  style={{ cursor: "pointer" }}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleUserClick(user)}
                >
                  <td>{user.first_name}</td>
                  <td>{user.last_name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{user.customer_address}</td>
                  <td>{new Date(user.dob).toLocaleDateString("en-GB")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
