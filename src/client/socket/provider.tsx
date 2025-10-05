import React, { createContext, useContext, useEffect } from 'react';
import { SocketClient } from './socket-client';

/**
 * Context for Socket.IO client
 */
const SocketContext = createContext<SocketClient | null>(null);

/**
 * Configuration for Socket Provider
 */
export interface SocketProviderConfig {
  client: SocketClient;
  autoConnect?: boolean;
  children: React.ReactNode;
}

/**
 * Provider component for Socket.IO client
 */
export const SocketProvider: React.FC<SocketProviderConfig> = ({
  client,
  autoConnect = true,
  children,
}) => {
  useEffect(() => {
    if (autoConnect) {
      client.connect();
    }

    return () => {
      client.disconnect();
    };
  }, [client, autoConnect]);

  return (
    <SocketContext.Provider value={client}>
      {children}
    </SocketContext.Provider>
  );
};

/**
 * Hook to access the Socket.IO client from context
 */
export function useSocketClient(): SocketClient {
  const client = useContext(SocketContext);
  if (!client) {
    throw new Error('useSocketClient must be used within a SocketProvider');
  }
  return client;
}
