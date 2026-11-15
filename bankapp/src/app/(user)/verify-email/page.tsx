//when user clicks on email-verification link -> redirects to this page

//It’s a server component that reads token from the URL (/verify-email?token=abc123).
// If the token appears more than once in the URL, it takes the first one. It then passes the token to VerifyEmailClient, which does the clicking and calls the backend.

import VerifyEmailClient from "./VerifyEmailClient";

type PageProps = {
  searchParams: Promise<{ token?: string | string[] }>;
};

export default async function VerifyEmailPage({ searchParams }: PageProps) {
  const { token } = await searchParams;
  const tokenValue = Array.isArray(token) ? token[0] : token;

  return <VerifyEmailClient token={tokenValue} />;
}

//Notes from email/email.service.ts - describing the flow
// Before the click (sending):
// The backend makes a random token and stores only its hash (sha256) in the database, with a 15-minute expiry.
// The email gets the raw token in the link: http://localhost:3000/verify-email?token=abc123...

// When the user clicks “Verify email”:
// 1.The browser opens your Next.js app. The link goes to localhost:3000/verify-email, so you need a page at that route. If it doesn’t exist, the user sees a 404.
// 2.The page reads the token from the URL and sends it to your Nest backend, for example POST /auth/verify-email with { token }.
// 3.The backend hashes the token the same way (sha256) and looks for that hash in the database. The raw token is never stored, so a database leak doesn’t give attackers working links.
// 4.The backend checks the record:
// -Does a matching hash exist?
// -Has it expired (older than 15 minutes)?
// -Has it already been used?
// 5.If everything is fine: the backend marks the user’s email as verified, marks the token as used (or deletes it), and returns success. If not: it returns an error such as “link invalid or expired”.
// 6.The page shows the result. On success it says “Email verified” and sends the user to login or the dashboard. On failure it shows the error and a “Send a new link” button. That button calls your existing send flow, which invalidates old tokens and creates a fresh one.

// Good practices
// Do the actual verification with a POST, not just by loading the page. Email security scanners often open links automatically, and they shouldn’t be able to verify an account by accident.
// Make each token single-use, and give a clear message when it’s expired.
