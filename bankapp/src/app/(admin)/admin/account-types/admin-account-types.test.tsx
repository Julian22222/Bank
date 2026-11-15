import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { adminApiServerFetch } from "@/src/lib/admin-api-server";
import { addNewSaverAccount } from "@/src/app/actions/addNewSaverAccount";
import AccountTypesPage from "./page";

const mockPush = jest.fn();

jest.mock("@/src/lib/admin-api-server", () => ({
  adminApiServerFetch: jest.fn(),
}));

jest.mock("@/src/components/AdminPageHeader", () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock("@/src/app/actions/addNewSaverAccount", () => ({
  addNewSaverAccount: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

describe("AccountTypesPage", () => {
  const accountTypes = [
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

  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(adminApiServerFetch).mockResolvedValue(accountTypes);
  });

  const renderPage = async () => render(await AccountTypesPage());

  const openAndFillForm = async () => {
    const user = userEvent.setup();
    await renderPage();
    await user.click(
      screen.getByRole("button", { name: "Add new Saver Account" }),
    );
    await user.type(
      screen.getByLabelText("New Saver Account Name"),
      "Premium Saver",
    );
    await user.type(screen.getByLabelText("Interest (%)"), "4.25");
    await user.type(screen.getByLabelText("Money limit (£)"), "50000");
    await user.type(screen.getByLabelText("Duration (months)"), "18");

    return user;
  };

  it("fetches and displays saver account types", async () => {
    await renderPage();

    expect(adminApiServerFetch).toHaveBeenCalledWith(
      `${process.env.BACK_END_URL}/accounts/saver-account/types`,
      {
        next: { tags: ["accountTypes"] },
        cache: "no-store",
      },
    );
    expect(
      screen.getByRole("heading", { name: "Bank Saving Account Types" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Saver")).toBeInTheDocument();
    expect(screen.getByText("2.5%")).toBeInTheDocument();
    expect(screen.getByText("£10000")).toBeInTheDocument();
    expect(screen.getByText("12 months")).toBeInTheDocument();
    expect(screen.getByText("ISA")).toBeInTheDocument();
  });

  it("submits a new saver type with numeric values and closes the form", async () => {
    const user = await openAndFillForm();
    jest.mocked(addNewSaverAccount).mockResolvedValue({
      success: true,
      data: {
        account_name: "Premium Saver",
        interest: 4.25,
        money_limit: 50000,
        account_duration: 18,
      },
    });

    await user.click(screen.getByRole("button", { name: "Submit" }));

    await waitFor(() => {
      expect(addNewSaverAccount).toHaveBeenCalledWith({
        account_name: "Premium Saver",
        interest: 4.25,
        money_limit: 50000,
        account_duration: 18,
      });
    });
    expect(
      screen.queryByRole("heading", { name: "Add New Saver Account" }),
    ).not.toBeInTheDocument();
  });

  it("displays an error returned while adding a saver account type", async () => {
    const user = await openAndFillForm();
    jest.mocked(addNewSaverAccount).mockResolvedValue({
      success: false,
      error: ["Account type already exists"],
    });

    await user.click(screen.getByRole("button", { name: "Submit" }));

    expect(
      await screen.findByText("Account type already exists"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Add New Saver Account" }),
    ).toBeInTheDocument();
  });
});
