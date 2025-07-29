// import { useState, useEffect, useRef } from "react";
// import { Card } from "@/components/ui/card";
// import { Phone } from "lucide-react";
// import CallControls from "./call/CallControls";
// import MessageList from "./call/MessageList";
// import VoiceStatus from "./call/VoiceStatus";
// import { Message, CallInterfaceProps } from "./call/types";

// export default function CallInterface({ 
//   selectedModel, 
//   systemPrompt, 
//   firstMessage, 
//   aiSpeaksFirst, 
//   onCallStart, 
//   onCallEnd, 
//   isSlidePanel = false 
// }: CallInterfaceProps) {
//   const [isCallActive, setIsCallActive] = useState(false);
//   const [isRinging, setIsRinging] = useState(false);
//   const [isMuted, setIsMuted] = useState(false);
//   const [isListening, setIsListening] = useState(false);
//   const [isRecording, setIsRecording] = useState(false);
//   const [useTextInput, setUseTextInput] = useState(false);
//   const [textInput, setTextInput] = useState("");
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [isAISpeaking, setIsAISpeaking] = useState(false);
//   const [isAiThinking, setIsAiThinking] = useState(false);
//   const [isConnected, setIsConnected] = useState(false);
//   const [connectionStatus, setConnectionStatus] = useState("Disconnected");
//   const [error, setError] = useState("");

//   const socketRef = useRef<WebSocket | null>(null);
//   const recognitionRef = useRef<any>(null);

//   // Initialize WebSocket connection
//   // ⬇️ Remove the entire useEffect

// const connectSocket = () => {
//   if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) return;

//   const ws = new WebSocket("ws://localhost:5000");
//   socketRef.current = ws;

//   ws.onopen = () => {
//     setIsConnected(true);
//     setConnectionStatus("Ready for call");
//   };

//   ws.onclose = () => {
//     setIsConnected(false);
//     setConnectionStatus("Disconnected");
//     setIsCallActive(false);
//   };

//   ws.onmessage = (event) => {
//     const data = JSON.parse(event.data);

//     if (data.type === "ai-response") {
//       // Prevent duplicate greeting
//       setMessages(prev =>
//         prev.some(m => m.content === data.aiText) ? prev : [...prev, {
//           id: Date.now().toString(),
//           type: "ai",
//           content: data.aiText,
//           timestamp: new Date(data.timestamp)
//         }]
//       );
//       setIsAiThinking(false);
//     }

//     else if (data.type === "ai-voice") {
//       const audio = new Audio(data.audioUrl + "?t=" + Date.now());
//       setIsAISpeaking(true);
//       audio.play().then(() => (audio.onended = () => setIsAISpeaking(false)));
//     }

//     else if (data.type === "ai-thinking") {
//       setIsAiThinking(data.thinking);
//     }

//     else if (data.type === "call-status") {
//       setIsCallActive(data.status === "active");
//     }

//     else if (data.type === "error") {
//       setError(data.message);
//       setIsAiThinking(false);
//     }
//   };

//   ws.onerror = () => setError("Connection error occurred");
// };

  

//   const addMessage = (sender: string, text: string, timestamp: string | null = null) => {
//     const newMessage: Message = {
//       id: (Date.now() + Math.random()).toString(),
//       type: sender as 'user' | 'ai',
//       content: text,
//       timestamp: timestamp ? new Date(timestamp) : new Date(),
//     };
//     setMessages(prev => [...prev, newMessage]);
//   };

//   const startCall = () => {
//     connectSocket();
//     if (!isConnected || !socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
//       // setError("Not connected to server");
//       return;
//     }

//     if (isSlidePanel) {
//       // For slide panel, start with ringing
//       setIsRinging(true);
//       onCallStart?.();
      
//       // After 3 seconds, connect the call
//       setTimeout(() => {
//         setIsRinging(false);
//         setIsCallActive(true);
//         setMessages([]);
        
//         socketRef.current?.send(JSON.stringify({ 
//           type: "call-start",
//           systemPrompt,
//           selectedModel,
//           firstMessage,
//           aiSpeaksFirst
//         }));
        
//         // If AI speaks first, add the first message
//         if (aiSpeaksFirst && firstMessage) {
//           const aiMessage: Message = {
//             id: Date.now().toString(),
//             type: 'ai',
//             content: firstMessage,
//             timestamp: new Date()
//           };
//           setMessages([aiMessage]);
          
//           // Simulate AI speaking
//           setIsAISpeaking(true);
//           setTimeout(() => setIsAISpeaking(false), 3000);
//         }
        
