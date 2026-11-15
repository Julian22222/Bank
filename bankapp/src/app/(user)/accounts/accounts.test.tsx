import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { apiServerFetch } from "@/src/lib/api-server";
import { UserProvider } from "../UserContext";
import CustomerAccountsPage from "./page";

jest.mock("@/src/lib/api-server", () => ({
  apiServerFetch: jest.fn(),
}));

jest.mock("../user-page/UserPageHeader", () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock("@/src/components/Footer", () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn() }),
}));

jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
  revalidateTag: jest.fn(),
}));

describe("CustomerAccountsPage", () => {
  const accounts = [
    {
      account_id: 101,
      customer_id: 1,
      account_type: "Main",
      account_nr: "12-34-56 / 12345678",
      status: "Active",
      overdraft_limit: 0,
      created_at: "2026-01-01",
      balance: 1250,
    },
    {
      account_id: 202,
      customer_id: 1,
      account_type: "Saver",
      account_nr: "98-76-54 / 87654321",
      status: "Active",
      overdraft_limit: 0,
      created_at: "2026-01-01",
      balance: 500,
    },
  ];

  const saverAccountTypes = [
    {
      account_name: "Saver",
      interest: 2.5,
      money_limit: 10000,
      account_duration: 12,
    },
    {
      account_name: "ISA",
      interest: 3.1,
      money_limit: 20000,
      account_duration: 24,
    },
  ];

  const activeUser = {
    customer_id: 1,
    first_name: "Taylor",
    last_name: "Doe",
    email: "taylor@example.com",
    phone: "+447700900000",
    customer_address: "1 High Street",
    dob: "1990-01-01",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest
      .mocked(apiServerFetch)
      .mockResolvedValueOnce(accounts)
      .mockResolvedValueOnce(saverAccountTypes);
  });

  const renderAccountsPage = async () => {
    const page = await CustomerAccountsPage();

    return render(
      <UserProvider
        initialUser={activeUser}
        initialUserAllAccounts={accounts}
        initialUserAllTransactions={[]}
      >
        {page}
      </UserProvider>,
    );
  };

  it("fetches and displays account balances and saver interest", async () => {
    await renderAccountsPage();

    expect(apiServerFetch).toHaveBeenNthCalledWith(
      1,
      `${process.env.BACK_END_URL}/accounts/my-accounts-balance`,
      {
        cache: "no-store",
        next: { tags: ["allAccountsWithBalance"] },
      },
    );
    expect(apiServerFetch).toHaveBeenNthCalledWith(
      2,
      `${process.env.BACK_END_URL}/accounts/saver-account/types`,
      { cache: "no-store" },
    );

    expect(
      screen.getByRole("heading", { name: "Customer Accounts" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Main Account")).toBeInTheDocument();
    expect(screen.getByText("12-34-56 / 12345678")).toBeInTheDocument();
    expect(screen.getByText("£1250")).toBeInTheDocument();
    expect(screen.getByText("2.5% interest")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Manage Main" })).toHaveAttribute(
      "href",
      "/transactions/Main/Doe",
    );
  });

  it("shows account options and disables account types the user already has", async () => {
    const user = userEvent.setup();
    await renderAccountsPage();

    await user.click(screen.getByRole("button", { name: "Open New Account" }));

    expect(
      screen.getByRole("button", { name: "Saver Account" }),
    ).toBeDisabled();
    expect(screen.getByRole("button", { name: "ISA Account" })).toBeEnabled();
  });
});
