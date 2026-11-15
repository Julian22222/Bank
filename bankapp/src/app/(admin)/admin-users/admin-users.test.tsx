import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { adminApiServerFetch } from "@/src/lib/admin-api-server";
import AdminUsersPage from "./page";

const mockPush = jest.fn();

jest.mock("@/src/lib/admin-api-server", () => ({
  adminApiServerFetch: jest.fn(),
}));

jest.mock("../../../components/AdminPageHeader", () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock("../../../components/AdminFooter", () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

describe("AdminUsersPage", () => {
  const users = [
    {
      customer_id: 7,
      first_name: "Ava",
      last_name: "Stone",
      email: "ava@example.com",
      phone: "+447700900007",
      customer_address: "7 Market Street",
      dob: "1992-05-10",
      account_id: 70,
      account_type: "Main",
      account_nr: "12-34-56 / 12345670",
    },
    {
      customer_id: 8,
      first_name: "Noah",
      last_name: "Reed",
      email: "noah@example.com",
      phone: "+447700900008",
      customer_address: "8 Market Street",
      dob: "1988-11-20",
      account_id: 80,
      account_type: "Saver",
      account_nr: "98-76-54 / 87654320",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(adminApiServerFetch).mockResolvedValue(users);
  });

  const renderPage = async () => render(await AdminUsersPage());

  it("fetches and displays users with their account details", async () => {
    await renderPage();

    expect(adminApiServerFetch).toHaveBeenCalledWith(
      `${process.env.BACK_END_URL}/accounts/with-customers`,
      { cache: "no-store", next: { tags: ["usersDataWithAccounts"] } },
    );
    expect(
      screen.getByRole("heading", { name: "User's data" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Ava")).toBeInTheDocument();
    expect(screen.getByText("Stone")).toBeInTheDocument();
    expect(screen.getByText("Main")).toBeInTheDocument();
    expect(screen.getByText("ava@example.com")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Register New User" }),
    ).toHaveAttribute("href", "/registration");
  });

  it("filters users using the selected search field", async () => {
    const user = userEvent.setup();
    await renderPage();

    await user.selectOptions(screen.getByRole("combobox"), "surname");
    await user.type(screen.getByRole("searchbox"), "reed");

    expect(screen.getByText("Noah")).toBeInTheDocument();
    expect(screen.queryByText("Ava")).not.toBeInTheDocument();
  });

  it("opens the selected user's admin details", async () => {
    const user = userEvent.setup();
    await renderPage();

    await user.click(screen.getByRole("row", { name: /Ava Stone/ }));

    expect(mockPush).toHaveBeenCalledWith("/admin/7");
  });
});
