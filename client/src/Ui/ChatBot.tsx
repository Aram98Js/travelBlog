
import { useState } from "react";
import type { KeyboardEvent } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import "./ChatBot.scss";

type Message = {
  id: number;
  text: string;
  sender: "user" | "bot";
};

type ChatBotProps = {
  chatBlocked: boolean;
  onBlocked: () => void;
};

type ChatResponse = {
  violation?: boolean;
  violationCount?: number;
  blocked?: boolean;
  message?: string | null;
  result?: string | null;
};

const ChatBot = ({
  chatBlocked,
  onBlocked
}: ChatBotProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Բարև 👋 Ինչո՞վ կարող եմ օգնել քեզ։",
      sender: "bot"
    }
  ]);

  const addBotMessage = (text: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        text,
        sender: "bot"
      }
    ]);
  };

  const sendMessage = async () => {
    if (!message.trim() || loading || chatBlocked) {
      return;
    }

    const currentMessage = message.trim();

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        text: currentMessage,
        sender: "user"
      }
    ]);

    setMessage("");
    setLoading(true);

    try {
      const token = localStorage.getItem("accessToken");

      const response = await fetch(
        "http://localhost:3000/ai/check",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token
              ? {
                  Authorization: `Bearer ${token}`
                }
              : {})
          },
          body: JSON.stringify({
            message: currentMessage
          })
        }
      );

      const data: ChatResponse = await response.json();

      console.log("CHAT RESPONSE:", data);

      // Անմիջական բլոկավորում
      if (data.blocked === true) {
        onBlocked();
        setMessage("");

        addBotMessage(
          data.message ||
            "Դուք արգելափակված եք։"
        );

        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message || "Server error"
        );
      }

      if (data.violation === true) {
        addBotMessage(
          data.message ||
            "Խնդրում ենք պահպանել հաղորդակցման կանոնները։"
        );

        return;
      }

      addBotMessage(
        data.result || "Պատասխան չի ստացվել։"
      );
    } catch (error) {
      console.error("CHAT ERROR:", error);

      addBotMessage(
        error instanceof Error
          ? error.message
          : "Տեղի ունեցավ սխալ։"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (
    evt: KeyboardEvent<HTMLInputElement>
  ) => {
    if (evt.key === "Enter") {
      void sendMessage();
    }
  };

  return (
    <>
      {!isOpen && (
        <button
          className="chat-button"
          onClick={() => setIsOpen(true)}
        >
          <MessageCircle size={26} />
        </button>
      )}

      {isOpen && (
        <div className="chatbot">
          <div className="chatbot__header">
            <div className="chatbot__info">
              <div className="chatbot__avatar">
                🤖
              </div>

              <div>
                <h3>Travel Assistant</h3>
                <span>
                  {chatBlocked ? "Blocked" : "Online"}
                </span>
              </div>
            </div>

            <button
              className="chatbot__close"
              onClick={() => setIsOpen(false)}
            >
              <X size={20} />
            </button>
          </div>

          <div className="chatbot__messages">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`message message--${msg.sender}`}
              >
                <div className="message__bubble">
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="message message--bot">
                <div className="message__bubble">
                  Մտածում եմ...
                </div>
              </div>
            )}
          </div>

          <div className="chatbot__input">
            <input
              type="text"
              placeholder={
                chatBlocked
                  ? "Դուք արգելափակված եք"
                  : "Գրեք հաղորդագրություն..."
              }
              value={message}
              onChange={(evt) =>
                setMessage(evt.target.value)
              }
              onKeyDown={handleKeyDown}
              disabled={chatBlocked || loading}
            />

            <button
              type="button"
              onClick={sendMessage}
              disabled={
                chatBlocked ||
                loading ||
                !message.trim()
              }
            >
              <Send size={19} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