//         // Start continuous listening
//         startListening();
//       }, 3000);
//     } else {
//       // For regular call, start immediately
//       setIsCallActive(true);
//       setMessages([]);
//       onCallStart?.();
      
//       socketRef.current.send(JSON.stringify({ 
//         type: "call-start",
//         systemPrompt,
//         selectedModel,
//         firstMessage,
//         aiSpeaksFirst
//       }));
      
//       // If AI speaks first, add the first message
//       if (aiSpeaksFirst && firstMessage) {
//         const aiMessage: Message = {
//           id: Date.now().toString(),
//           type: 'ai',
//           content: firstMessage,
//           timestamp: new Date()
//         };
//         setMessages([aiMessage]);
        
//         // Simulate AI speaking
//         setIsAISpeaking(true);
//         setTimeout(() => setIsAISpeaking(false), 3000);
//       }
      
//       // Start continuous listening
//       startListening();
//     }
//   };

//   const endCall = () => {
//     setIsCallActive(false);
//     setIsRinging(false);
//     setIsListening(false);
//     setIsRecording(false);
//     setIsAISpeaking(false);
//     setIsAiThinking(false);
//     setTextInput("");
//     stopListening();
    
//     if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
//       socketRef.current.send(JSON.stringify({
//         type: "call-end"
//       }));
//     }
    
//     onCallEnd?.();
//   };

//   const startListening = () => {
//     if (isMuted) return;

//     const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

//     if (!SpeechRecognition) {
//       setError("Speech recognition not supported in your browser");
//       return;
//     }

//     recognitionRef.current = new SpeechRecognition();
//     recognitionRef.current.lang = "en-US";
//     recognitionRef.current.interimResults = false;
//     recognitionRef.current.continuous = true;
//     recognitionRef.current.maxAlternatives = 1;

//     recognitionRef.current.onstart = () => {
//       setIsRecording(true);
//       setIsListening(true);
//       setError("");
//       console.log("🎤 Speech recognition started");
//     };

//     recognitionRef.current.onresult = (event: any) => {
//       const text = event.results[event.results.length - 1][0].transcript;
//       console.log("🎤 Recognized:", text);
      
//       // Add user message
//       addMessage("user", text);
      
//       // Send to AI
//       if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
//         socketRef.current.send(JSON.stringify({
//           type: "voice-input",
//           text: text
//         }));
//         setIsAiThinking(true);
//       }
      
//       // Brief pause in listening while AI responds
//       setIsRecording(false);
//       setIsListening(false);
//       setTimeout(() => {
//         if (isCallActive && recognitionRef.current && !isMuted) {
//           recognitionRef.current.start();
//         }
//       }, 2000);
//     };

//     recognitionRef.current.onerror = (event: any) => {
//       console.error("🎤 Speech recognition error:", event.error);
      
//       if (event.error !== "aborted" && isCallActive && !isMuted) {
//         setTimeout(() => {
//           if (isCallActive && recognitionRef.current) {
//             recognitionRef.current.start();
//           }
//         }, 1000);
//       }
//     };

//     recognitionRef.current.onend = () => {
//       setIsRecording(false);
      
//       if (isCallActive && !isMuted) {
//         setTimeout(() => {
//           if (recognitionRef.current) {
//             recognitionRef.current.start();
//           }
//         }, 500);
//       }
//     };

//     recognitionRef.current.start();
//   };

//   const stopListening = () => {
//     if (recognitionRef.current) {
//       recognitionRef.current.stop();
//       recognitionRef.current = null;
//     }
//     setIsRecording(false);
//     setIsListening(false);
//   };

//   const toggleMute = () => {
//     setIsMuted(!isMuted);
//     if (!isMuted) {
//       // Muting - stop listening
//       stopListening();
//     } else if (isCallActive) {
//       // Unmuting - start listening again
//       startListening();
//     }
//   };

//   const toggleListening = () => {
//     if (!isCallActive) return;
    
//     if (isListening) {
//       stopListening();
//     } else {
//       startListening();
//     }
//   };

//   const sendTextMessage = () => {
//     if (!textInput.trim() || !isCallActive) return;

//     const userMessage: Message = {
//       id: Date.now().toString(),
//       type: 'user', 
//       content: textInput,
//       timestamp: new Date()
//     };
    
//     setMessages(prev => [...prev, userMessage]);
    
//     // Send to AI via WebSocket
//     if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
//       socketRef.current.send(JSON.stringify({
//         type: "voice-input",
//         text: textInput
//       }));
//       setIsAiThinking(true);
//     }
    
