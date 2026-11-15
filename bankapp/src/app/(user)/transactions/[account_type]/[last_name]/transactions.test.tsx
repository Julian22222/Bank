import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { apiServerFetch } from "@/src/lib/api-server";
import { UserProvider } from "../../../UserContext";
import StatementPage from "./page";

jest.mock("@/src/lib/api-server", () => ({
  apiServerFetch: jest.fn(),
}));

jest.mock("../../../user-page/UserPageHeader", () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock("@/src/components/Footer", () => ({
  __esModule: true,
  default: () => null,
}));

describe("StatementPage", () => {
  const transactions = [
    ...Array.from({ length: 21 }, (_, index) => ({
      transaction_id: index + 1,
      account_id: 101,
      customer_id: 1,
      money_amount: -10,
      balance: 1000 - (index + 1) * 10,
      details: `Transaction ${index + 1}`,
    })),
    {
      transaction_id: 22,
      account_id: 202,
      customer_id: 1,
      money_amount: 50,
      balance: 500,
      details: "Savings only",
    },
  ];

  const user = {
    customer_id: 1,
    first_name: "Taylor",
    last_name: "Doe",
    email: "taylor@example.com",
    phone: "+447700900000",
    customer_address: "1 High Street",
    dob: "1990-01-01",
  };
  const accounts = [
    {
      account_id: 101,
      customer_id: 1,
      account_type: "Main",
      account_nr: "12-34-56 / 12345678",
      status: "Active",
      overdraft_limit: 0,
      created_at: "2026-01-01",
      balance: 790,
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

  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(apiServerFetch).mockResolvedValue(transactions);
  });

  const renderStatement = async (account_type?: string) => {
    const page = await StatementPage({
      params: Promise.resolve({ account_type, last_name: "Doe" }),
    });

    return render(
      <UserProvider
        initialUser={user}
        initialUserAllAccounts={accounts}
        initialUserAllTransactions={transactions}
      >
        {page}
      </UserProvider>,
    );
  };

  it("fetches transactions and displays the selected account's transactions", async () => {
    await renderStatement("Main");

    expect(apiServerFetch).toHaveBeenCalledWith(
      `${process.env.BACK_END_URL}/transactions/my`,
      {
        cache: "no-store",
        next: { tags: ["transactions"] },
      },
    );
    expect(
      screen.getByRole("heading", { name: "Bank Statement of Main Account" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Transaction 1")).toBeInTheDocument();
    expect(screen.queryByText("Savings only")).not.toBeInTheDocument();
    expect(screen.queryByText("Transaction 21")).not.toBeInTheDocument();
  });

  it("filters transactions by description", async () => {
    const user = userEvent.setup();
    await renderStatement("Main");

    await user.type(screen.getByRole("searchbox"), "Transaction 21");

    expect(screen.getByText("Transaction 21")).toBeInTheDocument();
    expect(screen.queryByText("Transaction 1")).not.toBeInTheDocument();
  });

  it("moves through transaction pages", async () => {
    const user = userEvent.setup();
    await renderStatement("Main");

    await user.click(screen.getByRole("button", { name: "Next" }));

    expect(screen.getByText("Transaction 21")).toBeInTheDocument();
    expect(screen.queryByText("Transaction 1")).not.toBeInTheDocument();
  });
});
