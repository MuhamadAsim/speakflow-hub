import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Phone, 
  PhoneOff, 
  Mic, 
  MicOff, 
  Keyboard, 
  Volume2,
  VolumeX,
  MessageSquare,
  User,
  Bot
} from "lucide-react";

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

interface CallInterfaceProps {
  selectedModel: string;
  systemPrompt: string;
  firstMessage: string;
  aiSpeaksFirst: boolean;
  onCallStart?: () => void;
  onCallEnd?: () => void;
  isSlidePanel?: boolean;
}

export default function CallInterface({ selectedModel, systemPrompt, firstMessage, aiSpeaksFirst, onCallStart, onCallEnd, isSlidePanel = false }: CallInterfaceProps) {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isRinging, setIsRinging] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [useTextInput, setUseTextInput] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

      {/* Call Controls */}
      <div className="flex justify-center space-x-4">
        {isRinging ? (
          <div className="flex flex-col items-center space-y-4">
            <div className="flex space-x-2">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-3 h-3 bg-primary rounded-full animate-pulse"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
            <Button
              variant="destructive"
              size="lg"
              onClick={endCall}
            >
              <PhoneOff className="w-5 h-5 mr-2" />
              Cancel
            </Button>
          </div>
        ) : !isCallActive ? (
          <Button
            variant="call"
            size="xl"
            onClick={startCall}
            className="shadow-lg"
          >
            <Phone className="w-6 h-6 mr-3" />
            Start Call
          </Button>
        ) : (
          <div className="flex space-x-3">
            <Button
              variant={isMuted ? "destructive" : "secondary"}
              size="lg"
              onClick={toggleMute}
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </Button>
            
            <Button
              variant={isListening ? "glow" : "voice"}
              size="lg"
              onClick={toggleListening}
              disabled={useTextInput}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </Button>
            
            <Button
              variant={useTextInput ? "accent" : "secondary"}
              size="lg"
              onClick={() => setUseTextInput(!useTextInput)}
            >
              {useTextInput ? <MessageSquare className="w-5 h-5" /> : <Keyboard className="w-5 h-5" />}
            </Button>
            
            <Button
              variant="destructive"
              size="lg"
              onClick={endCall}
            >
              <PhoneOff className="w-5 h-5" />
            </Button>
          </div>
        )}
      </div>

      {/* Voice Status */}
      {isCallActive && (
        <div className="text-center space-y-2">
          {isAISpeaking && (
            <div className="flex justify-center items-center space-x-2">
              <Bot className="w-5 h-5 text-primary" />
              <span className="text-primary font-medium">AI is speaking...</span>
              <div className="flex space-x-1">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 h-4 bg-primary rounded-full animate-voice-wave"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  />
                ))}
              </div>
            </div>
          )}
          
          {isListening && (
            <div className="flex justify-center items-center space-x-2">
              <User className="w-5 h-5 text-accent" />
              <span className="text-accent font-medium">Listening...</span>
              <div className="flex space-x-1">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 h-3 bg-accent rounded-full animate-voice-wave"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Text Input */}
      {isCallActive && useTextInput && (
        <div className="flex space-x-2">
          <Textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 resize-none"
            rows={2}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendTextMessage();
              }
            }}
          />
          <Button
            variant="accent"
            onClick={sendTextMessage}
            disabled={!textInput.trim()}
          >
            Send
          </Button>
        </div>
      )}

      {/* Conversation Display */}
      {isCallActive && messages.length > 0 && (
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
      )}
    </Card>
  );
}