import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import "./ChatBox.css";

const API_URL = import.meta.env.VITE_CHATBOX_URL + "/chat";

const ChatBoxAI = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "Xin chào 👋, mình là trợ lý AI tìm việc cho bạn.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  const toggleOpen = () => setIsOpen((prev) => !prev);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isSending) return;

    // đẩy tin nhắn user lên UI trước
    const userMsg = { id: Date.now(), sender: "user", text: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsSending(true);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: trimmed }),
      });

      if (!res.ok) {
        throw new Error("HTTP error " + res.status);
      }

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "bot",
          // 🔥 backend trả về { answer: "..." }
          text: data.answer || "Server không trả lời, vui lòng thử lại.",
        },
      ]);
    } catch (e) {
      console.error("Call API error:", e);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 2,
          sender: "bot",
          text: "Có lỗi khi gọi API, thử lại sau nhé.",
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  // Auto scroll xuống cuối
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      {/* Nút floating tròn */}
      <button
        onClick={toggleOpen}
        style={{
          position: "fixed",
          bottom: "25px",
          right: "25px",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          backgroundColor: "#2563eb",
          color: "#fff",
          border: "none",
          cursor: "pointer",
          fontSize: "24px",
          zIndex: 1000,
        }}
      >
        💬
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "100px",
            right: "25px",
            width: "360px",
            height: "500px",
            zIndex: 999,
            borderRadius: "16px",
            overflow: "hidden",
          }}
        >
          <ChatPanel
            messages={messages}
            input={input}
            setInput={setInput}
            handleSend={handleSend}
            isSending={isSending}
            messagesEndRef={messagesEndRef}
          />
        </div>
      )}
    </>
  );
};

// UI panel tách riêng
const ChatPanel = ({
  messages,
  input,
  setInput,
  handleSend,
  isSending,
  messagesEndRef,
}) => {
  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chatbox-container">
      <div className="chatbox-header">
        <div className="chatbox-title">Chat với AI</div>
        <div className="chatbox-subtitle">
          Tư vấn hoặc gõ yêu cầu tìm việc làm, lương, địa điểm,... 😉
        </div>
      </div>

      <div className="chatbox-messages">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={
              msg.sender === "user"
                ? "message-row message-row-user"
                : "message-row message-row-bot"
            }
          >
            <div className={`message-bubble ${msg.sender}`}>
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Khung gửi tin nhắn */}
      <div className="chatbox-input-area">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          className="chatbox-input"
          placeholder="Nhập yêu cầu ..."
          rows={2}
          disabled={isSending}
        />

        <button
          className="chatbox-send-btn"
          onClick={handleSend}
          disabled={isSending}
        >
          {isSending ? "Đang gửi..." : "Gửi"}
        </button>
      </div>
    </div>
  );
};

export default ChatBoxAI;
