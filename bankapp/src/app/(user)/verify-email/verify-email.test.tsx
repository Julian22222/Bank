import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import VerifyEmailPage from "./page";
import { verifyEmailAction } from "../../actions/verifyEmailActions";

jest.mock("../../actions/verifyEmailActions", () => ({
  verifyEmailAction: jest.fn(),
}));

describe("VerifyEmailPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderPage = async (token?: string | string[]) => {
    const page = await VerifyEmailPage({
      searchParams: Promise.resolve({ token }),
    });

    return render(page);
  };

  it("shows a sign-in link when the verification token is missing", async () => {
    await renderPage();

    expect(
      screen.getByRole("heading", { name: "Verification link is incomplete" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Go to sign in" })).toHaveAttribute(
      "href",
      "/login",
    );
    expect(screen.queryByRole("button", { name: "Verify email" })).toBeNull();
  });

  it("verifies the first token in the URL and shows success", async () => {
    const user = userEvent.setup();
    jest.mocked(verifyEmailAction).mockResolvedValue({
      ok: true,
      message: "Your email address is verified.",
    });
    await renderPage(["first-token", "second-token"]);

    await user.click(screen.getByRole("button", { name: "Verify email" }));

    expect(verifyEmailAction).toHaveBeenCalledWith("first-token");
    expect(
      await screen.findByRole("heading", { name: "Email verified" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Bank app" })).toHaveAttribute(
      "href",
      "/accounts",
    );
  });

  it("shows the error from the verification action", async () => {
    const user = userEvent.setup();
    jest.mocked(verifyEmailAction).mockResolvedValue({
      ok: false,
      message: "This link is invalid or has expired.",
    });
    await renderPage("expired-token");

    await user.click(screen.getByRole("button", { name: "Verify email" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "This link is invalid or has expired.",
    );
  });
});
