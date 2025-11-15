# Global UseState to use UseState in any component

Next.JS already has everything React has, including Context, useState, useReducer, and any global-state library.

# Options for Global State in Next.js

1. React Context (built-in)

Works the same as in any React app.

- in app folder create - Context.tsx file or any other name file

```JS
//Example: GlobalContext.tsx

"use client";
import { createContext, useContext, useState } from "react";

const GlobalContext = createContext(null);

export function GlobalProvider({ children }) {
  const [count, setCount] = useState(0);

  return (
    <GlobalContext.Provider value={{ count, setCount }}>
      {children}
    </GlobalContext.Provider>
  );
}

export function useGlobal() {
  return useContext(GlobalContext);
}
```

- Use it in your main layout:

```JS
// app/layout.tsx
import { GlobalProvider } from "./GlobalContext";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <GlobalProvider>{children}</GlobalProvider>
      </body>
    </html>
  );
}
```

- In any component to use

```JS
"use client";
import { useGlobal } from "../GlobalContext";

export default function MyComponent() {
  const { count, setCount } = useGlobal();

  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

2. Zustand (popular lightweight global store)
3. Redux Toolkit (if your app is large)
4. Server Actions / Server Context (Next.js-specific)
5. Jotai, Recoil, etc.
