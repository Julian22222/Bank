import { render } from "@testing-library/react";
import { RequestCookies } from "next/dist/compiled/@edge-runtime/cookies";
import { RequestCookiesAdapter } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { cookies } from "next/headers";
import { apiServerFetch } from "@/src/lib/api-server";
import UserDashboard from "./UserDashboard";
import UserPage from "./page";

jest.mock("next/headers", () => ({
  cookies: jest.fn(),
}));

jest.mock("@/src/lib/api-server", () => ({
  apiServerFetch: jest.fn(),
}));

jest.mock("./UserDashboard", () => ({
  __esModule: true,
  default: jest.fn(() => null),
}));

describe("UserPage", () => {
  const transactions = [
    {
      transaction_id: 1,
      account_id: 12,
      customer_id: 4,
      money_amount: 25,
      balance: 125,
      details: "Deposit",
    },
    {
      transaction_id: 2,
      account_id: 34,
      customer_id: 4,
      money_amount: -10,
      balance: 115,
      details: "Purchase",
    },
  ];
  const accountsWithBalance = {
    account_id: 34,
    customer_id: 4,
    account_type: "Main",
    account_nr: "12-34-56 / 98765432",
    status: "Active",
    overdraft_limit: 0,
    created_at: "2026-01-01",
    balance: 115,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
    jest
      .mocked(cookies)
      .mockResolvedValue(
        RequestCookiesAdapter.seal(
          new RequestCookies(
            new Headers({ cookie: "access_token=test-access-token" }),
          ),
        ),
      );
    jest
      .mocked(apiServerFetch)
      .mockResolvedValueOnce(transactions)
      .mockResolvedValueOnce(accountsWithBalance);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("fetches transactions and balances, then renders the dashboard with both results", async () => {
    const page = await UserPage();
    render(page);

    expect(apiServerFetch).toHaveBeenNthCalledWith(
      1,
      `${process.env.BACK_END_URL}/transactions/my`,
      expect.objectContaining({
        headers: { Cookie: "access_token=test-access-token" },
        cache: "no-store",
        next: { tags: ["transactions"] },
      }),
    );
    expect(apiServerFetch).toHaveBeenNthCalledWith(
      2,
      `${process.env.BACK_END_URL}/accounts/user/34/with-balance`,
      expect.objectContaining({
        cache: "no-store",
        next: { tags: ["userAllAccountsLastBalance"] },
      }),
    );

    expect(jest.mocked(UserDashboard).mock.calls[0][0]).toEqual({
      allUserTransactions: transactions,
      userAllAccLastBalance: accountsWithBalance,
    });
  });

  it("propagates an error when fetching transactions fails", async () => {
    const fetchError = new Error("Unable to fetch transactions");
    jest.mocked(apiServerFetch).mockReset().mockRejectedValueOnce(fetchError);

    await expect(UserPage()).rejects.toThrow(fetchError);
    expect(apiServerFetch).toHaveBeenCalledTimes(1);
    expect(UserDashboard).not.toHaveBeenCalled();
  });
});
