"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaHeadset } from "react-icons/fa";

const ChatBotBalloon: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false); // Controla se o chatbot está aberto
  const [input, setInput] = useState("");
  const [responses, setResponses] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isClient, setIsClient] = useState(false);

  // Referência para rolar automaticamente para o final
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const messages = [
    "Tire suas dúvidas comigo",
    "Pregúntame tus dudas",
    "Ask me your questions",
  ];

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const storedResponses = JSON.parse(localStorage.getItem("chatHistory") || "[]");
      setResponses(storedResponses);
    }
  }, [isClient]);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem("chatHistory", JSON.stringify(responses));
      scrollToBottom(); // Rola automaticamente para o final sempre que `responses` mudar
    }
  }, [responses, isClient]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Sempre rolar para o final quando o chatbot for reaberto
  useEffect(() => {
    if (isOpen) {
      setTimeout(scrollToBottom, 100); // Pequeno atraso para garantir o scroll correto
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const toggleChatBot = () => {
    setIsOpen(!isOpen); // Alterna o estado de aberto/fechado
  };

  const handleSend = async () => {
    if (input.trim()) {
      const userMessage = `💬 ${input}`;
      setResponses((prev) => [...prev, userMessage]);
      setInput(""); // Limpa o campo de entrada imediatamente

      try {
        setIsLoading(true);
        const response = await fetch(
          process.env.NODE_ENV === "production"
            ? "https://mao-amiga-one.vercel.app/api/assistant"
            : "http://localhost:3001/api/assistant",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ prompt: input }),
          }
        );

        if (!response.ok) {
          throw new Error("Erro ao consultar a API");
        }

        const data = await response.json();
        const cleanedResponse =
          typeof data.response === "string"
            ? data.response.replace(/【\d+:\d+†source】/g, "")
            : "Sem resposta no momento.";
        const botResponse = `🤖 ${cleanedResponse}`;

        setResponses((prev) => [...prev, botResponse]);
        setTimeout(scrollToBottom, 100); // Scroll após resposta ser adicionada
      } catch (error) {
        console.error("Erro ao consultar a API:", error);
        setResponses((prev) => [
          ...prev,
          "🤖 Ocorreu um erro ao processar sua solicitação.",
        ]);
        setTimeout(scrollToBottom, 100);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const clearChat = () => {
    setResponses([]);
    if (isClient) {
      localStorage.removeItem("chatHistory");
    }
  };

  return (
    <div>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleChatBot}
        ></div>
      )}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed bottom-20 right-6 text-center text-sm text-gray-700 bg-white rounded-lg px-4 py-2 shadow-lg border border-gray-200"
        >
          {messages[currentMessageIndex]}
        </motion.div>

        {!isOpen && (
          <motion.button
            onClick={toggleChatBot}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            className="w-16 h-16 bg-transparent rounded-full border-4 border-[#ffde59] flex items-center justify-center shadow-xl hover:shadow-2xl focus:outline-none"
          >
            <FaHeadset className="text-[#ffde59] text-3xl" />
          </motion.button>
        )}

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed bottom-6 right-6 w-80 h-96 p-4 bg-white rounded-2xl shadow-2xl flex flex-col border border-gray-300 z-50"
            >
              <div className="flex justify-between items-center mb-4 border-b pb-2">
                <h3 className="text-[#e5b019] font-bold text-base">
                  Assistente Virtual
                </h3>
                <button
                  onClick={toggleChatBot}
                  className="text-gray-500 hover:text-gray-700 text-lg"
                >
                  ✖
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2 mb-4 px-2 py-1 border rounded-md bg-gray-50">
                {responses.length > 0 ? (
                  responses.map((response, index) => (
                    <motion.div
                      key={index}
                      initial={{
                        opacity: 0,
                        x: response.startsWith("💬") ? -20 : 20,
                      }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`text-sm p-2 rounded-lg ${
                        response.startsWith("💬")
                          ? "bg-[#e5b019] text-white self-start"
                          : "bg-gray-100 text-gray-900 self-end"
                      }`}
                    >
                      {response}
                    </motion.div>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm text-center">
                    Faça sua primeira pergunta!
                  </p>
                )}
                {isLoading && (
                  <p className="text-gray-500 text-sm text-center">
                    Carregando...
                  </p>
                )}
                {/* Referência para rolar automaticamente para a última mensagem */}
                <div ref={messagesEndRef}></div>
              </div>

              <button
                onClick={clearChat}
                className="mb-2 bg-[#e5b019] text-white px-4 py-2 rounded-xl text-sm hover:bg-yellow-600 focus:outline-none"
              >
                Recomeçar conversa
              </button>

              <div className="flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Digite sua pergunta..."
                  className="flex-1 border border-gray-300 rounded-xl p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#e5b019] bg-white text-black"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSend}
                  className="ml-2 bg-[#e5b019] text-white rounded-xl px-4 py-2 text-sm hover:bg-yellow-600 focus:outline-none disabled:opacity-60"
                  disabled={isLoading}
                >
                  Enviar
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ChatBotBalloon;
