import { useState } from 'react';
import './aiChefModal.scss'
import Button from '../Button';
import { useTranslation } from 'react-i18next';


interface AiChefModalProps {
  closeAiModal: () => void;
}

type Message = {
  id: number;
  text: string;
  sender: "user" | "bot";
};

function AiChefModal({ closeAiModal }: AiChefModalProps) {
    const [messageToChef,setMessageToChef] = useState<string>("");
      const [loading,setLoading] = useState<boolean>(false)
    const [msgData,setMsgData] = useState<Message[]>([])
    const {t} = useTranslation()
    const sendAiChef = async()=>{


        
    if (!messageToChef.trim()) return;

    const newMessage: Message = {
      id: Date.now(),
      text: messageToChef,
      sender: "user"
    };

        setMsgData((prev) => [
      ...prev,
      newMessage,
      
    ]); 

    try {
                    const token = localStorage.getItem("accessToken")
                    setLoading(true)
        const response = await fetch("http://localhost:3000/ai/food_advice",{
            method:"POST",
              headers:{
                     "Content-Type":"application/json",
         ...(token && {
    Authorization: `Bearer ${token}`
  })
              },
                 body:JSON.stringify({
        ingredients: messageToChef
    })
        })

        const data = await response.json();
        console.log("AI DATA:", data);
     const botMessage: Message = {
  id: Date.now(),
  text: `
    dish: ${data.dish}

    ingredients:
    ${data.ingredients.join(", ")}

    steps:
    ${data.steps.join("\n")}
  `,
  sender: "bot"
};
       
setMsgData((prev)=>[
    ...prev,
    botMessage
])

    } catch (error) {
        console.log(error);

        
    }finally{
        setLoading(false)
    }

  setMessageToChef("")
    }
  return (
    <div className="ai-modal-overlay">
      <div className="ai-modal">

        <button
          className="ai-modal-close"
          onClick={closeAiModal}
        >
          ×
        </button>

        <div className="ai-modal-header">
          <span>👨‍🍳</span>
          <h2>{t("AiChats.foodAsistantHeader")}</h2>
        </div>

        <p className="ai-modal-description">
          {t("AiChats.foodAsistantParagraph")}
        </p>

        {/* Messages */}
        <div className="ai-modal-messages">
          {msgData.map((message) => (
            <div
              key={message.id}
              className={`ai-message ${message.sender}`}
            >
              {message.text}
            </div>
          ))}
          {loading && (
  <div className="message message--bot">
    <div className="message__bubble">
     {t("thinking")}
    </div>
  </div>
)}
        </div>

        {/* Input */}
        <textarea
          value={messageToChef}
          onChange={(
            evt: React.ChangeEvent<HTMLTextAreaElement>
          ) => setMessageToChef(evt.target.value)}
         placeholder={t("aiPlaceholder.foodPlaceholder")}
        />

        <Button
          className="ai-modal-submit"
          onClick={sendAiChef}
        >
       {t("AiChats.foodChatBtn")}
        </Button>

      </div>
    </div>
  );
}

export default AiChefModal;