import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Save, RotateCcw, Settings } from "lucide-react";

interface SystemPromptConfigProps {
  systemPrompt: string;
  onPromptChange: (prompt: string) => void;
}

const defaultPrompts = [
  {
    name: "Default Assistant",
    prompt: "You are a helpful AI assistant. Respond in a friendly and professional manner. Provide accurate information and ask clarifying questions when needed."
  },
  {
    name: "Customer Service",
    prompt: "You are a customer service representative. Be empathetic, patient, and solution-focused. Always maintain a positive and helpful tone."
  },
  {
    name: "Technical Expert", 
    prompt: "You are a technical expert. Provide detailed, accurate technical information. Use clear explanations and examples. Ask for clarification on technical requirements."
  },
  {
    name: "Creative Assistant",
    prompt: "You are a creative assistant. Be imaginative, inspiring, and supportive. Help with brainstorming, creative problem-solving, and artistic endeavors."
  }
];

export default function SystemPromptConfig({ systemPrompt, onPromptChange }: SystemPromptConfigProps) {
  const [currentPrompt, setCurrentPrompt] = useState(systemPrompt);
  const [isSaved, setIsSaved] = useState(true);

  const handlePromptChange = (value: string) => {
    setCurrentPrompt(value);
    setIsSaved(false);
  };

  const handleSave = () => {
    onPromptChange(currentPrompt);
    setIsSaved(true);
  };

  const handleReset = () => {
    setCurrentPrompt(systemPrompt);
    setIsSaved(true);
  };

  const loadPreset = (preset: string) => {
    setCurrentPrompt(preset);
    setIsSaved(false);
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center space-x-3">
        <Settings className="w-6 h-6 text-primary" />
        <div>
          <h3 className="text-xl font-semibold">System Prompt Configuration</h3>
          <p className="text-sm text-muted-foreground">
            Define how your AI assistant should behave and respond
          </p>
        </div>
      </div>

      {/* Preset Prompts */}
      <div className="space-y-3">
        <label className="text-sm font-medium">Quick Presets:</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {defaultPrompts.map((preset, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => loadPreset(preset.prompt)}
              className="justify-start text-left h-auto p-3 min-h-[4rem]"
            >
              <div className="space-y-1 w-full">
                <div className="font-medium text-xs leading-tight">{preset.name}</div>
                <div className="text-xs text-muted-foreground leading-tight whitespace-normal line-clamp-2">
                  {preset.prompt.substring(0, 60)}...
                </div>
              </div>
            </Button>
          ))}
        </div>
      </div>

      {/* Custom Prompt */}
      <div className="space-y-3">
        <label className="text-sm font-medium">Custom System Prompt:</label>
        <Textarea
          value={currentPrompt}
          onChange={(e) => handlePromptChange(e.target.value)}
          placeholder="Enter your custom system prompt here..."
          className="min-h-32 resize-none"
        />
        <div className="text-xs text-muted-foreground">
          Characters: {currentPrompt.length}/2000
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <Button
          variant={isSaved ? "secondary" : "accent"}
          onClick={handleSave}
          disabled={isSaved}
          className="flex-1"
        >
          <Save className="w-4 h-4 mr-2" />
          {isSaved ? "Saved" : "Save Changes"}
        </Button>
        <Button
          variant="outline"
          onClick={handleReset}
          disabled={isSaved}
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
      </div>
    </Card>
  );
}