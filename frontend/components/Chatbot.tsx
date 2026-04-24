/*
"use client";

import { useState } from "react";
import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { useChatRuntime, AssistantChatTransport } from "@assistant-ui/react-ai-sdk";
import { Thread } from "@/components/thread";
import { MessageCircleIcon, XIcon } from "lucide-react";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);

  const runtime = useChatRuntime({
    transport: new AssistantChatTransport({
      api: "/api/chat",
    }),
  });

  return (
    <div
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
      }}
    >


      {isOpen && (
        <AssistantRuntimeProvider runtime={runtime}>
          <div
            style={{
              width: "400px",
              height: "500px",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              marginBottom: "24px",
              background: "white",
            }}
          >


            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between", 
                padding: "10px",
                borderBottom: "1px solid #eee",
              }}
            >
              <span>TLK Bot</span>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <XIcon size={18} />
              </button>
            </div>


            <div style={{ flex: 1, overflow: "hidden" }}>
              <Thread />
            </div>
          </div>
        </AssistantRuntimeProvider>
      )}


      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: "64px",
          height: "64px",
          borderRadius: "50%",
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
          color: "white",
          backgroundColor: "black",
          cursor: "pointer",
          border: "none",
        }}
      >
        {isOpen ? <XIcon size={28} /> : <MessageCircleIcon size={28} />}
      </button>
    </div>
  );
}
*/
