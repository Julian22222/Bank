import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { adminApiServerFetch } from "@/src/lib/admin-api-server";
import { AdminProvider } from "../../AdminContext";
import UsersData from "./page";

const mockPush = jest.fn();

jest.mock("@/src/lib/admin-api-server", () => ({
  adminApiServerFetch: jest.fn(),
}));

jest.mock("../../../../components/AdminPageHeader", () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock("./AdminEditUserModule", () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock("./AdminEditUserPasswordModule", () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

describe("Admin user details page", () => {
  const customerId = "42";
  const userData = {
    customer_id: 42,
    first_name: "Ava",
    last_name: "Stone",
    email: "ava@example.com",
    phone: "+447700900042",
    customer_address: "42 Market Street",
    dob: "1992-05-10",
    phone_verified: true,
    email_verified: false,
    created_at: "2025-01-10",
  };
  const accounts = [
    {
      account_id: 420,
      customer_id: 42,
      account_type: "Main",
      account_nr: "12-34-56 / 12345670",
      status: "Active",
      overdraft_limit: 0,
      created_at: "2025-01-10",
      balance: 1250,
    },
  ];
  const admin = {
    admin_id: 3,
    role: "superAdmin",
    admin_name: "Morgan Admin",
    email: "morgan@example.com",
    phone: "+447700900003",
    customer_address: "3 Admin Road",
    dob: "1985-06-15",
    created_at: "2025-01-01",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest
      .mocked(adminApiServerFetch)
      .mockResolvedValueOnce(userData)
      .mockResolvedValueOnce(accounts);
  });

  const renderPage = async () => {
    const page = await UsersData({
      params: Promise.resolve({ customer_id: customerId }),
    });

    return render(<AdminProvider initialAdmin={admin}>{page}</AdminProvider>);
  };

  it("fetches and displays the selected customer's details and accounts", async () => {
    await renderPage();

    expect(adminApiServerFetch).toHaveBeenNthCalledWith(
      1,
      `${process.env.BACK_END_URL}/users/${customerId}`,
      { cache: "no-store", next: { tags: ["userData-Page"] } },
    );
    expect(adminApiServerFetch).toHaveBeenNthCalledWith(
      2,
      `${process.env.BACK_END_URL}/accounts/user/${customerId}/accounts-balance`,
      { cache: "no-store", next: { tags: ["userAccounts-Page"] } },
    );

    expect(screen.getByText("Ava Stone")).toBeInTheDocument();
    expect(screen.getByText("Customer ID: 42")).toBeInTheDocument();
    expect(screen.getByText("ava@example.com")).toBeInTheDocument();
    expect(screen.getByText("42 Market Street")).toBeInTheDocument();
    expect(screen.getByText("Account Types")).toBeInTheDocument();
    expect(screen.getByText("Main")).toBeInTheDocument();
    expect(
      screen.getByText("Account Nr: 12-34-56 / 12345670"),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "View" })).toHaveAttribute(
      "href",
      "/admin/user_messages?userId=42",
    );
  });

  it("navigates to the selected account's transactions", async () => {
    const user = userEvent.setup();
    await renderPage();

    await user.click(screen.getAllByRole("button", { name: "View" })[0]);

    expect(mockPush).toHaveBeenCalledWith("/admin/transactions/42/420");
  });
});
