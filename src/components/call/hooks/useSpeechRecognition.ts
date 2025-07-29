import { useRef, useState, useCallback } from 'react';

export const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);

  const startListening = useCallback((
    onResult: (text: string) => void,
    onError: (error: string) => void,
    isCallActive: boolean,
    isMuted: boolean
  ) => {
    if (isMuted) return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      onError("Speech recognition not supported in your browser");
      return;
    }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.lang = "en-US";
    recognitionRef.current.interimResults = false;
    recognitionRef.current.continuous = true;
    recognitionRef.current.maxAlternatives = 1;

    recognitionRef.current.onstart = () => {
      setIsRecording(true);
      setIsListening(true);
      onError("");
      console.log("🎤 Speech recognition started");
    };

    recognitionRef.current.onresult = (event: any) => {
      const text = event.results[event.results.length - 1][0].transcript;
      console.log("🎤 Recognized:", text);
      onResult(text);

      // Brief pause in listening while AI responds
      setIsRecording(false);
      setIsListening(false);
      setTimeout(() => {
        if (isCallActive && recognitionRef.current && !isMuted) {
          recognitionRef.current.start();
        }
      }, 2000);
    };

    recognitionRef.current.onerror = (event: any) => {
      console.error("🎤 Speech recognition error:", event.error);

      // Notify parent about the error
      if (event.error === "network") {
        onError("Internet connection issue – speech recognition failed.");
      } else if (event.error === "no-speech") {
        onError("No speech detected. Please try again.");
      } else if (event.error === "aborted") {
        // Ignore abort (user manually stopped)
        return;
      } else {
        onError("Speech recognition error: " + event.error);
      }

      // Try restarting only for recoverable errors
      if (event.error !== "aborted" && isCallActive && !isMuted) {
        setTimeout(() => {
          if (recognitionRef.current) {
            recognitionRef.current.start();
          }
        }, 1000);
      }
    };


    recognitionRef.current.onend = () => {
      setIsRecording(false);

      if (isCallActive && !isMuted) {
        setTimeout(() => {
          if (recognitionRef.current) {
            recognitionRef.current.start();
          }
        }, 500);
      }
    };

    recognitionRef.current.start();
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsRecording(false);
    setIsListening(false);
  }, []);

  return {
    isListening,
    isRecording,
    startListening,
    stopListening
  };
};