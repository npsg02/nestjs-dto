import { io, Socket, ManagerOptions, SocketOptions } from 'socket.io-client';

/**
 * Configuration for Socket.IO client
 */
export interface SocketClientConfig {
  url: string;
  options?: Partial<ManagerOptions & SocketOptions>;
  authToken?: string;
}

/**
 * Socket.IO Client wrapper with common functionality
 */
export class SocketClient {
  private socket: Socket;
  private isConnected: boolean = false;

  constructor(config: SocketClientConfig) {
    const options: Partial<ManagerOptions & SocketOptions> = {
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      ...config.options,
    };

    // Add auth token to options if provided
    if (config.authToken) {
      options.auth = {
        token: config.authToken,
      };
    }

    this.socket = io(config.url, options);
    this.setupEventHandlers();
  }

  /**
   * Setup default event handlers
   */
  private setupEventHandlers(): void {
    this.socket.on('connect', () => {
      this.isConnected = true;
      console.log('Socket connected:', this.socket.id);
    });

    this.socket.on('disconnect', (reason) => {
      this.isConnected = false;
      console.log('Socket disconnected:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
  }

  /**
   * Connect to the socket server
   */
  connect(): void {
    if (!this.isConnected) {
      this.socket.connect();
    }
  }

  /**
   * Disconnect from the socket server
   */
  disconnect(): void {
    if (this.isConnected) {
      this.socket.disconnect();
    }
  }

  /**
   * Emit an event to the server
   */
  emit(event: string, data?: any): void {
    this.socket.emit(event, data);
  }

  /**
   * Listen to an event from the server
   */
  on(event: string, callback: (...args: any[]) => void): void {
    this.socket.on(event, callback);
  }

  /**
   * Remove an event listener
   */
  off(event: string, callback?: (...args: any[]) => void): void {
    if (callback) {
      this.socket.off(event, callback);
    } else {
      this.socket.off(event);
    }
  }

  /**
   * Listen to an event once
   */
  once(event: string, callback: (...args: any[]) => void): void {
    this.socket.once(event, callback);
  }

  /**
   * Emit an event and wait for acknowledgment
   */
  async emitWithAck<T = any>(event: string, data?: any): Promise<T> {
    return new Promise((resolve, reject) => {
      this.socket.timeout(5000).emit(event, data, (err: any, response: T) => {
        if (err) {
          reject(err);
        } else {
          resolve(response);
        }
      });
    });
  }

  /**
   * Set or update authorization token
   */
  setAuthToken(token: string): void {
    if (this.socket.auth) {
      (this.socket.auth as any).token = token;
    } else {
      this.socket.auth = { token };
    }
    // Reconnect to apply new token
    if (this.isConnected) {
      this.disconnect();
      this.connect();
    }
  }

  /**
   * Check if socket is connected
   */
  getIsConnected(): boolean {
    return this.isConnected;
  }

  /**
   * Get the underlying socket instance
   */
  getSocket(): Socket {
    return this.socket;
  }
}

/**
 * Create a Socket.IO client instance
 */
export function createSocketClient(config: SocketClientConfig): SocketClient {
  return new SocketClient(config);
}
