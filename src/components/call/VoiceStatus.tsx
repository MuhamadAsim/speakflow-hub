import { Bot, User } from "lucide-react";

interface VoiceStatusProps {
  isCallActive: boolean;
  isAISpeaking: boolean;
  isListening: boolean;
}

export default function VoiceStatus({ isCallActive, isAISpeaking, isListening }: VoiceStatusProps) {
  if (!isCallActive) return null;

  return (
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
  );
}