//     setTextInput("");
//   };

//   const toggleTextInput = () => {
//     setUseTextInput(!useTextInput);
//   };

//   // Initialize call if it's a slide panel
//   useEffect(() => {
//     if (isSlidePanel && !isCallActive && !isRinging && isConnected) {
//       startCall();
//     }
//   }, [isSlidePanel, isConnected]);

//   return (
//     <Card className={`space-y-6 ${isSlidePanel ? 'h-full rounded-none border-0 p-4' : 'p-6'}`}>
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div className="flex items-center space-x-3">
//           <Phone className="w-6 h-6 text-primary" />
//           <div>
//             <h3 className="text-xl font-semibold">Voice Assistant Call</h3>
//             <p className="text-sm text-muted-foreground">
//               {isRinging 
//                 ? "Connecting..." 
//                 : isCallActive 
//                   ? `Connected with ${selectedModel}` 
//                   : connectionStatus
//               }
//             </p>
//           </div>
//         </div>

//         {/* Call Status */}
//         {isRinging && (
//           <div className="flex items-center space-x-2">
//             <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse" />
//             <span className="text-sm text-yellow-500 font-medium">Ringing...</span>
//           </div>
//         )}
//         {isCallActive && (
//           <div className="flex items-center space-x-2">
//             <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
//             <span className="text-sm text-green-500 font-medium">Connected</span>
//           </div>
//         )}
//         {!isConnected && (
//           <div className="flex items-center space-x-2">
//             <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
//             <span className="text-sm text-red-500 font-medium">Disconnected</span>
//           </div>
//         )}
//       </div>

//       {/* Error Display */}
//       {error && (
//         <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
//           <p className="text-red-700 text-sm">
//             <strong>Error:</strong> {error}
//           </p>
//         </div>
//       )}

//       <CallControls
//         isCallActive={isCallActive}
//         isRinging={isRinging}
//         isMuted={isMuted}
//         isListening={isListening}
//         useTextInput={useTextInput}
//         textInput={textInput}
//         onStartCall={startCall}
//         onEndCall={endCall}
//         onToggleMute={toggleMute}
//         onToggleListening={toggleListening}
//         onToggleTextInput={toggleTextInput}
//         onTextInputChange={setTextInput}
//         onSendMessage={sendTextMessage}
//       />

//       <VoiceStatus
//         isCallActive={isCallActive}
//         isAISpeaking={isAISpeaking || isAiThinking}
//         isListening={isListening}
//       />

//       <MessageList
//         messages={messages}
//         isCallActive={isCallActive}
//       />
//     </Card>
//   );
// }






























import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import CallControls from "./call/CallControls";
import MessageList from "./call/MessageList";
import VoiceStatus from "./call/VoiceStatus";
import { CallInterfaceProps } from "./call/types";
import { useWebSocket } from "./call/hooks/useWebSocket";
import { useSpeechRecognition } from "./call/hooks/useSpeechRecognition";
import { useCallState } from "./call/hooks/useCallState";
import CallHeader from "./call/CallHeader";
import ErrorDisplay from "./call/ErrorDisplay";



