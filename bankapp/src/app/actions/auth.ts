//this code can be used only in client side components

export const loadUser = async () => {
  const meRes = await fetch(`api/users/me`, { credentials: "include" }); // hits your own /api/users/me route

  if (!meRes.ok) {
    throw new Error("Failed to fetch user");
  }

  const userData = await meRes.json();

  console.log("auth file - meRes status:", meRes.status);
  console.log("auth file - userData", userData);

  console.log("User data in loadUser RETURN:", userData);
  return userData;
};
