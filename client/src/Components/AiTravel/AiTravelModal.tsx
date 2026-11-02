import { useState } from "react";
import "./AiTravelModal.scss";
import Button from "../Button";
import { useTranslation } from "react-i18next";

interface AiTravelModalProps {
  closeAiModal: () => void;
}

type Message = {
  id: number;
  text: string;
  sender: "user" | "bot";
};

function AiTravelModal({ closeAiModal }: AiTravelModalProps) {

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
   const {t} = useTranslation()
  const sendMessage = async () => {
    if (!message.trim()) return;

    const newMessage: Message = {
      id: Date.now(),
      text: message,
      sender: "user"
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage("");


    try {
 const token = localStorage.getItem("accessToken")
        setLoading(true)
      const response = await fetch("http://localhost:3000/ai/travel_advice",{
        method:"POST",
        headers: {
            "Content-Type": "application/json",
           ...(token && {
    Authorization: `Bearer ${token}`
  })
        },
         body:JSON.stringify({
        travelMessage: message
    })
      })


      const data = await response.json();
      console.log(data);
      const botMessage: Message = {
  id: Date.now(),
  text: data.response,
  sender: "bot"
};
     setMessages(prev=>[
        ...prev,
        botMessage
     ]) 
    } catch (error) {
       console.log(error);
        
    }finally{
setLoading(false)
    }
  };

  return (
    <div className="travel-ai-overlay">

      <div className="travel-ai-modal">

        <Button
          className="travel-ai-close"
          onClick={closeAiModal}
        >
          ×
        </Button>

        <div className="travel-ai-header">

          <div className="travel-ai-icon">
            ✈️
          </div>

          <div>
            <h2>{t("AiChats.travelAsistantHeaderOne")}</h2>
            <span>{t("AiChats.travelAsistantParagraphOne")}</span>
          </div>

        </div>

        <div className="travel-ai-messages">

          {messages.length === 0 && (
            <div className="travel-ai-welcome">
              <div className="welcome-icon">🌍</div>

              <h3>{t("AiChats.travelAsistantHeaderTwo")}</h3>

              <p>
               {t("AiChats.travelAsistantParagraphTwo")}
              </p>
            </div>
          )}

          {messages.map((item) => (
            <div
              key={item.id}
              className={`travel-message ${item.sender}`}
            >
              {item.text}
            </div>
          ))}

          {loading && (
            <div className="travel-message bot">
             {t("thinking")} 
            </div>
          )}

        </div>

        <div className="travel-ai-input">

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t("aiPlaceholder.travelPlaceholder")}
          />

          <Button
            className="travel-ai-submit"
            onClick={sendMessage}
          >
            ✈️ {t("AiChats.travelChatBtn")} 
          </Button>

        </div>

      </div>

    </div>
  );
}

export default AiTravelModal;