
import { useEffect,useRef } from "react";
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
        setMessages(prev => [
          ...prev,
          {
            id: `${Date.now()}-${Math.random()}`, // ensure unique ID
            type: "ai",
            content: data.aiText,
            timestamp: new Date(data.timestamp)
          }
        ]);
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
          // addMessage('ai', firstMessage);

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
        // addMessage('ai', firstMessage);

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
const hasStartedRef = useRef(false);

useEffect(() => {
  if (isSlidePanel && !isCallActive && !isRinging && !hasStartedRef.current) {
    if (!isConnected) {
      connectSocket();
    } else {
      startCall();
      hasStartedRef.current = true;
    }
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