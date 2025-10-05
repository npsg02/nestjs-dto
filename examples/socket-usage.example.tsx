import React, { useState, useEffect } from 'react';
import {
  createSocketClient,
  SocketProvider,
  useSocket,
  useSocketEvent,
  useSocketEmit,
} from 'nestjs-dto';

// Create Socket.IO client
const socketClient = createSocketClient({
  url: 'http://localhost:3000',
  authToken: 'your-jwt-token-here',
  options: {
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  },
});

// Example message type
interface Message {
  id: string;
  user: string;
  text: string;
  timestamp: number;
}

/**
 * Example component using Socket.IO for real-time chat
 */
function ChatComponent() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const { isConnected, emit } = useSocket(socketClient);

  // Listen to incoming messages
  useSocketEvent<Message>(socketClient, 'message', (message) => {
    setMessages((prev) => [...prev, message]);
  });

  // Listen to user joined event
  useSocketEvent<{ user: string }>(socketClient, 'user-joined', (data) => {
    console.log(`${data.user} joined the chat`);
  });

  // Listen to user left event
  useSocketEvent<{ user: string }>(socketClient, 'user-left', (data) => {
    console.log(`${data.user} left the chat`);
  });

  const handleSendMessage = () => {
    if (inputText.trim()) {
      emit('send-message', {
        text: inputText,
        timestamp: Date.now(),
      });
      setInputText('');
    }
  };

  return (
    <div>
      <h1>Chat Room</h1>
      <div>
        Status: {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
      </div>
      <div style={{ border: '1px solid #ccc', padding: '10px', height: '300px', overflowY: 'auto' }}>
        {messages.map((msg) => (
          <div key={msg.id}>
            <strong>{msg.user}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <div>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Type a message..."
        />
        <button onClick={handleSendMessage} disabled={!isConnected}>
          Send
        </button>
      </div>
    </div>
  );
}

/**
 * Example component using Socket.IO emit with acknowledgment
 */
function RoomManager() {
  const [rooms, setRooms] = useState<string[]>([]);
  const { emit: emitRaw } = useSocket(socketClient);
  const { emit: createRoom, isLoading, error } = useSocketEmit<
    { name: string },
    { success: boolean; roomId: string }
  >(socketClient);

  useSocketEvent<{ rooms: string[] }>(socketClient, 'rooms-list', (data) => {
    setRooms(data.rooms);
  });

  useEffect(() => {
    // Request initial rooms list
    emitRaw('get-rooms');
  }, [emitRaw]);

  const handleCreateRoom = async () => {
    try {
      const response = await createRoom('create-room', {
        name: `Room ${Date.now()}`,
      });
      console.log('Room created:', response);
    } catch (err) {
      console.error('Failed to create room:', err);
    }
  };

  return (
    <div>
      <h2>Room Manager</h2>
      <button onClick={handleCreateRoom} disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create Room'}
      </button>
      {error && <div style={{ color: 'red' }}>Error: {error.message}</div>}
      <h3>Available Rooms</h3>
      <ul>
        {rooms.map((room) => (
          <li key={room}>{room}</li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Example component for notifications
 */
function NotificationListener() {
  const [notifications, setNotifications] = useState<string[]>([]);

  useSocketEvent<{ message: string }>(socketClient, 'notification', (data) => {
    setNotifications((prev) => [data.message, ...prev].slice(0, 5));
  });

  return (
    <div>
      <h3>Notifications</h3>
      <ul>
        {notifications.map((notif, index) => (
          <li key={index}>{notif}</li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Root App component with Socket Provider
 */
export function App() {
  return (
    <SocketProvider client={socketClient} autoConnect={true}>
      <div>
        <ChatComponent />
        <hr />
        <RoomManager />
        <hr />
        <NotificationListener />
      </div>
    </SocketProvider>
  );
}

/**
 * Manual usage without provider
 */
export function manualSocketUsage() {
  // Connect to socket
  socketClient.connect();

  // Emit event
  socketClient.emit('join-room', { roomId: '123' });

  // Listen to event
  socketClient.on('room-joined', (data) => {
    console.log('Joined room:', data);
  });

  // Emit with acknowledgment
  socketClient
    .emitWithAck('get-user-info', { userId: 1 })
    .then((response) => {
      console.log('User info:', response);
    })
    .catch((error) => {
      console.error('Error:', error);
    });

  // Disconnect
  socketClient.disconnect();
}
