"use server";

import { ICreateUser } from "../../../../shared/types/createNewUser.interface";
import { INewUserRegister } from "../../../../shared/types/newUserRegister.interface";
import { IUserWithAccount } from "@/src/shared/types/userWithAccount.interface";

type RegisterResponse =
  | {
      success: true;
      data: IUserWithAccount;
    }
  | {
      success: false;
      error: string[];
    };

export async function registerNewUser(
  newUserData: ICreateUser,
): Promise<RegisterResponse> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACK_END_URL}/users/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUserData),
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        error: Array.isArray(data.message)
          ? data.message
          : [data.message || "Registration failed"],
      };
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACK_END_URL}/admin/user-registration/`,
    );

    const getUsersFromRegister = await response.json();

    const matchedUser = getUsersFromRegister.find(
      (user: INewUserRegister) => user.email === newUserData.email,
    );

    if (matchedUser) {
      const registrationId = matchedUser.registration_id;

      const delUser = await fetch(
        //DELETE /admin/user-registration/email/:email
        `${process.env.NEXT_PUBLIC_BACK_END_URL}/admin/user-registration/${registrationId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const deleteResult = await delUser.json();

      if (!delUser.ok) {
        return {
          success: false,
          error: deleteResult.message || ["Failed to delete user registration"],
        };
      }
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error adding user:", error);
    return {
      success: false,
      error:
        error instanceof Error ? [error.message] : ["Unknown error occurred"],
    };
  }
}
