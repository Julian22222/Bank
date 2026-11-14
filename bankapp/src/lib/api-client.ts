//Don't try to create one function that directly contacts Nest.js from both client and server components
//Separate the client and server fetch functions, because the the have different requirements for cookies and headers. The server fetch function can read httpOnly cookies, while the client fetch function cannot. The client fetch function needs to use Route Handling to set cookies in the browser, while the server fetch function can directly read cookies from the request.
//This is where refresh logic usually lives.
// For refresh token and access tokken generation and validation.

//Then Use It Everywhere, For example for profile route -> apiClientFetch('/profile') or apiServerFetch('/profile')
//this will automatically add the access token to the header and retry once if the access token is expired.

export async function apiClientFetch(path: string, options: RequestInit = {}) {
  // export async function apiClientFetch(url: string, options: RequestInit = {}) {

  // const headers = new Headers(options.headers);

  let response = await fetch(`/api/${path}`, {
    //use Route Handler to use httpOnly cookies (can use userId from cookies) and process.env.BACK_END_URL
    // let response = await fetch(url, {
    ...options,
    credentials: "include", //attaches the cookie in Client component fetch request
    headers: { "Content-Type": "application/json", ...options.headers },
    cache: "no-store",
  });

  // Access token expired — try refresh BEFORE reading the body
  if (response.status === 401) {
    const refreshResponse = await fetch(`/api/auth/refresh`, {
      //use Route Handling to setup new access token in the browser cookie
      method: "POST",
      credentials: "include",
      cache: "no-store",
    });

    if (refreshResponse.ok) {
      response = await fetch(`/api/${path}`, {
        // response = await fetch(url, {
        ...options,
        credentials: "include", //attaches the cookie in Client component fetch request
        cache: "no-store",
      });
    } else {
      // No router access here — just signal it clearly to the caller.
      throw new Error("SESSION_EXPIRED");
    }
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || "API request failed");
  }

  return data;
}
