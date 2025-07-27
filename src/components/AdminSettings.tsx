import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Settings, Save, Shield } from "lucide-react";

interface AdminSettingsProps {
  aiSpeaksFirst: boolean;
  firstMessage: string;
  onAISpeaksFirstChange: (value: boolean) => void;
  onFirstMessageChange: (message: string) => void;
}

export default function AdminSettings({
  aiSpeaksFirst,
  firstMessage,
  onAISpeaksFirstChange,
  onFirstMessageChange
}: AdminSettingsProps) {
  const [currentFirstMessage, setCurrentFirstMessage] = useState(firstMessage);
  const [isSaved, setIsSaved] = useState(true);

  const handleFirstMessageChange = (value: string) => {
    setCurrentFirstMessage(value);
    setIsSaved(false);
  };

  const handleSave = () => {
    onFirstMessageChange(currentFirstMessage);
    setIsSaved(true);
  };

  const handleSpeaksFirstChange = (value: boolean) => {
    onAISpeaksFirstChange(value);
    if (!value) {
      // If AI doesn't speak first, clear the first message
      setCurrentFirstMessage("");
      onFirstMessageChange("");
      setIsSaved(true);
    }
  };

  const presetMessages = [
    "Hello! I'm your AI assistant. How can I help you today?",
    "Welcome! I'm here to assist you with any questions or tasks you might have.",
    "Hi there! I'm ready to help. What would you like to know?",
    "Greetings! I'm your personal AI companion. How may I assist you?",
    "Hello! I'm equipped with the knowledge you've provided. How can I help?"
  ];

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center space-x-3">
        <Shield className="w-6 h-6 text-primary" />
        <div>
          <h3 className="text-xl font-semibold">Admin Settings</h3>
          <p className="text-sm text-muted-foreground">
            Configure conversation flow and initial behavior
          </p>
        </div>
      </div>

      {/* Who Speaks First */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <label className="text-sm font-medium">AI Speaks First</label>
            <p className="text-xs text-muted-foreground">
              Determine whether the AI or user initiates the conversation
            </p>
          </div>
          <Switch
            checked={aiSpeaksFirst}
            onCheckedChange={handleSpeaksFirstChange}
          />
        </div>

        {/* Conversation Flow Indicator */}
        <div className="p-4 bg-muted rounded-lg">
          <h4 className="font-medium text-sm mb-2">Conversation Flow:</h4>
          <div className="flex items-center space-x-2 text-sm">
            {aiSpeaksFirst ? (
              <>
                <div className="px-2 py-1 bg-primary text-primary-foreground rounded text-xs">
                  AI Greeting
                </div>
                <span>→</span>
                <div className="px-2 py-1 bg-accent text-accent-foreground rounded text-xs">
                  User Response
                </div>
              </>
            ) : (
              <>
                <div className="px-2 py-1 bg-accent text-accent-foreground rounded text-xs">
                  User Initiates
                </div>
                <span>→</span>
                <div className="px-2 py-1 bg-primary text-primary-foreground rounded text-xs">
                  AI Response
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* First Message Configuration */}
      {aiSpeaksFirst && (
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">AI's First Message</label>
            <p className="text-xs text-muted-foreground mt-1">
              The initial greeting message when AI speaks first
            </p>
          </div>

          {/* Preset Messages */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">
              Quick Presets:
            </label>
            <div className="grid gap-2">
              {presetMessages.map((preset, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="justify-start text-left h-auto p-3"
                  onClick={() => handleFirstMessageChange(preset)}
                >
                  <div className="text-xs text-muted-foreground">
                    "{preset}"
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Custom First Message */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">
              Custom Message:
            </label>
            <Textarea
              value={currentFirstMessage}
              onChange={(e) => handleFirstMessageChange(e.target.value)}
              placeholder="Enter the AI's first message..."
              className="resize-none"
              rows={3}
            />
            <div className="flex justify-between items-center">
              <div className="text-xs text-muted-foreground">
                Characters: {currentFirstMessage.length}/500
              </div>
              <Button
                variant={isSaved ? "secondary" : "accent"}
                size="sm"
                onClick={handleSave}
                disabled={isSaved}
              >
                <Save className="w-3 h-3 mr-1" />
                {isSaved ? "Saved" : "Save"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Additional Settings */}
      <div className="pt-4 border-t space-y-4">
        <h4 className="font-medium text-sm">Additional Settings</h4>
        
        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <label className="text-sm font-medium">Auto-transcription</label>
              <p className="text-xs text-muted-foreground">
                Automatically show speech-to-text during calls
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <label className="text-sm font-medium">Voice Responses</label>
              <p className="text-xs text-muted-foreground">
                Enable text-to-speech for AI responses
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <label className="text-sm font-medium">Call Recording</label>
              <p className="text-xs text-muted-foreground">
                Save conversation transcripts for review
              </p>
            </div>
            <Switch />
          </div>
        </div>
      </div>
    </Card>
  );
}