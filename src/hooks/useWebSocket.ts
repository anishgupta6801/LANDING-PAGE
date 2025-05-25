import { useState, useEffect, useCallback, useRef } from 'react';
import { captureException } from '../lib/sentry';

interface WebSocketOptions {
  url: string;
  protocols?: string | string[];
  reconnectAttempts?: number;
  reconnectInterval?: number;
  onOpen?: () => void;
  onClose?: (event: CloseEvent) => void;
  onError?: (event: Event) => void;
  onMessage?: (data: unknown) => void;
}

interface WebSocketState {
  isConnected: boolean;
  isConnecting: boolean;
  isError: boolean;
  lastMessage: unknown;
  error: Event | null;
}

interface WebSocketActions {
  send: (data: string | ArrayBufferLike | Blob | ArrayBufferView) => void;
  reconnect: () => void;
  disconnect: () => void;
}

export const useWebSocket = (options: WebSocketOptions): WebSocketState & WebSocketActions => {
  const {
    url,
    protocols,
    reconnectAttempts = 5,
    reconnectInterval = 3000,
    onOpen,
    onClose,
    onError,
    onMessage,
  } = options;

  const [state, setState] = useState<WebSocketState>({
    isConnected: false,
    isConnecting: false,
    isError: false,
    lastMessage: null,
    error: null,
  });

  const ws = useRef<WebSocket | null>(null);
  const reconnectCount = useRef(0);
  const reconnectTimeout = useRef<number>();

  const connect = useCallback(() => {
    if (ws.current?.readyState === WebSocket.OPEN) return;

    setState((prev) => ({ ...prev, isConnecting: true, isError: false }));

    try {
      ws.current = new WebSocket(url, protocols);
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isConnecting: false,
        isError: true,
        error: error instanceof Event ? error : new Event('WebSocket Error'),
      }));
      captureException(error instanceof Error ? error : new Error('WebSocket connection failed'));
      return;
    }

    ws.current.onopen = () => {
      setState((prev) => ({
        ...prev,
        isConnected: true,
        isConnecting: false,
        isError: false,
        error: null,
      }));
      reconnectCount.current = 0;
      onOpen?.();
    };

    ws.current.onclose = (event) => {
      setState((prev) => ({
        ...prev,
        isConnected: false,
        isConnecting: false,
      }));

      onClose?.(event);

      // Attempt to reconnect if not closed intentionally
      if (event.code !== 1000 && reconnectCount.current < reconnectAttempts) {
        reconnectCount.current += 1;
        reconnectTimeout.current = window.setTimeout(() => {
          connect();
        }, reconnectInterval * reconnectCount.current);
      }
    };

    ws.current.onerror = (event) => {
      setState((prev) => ({
        ...prev,
        isError: true,
        error: event,
      }));
      onError?.(event);
      captureException(new Error('WebSocket error occurred'), { event });
    };

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setState((prev) => ({ ...prev, lastMessage: data }));
        onMessage?.(data);
      } catch (error) {
        setState((prev) => ({ ...prev, lastMessage: event.data }));
        onMessage?.(event.data);
      }
    };
  }, [url, protocols, reconnectAttempts, reconnectInterval, onOpen, onClose, onError, onMessage]);

  const disconnect = useCallback(() => {
    if (reconnectTimeout.current) {
      clearTimeout(reconnectTimeout.current);
    }

    if (ws.current) {
      ws.current.close(1000);
      ws.current = null;
    }

    setState({
      isConnected: false,
      isConnecting: false,
      isError: false,
      lastMessage: null,
      error: null,
    });
  }, []);

  const send = useCallback(
    (data: string | ArrayBufferLike | Blob | ArrayBufferView) => {
      if (ws.current?.readyState === WebSocket.OPEN) {
        ws.current.send(data);
      } else {
        captureException(new Error('WebSocket is not connected'), { data });
      }
    },
    []
  );

  const reconnect = useCallback(() => {
    disconnect();
    reconnectCount.current = 0;
    connect();
  }, [connect, disconnect]);

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    ...state,
    send,
    reconnect,
    disconnect,
  };
}; 