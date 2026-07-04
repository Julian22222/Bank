//This is where refresh logic usually lives.
// For refresh tokken and access tokken generation and validation.

//Then Use It Everywhere, For example for profile route -> apiFetch('/profile')
//thi s will automatically add the access token to the header and retry once if the access token is expired.

export async function apiFetch(url: string, options: RequestInit = {}) {
  let accessToken = localStorage.getItem("access_token");

  // First request
  let response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    },
  });

  // Access token expired
  if (response.status === 401) {
    const refreshToken = localStorage.getItem("refresh_token");

    // Request new access token
    const refreshResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BACK_END_URL}/auth/refresh`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refresh_token: refreshToken,
        }),
      },
    );

    // Get new token
    const refreshData = await refreshResponse.json();

    accessToken = refreshData.access_token;

    // Save new access token
    localStorage.setItem("access_token", accessToken ?? "");

    // Retry original request
    response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  return response;
}
