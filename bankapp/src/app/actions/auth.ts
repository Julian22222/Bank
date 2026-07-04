//this code can be used only in client side components

export const loadUser = async () => {
  const meRes = await fetch(
    `${process.env.NEXT_PUBLIC_BACK_END_URL}/users/me`,
    {
      credentials: "include",
      cache: "no-store",
    },
  );

  if (!meRes.ok) {
    throw new Error("Failed to fetch user");
  }

  const userData = await meRes.json();

  console.log("auth file - meRes status:", meRes.status);
  console.log("auth file - userData", userData);

  console.log("User data in loadUser RETURN:", userData);
  return userData;
};
