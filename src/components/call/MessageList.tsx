import { useRef, useEffect } from "react";
import { User, Bot } from "lucide-react";
import { MessageListProps } from "./types";

export default function MessageList({ messages, isCallActive }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!isCallActive || messages.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h4 className="font-medium">Conversation</h4>
      <div className="bg-muted rounded-lg p-4 max-h-80 overflow-y-auto space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.type === 'user'
                  ? 'bg-accent text-accent-foreground'
                  : 'bg-primary text-primary-foreground'
              }`}
            >
              <div className="flex items-center space-x-2 mb-1">
                {message.type === 'user' ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Bot className="w-4 h-4" />
                )}
                <span className="text-xs opacity-75">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
              <p className="text-sm">{message.content}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}