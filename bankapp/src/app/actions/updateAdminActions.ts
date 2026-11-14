"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

export async function updateAdminActions(
  adminId: number | undefined,
  adminData: any,
) {
  const { admin_name, role, email, phone, customer_address, dob } = adminData;

  const cookieStore = await cookies();
  const token = cookieStore.get("admin_access_token")?.value;

  try {
    const result = await fetch(`${process.env.BACK_END_URL}/admin/${adminId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: `admin_access_token=${token}`,
      },
      body: JSON.stringify({
        admin_name,
        role,
        email,
        phone,
        customer_address,
        dob,
      }),
      cache: "no-store",
    });

    const responseUpdatedAdmin = await result.json();

    if (!result.ok) {
      return {
        success: false,
        error: responseUpdatedAdmin.message,
      };
    }

    revalidateTag(`allAdminsData`);

    return {
      success: true,
      data: responseUpdatedAdmin,
    };
  } catch (error) {
    console.error("Error managing admin:", error);

    return {
      success: false,
      error: error instanceof Error ? [error.message] : ["Backend unreachable"],
    };
  }
}
