//This is where refresh logic usually lives.
// For refresh tokken and access tokken generation and validation.

//Then Use It Everywhere, For example for profile route -> apiFetch('/profile')
//thi s will automatically add the access token to the header and retry once if the access token is expired.

export async function apiFetch(url: string, options: RequestInit = {}) {
  let response = await fetch(url, {
    ...options,
    credentials: "include",
  });

  // Access token expired
  if (response.status === 401) {
    const refreshResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BACK_END_URL}/auth/refresh`,
      {
        method: "POST",
        credentials: "include",
      },
    );

    if (refreshResponse.ok) {
      // Retry original request
      response = await fetch(url, {
        ...options,
        credentials: "include",
      });
    }
  }

  return response;
}
