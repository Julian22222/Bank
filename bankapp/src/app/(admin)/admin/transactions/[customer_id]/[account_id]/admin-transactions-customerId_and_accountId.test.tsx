import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { adminApiServerFetch } from "@/src/lib/admin-api-server";
import { AdminProvider } from "../../../../AdminContext";
import AdminUserTransactions from "./page";

jest.mock("@/src/lib/admin-api-server", () => ({
  adminApiServerFetch: jest.fn(),
}));

jest.mock("../../../../../../components/AdminPageHeader", () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock("./AdminTransactionModule", () => ({
  __esModule: true,
  default: () => <div>Transaction Form</div>,
}));

jest.mock("./OverdraftFormModule", () => ({
  __esModule: true,
  default: () => <div>Overdraft Limit Form</div>,
}));

describe("Admin user transactions page", () => {
  const customerId = "42";
  const accountId = "420";
  const transactions = [
    {
      transaction_id: 1,
      account_id: 420,
      customer_id: 42,
      money_amount: -25.5,
      balance: 124.5,
      transaction_date: "2026-03-15T12:30:00.000Z",
      details: "Card payment",
    },
  ];
  const accounts = [
    {
      account_id: 420,
      customer_id: 42,
      account_type: "Main",
      overdraft_limit: 200,
    },
    {
      account_id: 421,
      customer_id: 42,
      account_type: "Savings",
      overdraft_limit: 0,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    jest
      .mocked(adminApiServerFetch)
      .mockResolvedValueOnce(transactions)
      .mockResolvedValueOnce(accounts);
  });

  const renderPage = async () => {
    const page = await AdminUserTransactions({
      params: Promise.resolve({
        customer_id: customerId,
        account_id: accountId,
      }),
    });

    return render(<AdminProvider initialAdmin={null}>{page}</AdminProvider>);
  };

  it("fetches and displays the selected account's transactions", async () => {
    await renderPage();

    expect(adminApiServerFetch).toHaveBeenNthCalledWith(
      1,
      `${process.env.BACK_END_URL}/transactions/${customerId}/accounts/${accountId}`,
      { cache: "no-store", next: { tags: ["userTransactionsAdminPage"] } },
    );
    expect(adminApiServerFetch).toHaveBeenNthCalledWith(
      2,
      `${process.env.BACK_END_URL}/accounts/user/${customerId}/accounts-balance`,
      {
        cache: "no-store",
        next: { tags: ["userAccountsWithBalanceAdminPage"] },
      },
    );

    expect(
      screen.getByRole("heading", { name: "Bank Statement of Main Account" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Card payment")).toBeInTheDocument();
    expect(screen.getByText("-£25.5")).toBeInTheDocument();
    expect(screen.getByText("£124.5")).toBeInTheDocument();
    expect(screen.getByText("Overdraft Limit: 200")).toBeInTheDocument();
  });

  it("opens the transaction form from the selected account's statement", async () => {
    const user = userEvent.setup();
    await renderPage();

    await user.click(screen.getByRole("button", { name: "Add Transaction" }));

    expect(screen.getByText("Transaction Form")).toBeInTheDocument();
  });

  it("throws when the requested account is not returned", async () => {
    jest
      .mocked(adminApiServerFetch)
      .mockReset()
      .mockResolvedValueOnce(transactions)
      .mockResolvedValueOnce(
        accounts.filter((account) => account.account_id !== 420),
      );

    await expect(
      AdminUserTransactions({
        params: Promise.resolve({
          customer_id: customerId,
          account_id: accountId,
        }),
      }),
    ).rejects.toThrow("Account not found");
  });
});
