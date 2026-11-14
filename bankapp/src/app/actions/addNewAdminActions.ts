"use server";

import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";
import { AdminCreate } from "../../../../shared/types/adminCreate.interface";

export async function addNewAdminActions(newAdminData: AdminCreate) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_access_token")?.value;

  if (!token) {
    return { success: false, error: ["Not authenticated"] };
  }

  try {
    const response = await fetch(`${process.env.BACK_END_URL}/admin`, {
      method: "POST",
      headers: {
        Cookie: `admin_access_token=${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newAdminData),
      cache: "no-store",
    });

    const result = await response.json();

    if (!response.ok) {
      const message = result?.message ?? "Failed to add new admin";
      return {
        success: false,
        error: Array.isArray(message) ? message : [message],
      };
    }

    revalidateTag("allAdminsData");
    return { success: true, data: result };
  } catch (error) {
    console.error("Error adding new admin:", error);
    return { success: false, error: ["Backend unreachable"] };
  }
}