export default function CallInterface({ 
  selectedModel, 
  systemPrompt, 
  firstMessage, 
  aiSpeaksFirst, 
  onCallStart, 
  onCallEnd, 
  isSlidePanel = false 
}: CallInterfaceProps) {
  // Custom hooks
  const { 
    socketRef, 
    isConnected, 
    connectionStatus, 
    error, 
    setError, 
    connectSocket, 
    sendMessage 
  } = useWebSocket();

  const { 
    isListening, 
    isRecording, 
    startListening, 
    stopListening 
  } = useSpeechRecognition();

  const {
    isCallActive, setIsCallActive,
    isRinging, setIsRinging,
    isMuted, setIsMuted,
    useTextInput, setUseTextInput,
    textInput, setTextInput,
    messages, setMessages,
    isAISpeaking, setIsAISpeaking,
    isAiThinking, setIsAiThinking,
    addMessage,
    resetCallState
  } = useCallState();

  // WebSocket message handler
  useEffect(() => {
    if (!socketRef.current) return;

    const handleMessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);

      if (data.type === "ai-response") {
        // Prevent duplicate greeting
        setMessages(prev =>
          prev.some(m => m.content === data.aiText) ? prev : [...prev, {
            id: Date.now().toString(),
            type: "ai",
            content: data.aiText,
            timestamp: new Date(data.timestamp)
          }]
        );
        setIsAiThinking(false);
      }

      else if (data.type === "ai-voice") {
        const audio = new Audio(data.audioUrl + "?t=" + Date.now());
        setIsAISpeaking(true);
        audio.play().then(() => (audio.onended = () => setIsAISpeaking(false)));
      }

      else if (data.type === "ai-thinking") {
        setIsAiThinking(data.thinking);
      }

      else if (data.type === "call-status") {
        setIsCallActive(data.status === "active");
      }

      else if (data.type === "error") {
        setError(data.message);
        setIsAiThinking(false);
      }
    };

    socketRef.current.onmessage = handleMessage;
  }, [socketRef.current, setMessages, setIsAiThinking, setIsAISpeaking, setIsCallActive, setError]);

  // Handle speech recognition result
  const handleSpeechResult = (text: string) => {
    // Add user message
    addMessage("user", text);
    
    // Send to AI
    if (sendMessage({ type: "voice-input", text })) {
      setIsAiThinking(true);
    }
  };

  const startCall = () => {
    connectSocket();
    if (!isConnected || !socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      // setError("Not connected to server");
      return;
    }

    if (isSlidePanel) {
      // For slide panel, start with ringing
      setIsRinging(true);
      onCallStart?.();
      
      // After 3 seconds, connect the call
      setTimeout(() => {
        setIsRinging(false);
        setIsCallActive(true);
        setMessages([]);
        
        sendMessage({ 
          type: "call-start",
          systemPrompt,
          selectedModel,
          firstMessage,
          aiSpeaksFirst
        });
        
        // If AI speaks first, add the first message
        if (aiSpeaksFirst && firstMessage) {
          addMessage('ai', firstMessage);
          
          // Simulate AI speaking
          setIsAISpeaking(true);
          setTimeout(() => setIsAISpeaking(false), 3000);
        }
        
        // Start continuous listening
        startListening(handleSpeechResult, setError, true, isMuted);
      }, 3000);
    } else {
      // For regular call, start immediately
      setIsCallActive(true);
      setMessages([]);
      onCallStart?.();
      
      sendMessage({ 
        type: "call-start",
        systemPrompt,
        selectedModel,
        firstMessage,
        aiSpeaksFirst
      });
      
      // If AI speaks first, add the first message
      if (aiSpeaksFirst && firstMessage) {
        addMessage('ai', firstMessage);
        
        // Simulate AI speaking
        setIsAISpeaking(true);
        setTimeout(() => setIsAISpeaking(false), 3000);
      }
      
      // Start continuous listening
      startListening(handleSpeechResult, setError, true, isMuted);
    }
  };

  const endCall = () => {
    resetCallState();
    stopListening();
    
    sendMessage({ type: "call-end" });
    
    onCallEnd?.();
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (!isMuted) {
      // Muting - stop listening
      stopListening();
    } else if (isCallActive) {
      // Unmuting - start listening again
      startListening(handleSpeechResult, setError, isCallActive, false);
    }
  };

  const toggleListening = () => {
    if (!isCallActive) return;
    
    if (isListening) {
      stopListening();
    } else {
      startListening(handleSpeechResult, setError, isCallActive, isMuted);
    }
  };

  const sendTextMessage = () => {
    if (!textInput.trim() || !isCallActive) return;

    addMessage('user', textInput);
    
    // Send to AI via WebSocket
    if (sendMessage({ type: "voice-input", text: textInput })) {
      setIsAiThinking(true);
    }
    
    setTextInput("");
  };

  const toggleTextInput = () => {
    setUseTextInput(!useTextInput);
  };

  // Initialize call if it's a slide panel
  useEffect(() => {
    if (isSlidePanel && !isCallActive && !isRinging && isConnected) {
      startCall();
    }
  }, [isSlidePanel, isConnected]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (socketRef.current?.readyState === WebSocket.OPEN) {
        socketRef.current.close();
      }
    };
  }, []);

  return (
    <Card className={`space-y-6 ${isSlidePanel ? 'h-full rounded-none border-0 p-4' : 'p-6'}`}>
      <CallHeader
        selectedModel={selectedModel}
        isRinging={isRinging}
        isCallActive={isCallActive}
        isConnected={isConnected}
        connectionStatus={connectionStatus}
      />

      <ErrorDisplay error={error} />

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
        isAISpeaking={isAISpeaking || isAiThinking}
        isListening={isListening}
      />

      <MessageList
        messages={messages}
        isCallActive={isCallActive}
      />
    </Card>
  );
}