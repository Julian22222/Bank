"use server";

import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";

export async function updateAdminPasswordActions(
  adminId: number | undefined,
  newPassword: string,
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_access_token")?.value;

  try {
    const result = await fetch(
      `${process.env.BACK_END_URL}/admin/${adminId}/update-password`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Cookie: `admin_access_token=${token}`,
        },
        body: JSON.stringify({ newPassword }),
        cache: "no-store",
      },
    );

    const responseUpdatedAdmin = await result.json();

    if (!result.ok) {
      return {
        success: false,
        error: Array.isArray(responseUpdatedAdmin.message)
          ? responseUpdatedAdmin.message
          : [String(responseUpdatedAdmin.message)],
      };
    }

    revalidateTag(`allAdminsData`);

    return {
      success: true,
      data: responseUpdatedAdmin,
    };
  } catch (error) {
    console.error("Error updating admin password:", error);

    return {
      success: false,
      error: error instanceof Error ? [error.message] : ["Backend unreachable"],
    };
  }
}
