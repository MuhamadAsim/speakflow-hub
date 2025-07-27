import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Phone, Settings, Upload, MessageSquare } from "lucide-react";
import VoiceModelSelector from "@/components/VoiceModelSelector";
import SystemPromptConfig from "@/components/SystemPromptConfig";
import FileUpload from "@/components/FileUpload";
import CallInterface from "@/components/CallInterface";
import AdminSettings from "@/components/AdminSettings";

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  content?: string;
}

const Index = () => {
  const [selectedModel, setSelectedModel] = useState("aria");
  const [systemPrompt, setSystemPrompt] = useState(
    "You are a helpful AI assistant. Respond in a friendly and professional manner. Provide accurate information and ask clarifying questions when needed."
  );
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [aiSpeaksFirst, setAISpeaksFirst] = useState(true);
  const [firstMessage, setFirstMessage] = useState(
    "Hello! I'm your AI assistant. How can I help you today?"
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-voice flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-voice bg-clip-text text-transparent">
                  SpeakFlow Hub
                </h1>
                <p className="text-sm text-muted-foreground">
                  Advanced AI Voice Assistant Platform
                </p>
              </div>
            </div>

            {/* Quick Call Button */}
            <div className="flex items-center space-x-4">
              <Button
                variant="call"
                size="lg"
                className="shadow-lg"
                onClick={() => {
                  document.getElementById('call-section')?.scrollIntoView({ 
                    behavior: 'smooth' 
                  });
                }}
              >
                <Phone className="w-5 h-5 mr-2" />
                Start Call
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 space-y-12">
        {/* Hero Section */}
        <section className="text-center space-y-6 py-12">
          <div className="space-y-4">
            <h2 className="text-5xl font-bold bg-gradient-voice bg-clip-text text-transparent leading-tight">
              Your Intelligent Voice Assistant
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Experience the future of AI conversations with customizable voice models, 
              intelligent document processing, and real-time communication capabilities.
            </p>
          </div>
          
          <div className="flex justify-center space-x-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-8 bg-gradient-voice rounded-full animate-voice-wave opacity-60"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        </section>

        {/* Voice Model Selection */}
        <section className="space-y-8">
          <VoiceModelSelector
            selectedModel={selectedModel}
            onModelSelect={setSelectedModel}
          />
        </section>

        {/* Configuration Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SystemPromptConfig
            systemPrompt={systemPrompt}
            onPromptChange={setSystemPrompt}
          />
          
          <FileUpload
            uploadedFiles={uploadedFiles}
            onFilesChange={setUploadedFiles}
          />
        </section>

        {/* Call Interface */}
        <section id="call-section" className="space-y-8">
          <CallInterface
            selectedModel={selectedModel}
            systemPrompt={systemPrompt}
            firstMessage={firstMessage}
            aiSpeaksFirst={aiSpeaksFirst}
          />
        </section>

        {/* Admin Settings */}
        <section className="space-y-8">
          <AdminSettings
            aiSpeaksFirst={aiSpeaksFirst}
            firstMessage={firstMessage}
            onAISpeaksFirstChange={setAISpeaksFirst}
            onFirstMessageChange={setFirstMessage}
          />
        </section>

        {/* Footer Info */}
        <section className="text-center py-12 border-t border-border">
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold">Ready to Get Started?</h3>
            <p className="text-muted-foreground">
              Configure your AI assistant above and start your first conversation
            </p>
            <div className="flex justify-center space-x-4">
              <Button
                variant="voice"
                onClick={() => {
                  document.getElementById('call-section')?.scrollIntoView({ 
                    behavior: 'smooth' 
                  });
                }}
              >
                <Phone className="w-4 h-4 mr-2" />
                Start Your First Call
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <Settings className="w-4 h-4 mr-2" />
                Customize Settings
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
