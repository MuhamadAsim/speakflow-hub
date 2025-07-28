import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Phone } from "lucide-react";
import CallControls from "./call/CallControls";
import MessageList from "./call/MessageList";
import VoiceStatus from "./call/VoiceStatus";
import { Message, CallInterfaceProps } from "./call/types";

export default function CallInterface({ 
  selectedModel, 
  systemPrompt, 
  firstMessage, 
  aiSpeaksFirst, 
  onCallStart, 
  onCallEnd, 
  isSlidePanel = false 
}: CallInterfaceProps) {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isRinging, setIsRinging] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [useTextInput, setUseTextInput] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isAISpeaking, setIsAISpeaking] = useState(false);

  const startCall = () => {
    if (isSlidePanel) {
      // For slide panel, start with ringing
      setIsRinging(true);
      onCallStart?.();
      
      // After 3 seconds, connect the call
      setTimeout(() => {
        setIsRinging(false);
        setIsCallActive(true);
        setMessages([]);
        
        // If AI speaks first, add the first message
        if (aiSpeaksFirst && firstMessage) {
          const aiMessage: Message = {
            id: Date.now().toString(),
            type: 'ai',
            content: firstMessage,
            timestamp: new Date()
          };
          setMessages([aiMessage]);
          
          // Simulate AI speaking
          setIsAISpeaking(true);
          setTimeout(() => setIsAISpeaking(false), 3000);
        }
      }, 3000);
    } else {
      // For regular call, start immediately
      setIsCallActive(true);
      setMessages([]);
      onCallStart?.();
      
      // If AI speaks first, add the first message
      if (aiSpeaksFirst && firstMessage) {
        const aiMessage: Message = {
          id: Date.now().toString(),
          type: 'ai',
          content: firstMessage,
          timestamp: new Date()
        };
        setMessages([aiMessage]);
        
        // Simulate AI speaking
        setIsAISpeaking(true);
        setTimeout(() => setIsAISpeaking(false), 3000);
      }
    }
  };

  const endCall = () => {
    setIsCallActive(false);
    setIsRinging(false);
    setIsListening(false);
    setIsAISpeaking(false);
    setTextInput("");
    onCallEnd?.();
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleListening = () => {
    if (!isCallActive) return;
    
    setIsListening(!isListening);
    
    // Simulate voice recognition
    if (!isListening) {
      setTimeout(() => {
        const userMessage: Message = {
          id: Date.now().toString(),
          type: 'user',
          content: "This is a simulated voice input. In a real implementation, this would be speech-to-text.",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, userMessage]);
        setIsListening(false);
        
        // Simulate AI response
        setTimeout(() => {
          const aiResponse: Message = {
            id: (Date.now() + 1).toString(),
            type: 'ai',
            content: "I received your voice message. This is a simulated AI response based on your system prompt configuration.",
            timestamp: new Date()
          };
          setMessages(prev => [...prev, aiResponse]);
          setIsAISpeaking(true);
          setTimeout(() => setIsAISpeaking(false), 2500);
        }, 1000);
      }, 2000);
    }
  };

  const sendTextMessage = () => {
    if (!textInput.trim() || !isCallActive) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user', 
      content: textInput,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setTextInput("");

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `I understand your message: "${userMessage.content}". This response is generated based on your system prompt: "${systemPrompt.substring(0, 100)}..."`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsAISpeaking(true);
      setTimeout(() => setIsAISpeaking(false), 3000);
    }, 1000);
  };

  const toggleTextInput = () => {
    setUseTextInput(!useTextInput);
  };

  // Initialize call if it's a slide panel
  useEffect(() => {
    if (isSlidePanel && !isCallActive && !isRinging) {
      startCall();
    }
  }, [isSlidePanel]);

  return (
    <Card className={`space-y-6 ${isSlidePanel ? 'h-full rounded-none border-0 p-4' : 'p-6'}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Phone className="w-6 h-6 text-primary" />
          <div>
            <h3 className="text-xl font-semibold">Voice Assistant Call</h3>
            <p className="text-sm text-muted-foreground">
              {isRinging 
                ? "Connecting..." 
                : isCallActive 
                  ? `Connected with ${selectedModel}` 
                  : "Ready to start conversation"
              }
            </p>
          </div>
        </div>

        {/* Call Status */}
        {isRinging && (
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse" />
            <span className="text-sm text-yellow-500 font-medium">Ringing...</span>
          </div>
        )}
        {isCallActive && (
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-green-500 font-medium">Connected</span>
          </div>
        )}
      </div>

      <CallControls
        isCallActive={isCallActive}
        isRinging={isRinging}
        isMuted={isMuted}
        isListening={isListening}
        useTextInput={useTextInput}
        textInput={textInput}
        onStartCall={startCall}
        onEndCall={endCall}
        onToggleMute={toggleMute}
        onToggleListening={toggleListening}
        onToggleTextInput={toggleTextInput}
        onTextInputChange={setTextInput}
        onSendMessage={sendTextMessage}
      />

      <VoiceStatus
        isCallActive={isCallActive}
        isAISpeaking={isAISpeaking}
        isListening={isListening}
      />

      <MessageList
        messages={messages}
        isCallActive={isCallActive}
      />
    </Card>
  );
}