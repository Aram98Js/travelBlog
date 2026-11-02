  import { useState } from "react";
  import "./aiRelaxModal.scss";
  import Button from "../Button";
  import { getFamilyAdvice, getNatureAdvice, getSpaAdvice, getWeekendAdvice } from "../../api/relaxApi";
  import { SelectedTypes } from "../../enums/relaxAiRoute";
  import { useTranslation } from "react-i18next";

  interface AiRelaxModalProps {
    closeAiModal: () => void;
  }

  type Message = {
    id: number,
    answer: string;
    suggestion?: string[],
    tips?: string[]
    sender: "user" | "bot";
  };




  function AiRelaxModal({ closeAiModal }: AiRelaxModalProps) {

    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);

  const [selectedType, setSelectedType] = useState("");
  const {t} = useTranslation()
    const sendMessage = async () => {
  console.log("SEND CLICK");
    if (!message.trim()) {
      console.log("MESSAGE IS EMPTY");
      return;
    }
  
      const newMessage: Message = {
        id: Date.now(),
        answer: message,
        sender: "user"
      };


    console.log("selectedType:", selectedType);
    console.log("message:", message);
      setMessages(prev => [...prev, newMessage]);

      
try {
  setLoading(true)
   if(selectedType === SelectedTypes.NATURE){
      const data =   await getNatureAdvice(message);
      console.log("NATURE DATA:", data.result);
      setMessages(prev=>[
    ...prev,
    {
      id: Date.now(),
      answer: data.result.answer,
      suggestion: data.result.suggestions,
      tips: data.result.tips,
      sender: "bot"
    }
  ]);
      
    }

        if(selectedType === SelectedTypes.WEEKEND){
    const data = await getWeekendAdvice(message)
  setMessages(prev=>[
    ...prev,
    {
      id: Date.now(),
      answer: data.result.answer,
      suggestion: data.result.suggestions,
      tips: data.result.tips,
      sender: "bot"
    }
  ]); 
    }
    
    if(selectedType === SelectedTypes.SPA){
    const data =  await getSpaAdvice(message)
  setMessages(prev=>[
    ...prev,
    {
      id: Date.now(),
      answer: data.result.answer,
      suggestion: data.result.suggestions,
      tips: data.result.tips,
      sender: "bot"
    }
  ]);
    
    }
        if(selectedType === SelectedTypes.FAMILY){
  const data = await getFamilyAdvice(message)
  setMessages(prev=>[
    ...prev,
    {
      id: Date.now(),
      answer: data.result.answer,
      suggestion: data.result.suggestions,
      tips: data.result.tips,
      sender: "bot"
    }
  ]);
  
    }
} catch (error) {
  console.log(error);
  
}finally{
  setLoading(false)
}

     



    setMessage("")
    };




    
    return (
      <div className="relax-ai-overlay">

        <div className="relax-ai-modal">

          <Button
            className="relax-ai-close"
            onClick={closeAiModal}
          >
            ×
          </Button>

          <div className="relax-ai-header">

            <div className="relax-ai-icon">
              🧘
            </div>

            <div>
              <h2>{t("AiChats.relaxAsistantHeaderOne")}</h2>
              <span>{t("AiChats.travelAsistantParagraphOne")}</span>
            </div>

          </div>

          <div className="relax-ai-messages">

            {messages.length === 0 && (

              <div className="relax-ai-welcome">

                <div className="relax-welcome-icon">
                  🌿
                </div>

                <h3>{t("AiChats.relaxAsistantHeaderTwo")}</h3>

                <p>
                 {t("AiChats.relaxAsistantParagraphTwo")}
                </p>

                <div className="relax-options">

                  <Button className="" onClick={() =>{
                      setSelectedType(SelectedTypes.NATURE);
      setMessage(t("relaxAi.natureMessage"));
                  }}>
                    🌲 {t("AiRelaxChatBtns.natureBtn")}
                  </Button>

                  <Button className=""  onClick={() =>{
  setSelectedType(SelectedTypes.WEEKEND)
  setMessage(t("relaxAi.weekendMessage"));
                  }}>
                    🏕️ {t("AiRelaxChatBtns.weekendBtn")}
                  </Button>

                  <Button className=""  onClick={() => {
                    setSelectedType(SelectedTypes.SPA)  
              setMessage(t("relaxAi.spaMessage"));
                  }}>
                    🧖 {t("AiRelaxChatBtns.spaBtn")}
                  </Button>

                  <Button className=""  onClick={() => {
                setSelectedType(SelectedTypes.FAMILY)
                setMessage(t("relaxAi.familyMessage"));
                  }}>
                    👨‍👩‍👧 {t("AiRelaxChatBtns.familyBtn")}
                  </Button>

                </div>

              </div>

            )}

           {messages.map(item => (
  <div
    key={item.id}
    className={`relax-message ${item.sender}`}
  >
    <p>{item.answer}</p>

    {item.suggestion && (
      <ul>
        {item.suggestion.map((text, index) => (
          <li key={index}>{text}</li>
        ))}
      </ul>
    )}

    {item.tips && (
      <ul>
        {item.tips.map((text, index) => (
          <li key={index}>{text}</li>
        ))}
      </ul>
    )}
  </div>
))}


            {loading && (
              <div className="relax-message bot">
                {t("thinking")}
              </div>
            )}

          </div>

          <div className="relax-ai-input">

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t("aiPlaceholder.relaxPlaceholder")}
              
            />

            <Button
              className="relax-ai-submit"
              onClick={sendMessage}
            >
              🌿 {t("AiChats.relaxChatBtn")}
            </Button>

          </div>

        </div>

      </div>
    );
  }

  export default AiRelaxModal;