import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { apiClientFetch } from "@/src/lib/api-client";
import { loadUserClient } from "../../actions/auth-client";
import { UserProvider, useUser } from "../UserContext";
import LoginPage from "./page";

const mockPush = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock("@/src/app/(user)/Header", () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock("@/src/components/Footer", () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock("../../actions/auth-client", () => ({
  loadUserClient: jest.fn(),
}));

jest.mock("@/src/lib/api-client", () => ({
  apiClientFetch: jest.fn(),
}));

function UserStateProbe() {
  const { activeUser, userAccountType, currUserAllAccounts } = useUser();

  return (
    <output data-testid="user-state">
      {JSON.stringify({ activeUser, userAccountType, currUserAllAccounts })}
    </output>
  );
}

describe("LoginPage", () => {
  const activeUser = {
    customer_id: 5,
    first_name: "Taylor",
    last_name: "Doe",
    email: "taylor@example.com",
    phone: "+447700900000",
    customer_address: "1 High Street",
    dob: "1990-01-01",
  };
  const accounts = [
    {
      account_id: 12,
      customer_id: 5,
      account_type: "Main",
      account_nr: "12-34-56 / 12345678",
      status: "Active",
      overdraft_limit: 0,
      created_at: "2026-01-01",
      balance: 250,
    },
  ];

  const mockFetch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    Object.defineProperty(globalThis, "fetch", {
      configurable: true,
      writable: true,
      value: mockFetch,
    });
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
    Reflect.deleteProperty(globalThis, "fetch");
  });

  const renderLoginPage = async () => {
    const page = await LoginPage();

    return render(
      <UserProvider
        initialUser={null}
        initialUserAllAccounts={[]}
        initialUserAllTransactions={[]}
      >
        {page}
        <UserStateProbe />
      </UserProvider>,
    );
  };

  it("renders login controls and redirects to admin login", async () => {
    const user = userEvent.setup();
    await renderLoginPage();

    expect(
      screen.getByRole("heading", { name: "Log on to your account" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/never ask you to move money/i),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Login as Admin" }));

    expect(mockPush).toHaveBeenCalledWith("/admin-login");
  });

  it("logs in, updates the user context, and navigates to the dashboard", async () => {
    const user = userEvent.setup();
    mockFetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ message: "Logged in" }),
    } as unknown as Response);
    jest.mocked(loadUserClient).mockResolvedValue(activeUser);
    jest.mocked(apiClientFetch).mockResolvedValue(accounts);
    await renderLoginPage();

    await user.type(
      screen.getByPlaceholderText("Enter your User ID"),
      activeUser.email,
    );
    await user.type(
      screen.getByPlaceholderText("Enter your Password"),
      "safe-password",
    );
    await user.click(screen.getByRole("button", { name: "Login" }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/user-page");
    });
    expect(mockFetch).toHaveBeenCalledWith(
      "/api/auth/login",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          email: activeUser.email,
          password: "safe-password",
        }),
      }),
    );
    expect(apiClientFetch).toHaveBeenCalledWith(
      `/accounts/user/${activeUser.customer_id}/accounts-balance`,
    );
    expect(
      JSON.parse(screen.getByTestId("user-state").textContent ?? ""),
    ).toEqual({
      activeUser,
      userAccountType: "Main",
      currUserAllAccounts: accounts,
    });
  });

  it("displays an error when the login request is rejected", async () => {
    const user = userEvent.setup();
    mockFetch.mockResolvedValue({
      ok: false,
      json: jest.fn().mockResolvedValue({ message: "Invalid credentials" }),
      text: jest.fn().mockResolvedValue("Invalid credentials"),
    } as unknown as Response);
    await renderLoginPage();

    await user.type(
      screen.getByPlaceholderText("Enter your User ID"),
      activeUser.email,
    );
    await user.type(
      screen.getByPlaceholderText("Enter your Password"),
      "wrong-password",
    );
    await user.click(screen.getByRole("button", { name: "Login" }));

    expect(
      await screen.findByText("Invalid User Email or Password"),
    ).toBeInTheDocument();
    expect(loadUserClient).not.toHaveBeenCalled();
    expect(apiClientFetch).not.toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalled();
  });
});
