// src/lib/askAssistant.ts
import { apiClientFetch } from "@/src/lib/api-client";

export async function askAssistant(message: string): Promise<string> {
  const data = await apiClientFetch("/api/assistant", {
    method: "POST",
    body: JSON.stringify({ message }),
  });
  return data.reply;
}
