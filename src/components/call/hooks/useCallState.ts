import { useState, useCallback } from 'react';
import { Message } from '../types';

export const useCallState = () => {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isRinging, setIsRinging] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [useTextInput, setUseTextInput] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [isAiThinking, setIsAiThinking] = useState(false);

  const addMessage = useCallback((sender: string, text: string, timestamp: string | null = null) => {
    const newMessage: Message = {
      id: (Date.now() + Math.random()).toString(),
      type: sender as 'user' | 'ai',
      content: text,
      timestamp: timestamp ? new Date(timestamp) : new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
  }, []);

  const resetCallState = useCallback(() => {
    setIsCallActive(false);
    setIsRinging(false);
    setIsAISpeaking(false);
    setIsAiThinking(false);
    setTextInput("");
  }, []);

  return {
    // State
    isCallActive, setIsCallActive,
    isRinging, setIsRinging,
    isMuted, setIsMuted,
    useTextInput, setUseTextInput,
    textInput, setTextInput,
    messages, setMessages,
    isAISpeaking, setIsAISpeaking,
    isAiThinking, setIsAiThinking,
    
    // Actions
    addMessage,
    resetCallState
  };
};
