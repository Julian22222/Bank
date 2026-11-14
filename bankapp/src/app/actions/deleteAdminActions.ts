"use server";

import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";

export async function deleteAdminActions(adminId: number | undefined) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_access_token")?.value;

  try {
    const result = await fetch(`${process.env.BACK_END_URL}/admin/${adminId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Cookie: `admin_access_token=${token}`,
      },
      cache: "no-store",
    });

    const responseDeletedAdmin = await result.json();

    if (!result.ok) {
      return {
        success: false,
        error: Array.isArray(responseDeletedAdmin.message)
          ? responseDeletedAdmin.message
          : [String(responseDeletedAdmin.message)],
      };
    }

    revalidateTag(`allAdminsData`);

    return {
      success: true,
      data: responseDeletedAdmin,
    };
  } catch (error) {
    console.error("Error deleting admin:", error);

    return {
      success: false,
      error: error instanceof Error ? [error.message] : ["Backend unreachable"],
    };
  }
}
