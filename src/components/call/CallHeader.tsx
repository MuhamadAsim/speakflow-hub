import { Phone } from "lucide-react";

interface CallHeaderProps {
  selectedModel: string;
  isRinging: boolean;
  isCallActive: boolean;
  isConnected: boolean;
  connectionStatus: string;
}

const CallHeader = ({ 
  selectedModel, 
  isRinging, 
  isCallActive, 
  isConnected, 
  connectionStatus 
}: CallHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <Phone className="w-6 h-6 text-primary" />
        <div>
          <h3 className="text-xl font-semibold">Voice Assistant Call</h3>
          <p className="text-sm text-muted-foreground">
            {isRinging 
              ? "Connecting..." 
              : isCallActive 
                ? `Connected with ${selectedModel}` 
                : connectionStatus
            }
          </p>
        </div>
      </div>

      {/* Call Status */}
      {isRinging && (
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse" />
          <span className="text-sm text-yellow-500 font-medium">Ringing...</span>
        </div>
      )}
      {isCallActive && (
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm text-green-500 font-medium">Connected</span>
        </div>
      )}
      {!isConnected && (
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          <span className="text-sm text-red-500 font-medium">Disconnected</span>
        </div>
      )}
    </div>
  );
};


export default CallHeader;
