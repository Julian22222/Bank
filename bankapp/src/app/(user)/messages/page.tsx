import { apiFetch } from "@/src/lib/api";
import MessagesDashboard from "./MessagesDashboard";
import { cookies } from "next/headers";

const fetchAllUserMessages = async () => {
  const cookieStore = await cookies();

  const response = await apiFetch(
    `${process.env.NEXT_PUBLIC_BACK_END_URL}/messages/my`,
    {
      headers: {
        //JwtAuthGuard requires a JWT, If your JWT is stored in a cookie, then req.user. Needs this code
        Cookie: cookieStore.toString(),
      },
      cache: "no-store",
      next: { tags: ["allUserMessages"] },
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch all user messages");
  }

  // console.log("Fetched user messages FROM messages/page.tsx:", data);
  return data;
};

export default async function Messages() {
  const userAllMessages = await fetchAllUserMessages();

  return <MessagesDashboard userAllMessages={userAllMessages} />;
}
