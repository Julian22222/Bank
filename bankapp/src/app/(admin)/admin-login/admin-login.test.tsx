import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { loadAdminClient } from "../../actions/auth-admin-client";
import { AdminProvider, useAdmin } from "../AdminContext";
import AdminLoginPage from "./page";

const mockPush = jest.fn();
const mockFetch = jest.fn();

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

jest.mock("../../actions/auth-admin-client", () => ({
  loadAdminClient: jest.fn(),
}));

function AdminStateProbe() {
  const { activeAdmin } = useAdmin();

  return (
    <output data-testid="admin-state">{JSON.stringify(activeAdmin)}</output>
  );
}

describe("AdminLoginPage", () => {
  const admin = {
    admin_id: 3,
    role: "admin",
    admin_name: "Taylor Admin",
    email: "taylor@example.com",
    phone: "+447700900003",
    customer_address: "3 Admin Road",
    dob: "1988-08-08",
    created_at: "2025-01-01",
  };

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

  const renderPage = () =>
    render(
      <AdminProvider initialAdmin={null}>
        <AdminLoginPage />
        <AdminStateProbe />
      </AdminProvider>,
    );

  it("renders admin login controls and the return link", () => {
    renderPage();

    expect(
      screen.getByRole("heading", { name: "Log on to your Admin account" }),
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter your Admin ID")).toBeRequired();
    expect(screen.getByPlaceholderText("Enter your Password")).toBeRequired();
    expect(
      screen.getByRole("checkbox", { name: "Remember my Admin ID" }),
    ).not.toBeChecked();
    expect(
      screen.getByRole("link", { name: "Back to Main Page" }),
    ).toHaveAttribute("href", "/");
  });

  it("logs in, updates the admin context, and navigates to the admin dashboard", async () => {
    const user = userEvent.setup();
    mockFetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ message: "Logged in" }),
    } as unknown as Response);
    jest.mocked(loadAdminClient).mockResolvedValue(admin);
    renderPage();

    await user.type(
      screen.getByPlaceholderText("Enter your Admin ID"),
      admin.email,
    );
    await user.type(
      screen.getByPlaceholderText("Enter your Password"),
      "safe-password",
    );
    await user.click(
      screen.getByRole("checkbox", { name: "Remember my Admin ID" }),
    );
    await user.click(screen.getByRole("button", { name: "Login as Admin" }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/admin");
    });
    expect(mockFetch).toHaveBeenCalledWith(
      "/api/auth-admin/login",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          email: admin.email,
          password: "safe-password",
          rememberMe: true,
        }),
      }),
    );
    expect(loadAdminClient).toHaveBeenCalled();
    expect(
      JSON.parse(screen.getByTestId("admin-state").textContent ?? ""),
    ).toEqual(admin);
  });

  it("shows an error and does not load the admin when credentials are rejected", async () => {
    const user = userEvent.setup();
    mockFetch.mockResolvedValue({
      ok: false,
      json: jest.fn().mockResolvedValue({ message: "Invalid credentials" }),
      text: jest.fn().mockResolvedValue("Invalid credentials"),
    } as unknown as Response);
    renderPage();

    await user.type(
      screen.getByPlaceholderText("Enter your Admin ID"),
      admin.email,
    );
    await user.type(
      screen.getByPlaceholderText("Enter your Password"),
      "wrong-password",
    );
    await user.click(screen.getByRole("button", { name: "Login as Admin" }));

    expect(
      await screen.findByText("Invalid Admin ID or Password"),
    ).toBeInTheDocument();
    expect(loadAdminClient).not.toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalled();
  });
});
