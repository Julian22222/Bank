✔️ How Login Should Be Done in Next.js

You should:

1. Send the email + password → to an API route
2. Validate credentials on the server
3. Return a session token (JWT or cookie)

```JS
//Example:

//app/api/login/route.ts (server)

export async function POST(req: Request) {

  const { email, password } = await req.json();

  const user = await findUserInDatabase(email);

  if (!user || user.password !== password) {
    return new Response("Invalid credentials", { status: 401 });
  }

  return Response.json({ user });
}



//Client component

const handleSubmit = async (e) => {
  e.preventDefault();

  const res = await fetch("/api/login", {
    method: "POST",
    body: JSON.stringify(formInput),
  });

  if (res.ok) {
    const data = await res.json();
    setActiveUser(data.user);
    router.push("/user-page");
  } else {
    setLoginError(true);
  }
};

No need to fetch all users on the client.

```
