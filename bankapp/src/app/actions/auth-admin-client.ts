//to send cookies from client component - use Route Handling

export const loadAdminClient = async () => {
  const meRes = await fetch(`/api/admin/me`, {
    credentials: "include",
    cache: "no-store",
  });

  if (!meRes.ok) {
    const body = await meRes.text();
    console.error("admin/me failed:", meRes.status, body);
    throw new Error(`Failed to fetch admin (${meRes.status}): ${body}`);
  }

  const adminData = await meRes.json();

  console.log("auth file - meRes status:", meRes.status);
  console.log("auth file - adminData", adminData);

  console.log("Admin data in loadAdmin RETURN:", adminData);
  return adminData;
};
