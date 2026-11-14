"use client";

import dynamic from "next/dynamic";
// import AssistantButton from "./AssistentBtn";
import { askAssistant } from "@/src/lib/askAssistant";

const AssistantBtn = dynamic(() => import("./AssistantBtn"), {
  ssr: false,
});

export default function AssistantWidget() {
  return <AssistantBtn onSend={askAssistant} />;
}

//Lazy-load it. A chat widget isn’t needed for first paint, so you can keep it out of the initial bundle:
// ssr: false is allowed here because the wrapper is a Client Component. It’s a small saving, so only bother if bundle size matters to you.
// 2. Only render it where it makes sense. Put <AssistantWidget /> in the layout of the authenticated area ((user)) rather than the root layout, so it doesn’t appear on the login page, and use your role or session checks if only some users should see it.

// The wrapper should stay “dumb”: no data fetching, state or business logic. If it grows beyond wiring props together, that logic belongs in the helper or in the component itself.
