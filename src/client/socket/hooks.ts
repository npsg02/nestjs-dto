import { useState, useEffect, useCallback, useRef } from 'react';
import { SocketClient } from './socket-client';

/**
 * Hook to use Socket.IO client in React components
 */
export function useSocket(client: SocketClient) {
  const [isConnected, setIsConnected] = useState(client.getIsConnected());

  useEffect(() => {
    const socket = client.getSocket();

    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, [client]);

  return {
    isConnected,
    emit: useCallback((event: string, data?: any) => client.emit(event, data), [client]),
    emitWithAck: useCallback((event: string, data?: any) => client.emitWithAck(event, data), [client]),
    socket: client.getSocket(),
  };
}

/**
 * Hook to listen to Socket.IO events
 */
export function useSocketEvent<T = any>(
  client: SocketClient,
  event: string,
  callback: (data: T) => void
) {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const socket = client.getSocket();
    const handler = (data: T) => callbackRef.current(data);

    socket.on(event, handler);

    return () => {
      socket.off(event, handler);
    };
  }, [client, event]);
}

/**
 * Hook to emit Socket.IO events with state management
 */
export function useSocketEmit<TData = any, TResponse = any>(client: SocketClient) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<TResponse | null>(null);

  const emit = useCallback(
    async (event: string, payload?: TData) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await client.emitWithAck<TResponse>(event, payload);
        setData(response);
        return response;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [client]
  );

  return {
    emit,
    isLoading,
    error,
    data,
  };
}
