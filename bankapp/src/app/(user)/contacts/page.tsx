import UserPageHeader from "../user-page/UserPageHeader";

export default function Contacts() {
  const messages = [
    {
      id: 1,
      sender: "Alice",
      text: "Hello, how are you?",
      time: "10:01",
      sent: true,
    },
    {
      id: 2,
      sender: "Admin",
      text: "I'm good! Working on the bank project.",
      time: "10:02",
      sent: true,
    },
    {
      id: 3,
      sender: "Alice",
      text: "Nice! Keep it up 💪",
      time: "10:03",
      sent: true,
    },
  ];

  return (
    <div>
      <UserPageHeader />
      <h1 style={{ color: "#004c3f" }}>Contacts</h1>
      <p style={{ color: "#555" }}>
        You can contact us directly through our customer service line:
        1-800-123-4567
      </p>
      <p style={{ color: "#555" }}>Or open a live chat with us </p>
      <div
        style={{
          display: "flex",
          height: "100vh",
          backgroundColor: "#f4f6f9",
          fontFamily: "Segoe UI, Tahoma, sans-serif",
        }}
      >
        {/* Sidebar */}
        <div
          style={{
            width: "320px",
            backgroundColor: "#fff",
            borderRight: "1px solid #e0e0e0",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              padding: "20px",
              fontSize: "20px",
              fontWeight: 600,
              borderBottom: "1px solid #eee",
            }}
          >
            Chats
          </div>

          <div style={{ padding: "10px 15px" }}>
            <input
              type="text"
              placeholder="Search..."
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ddd",
                outline: "none",
              }}
            />
          </div>

          <div style={{ flex: 1, overflowY: "auto" }}>
            {/* Conversation */}
            <div
              style={{
                padding: "15px",
                display: "flex",
                justifyContent: "space-between",
                borderBottom: "1px solid #f1f1f1",
                backgroundColor: "#e8f0ff",
                cursor: "pointer",
              }}
            >
              <div>
                <div style={{ fontWeight: 500 }}>Alice</div>
                <div style={{ fontSize: "12px", color: "#777" }}>
                  Last message preview...
                </div>
              </div>
              <div
                style={{
                  backgroundColor: "#007bff",
                  color: "#fff",
                  fontSize: "11px",
                  padding: "4px 8px",
                  borderRadius: "12px",
                }}
              >
                2
              </div>
            </div>

            <div
              style={{
                padding: "15px",
                display: "flex",
                justifyContent: "space-between",
                borderBottom: "1px solid #f1f1f1",
                cursor: "pointer",
              }}
            >
              <div>
                <div style={{ fontWeight: 500 }}>Bob</div>
                <div style={{ fontSize: "12px", color: "#777" }}>
                  See you tomorrow
                </div>
              </div>
            </div>

            <div
              style={{
                padding: "15px",
                display: "flex",
                justifyContent: "space-between",
                borderBottom: "1px solid #f1f1f1",
                cursor: "pointer",
              }}
            >
              <div>
                <div style={{ fontWeight: 500 }}>Charlie</div>
                <div style={{ fontSize: "12px", color: "#777" }}>
                  Payment confirmed
                </div>
              </div>
              <div
                style={{
                  backgroundColor: "#007bff",
                  color: "#fff",
                  fontSize: "11px",
                  padding: "4px 8px",
                  borderRadius: "12px",
                }}
              >
                1
              </div>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              padding: "20px",
              borderBottom: "1px solid #eee",
              backgroundColor: "#fff",
              fontWeight: 600,
            }}
          >
            Alice
          </div>

          <div
            style={{
              flex: 1,
              padding: "20px",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            {/* Received */}

            {messages.map((message) => (
              <div
                key={message.id}
                style={{
                  maxWidth: "60%",
                  padding: "12px 15px",
                  borderRadius: "12px",
                  backgroundColor:
                    message.sender !== "Admin" ? "#e9ecef" : "#007bff",
                  color: message.sender !== "Admin" ? "black" : "#fff",
                  alignSelf:
                    message.sender !== "Admin" ? "flex-end" : "flex-start",
                }}
              >
                {message.text}
                <div
                  style={{ fontSize: "10px", marginTop: "5px", opacity: 0.7 }}
                >
                  {message.time}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div
            style={{
              padding: "15px",
              borderTop: "1px solid #eee",
              display: "flex",
              gap: "10px",
              backgroundColor: "#fff",
            }}
          >
            <input
              type="text"
              placeholder="Type a message..."
              style={{
                flex: 1,
                padding: "12px",
                borderRadius: "10px",
                border: "1px solid #ddd",
                outline: "none",
              }}
            />
            <button
              style={{
                padding: "12px 20px",
                border: "none",
                backgroundColor: "#007bff",
                color: "#fff",
                borderRadius: "10px",
                cursor: "pointer",
              }}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
