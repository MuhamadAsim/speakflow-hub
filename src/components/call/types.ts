export interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

export interface CallInterfaceProps {
  selectedModel: string;
  systemPrompt: string;
  firstMessage: string;
  aiSpeaksFirst: boolean;
  onCallStart?: () => void;
  onCallEnd?: () => void;
  isSlidePanel?: boolean;
}

export interface CallControlsProps {
  isCallActive: boolean;
  isRinging: boolean;
  isMuted: boolean;
  isListening: boolean;
  useTextInput: boolean;
  textInput: string;
  onStartCall: () => void;
  onEndCall: () => void;
  onToggleMute: () => void;
  onToggleListening: () => void;
  onToggleTextInput: () => void;
  onTextInputChange: (value: string) => void;
  onSendMessage: () => void;
}

export interface MessageListProps {
  messages: Message[];
  isCallActive: boolean;
}