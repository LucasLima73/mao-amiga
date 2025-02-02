"use client";

import React, { useState, useEffect } from "react";
import { FaHeadset } from "react-icons/fa";

const ChatBotBalloon: React.FC = () => {
  const [iconColor, setIconColor] = useState("#ffde59");
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [responses, setResponses] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  const messages = [
    "Tire suas dúvidas comigo",
    "Pregúntame tus dudas",
    "Ask me your questions",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 3000); // Alterna a mensagem a cada 3 segundos

    return () => clearInterval(interval); // Limpa o intervalo quando o componente é desmontado
  }, []);

  const toggleChatBot = () => {
    setIsOpen(!isOpen);
  };

  const handleSend = async () => {
    if (input.trim()) {
      setIsLoading(true);
      const userMessage = `💬 ${input}`;
      setResponses((prev) => [...prev, userMessage]);

      try {
        // Faz a chamada à API do RAG
        const response = await fetch("http://localhost:3000/api/assistant", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt: input }),
        });

        if (!response.ok) {
          throw new Error("Erro ao consultar a API");
        }

        const data = await response.json();
        const botResponse = `🤖 ${data.response || "Sem resposta no momento."}`;

        setResponses((prev) => [...prev, botResponse]);
      } catch (error) {
        console.error("Erro ao consultar a API:", error);
        setResponses((prev) => [
          ...prev,
          "🤖 Ocorreu um erro ao processar sua solicitação.",
        ]);
      } finally {
        setIsLoading(false);
        setInput("");
      }
    }
  };

  return (
    
    <div className="fixed bottom-6 right-6 z-50">
      {/* Mensagem rotativa acima do balão */}
      {!isOpen && (
      <div className="fixed bottom-20 right-6 text-center text-sm text-gray-600 bg-white rounded-md px-4 py-2 shadow-md">
        {messages[currentMessageIndex]}
      </div>
      )}
      
      {/* Botão flutuante (exibido apenas quando o balão está fechado) */}
      {!isOpen && (
         <button onClick={toggleChatBot}
         style={{
           position: "fixed",
           bottom: "20px",
           right: "20px",
           width: "60px",
           height: "60px",
           borderRadius: "50%",
           border: "4px solid #ffde59",
           backgroundColor: "transparent",
           display: "flex",
           alignItems: "center",
           justifyContent: "center",
           cursor: "pointer",
           boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
           transition: "transform 0.2s ease, box-shadow 0.2s ease",
         }}
         onMouseOver={(e) => {
           e.currentTarget.style.transform = "scale(1.1)";
           e.currentTarget.style.boxShadow = "0 6px 8px rgba(0, 0, 0, 0.2)";
         }}
         onMouseOut={(e) => {
           e.currentTarget.style.transform = "scale(1)";
           e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
         }}
         onMouseDown={(e) => {
           e.currentTarget.style.transform = "scale(0.98)";
           e.currentTarget.style.boxShadow = "0 3px 5px rgba(0, 0, 0, 0.2)";
         }}
         onMouseUp={(e) => {
           e.currentTarget.style.transform = "scale(1.1)";
           e.currentTarget.style.boxShadow = "0 6px 8px rgba(0, 0, 0, 0.2)";
         }}
       >
         <FaHeadset
           style={{
             fontSize: "24px",
             color: iconColor,
           }}
         />
       </button>
      )}

      {/* Container do balão (exibido apenas quando aberto) */}
      {isOpen && (
        <div className="w-80 h-96 p-4 bg-white rounded-lg shadow-lg flex flex-col">
          {/* Cabeçalho */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-blue-500 font-bold text-sm">
              Assistente Virtual
            </h3>
            <button
              onClick={toggleChatBot}
              className="text-gray-500 hover:text-gray-700"
            >
              ✖
            </button>
          </div>

          {/* Área de respostas */}
          <div className="flex-1 overflow-y-auto space-y-2 mb-4">
            {responses.length > 0 ? (
              responses.map((response, index) => (
                <div
                  key={index}
                  className={`${
                    response.startsWith("❓")
                      ? "text-gray-700 text-left"
                      : "text-blue-500 text-right"
                  } text-sm`}
                >
                  {response}
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-sm">
                Faça sua primeira pergunta!
              </p>
            )}
            {isLoading && (
              <p className="text-gray-500 text-sm text-center">Carregando...</p>
            )}
          </div>

          {/* Área de input */}
          <div className="flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Digite sua pergunta..."
              className="flex-1 border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              className="ml-2 bg-blue-500 text-white rounded-lg px-4 py-2 text-sm hover:bg-blue-600 disabled:opacity-50"
              disabled={isLoading}
            >
              Enviar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBotBalloon;
