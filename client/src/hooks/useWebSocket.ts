import { useEffect, useRef, useState } from 'react';
import { ReconnectingWebSocket } from '../utils/websocket';

function getWebSocketURL(): string {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const host = window.location.host;
  return `${protocol}//${host}/ws`;
}

export function useWebSocket(token: string) {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionState, setConnectionState] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
  const wsRef = useRef<ReconnectingWebSocket | null>(null);

  useEffect(() => {
    if (!token) return;

    const wsUrl = getWebSocketURL();
    const ws = new ReconnectingWebSocket(wsUrl, token);
    wsRef.current = ws;
    (window as any).gameWebSocket = ws;

    ws.onConnectionStateChange((state) => {
      setConnectionState(state);
      setIsConnected(state === 'connected');
    });

    ws.connect();

    return () => {
      ws.disconnect();
      wsRef.current = null;
      delete (window as any).gameWebSocket;
    };
  }, [token]);

  const sendMessage = (message: any) => {
    if (wsRef.current) {
      wsRef.current.send({
        ...message,
        timestamp: Date.now(),
      });
    }
  };

  const on = (eventType: string, callback: (data: any) => void) => {
    if (wsRef.current) {
      wsRef.current.on(eventType, callback);
    }
  };

  const off = (eventType: string, callback: (data: any) => void) => {
    if (wsRef.current) {
      wsRef.current.off(eventType, callback);
    }
  };

  return { sendMessage, isConnected, connectionState, on, off };
}
