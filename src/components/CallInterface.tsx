import { useEffect, useRef, useState } from "react";
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
  isSlidePanel = false,
}: CallInterfaceProps) {
  // Track if connection is being established
  const [isConnecting, setIsConnecting] = useState(false);

  const {
    socketRef,
    isConnected,
    connectionStatus,
    error,
    setError,
    connectSocket,
    sendMessage,
  } = useWebSocket();

  const {
    isListening,
    isRecording,
    startListening,
    stopListening,
  } = useSpeechRecognition();

  const {
    isCallActive,
    setIsCallActive,
    isRinging,
    setIsRinging,
    isMuted,
    setIsMuted,
    useTextInput,
    setUseTextInput,
    textInput,
    setTextInput,
    messages,
    setMessages,
    isAISpeaking,
    setIsAISpeaking,
    isAiThinking,
    setIsAiThinking,
    addMessage,
    resetCallState,
  } = useCallState();

  // ✅ Handle WebSocket messages
  useEffect(() => {
    if (!socketRef.current) return;

    const handleMessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);

      if (data.type === "ai-response") {
        setMessages((prev) => [
          ...prev,
          {
            id: `${Date.now()}-${Math.random()}`,
            type: "ai",
            content: data.aiText,
            timestamp: new Date(data.timestamp),
          },
        ]);
        setIsAiThinking(false);
      } else if (data.type === "ai-voice") {
        const audio = new Audio(data.audioUrl + "?t=" + Date.now());
        setIsAISpeaking(true);
        audio.play().then(() => (audio.onended = () => setIsAISpeaking(false)));
      } else if (data.type === "ai-thinking") {
        setIsAiThinking(data.thinking);
      } else if (data.type === "call-status") {
        setIsCallActive(data.status === "active");
      } else if (data.type === "error") {
        setError(data.message);
        setIsAiThinking(false);
      }
    };

    socketRef.current.onmessage = handleMessage;
  }, [socketRef.current]);

  // ✅ Handle speech recognition results
  const handleSpeechResult = (text: string) => {
    addMessage("user", text);

    if (sendMessage({ type: "voice-input", text })) {
      setIsAiThinking(true);
    }
  };

  // ✅ Start Call (with guard)
  const startCall = () => {
    // Prevent multiple connection attempts
    if (isConnected || isConnecting) return;

    setIsConnecting(true);
    connectSocket();

    const checkInterval = setInterval(() => {
      if (socketRef.current?.readyState === WebSocket.OPEN) {
        clearInterval(checkInterval);
        setIsConnecting(false);
        initiateCall();
      }
    }, 200);

    setTimeout(() => {
      // Fallback: stop connecting state after 5s
      if (!isConnected) setIsConnecting(false);
    }, 5000);
  };

  const initiateCall = () => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN)
      return;

    if (isSlidePanel) {
      setIsRinging(true);
      onCallStart?.();

      setTimeout(() => {
        setIsRinging(false);
        setIsCallActive(true);
        setMessages([]);

        sendMessage({
          type: "call-start",
          systemPrompt,
          selectedModel,
          firstMessage,
          aiSpeaksFirst,
        });

        if (aiSpeaksFirst && firstMessage) {
          setIsAISpeaking(true);
          setTimeout(() => setIsAISpeaking(false), 3000);
        }

        startListening(handleSpeechResult, setError, true, isMuted);
      }, 3000);
    } else {
      setIsCallActive(true);
      setMessages([]);
      onCallStart?.();

      sendMessage({
        type: "call-start",
        systemPrompt,
        selectedModel,
        firstMessage,
        aiSpeaksFirst,
      });

      if (aiSpeaksFirst && firstMessage) {
        setIsAISpeaking(true);
        setTimeout(() => setIsAISpeaking(false), 3000);
      }

      startListening(handleSpeechResult, setError, true, isMuted);
    }
  };

  // ✅ End Call
  const endCall = () => {
    resetCallState();
    stopListening();
    sendMessage({ type: "call-end" });
    onCallEnd?.();
  };

  // ✅ Toggle Mute
  const toggleMute = () => {
    setIsMuted((prev) => !prev);
    if (!isMuted) {
      stopListening();
    } else if (isCallActive) {
      startListening(handleSpeechResult, setError, isCallActive, false);
    }
  };

  // ✅ Toggle Listening
  const toggleListening = () => {
    if (!isCallActive) return;

    if (isListening) stopListening();
    else startListening(handleSpeechResult, setError, isCallActive, isMuted);
  };

  // ✅ Send Text Message
  const sendTextMessage = () => {
    if (!textInput.trim() || !isCallActive) return;

    addMessage("user", textInput);
    if (sendMessage({ type: "voice-input", text: textInput })) {
      setIsAiThinking(true);
    }
    setTextInput("");
  };

  const toggleTextInput = () => {
    setUseTextInput((prev) => !prev);
  };

  // ✅ Auto Start for Slide Panel (only once)
  const hasStartedRef = useRef(false);

  useEffect(() => {
    if (
      isSlidePanel &&
      !isCallActive &&
      !isRinging &&
      !hasStartedRef.current &&
      !isConnecting &&
      !isConnected
    ) {
      hasStartedRef.current = true;
      startCall();
    }
  }, [isSlidePanel, isConnected]);

  // ✅ Cleanup on Unmount
  useEffect(() => {
    return () => {
      if (socketRef.current?.readyState === WebSocket.OPEN) {
        socketRef.current.close();
      }
    };
  }, []);

  return (
    <Card
      className={`space-y-6 ${
        isSlidePanel ? "h-full rounded-none border-0 p-4" : "p-6"
      }`}
    >
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

      <MessageList messages={messages} isCallActive={isCallActive} />
    </Card>
  );
}
