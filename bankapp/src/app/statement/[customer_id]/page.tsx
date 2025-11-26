////If you pass some params (customer_id) -> to child component, child component can be server or client side component, to get id from URL for example
//Never use useGlobal() or context hooks inside the server component.
//layouts and pages are server components by default in Next.js 13+
//if you add "use cleint " to the layout, all its children will become client components too, which is not desired.
//If your layout or provider imports any "use client" modules incorrectly, or the page imports a client-only module in the wrong way, you may get the params Promise error after navigation.

import StatementClient from "./StatementClient";
import { use } from "react";
export default function StatementPage({
  params,
}: {
  params: Promise<{ customer_id: string }>; //params is a Promise that resolves to an object with customer_id
}) {
  console.log("SERVER check:", typeof window === "undefined");
  //"SERVER check: true" — this means your page is correctly a Server Component

  //params is a Promise and must be unwrapped with await or React.use() before accessing its properties
  const resolvedParams = use(params); // unwrap the Promise
  console.log("Statement Page Params:", resolvedParams.customer_id);

  return (
    <div>
      <form>
        <label>Search Statement:</label>
        <input />
        <button type="submit">Search</button>
      </form>
      <StatementClient />;
    </div>
  );
}
