import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { adminApiServerFetch } from "@/src/lib/admin-api-server";
import { deleteAdminActions } from "../../actions/deleteAdminActions";
import ManageAdmins from "./page";

const mockRefresh = jest.fn();

jest.mock("@/src/lib/admin-api-server", () => ({
  adminApiServerFetch: jest.fn(),
}));

jest.mock("@/src/components/AdminPageHeader", () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: mockRefresh }),
}));

jest.mock("../../actions/deleteAdminActions", () => ({
  deleteAdminActions: jest.fn(),
}));

jest.mock("../../actions/updateAdminActions", () => ({
  updateAdminActions: jest.fn(),
}));

jest.mock("../../actions/addNewAdminActions", () => ({
  addNewAdminActions: jest.fn(),
}));

jest.mock("../../actions/updateAdminPasswordActions", () => ({
  updateAdminPasswordActions: jest.fn(),
}));

describe("ManageAdmins page", () => {
  const admins = [
    {
      admin_id: 1,
      role: "superAdmin",
      admin_name: "Morgan Admin",
      email: "morgan@example.com",
      phone: "+447700900001",
      customer_address: "1 Admin Road",
      dob: "1985-06-15",
      created_at: "2025-01-10",
    },
    {
      admin_id: 2,
      role: "admin",
      admin_name: "Taylor Manager",
      email: "taylor@example.com",
      phone: "+447700900002",
      customer_address: "2 Manager Road",
      dob: "1990-03-20",
      created_at: "2025-02-11",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(adminApiServerFetch).mockResolvedValue(admins);
    jest.mocked(deleteAdminActions).mockResolvedValue({
      success: true,
      data: {},
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const renderPage = async () => render(await ManageAdmins());

  it("fetches and displays admin records", async () => {
    await renderPage();

    expect(adminApiServerFetch).toHaveBeenCalledWith(
      `${process.env.BACK_END_URL}/admin`,
      {
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        next: { tags: ["allAdminsData"] },
      },
    );
    expect(
      screen.getByRole("heading", { name: "Manage Admins" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Morgan Admin")).toBeInTheDocument();
    expect(screen.getByText("Taylor Manager")).toBeInTheDocument();
    expect(screen.getByText("taylor@example.com")).toBeInTheDocument();
  });

  it("opens the selected admin's edit form", async () => {
    const user = userEvent.setup();
    await renderPage();

    await user.click(screen.getAllByRole("button", { name: "Edit Admin" })[1]);

    expect(
      screen.getByRole("heading", { name: "Change Admin Details" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Admin Name")).toHaveValue("Taylor Manager");
    expect(screen.getByLabelText("Email")).toHaveValue("taylor@example.com");
  });

  it("prevents deleting a super admin and refreshes after deleting an admin", async () => {
    const user = userEvent.setup();
    const confirmSpy = jest.spyOn(window, "confirm").mockReturnValue(true);
    await renderPage();

    const deleteButtons = screen.getAllByRole("button", { name: "Delete" });
    expect(deleteButtons[0]).toBeDisabled();
    expect(deleteButtons[1]).toBeEnabled();

    await user.click(deleteButtons[1]);

    expect(confirmSpy).toHaveBeenCalledWith("Delete this admin?");
    await waitFor(() => {
      expect(deleteAdminActions).toHaveBeenCalledWith(2);
      expect(mockRefresh).toHaveBeenCalled();
    });
  });
});
