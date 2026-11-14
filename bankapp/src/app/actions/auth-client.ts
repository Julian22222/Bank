//to send cookies from client component - use Route Handling

export const loadUserClient = async () => {
  const meRes = await fetch(`/api/users/me`, {
    credentials: "include",
    cache: "no-store",
  });

  if (!meRes.ok) {
    throw new Error("Failed to fetch user");
  }

  const userData = await meRes.json();

  console.log("auth file - meRes status:", meRes.status);
  console.log("auth file - userData", userData);

  console.log("User data in loadUser RETURN:", userData);
  return userData;
};
