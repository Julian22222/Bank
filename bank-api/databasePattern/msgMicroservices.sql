DROP TABLE IF EXISTS chatMessages;
DROP TABLE IF EXISTS conversations;


CREATE TABLE conversations (
    conversation_id SERIAL PRIMARY KEY,
    customer_id INT REFERENCES customers(customer_id) ON DELETE CASCADE,
    assigned_admin_id INT REFERENCES admins(admin_id),
    status VARCHAR(50) DEFAULT 'open', -- open, closed, pending
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE chatMessages (
  message_id SERIAL PRIMARY KEY,
    conversation_id INT REFERENCES conversations(conversation_id) ON DELETE CASCADE,
    sender_type VARCHAR(20) NOT NULL, -- 'customer' or 'admin'
    sender_id INT NOT NULL, -- either customer_id or admin_id
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

CREATE INDEX idx_conversation_customer ON conversations(customer_id);
CREATE INDEX idx_messages_conversation ON chat_messages(conversation_id);

INSERT INTO conversations
(conversation_id, customer_id, assigned_admin_id)
VALUES (1, 1, 1), (2,1,1),(3,1,1),(2,2,1);

INSERT INTO chatMessages
(message_id, conversation_id, sender_type, sender_id, message)
VALUES (1,1, 'customer', 1, 'Hello World')