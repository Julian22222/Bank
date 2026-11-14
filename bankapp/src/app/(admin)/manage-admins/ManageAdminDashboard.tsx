"use client";

import { AdminReturn } from "@/src/shared/types/adminReturn.interface";
import styles from "../../../styles/Admin/manage-admins.module.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminUpdateModule from "./AdminUpdateModule";
import AdminAddModule from "./AdminAddModule";
import AdminEditPasswordModule from "./AdminEditPasswordModule";
import { deleteAdminActions } from "../../actions/deleteAdminActions";

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-50 px-3 py-1 rounded-md min-w-0">
      <p className="text-gray-500 text-xs leading-tight m-0">{label}</p>
      <p
        className={`font-medium ${value === "superAdmin" ? "text-danger" : "text-gray-800"} text-sm leading-tight m-0 break-words`}
      >
        {value}
      </p>
    </div>
  );
}

export default function ManageAdminDashboard({
  data,
}: {
  data: AdminReturn[];
}) {
  const router = useRouter();
  const [showAddModule, setShowAddModule] = useState(false);
  const [showPasswordModule, setShowPasswordModule] = useState(false);
  const [showUpdateModule, setShowUpdateModule] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<AdminReturn | null>(null);
  const [error, setError] = useState<string[]>([]);

  const deleteAdmin = async (id: number) => {
    if (!confirm("Delete this admin?")) return;

    const result = await deleteAdminActions(id);

    if (!result.success) {
      setError(Array.isArray(result.error) ? result.error : [result.error]);
      return;
    }

    router.refresh();
  };

  const openAdd = () => {
    setSelectedAdmin(null);
    setShowAddModule(true);
  };

  const openEditAdmin = (admin: AdminReturn) => {
    setSelectedAdmin(admin);
    setShowUpdateModule(true);
  };

  const openEditPassword = (admin: AdminReturn) => {
    setSelectedAdmin(admin);
    setShowPasswordModule(true);
  };

  return (
    <>
      <ul className="list-none p-0 mt-4 grid gap-3 grid-cols-[repeat(auto-fill,minmax(min(420px,100%),540px))] justify-center">
        {data.map((admin) => (
          <li
            key={admin.admin_id}
            className={`bg-white rounded-xl shadow border border-gray-100 p-3 ${styles.block}`}
          >
            <div className="grid grid-cols-2 gap-2">
              <Field label="Name" value={admin.admin_name} />
              <Field label="Role" value={admin.role} />
              <Field label="Email" value={admin.email} />
              <Field label="Phone" value={admin.phone} />
              <Field label="Address" value={admin.customer_address} />
              <Field label="Date of Birth" value={formatDate(admin.dob)} />
              <Field label="Created At" value={formatDate(admin.created_at)} />
              <button
                className="btn btn-primary mt-2 w-100"
                onClick={() => openEditAdmin(admin)}
              >
                Edit Admin
              </button>
              <button
                className="btn  btn-secondary mt-2 w-100"
                onClick={() => openEditPassword(admin)}
              >
                Edit password
              </button>
              <button
                className="btn btn-danger mt-2 w-100"
                onClick={() => deleteAdmin(admin.admin_id)}
                disabled={admin.role === "superAdmin"}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {error.length > 0 && (
        <div
          style={{
            background: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: "12px",
            padding: "10px 16px",
            color: "#dc2626",
            fontSize: "14px",
          }}
        >
          <ul style={{ margin: 0, paddingLeft: "18px" }}>
            {error.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="justify-center d-flex mt-4">
        <button
          className="btn btn-success mt-2 block mx-auto w-[60%]"
          onClick={openAdd}
        >
          Add New Admin
        </button>
      </div>

      {showUpdateModule && selectedAdmin && (
        <AdminUpdateModule
          setShowUpdateModule={setShowUpdateModule}
          admin={selectedAdmin}
        />
      )}

      {showAddModule && <AdminAddModule setShowAddModule={setShowAddModule} />}

      {showPasswordModule && selectedAdmin && (
        <AdminEditPasswordModule
          setShowPasswordModule={setShowPasswordModule}
          admin={selectedAdmin}
        />
      )}
    </>
  );
}
