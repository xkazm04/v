import { useState, useEffect, useRef, useCallback } from 'react';
import { ProcessingUpdate, ProcessingStatus } from '../types/processing';

interface UseSSEOptions {
  onUpdate?: (update: ProcessingUpdate) => void;
  onError?: (error: string) => void;
  onComplete?: (finalUpdate: ProcessingUpdate) => void;
  autoReconnect?: boolean;
  maxReconnectAttempts?: number;
}

export const useSSE = (streamUrl: string | null, options: UseSSEOptions = {}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<ProcessingUpdate | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);

  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const {
    onUpdate,
    onError,
    onComplete,
    autoReconnect = true,
    maxReconnectAttempts = 3
  } = options;

  const disconnect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    setIsConnected(false);
  }, []);

  const connect = useCallback(() => {
    if (!streamUrl || eventSourceRef.current) return;

    try {
      const eventSource = new EventSource(streamUrl);
      eventSourceRef.current = eventSource;

      eventSource.onopen = () => {
        console.log('SSE connection opened');
        setIsConnected(true);
        setError(null);
        setReconnectAttempts(0);
      };

      eventSource.onmessage = (event) => {
        try {
          const update: ProcessingUpdate = JSON.parse(event.data);
          
          // Skip heartbeat messages
          if (update.type === 'heartbeat') {
            return;
          }

          console.log('SSE Update:', update);
          setLastUpdate(update);
          
          // Call update callback
          onUpdate?.(update);

          // Check if processing is complete
          if (update.status === ProcessingStatus.COMPLETED || update.status === ProcessingStatus.FAILED) {
            onComplete?.(update);
          }

        } catch (parseError) {
          console.error('Failed to parse SSE message:', parseError);
        }
      };

      eventSource.onerror = (event) => {
        console.error('SSE connection error:', event);
        setIsConnected(false);
        
        const errorMessage = 'SSE connection failed';
        setError(errorMessage);
        onError?.(errorMessage);

        // Auto-reconnect logic
        if (autoReconnect && reconnectAttempts < maxReconnectAttempts) {
          const delay = Math.pow(2, reconnectAttempts) * 1000; // Exponential backoff
          console.log(`Attempting to reconnect in ${delay}ms (attempt ${reconnectAttempts + 1}/${maxReconnectAttempts})`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            setReconnectAttempts(prev => prev + 1);
            disconnect();
            connect();
          }, delay);
        }
      };

    } catch (connectError) {
      console.error('Failed to create SSE connection:', connectError);
      setError('Failed to establish connection');
      onError?.('Failed to establish connection');
    }
  }, [streamUrl, onUpdate, onError, onComplete, autoReconnect, maxReconnectAttempts, reconnectAttempts, disconnect]);

  // Connect when streamUrl is provided
  useEffect(() => {
    if (streamUrl) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [streamUrl, connect, disconnect]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    isConnected,
    lastUpdate,
    error,
    reconnectAttempts,
    disconnect,
    reconnect: connect
  };
};