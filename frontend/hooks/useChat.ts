import { useState, useEffect, useRef } from "react";
import { ChatMessage } from "../types/types";

export const useChat = () => {
  const [question, setQuestion] = useState("");
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [asking, setAsking] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const handleAsk = async () => {
    if (!question.trim()) return;
    setAsking(true);
    const currentQuestion = question;
    setQuestion("");
    
    const newChat = [...chat, { q: currentQuestion, a: "" }];
    setChat(newChat);
    
    try {
      const res = await fetch("http://localhost:8000/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: currentQuestion }),
      });
      const data = await res.json();
      
      setChat(prev => {
        const updated = [...prev];
        updated[updated.length - 1].a = data.answer;
        return updated;
      });
    } finally {
      setAsking(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  };

  const resetChat = () => {
    setChat([]);
    setQuestion("");
  };

  return {
    question,
    setQuestion,
    chat,
    asking,
    chatEndRef,
    handleAsk,
    handleKeyPress,
    resetChat
  };
};