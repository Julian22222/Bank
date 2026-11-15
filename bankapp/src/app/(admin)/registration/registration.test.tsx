import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { registerNewUser } from "../../actions/registerNewUserActions";
import { AdminProvider, useAdmin } from "../AdminContext";
import RegistrationPage from "./page";

const mockPush = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock("@/src/components/AdminFooter", () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock("../../actions/registerNewUserActions", () => ({
  registerNewUser: jest.fn(),
}));

function RegistrationStateProbe() {
  const { newUserRegister } = useAdmin();

  return (
    <output data-testid="registration-state">
      {JSON.stringify(newUserRegister)}
    </output>
  );
}

describe("RegistrationPage", () => {
  const registeredUser = {
    customer_id: 12,
    first_name: "Taylor",
    last_name: "Doe",
    email: "taylor@example.com",
    phone: "+447700900000",
    customer_address: "1 High Street",
    dob: "1990-01-01",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderRegistrationPage = () =>
    render(
      <AdminProvider initialAdmin={null}>
        <RegistrationPage />
        <RegistrationStateProbe />
      </AdminProvider>,
    );

  const fillRequiredFields = async (
    user: ReturnType<typeof userEvent.setup>,
    container: HTMLElement,
    password = "safe-password",
    confirmPassword = password,
  ) => {
    await user.type(screen.getByPlaceholderText("Enter first name"), "Taylor");
    await user.type(screen.getByPlaceholderText("Enter last name"), "Doe");
    await user.type(
      screen.getByPlaceholderText("Enter email address"),
      "taylor@example.com",
    );
    await user.type(screen.getByPlaceholderText("Enter password"), password);
    await user.type(
      screen.getByPlaceholderText("Confirm password"),
      confirmPassword,
    );
    await user.type(
      screen.getByPlaceholderText("Enter phone number"),
      "+447700900000",
    );
    await user.type(
      screen.getByPlaceholderText("Enter address"),
      "1 High Street",
    );

    const dateInput = container.querySelector<HTMLInputElement>("#dob");
    if (!dateInput) {
      throw new Error("Date of birth input was not rendered");
    }
    fireEvent.change(dateInput, { target: { value: "1990-01-01" } });
  };

  it("renders all required registration fields", () => {
    renderRegistrationPage();

    expect(
      screen.getByRole("heading", { name: "Register New User" }),
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter first name")).toBeRequired();
    expect(screen.getByPlaceholderText("Enter last name")).toBeRequired();
    expect(screen.getByPlaceholderText("Enter email address")).toBeRequired();
    expect(screen.getByPlaceholderText("Enter password")).toBeRequired();
    expect(screen.getByPlaceholderText("Confirm password")).toBeRequired();
    expect(screen.getByRole("link", { name: "Go back" })).toHaveAttribute(
      "href",
      "/admin-users",
    );
  });

  it("shows a validation error and skips registration when passwords do not match", async () => {
    const user = userEvent.setup();
    const { container } = renderRegistrationPage();
    await fillRequiredFields(
      user,
      container,
      "safe-password",
      "other-password",
    );

    await user.click(screen.getByRole("button", { name: "Register New User" }));

    expect(
      await screen.findByText("Passwords do not match"),
    ).toBeInTheDocument();
    expect(registerNewUser).not.toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("submits valid details, clears registration state, and navigates to users", async () => {
    const user = userEvent.setup();
    const { container } = renderRegistrationPage();
    await fillRequiredFields(user, container);
    jest.mocked(registerNewUser).mockResolvedValue({
      success: true,
      data: registeredUser,
    });

    await user.click(screen.getByRole("button", { name: "Register New User" }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/admin-users");
    });
    expect(registerNewUser).toHaveBeenCalledWith({
      first_name: "Taylor",
      last_name: "Doe",
      email: "taylor@example.com",
      password: "safe-password",
      phone: "+447700900000",
      customer_address: "1 High Street",
      dob: new Date("1990-01-01"),
    });
    expect(
      JSON.parse(screen.getByTestId("registration-state").textContent ?? ""),
    ).toEqual({
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      customer_address: "",
      dob: "",
    });
  });

  it("shows registration errors returned by the action", async () => {
    const user = userEvent.setup();
    const { container } = renderRegistrationPage();
    await fillRequiredFields(user, container);
    jest.mocked(registerNewUser).mockResolvedValue({
      success: false,
      error: ["Email already exists"],
    });

    await user.click(screen.getByRole("button", { name: "Register New User" }));

    expect(await screen.findByText("Email already exists")).toBeInTheDocument();
    expect(mockPush).not.toHaveBeenCalled();
  });
});
