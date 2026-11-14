import { apiServerFetch } from "@/src/lib/api-server";
import MessagesDashboard from "./MessagesDashboard";

const fetchAllUserMessages = async () => {
  try {
    const data = await apiServerFetch(
      `${process.env.BACK_END_URL}/messages/my`,
      {
        cache: "no-store",
        next: { tags: ["allUserMessages"] },
      },
    );

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default async function Messages() {
  const userAllMessages = await fetchAllUserMessages();

  return <MessagesDashboard userAllMessages={userAllMessages} />;
}
