"use client";

import React, { useState,useEffect,useCallback } from "react";
import { excuteFetch } from "@/components/hooks/useFetch";
import toast from "react-hot-toast";
import { API_CONFIG, API_ENDPOINTS } from "@/lib/api-config";

interface Message {
  id: number;
  sender: "me" | "client";
  text: string;
  time: string;
}

interface SoloChat {
  name: string;
  email: string;
  avatarColor: string;
  online: boolean;
  messages: Message[];
}

const initialChatData: SoloChat = {
  name: "John Doe (Client)",
  email: "johndoe@example.com",
  avatarColor: "bg-violet-600 text-white",
  online: true,
  messages: [
    { id: 1, sender: "client", text: "Hello, I am having issues with Stripe payment.", time: "2:40 PM" },
    { id: 2, sender: "me", text: "Hello John, I am looking into it right now.", time: "2:42 PM" },
    { id: 3, sender: "client", text: "I need an update on my ticket please.", time: "2:45 PM" },
  ],
};

export default function MessagesPage({ params }: { params: Promise<{ id: string }> }) {
  const [chat, setChat] = useState<SoloChat>(initialChatData);
  const [typedMessage, setTypedMessage] = useState("");
  const [id,setId] = useState<string>("");

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim()) return;

    const newMessage: Message = {
      id: Date.now(),
      sender: "me",
      text: typedMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChat((prevChat) => ({
      ...prevChat,
      messages: [...prevChat.messages, newMessage],
    }));

    setTypedMessage("");
  };



  

  

  useEffect( () => {
    params.then(async ({ id }) => {
        try {
            const token = document.cookie.split('; ').find(row => row.startsWith('accessToken='))?.split('=')[1] || '';
            const res = await fetch(`${API_CONFIG.STRAPI_BASE_URL}${API_ENDPOINTS.PLATFORM_SUPPORT.BY_ID(id)}`, {
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
            });
            const data = await res.json();
            if(data && data.data){
                console.log(data.data);
            }
        } catch (err) {
            console.error(err);
        }
    });



  },[]);

 

  return (
    <div className="w-full h-[calc(100vh-80px)] flex flex-col bg-white dark:bg-black border border-gray-200 dark:border-zinc-800/80 rounded-2xl overflow-hidden transition-colors duration-200" dir="ltr">
      
      {/* Dynamic Header */}
      <div className="p-4 border-b border-gray-200 dark:border-zinc-800/80 bg-gray-50/50 dark:bg-zinc-950/40 flex items-center justify-between transition-colors duration-200">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 ${chat.avatarColor} rounded-xl flex items-center justify-center font-bold text-sm select-none`}>
            {chat.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-gray-900 dark:text-white text-sm font-bold">{chat.name}</h2>
            <p className="text-[11px] text-gray-400 dark:text-zinc-500 font-mono mt-0.5">{chat.email}</p>
          </div>
        </div>
        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md ${chat.online ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-gray-100 dark:bg-zinc-800 text-gray-400 dark:text-zinc-500"}`}>
          {chat.online ? "Online" : "Offline"}
        </span>
      </div>

      {/* Solo Chat Messages Screen */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/10 dark:bg-zinc-950/10 transition-colors duration-200">
        {chat.messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-xl rounded-2xl px-4 py-3 shadow-sm dark:shadow-lg transition-all ${
              msg.sender === "me"
                ? "bg-violet-600 text-white rounded-tr-none"
                : "bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800/80 text-gray-800 dark:text-zinc-100 rounded-tl-none"
            }`}>
              <p className="text-sm leading-relaxed tracking-wide select-text">{msg.text}</p>
              <span className={`block text-[9px] text-right mt-1.5 font-medium ${msg.sender === "me" ? "text-violet-200" : "text-gray-400 dark:text-zinc-500"}`}>
                {msg.time}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input Form Box */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-zinc-800/80 bg-gray-50/50 dark:bg-zinc-950/40 flex items-center space-x-3 transition-colors duration-200">
        <input
          type="text"
          placeholder="Type your secure message here..."
          value={typedMessage}
          onChange={(e) => setTypedMessage(e.target.value)}
          className="flex-1 px-4 py-3.5 bg-white dark:bg-black/60 border border-gray-200 dark:border-zinc-800 rounded-xl text-gray-900 dark:text-zinc-100 text-sm placeholder:text-gray-400 dark:placeholder:text-zinc-700 focus:outline-none focus:border-violet-600 dark:focus:border-violet-500 focus:ring-4 focus:ring-violet-600/10 dark:focus:ring-violet-500/10 transition-all duration-150"
        />
        <button
          type="submit"
          className="px-6 py-3.5 bg-violet-600 hover:bg-violet-500 text-white text-sm font-bold rounded-xl shadow-md hover:shadow-lg active:scale-95 transition-all cursor-pointer tracking-wide"
        >
          Send 🚀
        </button>
      </form>

    </div>
  );
}
