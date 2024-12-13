import React, { useState } from "react";
import { AiOutlineMessage } from "react-icons/ai";
import { motion } from "framer-motion";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Bonjour, comment puis-je vous aider ?" },
  ]);
  const [input, setInput] = useState("");

  const toggleChat = () => setIsOpen(!isOpen);

  const sendMessage = async (e) => {
    e.preventDefault();

    if (!input.trim()) {
      alert("Veuillez entrer un message !");
      return;
    }

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await fetch("http://localhost:5000/api/chat/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: data.response || "Pas de réponse." },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Erreur de connexion au serveur." },
      ]);
    } finally {
      setInput("");
    }
  };

  return (
    <div>
      <div
        onClick={toggleChat}
        className="fixed bottom-6 right-6 bg-blue-500 p-4 rounded-full shadow-lg cursor-pointer hover:bg-blue-600"
      >
        <AiOutlineMessage className="text-white text-3xl" />
      </div>
      {isOpen && (
        <motion.div
          className="fixed bottom-16 right-6 bg-white w-[300px] h-[500px] rounded-lg shadow-lg flex flex-col"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
        >
          <div className="flex justify-between items-center border-b pb-2 px-4">
            <h3 className="text-lg font-bold">Chatbot</h3>
            <button
              onClick={toggleChat}
              className="text-gray-500 hover:text-gray-700"
            >
              ✖
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 rounded ${
                  msg.sender === "user"
                    ? "bg-blue-100 text-right"
                    : "bg-gray-100 text-left"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>
          <form onSubmit={sendMessage} className="p-4 border-t flex">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Écrivez votre message..."
              className="flex-1 border rounded p-2"
            />
            <button
              type="submit"
              className="ml-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Envoyer
            </button>
          </form>
        </motion.div>
      )}
    </div>
  );
};

export default Chatbot;
