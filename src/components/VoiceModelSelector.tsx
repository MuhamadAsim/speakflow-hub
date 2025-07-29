import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, Pause, Volume2 } from "lucide-react";
import avatarFemale from "@/assets/ai-avatar-female.jpg";
import avatarMale from "@/assets/ai-avatar-male.jpg";
import avatarCosmic from "@/assets/ai-avatar-cosmic.jpg";
import avatarChrome from "@/assets/ai-avatar-chrome.jpg";

interface VoiceModel {
  id: string;
  name: string;
  avatar: string;
  description: string;
  voiceType: string;
  sampleText: string;
}

const voiceModels: VoiceModel[] = [
  {
    id: "aria",
    name: "Aria",
    avatar: avatarFemale,
    description: "Professional and warm female voice",
    voiceType: "Female • Professional",
    sampleText: "Hello! I'm Aria, your AI assistant. How can I help you today?"
  },
  {
    id: "roger",
    name: "Roger", 
    avatar: avatarMale,
    description: "Confident and articulate male voice",
    voiceType: "Male • Authoritative",
    sampleText: "Greetings! I'm Roger, ready to assist you with any questions you might have."
  },
  {
    id: "kareem",
    name: "Kareem",
    avatar: avatarCosmic,
    description: "Ethereal and mystical voice",
    voiceType: "Neutral • Mystical", 
    sampleText: "Welcome to the cosmic realm of knowledge. I am kareem, your guide through the universe of information."
  },
  {
    id: "chrome",
    name: "Chrome",
    avatar: avatarChrome,
    description: "Modern and sleek voice",
    voiceType: "Neutral • Modern",
    sampleText: "System initialized. I'm Chrome, your advanced AI companion for seamless interactions."
  }
];

interface VoiceModelSelectorProps {
  selectedModel: string;
  onModelSelect: (modelId: string) => void;
}

export default function VoiceModelSelector({ selectedModel, onModelSelect }: VoiceModelSelectorProps) {
  const [playingModel, setPlayingModel] = useState<string | null>(null);

  const handlePlaySample = (model: VoiceModel) => {
  if (playingModel === model.id) {
    setPlayingModel(null);
    return;
  }

  setPlayingModel(model.id);

  const audio = new Audio(`/audio/${model.id}.wav`); // audio files in /public/audio
  audio.play();

  audio.onended = () => setPlayingModel(null);
};


  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold bg-gradient-voice bg-clip-text text-transparent">
          Choose Your AI Assistant
        </h2>
        <p className="text-muted-foreground">
          Select a voice model and hear a sample before starting your conversation
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {voiceModels.map((model) => (
          <Card
            key={model.id}
            className={`p-6 cursor-pointer transition-all duration-300 hover:scale-105 ${
              selectedModel === model.id
                ? "ring-2 ring-primary shadow-voice bg-gradient-to-br from-card to-primary/5"
                : "hover:shadow-elegant"
            }`}
            onClick={() => onModelSelect(model.id)}
          >
            <div className="space-y-4">
              {/* Avatar */}
              <div className="relative mx-auto w-20 h-20">
                <img
                  src={model.avatar}
                  alt={model.name}
                  className="w-full h-full rounded-full object-cover border-2 border-primary/20"
                />
                {selectedModel === model.id && (
                  <div className="absolute inset-0 rounded-full bg-primary/20 animate-pulse-glow" />
                )}
              </div>

              {/* Name and Type */}
              <div className="text-center space-y-1">
                <h3 className="font-semibold text-lg">{model.name}</h3>
                <p className="text-sm text-muted-foreground">{model.voiceType}</p>
              </div>

              {/* Description */}
              <p className="text-xs text-muted-foreground text-center leading-relaxed">
                {model.description}
              </p>

              {/* Play Sample Button */}
              <Button
                variant="voice"
                size="sm"
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlaySample(model);
                }}
              >
                {playingModel === model.id ? (
                  <>
                    <Pause className="w-4 h-4" />
                    Playing...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Hear Sample
                  </>
                )}
              </Button>

              {/* Voice Wave Animation */}
              {playingModel === model.id && (
                <div className="flex justify-center items-center space-x-1 h-8">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1 bg-primary rounded-full animate-voice-wave"
                      style={{
                        height: "20px",
                        animationDelay: `${i * 0.1}s`
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}