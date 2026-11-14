"use client";

import { useRouter } from "next/navigation";
import { useAdmin } from "../AdminContext";

//Show Register NEW Admin button only if the activeAdmin has role = "superadmin"
export default function ManageAdmins() {
  const { activeAdmin } = useAdmin();
  const router = useRouter();

  const handleClick = () => {
    // Implement the functionality for managing admins here
    console.log("Manage Admins button clicked");
    // alert("New admin registration functionality coming soon!");

    router.push("/manage-admins");
  };

  return (
    //admin role can be accessed through the useAdmin hook,
    // through apiServerFetch (/users/me) and
    // from JWT payload
    <>
      {activeAdmin?.role === "superAdmin" && (
        <div>
          <button
            className="btn btn-primary mt-2 w-100"
            onClick={() => handleClick()}
          >
            Manage Admins
          </button>
        </div>
      )}
    </>
  );
}

//JWT payload can be accessed in server components using the cookies() function from next/headers and jwtDecode from jwt-decode.
// This allows you to decode the JWT token and access the role of the admin. The commented-out code below shows how you could implement this in a server component:
// import { cookies } from "next/headers";
// import { jwtDecode } from "jwt-decode";

// const token = (await cookies()).get("admin_access_token")?.value;
// const role = token ? jwtDecode<{ role: string }>(token).role : null;

// {role === "superadmin" && <button>Manage Admins</button>}
