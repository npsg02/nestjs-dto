# Client Integration Guide

This guide provides comprehensive instructions for integrating the nestjs-dto client modules into your application.

## Table of Contents

1. [REST API with React Query](#rest-api-with-react-query)
2. [GraphQL with Apollo Client](#graphql-with-apollo-client)
3. [Real-time with Socket.IO](#real-time-with-socketio)
4. [Integrated Example](#integrated-example)

---

## REST API with React Query

### Installation

```bash
npm install nestjs-dto @tanstack/react-query react
```

### Basic Setup

```typescript
import { ApiClient, ApiQueryProvider, createDefaultQueryClient } from 'nestjs-dto';

// Create API client
const apiClient = new ApiClient({
  baseURL: 'http://localhost:3000/api',
  timeout: 10000,
  auth: {
    token: localStorage.getItem('token'),
  },
});

// Create Query Client
const queryClient = createDefaultQueryClient();

// Wrap your app with the provider
function App() {
  return (
    <ApiQueryProvider queryClient={queryClient}>
      <YourComponents />
    </ApiQueryProvider>
  );
}
```

### Using Hooks

#### GET Request

```typescript
import { useApiQuery } from 'nestjs-dto';

function UsersList() {
  const { data, isLoading, error, refetch } = useApiQuery(
    ['users'],
    apiClient,
    '/users',
    { page: 1, limit: 10 }
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {data?.data.data.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

#### POST Request

```typescript
import { useApiPost } from 'nestjs-dto';

function CreateUser() {
  const createUser = useApiPost(apiClient, '/users', {
    onSuccess: (data) => {
      console.log('User created:', data);
    },
    onError: (error) => {
      console.error('Error:', error);
    },
  });

  const handleSubmit = (userData) => {
    createUser.mutate(userData);
  };

  return (
    <button onClick={() => handleSubmit({ name: 'John' })} disabled={createUser.isPending}>
      {createUser.isPending ? 'Creating...' : 'Create User'}
    </button>
  );
}
```

#### With Query Builder

```typescript
import { useApiQuery, FilterOperator, SortDirection } from 'nestjs-dto';

function FilteredUsers() {
  const queryBuilder = apiClient
    .query()
    .paginate(1, 10)
    .sort('createdAt', SortDirection.DESC)
    .filter('age', FilterOperator.GREATER_THAN_OR_EQUAL, 18)
    .filter('status', FilterOperator.IN, ['active', 'verified'])
    .logicalOperator('AND');

  const { data, isLoading } = useApiQuery(
    ['users', 'filtered'],
    apiClient,
    '/users',
    queryBuilder.build()
  );

  // Render...
}
```

### Available Hooks

- `useApiQuery` - GET requests
- `useApiPost` - POST requests
- `useApiPut` - PUT requests
- `useApiPatch` - PATCH requests
- `useApiDelete` - DELETE requests
- `useApiQueryBuilder` - GET with query builder

---

## GraphQL with Apollo Client

### Installation

```bash
npm install nestjs-dto @apollo/client graphql react
```

### Basic Setup

```typescript
import { createApolloClient, GraphQLProvider } from 'nestjs-dto';

// Create Apollo Client
const apolloClient = createApolloClient({
  uri: 'http://localhost:3000/graphql',
  authToken: localStorage.getItem('token'),
  onErrorCallback: (error) => {
    console.error('GraphQL Error:', error);
  },
});

// Wrap your app with the provider
function App() {
  return (
    <GraphQLProvider client={apolloClient}>
      <YourComponents />
    </GraphQLProvider>
  );
}
```

### Using Hooks

#### Query

```typescript
import { gql } from '@apollo/client';
import { useGraphQLQuery } from 'nestjs-dto';

const GET_USERS = gql`
  query GetUsers($page: Int!, $limit: Int!) {
    users(page: $page, limit: $limit) {
      data {
        id
        name
        email
      }
      meta {
        total
        hasNext
      }
    }
  }
`;

function UsersList() {
  const { data, loading, error, refetch } = useGraphQLQuery(GET_USERS, {
    variables: { page: 1, limit: 10 },
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <ul>
        {data.users.data.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
      <button onClick={() => refetch()}>Refresh</button>
    </div>
  );
}
```

#### Mutation

```typescript
import { gql } from '@apollo/client';
import { useGraphQLMutation } from 'nestjs-dto';

const CREATE_USER = gql`
  mutation CreateUser($name: String!, $email: String!) {
    createUser(name: $name, email: $email) {
      id
      name
      email
    }
  }
`;

function CreateUser() {
  const [createUser, { loading, error }] = useGraphQLMutation(CREATE_USER, {
    onCompleted: (data) => {
      console.log('User created:', data);
    },
  });

  const handleSubmit = () => {
    createUser({
      variables: {
        name: 'John Doe',
        email: 'john@example.com',
      },
    });
  };

  return (
    <button onClick={handleSubmit} disabled={loading}>
      {loading ? 'Creating...' : 'Create User'}
    </button>
  );
}
```

#### Subscription

```typescript
import { gql } from '@apollo/client';
import { useGraphQLSubscription } from 'nestjs-dto';

const USER_ADDED = gql`
  subscription OnUserAdded {
    userAdded {
      id
      name
      email
    }
  }
`;

function UserSubscription() {
  const { data, loading, error } = useGraphQLSubscription(USER_ADDED);

  if (loading) return <div>Connecting...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data && (
        <div>
          New user added: {data.userAdded.name} ({data.userAdded.email})
        </div>
      )}
    </div>
  );
}
```

### Available Hooks

- `useGraphQLQuery` - GraphQL queries
- `useGraphQLMutation` - GraphQL mutations
- `useGraphQLSubscription` - GraphQL subscriptions

---

## Real-time with Socket.IO

### Installation

```bash
npm install nestjs-dto socket.io-client react
```

### Basic Setup

```typescript
import { createSocketClient, SocketProvider } from 'nestjs-dto';

// Create Socket.IO client
const socketClient = createSocketClient({
  url: 'http://localhost:3000',
  authToken: localStorage.getItem('token'),
  options: {
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  },
});

// Wrap your app with the provider
function App() {
  return (
    <SocketProvider client={socketClient} autoConnect={true}>
      <YourComponents />
    </SocketProvider>
  );
}
```

### Using Hooks

#### Basic Socket Connection

```typescript
import { useSocket } from 'nestjs-dto';

function ConnectionStatus() {
  const { isConnected, emit } = useSocket(socketClient);

  return (
    <div>
      Status: {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
      <button onClick={() => emit('ping')}>Ping Server</button>
    </div>
  );
}
```

#### Listen to Events

```typescript
import { useSocketEvent } from 'nestjs-dto';

function MessageListener() {
  const [messages, setMessages] = useState([]);

  useSocketEvent(socketClient, 'new-message', (message) => {
    setMessages((prev) => [...prev, message]);
  });

  return (
    <ul>
      {messages.map((msg, i) => (
        <li key={i}>{msg.text}</li>
      ))}
    </ul>
  );
}
```

#### Emit with Acknowledgment

```typescript
import { useSocketEmit } from 'nestjs-dto';

function SendMessage() {
  const { emit, isLoading, error, data } = useSocketEmit(socketClient);

  const handleSend = async () => {
    try {
      const response = await emit('send-message', {
        text: 'Hello World',
      });
      console.log('Server response:', response);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <button onClick={handleSend} disabled={isLoading}>
      {isLoading ? 'Sending...' : 'Send Message'}
    </button>
  );
}
```

### Available Hooks

- `useSocket` - Socket connection and emit
- `useSocketEvent` - Listen to socket events
- `useSocketEmit` - Emit with state management
- `useSocketClient` - Access socket from context

### Manual Usage (without React)

```typescript
import { createSocketClient } from 'nestjs-dto';

const socketClient = createSocketClient({
  url: 'http://localhost:3000',
});

// Connect
socketClient.connect();

// Emit event
socketClient.emit('join-room', { roomId: '123' });

// Listen to event
socketClient.on('room-joined', (data) => {
  console.log('Joined room:', data);
});

// Emit with acknowledgment
const response = await socketClient.emitWithAck('get-data', { id: 1 });
console.log('Response:', response);

// Disconnect
socketClient.disconnect();
```

---

## Integrated Example

Using all three client types together:

```typescript
import React from 'react';
import {
  // REST
  ApiClient,
  ApiQueryProvider,
  createDefaultQueryClient,
  useApiQuery,
  // GraphQL
  createApolloClient,
  GraphQLProvider,
  useGraphQLQuery,
  // Socket.IO
  createSocketClient,
  SocketProvider,
  useSocket,
  useSocketEvent,
} from 'nestjs-dto';

// Setup clients
const apiClient = new ApiClient({ baseURL: 'http://localhost:3000/api' });
const queryClient = createDefaultQueryClient();
const apolloClient = createApolloClient({ uri: 'http://localhost:3000/graphql' });
const socketClient = createSocketClient({ url: 'http://localhost:3000' });

function Dashboard() {
  // REST API Query
  const { data: restData } = useApiQuery(['users'], apiClient, '/users');

  // GraphQL Query
  const { data: graphqlData } = useGraphQLQuery(GET_USERS_QUERY);

  // Socket.IO
  const { isConnected } = useSocket(socketClient);
  useSocketEvent(socketClient, 'notification', (notif) => {
    console.log('Notification:', notif);
  });

  return (
    <div>
      <h1>Dashboard</h1>
      <div>Socket Status: {isConnected ? 'Connected' : 'Disconnected'}</div>
      {/* Render data... */}
    </div>
  );
}

function App() {
  return (
    <ApiQueryProvider queryClient={queryClient}>
      <GraphQLProvider client={apolloClient}>
        <SocketProvider client={socketClient}>
          <Dashboard />
        </SocketProvider>
      </GraphQLProvider>
    </ApiQueryProvider>
  );
}
```

See [examples/integrated-client.example.tsx](examples/integrated-client.example.tsx) for a complete working example.

---

## Best Practices

### Authentication

#### REST API

```typescript
// Set token after login
apiClient.setAuthToken(token);
```

#### GraphQL

```typescript
// Pass token during creation
const apolloClient = createApolloClient({
  uri: 'http://localhost:3000/graphql',
  authToken: token,
});
```

#### Socket.IO

```typescript
// Set token after connection
socketClient.setAuthToken(token);
```

### Error Handling

#### REST API

```typescript
const { data, error } = useApiQuery(['users'], apiClient, '/users');

if (error) {
  console.error('API Error:', error.message);
}
```

#### GraphQL

```typescript
const { data, error } = useGraphQLQuery(GET_USERS);

if (error) {
  console.error('GraphQL Error:', error.message);
}
```

#### Socket.IO

```typescript
useSocketEvent(socketClient, 'connect_error', (error) => {
  console.error('Socket Error:', error);
});
```

### Performance Optimization

1. **Use React Query's caching** - Data is automatically cached
2. **Debounce socket emissions** - Avoid sending too many events
3. **Use Apollo's cache** - GraphQL responses are cached
4. **Batch requests** - Combine multiple API calls when possible

---

## Troubleshooting

### React Query not working

Ensure you've wrapped your app with `ApiQueryProvider`:

```typescript
<ApiQueryProvider queryClient={queryClient}>
  <App />
</ApiQueryProvider>
```

### GraphQL queries failing

Check your Apollo Client configuration and ensure the URI is correct:

```typescript
const apolloClient = createApolloClient({
  uri: 'http://localhost:3000/graphql', // Verify this URL
});
```

### Socket.IO not connecting

1. Check the server URL
2. Verify CORS settings on the server
3. Check browser console for errors
4. Ensure `autoConnect` is set to `true` or call `socketClient.connect()` manually

---

## Additional Resources

- [React Query Documentation](https://tanstack.com/query/latest)
- [Apollo Client Documentation](https://www.apollographql.com/docs/react/)
- [Socket.IO Documentation](https://socket.io/docs/v4/)
- [nestjs-dto Examples](examples/)
