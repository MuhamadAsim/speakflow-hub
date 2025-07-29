import { useRef, useState, useCallback } from 'react';

export const useWebSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("Disconnected");
  const [error, setError] = useState("");
  const socketRef = useRef<WebSocket | null>(null);

  const connectSocket = useCallback(() => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) return;

    const ws = new WebSocket("ws://localhost:5000");
    socketRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      setConnectionStatus("Ready for call");
    };

    ws.onclose = () => {
      setIsConnected(false);
      setConnectionStatus("Disconnected");
    };

    ws.onerror = () => setError("Connection error occurred");

    return ws;
  }, []);

  const sendMessage = useCallback((message: any) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(message));
      return true;
    }
    return false;
  }, []);

  return {
    socketRef,
    isConnected,
    connectionStatus,
    error,
    setError,
    connectSocket,
    sendMessage
  };
};