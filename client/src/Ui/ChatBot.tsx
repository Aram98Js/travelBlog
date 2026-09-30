
import React, { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import "./ChatBot.scss";

type Message = {
  id: number;
  text: string;
  sender: "user" | "bot";
};
type ChatBlocked={
chatBlocked: boolean
}
const ChatBot = ({chatBlocked}:ChatBlocked) => {

  const [isOpen, setIsOpen] = useState(false);

  const [message, setMessage] = useState("");
  const [loading,setLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Բարև 👋 Ինչո՞վ կարող եմ օգնել քեզ։",
      sender: "bot"
    }
  ]);

  const sendMessage = async () => {

    if (!message.trim()) return;

    const newMessage: Message = {
      id: Date.now(),
      text: message,
      sender: "user"
    };

    setMessages((prev) => [
      ...prev,
      newMessage
    ]); 
 const currentMessage = message;
    setMessage("");

    try {
      const token = localStorage.getItem("accessToken")
  
       setLoading(true)
console.log("AI TOKEN:", token);
        const response = await fetch("http://localhost:3000/ai/check",{
    method:"POST",
    headers:{
        "Content-Type":"application/json",
         ...(token && {
    Authorization: `Bearer ${token}`
  })
    },
    body:JSON.stringify({
        message: currentMessage
    })

})

const data = await response.json();
if(data.violation){
  setMessages((prev) => [
    ...prev,
    {
      id: Date.now() + Math.random(),
      text: data.message,
      sender: "bot"
    }
  ]);
}else{
setMessages((prev)=>[
...prev,
{
    id: Date.now() + 1,
    text:data.result,
    sender:"bot"
}
])
}


    console.log("CHAT RESPONSE:", data);

    if (!response.ok) {
      console.log("SERVER ERROR:",);
      return;
    }

    } catch (error) {
        console.log(error);
        
    }finally{
      setLoading(false)
    }


  };



  const handleKeyDown = (
    evt: React.KeyboardEvent<HTMLInputElement>
  ) => {

    if (evt.key === "Enter") {
      sendMessage();
    }

  };

  return (
    <>

      {/* Chat Button */}

      {!isOpen && (
        <button
          className="chat-button"
          onClick={() => setIsOpen(true)}
        >
          <MessageCircle size={26} />
        </button>
      )}


      {/* Chat Window */}

      {isOpen && (

        <div className="chatbot">

          {/* Header */}

          <div className="chatbot__header">

            <div className="chatbot__info">

              <div className="chatbot__avatar">
                🤖
              </div>

              <div>
                <h3>Travel Assistant</h3>
                <span>Online</span>
              </div>

            </div>

            <button
              className="chatbot__close"
              onClick={() => setIsOpen(false)}
            >
              <X size={20} />
            </button>

          </div>


          {/* Messages */}

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


          {/* Input */}

          <div className="chatbot__input">

            <input
              type="text"
              placeholder={chatBlocked?"Դուք Արդեն բլոկավորված եք":"Գրեք հաղորդագրություն..."}
              value={message}
              onChange={(evt) =>
                setMessage(evt.target.value)
              }
              onKeyDown={handleKeyDown}
              disabled={chatBlocked?true:false}
            />

            <button
              onClick={sendMessage}
              disabled={!message.trim()}
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

