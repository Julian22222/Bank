import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { adminApiServerFetch } from "@/src/lib/admin-api-server";
import AllTransactions from "./page";

jest.mock("@/src/lib/admin-api-server", () => ({
  adminApiServerFetch: jest.fn(),
}));

jest.mock("../../../../components/AdminPageHeader", () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock("../../../../components/AdminFooter", () => ({
  __esModule: true,
  default: () => null,
}));

describe("AllTransactions page", () => {
  const transactions = Array.from({ length: 21 }, (_, index) => ({
    transaction_id: index + 1,
    account_id: 10,
    customer_id: index + 1,
    money_amount: index === 0 ? -25.5 : 10,
    balance: 1000 + index,
    transaction_date: "2026-03-15T12:30:00.000Z",
    details: `Transaction ${index + 1}`,
    first_name: index === 0 ? "Ava" : `User${index + 1}`,
    last_name: index === 0 ? "Stone" : `Surname${index + 1}`,
    email: index === 0 ? "ava@example.com" : `user${index + 1}@example.com`,
    phone: "+447700900000",
    customer_address: "1 Market Street",
    dob: "1990-01-01",
    account_type: "Main",
  }));

  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(adminApiServerFetch).mockResolvedValue(transactions);
  });

  const renderPage = async () => render(await AllTransactions());

  it("fetches and displays all users' transactions", async () => {
    await renderPage();

    expect(adminApiServerFetch).toHaveBeenCalledWith(
      `${process.env.BACK_END_URL}/transactions/with-details`,
      { cache: "no-store" },
    );
    expect(
      screen.getByRole("heading", { name: "All Users Transactions" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Ava")).toBeInTheDocument();
    expect(screen.getByText("Stone")).toBeInTheDocument();
    expect(screen.getByText("Transaction 1")).toBeInTheDocument();
    expect(screen.getByText("-£25.50")).toBeInTheDocument();
  });

  it("filters transactions by a customer's email", async () => {
    const user = userEvent.setup();
    await renderPage();

    await user.type(
      screen.getByPlaceholderText("Search by name, surname or email..."),
      "ava@example.com",
    );

    expect(screen.getByText("Ava")).toBeInTheDocument();
    expect(screen.queryByText("User2")).not.toBeInTheDocument();
  });

  it("paginates through transactions", async () => {
    const user = userEvent.setup();
    await renderPage();

    expect(screen.getByText("Transaction 20")).toBeInTheDocument();
    expect(screen.queryByText("Transaction 21")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Next" }));

    expect(screen.getByText("Transaction 21")).toBeInTheDocument();
    expect(screen.queryByText("Transaction 1")).not.toBeInTheDocument();
  });
});
