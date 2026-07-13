"use client";

import { useEffect, useMemo, useState } from "react";
import { IUserWithAccount } from "../shared/types/userWithAccount.interface";
import { handleAdminMessage } from "../app/actions/adminMessageActions";
import styles from "../styles/Admin/admin.module.css";
import { useAdmin } from "../app/(admin)/AdminContext";

type Props = {
  setShowMsgModule: React.Dispatch<React.SetStateAction<boolean>>;
  userId: string | null;
};

export function AdminMessageModule({ setShowMsgModule, userId }: Props) {
  const { activeAdmin } = useAdmin();

  const [searchTerm, setSearchTerm] = useState("");
  const [allUsers, setAllUsers] = useState<IUserWithAccount[]>([]);
  const [customerId, setCustomerId] = useState<number | undefined>();
  const [errorMessage, setErrorMessage] = useState<string>("");

  const [bodyText, setBodyText] = useState(
    `Dear ${searchTerm},\n\nWrite your text here... \n\nKind regards,\nYour Bank Team.`,
  );

  useEffect(() => {
    const fetchAllUsers = async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACK_END_URL}/users`,
      );

      const customersData = await response.json();

      setAllUsers(customersData);

      if (userId !== null) {
        const user = customersData.find(
          (user: IUserWithAccount) => user.customer_id === Number(userId),
        );

        if (!user) return;

        setSearchTerm(`${user.first_name} ${user.last_name}`);
        setCustomerId(user.customer_id);
      }
    };

    fetchAllUsers();
  }, [activeAdmin, userId]);

  useEffect(() => {
    if (searchTerm) {
      setBodyText(
        `Dear ${searchTerm},\n\nWrite your text here...\n\nKind regards,\nYour Bank Team.`,
      );
    }
  }, [searchTerm]);

  const filterUsers = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();

    return allUsers.filter((user) =>
      `${user.first_name} ${user.last_name}`.toLowerCase().includes(term),
    );
  }, [searchTerm, allUsers]);

  const handleSubmit = async (formData: FormData) => {
    try {
      if (customerId === undefined) {
        alert("Please select a valid user");
        return;
      }

      const newMessage = await handleAdminMessage(formData);

      if (!newMessage.success) {
        setErrorMessage(newMessage.error);
        throw new Error(newMessage.error || "Failed to send message");
      }

      setSearchTerm("");
      setShowMsgModule(false);
      // }
    } catch (error) {
      console.error("SEND MESSAGE ERROR:", error);
      setErrorMessage(
        error instanceof Error ? error.message : "An unknown error occurred",
      );
    }
  };

  return (
    <div
      className="position-fixed top-0 start-0 w-100 vh-100 d-flex justify-content-center align-items-center"
      style={{
        backgroundImage: "url('/LogInPic/BackgroundPic2.png')",
        zIndex: 999,
      }}
    >
      <form
        action={handleSubmit}
        className={`w-100 position-relative bg-white d-flex flex-column gap-4 shadow p-4 rounded-5 ${styles.mainFormMessage}`}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={() => setShowMsgModule(false)}
          className={`position-absolute border-0 rounded-circle d-flex justify-content-center align-items-center fw-bold ${styles.formCloseBtn}`}
        >
          ×
        </button>

        <h2
          className="text-center mb-2"
          style={{
            color: "#1e293b",
            fontSize: "28px",
          }}
        >
          Message Form
        </h2>

        {/* Name */}
        <div>
          <label className="fw-bold mb-2 d-block fs-6 text-dark">Name</label>

          <input
            name="searchTerm"
            autoComplete="off"
            required
            type="search"
            placeholder="Search user ..."
            readOnly={userId !== null}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCustomerId(undefined);
            }}
            className="form-control p-3 rounded-3 fs-6"
            style={{
              backgroundColor: userId !== null ? "#e2e8f0" : "#f8fafc",
              cursor: userId !== null ? "not-allowed" : "text",
            }}
          />
        </div>

        {/* User Suggestions */}
        {searchTerm.length > 0 &&
          customerId === undefined &&
          filterUsers.length > 0 && (
            <ul className="list-unstyled mb-0">
              {filterUsers.map((user) => (
                <li key={user.customer_id} className="mb-1">
                  <button
                    type="button"
                    className="btn btn-link p-0 text-primary text-decoration-none"
                    onClick={() => {
                      setCustomerId(user.customer_id);
                      setSearchTerm(`${user.first_name} ${user.last_name}`);
                    }}
                  >
                    {user.first_name} {user.last_name}
                  </button>
                </li>
              ))}
            </ul>
          )}

        <input type="hidden" name="customerId" value={customerId} />

        <input
          type="hidden"
          name="msgCreatedBy"
          value={activeAdmin?.admin_name ?? ""}
        />

        {/* Subject */}
        <div>
          <label
            htmlFor="messageSubject"
            className="fw-bold mb-2 d-block fs-6 text-dark"
          >
            Message Subject
          </label>

          <input
            required
            autoComplete="off"
            id="messageSubject"
            name="messageSubject"
            type="text"
            placeholder="Enter message subject"
            className="form-select p-3 rounded-3 fs-6 bg-light"
          />
        </div>

        {/* Status */}
        <div>
          <label
            htmlFor="messageStatus"
            className="fw-bold mb-2 d-block fs-6 text-dark"
          >
            Message Status
          </label>

          <select
            required
            id="messageStatus"
            name="messageStatus"
            className="form-select p-3 rounded-3 fs-6 bg-light"
          >
            <option value="">Select Status</option>
            <option value="Pending">Pending</option>
            <option value="Open">Open</option>
            <option value="Urgent">Urgent</option>
          </select>
        </div>

        {/* Body */}
        <div>
          <label
            htmlFor="messageBody"
            className="fw-bold mb-2 d-block fs-6 text-dark"
          >
            Message Body
          </label>

          <textarea
            required
            id="messageBody"
            name="messageBody"
            rows={6}
            value={bodyText}
            onChange={(e) => setBodyText(e.target.value)}
            placeholder="Write your message here..."
            className="form-control p-3 rounded-3 fs-6 resize-vertical bg-light"
          />
        </div>
        {errorMessage && (
          <div className="text-danger text-bold text-center">
            {errorMessage}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          className="btn text-white fw-bold p-3 rounded-3 bg-primary bg-gradient fs-6 shadow"
        >
          Send Message
        </button>
      </form>
    </div>
  );
}
