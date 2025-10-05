import React, { useState } from 'react';
import { gql } from '@apollo/client';
import {
  // REST Client with React Query
  ApiClient,
  ApiQueryProvider,
  createDefaultQueryClient,
  useApiQuery,
  useApiPost,
  // GraphQL with Apollo Client
  createApolloClient,
  GraphQLProvider,
  useGraphQLQuery,
  useGraphQLMutation,
  // Socket.IO Client
  createSocketClient,
  SocketProvider,
  useSocket,
  useSocketEvent,
  // Utilities
  FilterOperator,
  SortDirection,
} from 'nestjs-dto';

/**
 * CLIENT SETUP
 */

// 1. REST API Client
const apiClient = new ApiClient({
  baseURL: 'http://localhost:3000/api',
});

const queryClient = createDefaultQueryClient();

// 2. GraphQL Apollo Client
const apolloClient = createApolloClient({
  uri: 'http://localhost:3000/graphql',
  authToken: localStorage.getItem('token') || undefined,
});

// 3. Socket.IO Client
const socketClient = createSocketClient({
  url: 'http://localhost:3000',
  authToken: localStorage.getItem('token') || undefined,
});

/**
 * TYPES
 */
interface User {
  id: number;
  name: string;
  email: string;
  status: string;
}

interface Message {
  id: string;
  userId: number;
  text: string;
  timestamp: number;
}

/**
 * GRAPHQL QUERIES
 */
const GET_USER_PROFILE = gql`
  query GetUserProfile($userId: Int!) {
    user(id: $userId) {
      id
      name
      email
      status
    }
  }
`;

const UPDATE_USER_STATUS = gql`
  mutation UpdateUserStatus($userId: Int!, $status: String!) {
    updateUserStatus(userId: $userId, status: $status) {
      id
      status
    }
  }
`;

/**
 * COMPONENTS
 */

// REST API - User List with Filters
function UsersList() {
  const queryBuilder = apiClient
    .query<User>()
    .paginate(1, 10)
    .sort('name', SortDirection.ASC)
    .filter('status', FilterOperator.IN, ['active', 'verified']);

  const { data, isLoading, error, refetch } = useApiQuery(
    ['users', 'list'],
    apiClient,
    '/users',
    queryBuilder.build()
  );

  const createUser = useApiPost<User, Partial<User>>(apiClient, '/users', {
    onSuccess: () => refetch(),
  });

  if (isLoading) return <div>Loading users...</div>;
  if (error) return <div>Error loading users: {error.message}</div>;

  return (
    <div style={{ border: '1px solid #ddd', padding: '10px', margin: '10px' }}>
      <h2>👥 Users List (REST API)</h2>
      <button
        onClick={() =>
          createUser.mutate({
            name: 'New User',
            email: `user${Date.now()}@example.com`,
            status: 'active',
          })
        }
        disabled={createUser.isPending}
      >
        Add User
      </button>
      <ul>
        {data?.data.data?.map((user) => (
          <li key={user.id}>
            {user.name} - {user.email} ({user.status})
          </li>
        ))}
      </ul>
    </div>
  );
}

// GraphQL - User Profile
function UserProfile({ userId }: { userId: number }) {
  const { data, loading, error } = useGraphQLQuery<{ user: User }>(GET_USER_PROFILE, {
    variables: { userId },
  });

  const [updateStatus, { loading: updating }] = useGraphQLMutation<
    { updateUserStatus: User },
    { userId: number; status: string }
  >(UPDATE_USER_STATUS);

  const handleToggleStatus = () => {
    const newStatus = data?.user.status === 'active' ? 'inactive' : 'active';
    updateStatus({
      variables: { userId, status: newStatus },
    });
  };

  if (loading) return <div>Loading profile...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data?.user) return <div>User not found</div>;

  return (
    <div style={{ border: '1px solid #ddd', padding: '10px', margin: '10px' }}>
      <h2>👤 User Profile (GraphQL)</h2>
      <p>
        <strong>Name:</strong> {data.user.name}
      </p>
      <p>
        <strong>Email:</strong> {data.user.email}
      </p>
      <p>
        <strong>Status:</strong> {data.user.status}
      </p>
      <button onClick={handleToggleStatus} disabled={updating}>
        Toggle Status
      </button>
    </div>
  );
}

// Socket.IO - Real-time Chat
function RealtimeChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const { isConnected, emit } = useSocket(socketClient);

  // Listen to new messages
  useSocketEvent<Message>(socketClient, 'new-message', (message) => {
    setMessages((prev) => [...prev, message]);
  });

  // Listen to typing indicators
  useSocketEvent<{ userId: number; isTyping: boolean }>(
    socketClient,
    'user-typing',
    (data) => {
      console.log(`User ${data.userId} is ${data.isTyping ? 'typing' : 'stopped typing'}`);
    }
  );

  const handleSendMessage = () => {
    if (inputText.trim() && isConnected) {
      emit('send-message', {
        text: inputText,
        timestamp: Date.now(),
      });
      setInputText('');
    }
  };

  const handleTyping = () => {
    emit('typing', { isTyping: true });
  };

  return (
    <div style={{ border: '1px solid #ddd', padding: '10px', margin: '10px' }}>
      <h2>💬 Real-time Chat (Socket.IO)</h2>
      <div>
        Status: {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
      </div>
      <div
        style={{
          border: '1px solid #ccc',
          padding: '10px',
          height: '200px',
          overflowY: 'auto',
          marginTop: '10px',
          marginBottom: '10px',
        }}
      >
        {messages.map((msg) => (
          <div key={msg.id} style={{ marginBottom: '5px' }}>
            <strong>User {msg.userId}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <div>
        <input
          type="text"
          value={inputText}
          onChange={(e) => {
            setInputText(e.target.value);
            handleTyping();
          }}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Type a message..."
          style={{ width: '70%', marginRight: '10px' }}
        />
        <button onClick={handleSendMessage} disabled={!isConnected}>
          Send
        </button>
      </div>
    </div>
  );
}

// Integrated Dashboard
function Dashboard() {
  const [selectedUserId, setSelectedUserId] = useState<number>(1);

  return (
    <div style={{ padding: '20px' }}>
      <h1>🚀 Integrated Client Example</h1>
      <p>
        This example demonstrates using REST (React Query), GraphQL (Apollo Client), and Socket.IO
        together in a single application.
      </p>

      {/* REST API Section */}
      <UsersList />

      {/* GraphQL Section */}
      <div>
        <label>
          Select User ID for Profile:
          <input
            type="number"
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(Number(e.target.value))}
            style={{ marginLeft: '10px' }}
          />
        </label>
      </div>
      <UserProfile userId={selectedUserId} />

      {/* Socket.IO Section */}
      <RealtimeChat />
    </div>
  );
}

/**
 * ROOT APPLICATION WITH ALL PROVIDERS
 */
export function App() {
  return (
    <ApiQueryProvider queryClient={queryClient}>
      <GraphQLProvider client={apolloClient}>
        <SocketProvider client={socketClient} autoConnect={true}>
          <Dashboard />
        </SocketProvider>
      </GraphQLProvider>
    </ApiQueryProvider>
  );
}

export default App;
