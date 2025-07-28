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
  MessageSquare
} from "lucide-react";
import { CallControlsProps } from "./types";

export default function CallControls({
  isCallActive,
  isRinging,
  isMuted,
  isListening,
  useTextInput,
  textInput,
  onStartCall,
  onEndCall,
  onToggleMute,
  onToggleListening,
  onToggleTextInput,
  onTextInputChange,
  onSendMessage
}: CallControlsProps) {
  return (
    <>
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
              onClick={onEndCall}
            >
              <PhoneOff className="w-5 h-5 mr-2" />
              Cancel
            </Button>
          </div>
        ) : !isCallActive ? (
          <Button
            variant="call"
            size="xl"
            onClick={onStartCall}
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
              onClick={onToggleMute}
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </Button>
            
            <Button
              variant={isListening ? "glow" : "voice"}
              size="lg"
              onClick={onToggleListening}
              disabled={useTextInput}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </Button>
            
            <Button
              variant={useTextInput ? "accent" : "secondary"}
              size="lg"
              onClick={onToggleTextInput}
            >
              {useTextInput ? <MessageSquare className="w-5 h-5" /> : <Keyboard className="w-5 h-5" />}
            </Button>
            
            <Button
              variant="destructive"
              size="lg"
              onClick={onEndCall}
            >
              <PhoneOff className="w-5 h-5" />
            </Button>
          </div>
        )}
      </div>

      {/* Text Input */}
      {isCallActive && useTextInput && (
        <div className="flex space-x-2">
          <Textarea
            value={textInput}
            onChange={(e) => onTextInputChange(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 resize-none"
            rows={2}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                onSendMessage();
              }
            }}
          />
          <Button
            variant="accent"
            onClick={onSendMessage}
            disabled={!textInput.trim()}
          >
            Send
          </Button>
        </div>
      )}
    </>
  );
}