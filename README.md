# nestjs-dto

A comprehensive NestJS library providing reusable DTOs (Data Transfer Objects) for REST API, GraphQL, and WebSocket applications. Includes powerful client packages with:
- **REST**: React Query integration for data fetching and caching
- **GraphQL**: Apollo Client integration for GraphQL queries and mutations
- **Socket.IO**: Real-time communication with React hooks

Supports complex queries, pagination, filtering, and full TypeScript type safety.

## Features

- ✨ **Reusable DTOs** for REST API, GraphQL, and WebSocket
- 🔍 **Complex Query Support** with flexible filtering and sorting
- 📄 **Pagination** with offset-based and cursor-based strategies
- 🎯 **Generic Types** for type-safe responses
- 🌐 **API Client** with Axios for easy data fetching
- 🔧 **Query Builder** for constructing complex queries
- 📊 **Multiple Filter Operators** (equals, greater than, like, in, between, etc.)
- 🔄 **TypeORM and MongoDB** query parser utilities
- ⚛️ **React Query Integration** for REST APIs with built-in hooks
- 🔷 **Apollo Client Integration** for GraphQL with type-safe hooks
- 🔌 **Socket.IO Client** with React hooks for real-time communication

## Installation

```bash
npm install nestjs-dto
```

### Peer Dependencies

Make sure you have the following peer dependencies installed:

```bash
npm install @nestjs/common @nestjs/graphql @nestjs/swagger class-validator class-transformer reflect-metadata
```

#### Optional Client Dependencies

For React Query (REST):
```bash
npm install @tanstack/react-query react
```

For Apollo Client (GraphQL):
```bash
npm install @apollo/client graphql react
```

For Socket.IO Client:
```bash
npm install socket.io-client react
```

## Usage

### DTOs for Backend (NestJS)

#### 1. Pagination DTO

```typescript
import { PaginationDto } from 'nestjs-dto';

@Controller('users')
export class UsersController {
  @Get()
  async findAll(@Query() pagination: PaginationDto) {
    const skip = pagination.getSkip();
    const limit = pagination.getLimit();
    // Use skip and limit in your database query
  }
}
```

#### 2. Query DTO (Pagination + Sorting + Filtering)

```typescript
import { QueryDto } from 'nestjs-dto';

@Controller('users')
export class UsersController {
  @Get()
  async findAll(@Query() query: QueryDto) {
    // Query includes pagination, sorting, and filtering
    const { page, limit, sortBy, sortDirection, search, filters } = query;
    // Apply to your database query
  }
}
```

#### 3. GraphQL Support

```typescript
import { QueryDto, PaginationDto } from 'nestjs-dto';
import { Args, Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class UsersResolver {
  @Query(() => [User])
  async users(@Args() query: QueryDto) {
    // Use query parameters in your service
  }
}
```

#### 4. Response DTOs

```typescript
import { PaginatedResponse, createPaginationMeta } from 'nestjs-dto';

// Define your entity
class User {
  id: number;
  name: string;
}

// Create paginated response type
class UserPaginatedResponse extends PaginatedResponse(User) {}

@Controller('users')
export class UsersController {
  @Get()
  async findAll(@Query() query: QueryDto): Promise<UserPaginatedResponse> {
    const [data, total] = await this.usersService.findAndCount(query);
    
    return {
      data,
      meta: createPaginationMeta(query.page, query.limit, total),
    };
  }
}
```

#### 5. Filter Operators

```typescript
import { FilterDto, FilterOperator } from 'nestjs-dto';

// Available operators:
// EQUALS, NOT_EQUALS, GREATER_THAN, GREATER_THAN_OR_EQUAL
// LESS_THAN, LESS_THAN_OR_EQUAL, LIKE, IN, NOT_IN
// BETWEEN, IS_NULL, IS_NOT_NULL, CONTAINS, STARTS_WITH, ENDS_WITH

// Example: Filter users by age and name
const filters = [
  { field: 'age', operator: FilterOperator.GREATER_THAN, value: 18 },
  { field: 'name', operator: FilterOperator.CONTAINS, value: 'John' },
];
```

#### 6. Query Parser Utilities

```typescript
import { QueryParser } from 'nestjs-dto';

// Convert filters to TypeORM where clause
const whereClause = QueryParser.toTypeORMWhere(query.filters, query.logicalOperator);

// Convert filters to MongoDB query
const mongoQuery = QueryParser.toMongoQuery(query.filters, query.logicalOperator);

// Build sort object
const sort = QueryParser.buildSort(query.sortBy, query.sortDirection);
```

### Client Package (Frontend)

#### 1. Basic API Client

```typescript
import { ApiClient } from 'nestjs-dto';

// Initialize the client
const client = new ApiClient({
  baseURL: 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Custom-Header': 'value',
  },
});

// Set authentication token
client.setAuthToken('your-jwt-token');

// Make requests
const response = await client.get('/users');
const user = await client.post('/users', { name: 'John Doe' });
```

#### 2. Query Builder

```typescript
import { ApiClient, FilterOperator, SortDirection } from 'nestjs-dto';

const client = new ApiClient({ baseURL: 'http://localhost:3000/api' });

// Build a complex query
const query = client
  .query()
  .paginate(1, 10)
  .sort('createdAt', SortDirection.DESC)
  .search('john')
  .filter('age', FilterOperator.GREATER_THAN, 18)
  .filter('status', FilterOperator.IN, ['active', 'pending'])
  .logicalOperator('AND');

// Execute the query
const response = await client.query_get('/users', query);
```

#### 3. Pagination

```typescript
// Offset-based pagination
const query = client.query().paginate(2, 20); // page 2, 20 items per page

// Skip and limit
const query = client.query().skip(40, 20); // skip 40, take 20

// Cursor-based pagination
const query = client.query().cursor('eyJpZCI6MTAwfQ==', 20);
```

#### 4. Advanced Filtering

```typescript
const query = client
  .query()
  .filter('email', FilterOperator.ENDS_WITH, '@example.com')
  .filter('age', FilterOperator.BETWEEN, [18, 65])
  .filter('verified', FilterOperator.EQUALS, true)
  .logicalOperator('AND');

const response = await client.query_get('/users', query);
```

#### 5. Generic Type Support

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

// Type-safe responses
const response = await client.get<User>('/users/1');
const user: User = response.data;

// Paginated responses
const paginatedResponse = await client.getPaginated<User>('/users', 1, 10);
const users: User[] = paginatedResponse.data.data;
```

### React Query Integration (REST)

The library provides built-in React Query hooks for seamless integration with React applications.

#### Installation

```bash
npm install @tanstack/react-query
```

#### Setup

```typescript
import { ApiClient, ApiQueryProvider, createDefaultQueryClient } from 'nestjs-dto';

const apiClient = new ApiClient({
  baseURL: 'http://localhost:3000/api',
});

const queryClient = createDefaultQueryClient();

function App() {
  return (
    <ApiQueryProvider queryClient={queryClient}>
      <YourComponents />
    </ApiQueryProvider>
  );
}
```

#### Usage

```typescript
import { useApiQuery, useApiPost } from 'nestjs-dto';

function UsersList() {
  // GET request with React Query
  const { data, isLoading, error } = useApiQuery(
    ['users'],
    apiClient,
    '/users',
    { page: 1, limit: 10 }
  );

  // POST request
  const createUser = useApiPost(apiClient, '/users', {
    onSuccess: () => {
      // Invalidate queries
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <button onClick={() => createUser.mutate({ name: 'John' })}>
        Create User
      </button>
      <ul>
        {data?.data.data.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

See [examples/react-query-usage.example.tsx](examples/react-query-usage.example.tsx) for complete examples.

### GraphQL (Apollo Client) Integration

Built-in Apollo Client integration for GraphQL APIs.

#### Installation

```bash
npm install @apollo/client graphql
```

#### Setup

```typescript
import { createApolloClient, GraphQLProvider } from 'nestjs-dto';

const apolloClient = createApolloClient({
  uri: 'http://localhost:3000/graphql',
  authToken: 'your-jwt-token',
});

function App() {
  return (
    <GraphQLProvider client={apolloClient}>
      <YourComponents />
    </GraphQLProvider>
  );
}
```

#### Usage

```typescript
import { gql } from '@apollo/client';
import { useGraphQLQuery, useGraphQLMutation } from 'nestjs-dto';

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
  const { data, loading, error } = useGraphQLQuery(GET_USERS, {
    variables: { page: 1, limit: 10 },
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {data?.users.data.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

See [examples/graphql-usage.example.tsx](examples/graphql-usage.example.tsx) for complete examples.

### Socket.IO Client Integration

Real-time communication with Socket.IO client wrapper and React hooks.

#### Installation

```bash
npm install socket.io-client
```

#### Setup

```typescript
import { createSocketClient, SocketProvider } from 'nestjs-dto';

const socketClient = createSocketClient({
  url: 'http://localhost:3000',
  authToken: 'your-jwt-token',
  options: {
    reconnection: true,
    reconnectionAttempts: 5,
  },
});

function App() {
  return (
    <SocketProvider client={socketClient} autoConnect={true}>
      <YourComponents />
    </SocketProvider>
  );
}
```

#### Usage

```typescript
import { useSocket, useSocketEvent, useSocketEmit } from 'nestjs-dto';

function ChatComponent() {
  const { isConnected, emit } = useSocket(socketClient);
  const [messages, setMessages] = useState([]);

  // Listen to events
  useSocketEvent(socketClient, 'message', (message) => {
    setMessages((prev) => [...prev, message]);
  });

  // Send message
  const handleSend = () => {
    emit('send-message', { text: 'Hello!' });
  };

  return (
    <div>
      <div>Status: {isConnected ? 'Connected' : 'Disconnected'}</div>
      {messages.map((msg, i) => (
        <div key={i}>{msg.text}</div>
      ))}
      <button onClick={handleSend}>Send</button>
    </div>
  );
}
```

See [examples/socket-usage.example.tsx](examples/socket-usage.example.tsx) for complete examples.

## API Reference

### DTOs

- **PaginationDto**: Basic pagination with page, limit, skip, and cursor support
- **SortDto**: Sorting with sortBy and sortDirection
- **FilterDto**: Complex filtering with multiple operators
- **QueryDto**: Combined DTO with pagination, sorting, and filtering
- **PaginatedResponse**: Generic paginated response wrapper
- **ApiResponse**: Generic API response wrapper

### Client

- **ApiClient**: Main client class for API requests
- **QueryBuilder**: Fluent interface for building complex queries

#### React Query (REST)
- **ApiQueryProvider**: React Query provider component
- **createDefaultQueryClient**: Create configured QueryClient
- **useApiQuery**: Hook for GET requests
- **useApiPost**: Hook for POST requests
- **useApiPut**: Hook for PUT requests
- **useApiPatch**: Hook for PATCH requests
- **useApiDelete**: Hook for DELETE requests

#### GraphQL (Apollo)
- **createApolloClient**: Create configured Apollo Client
- **GraphQLProvider**: Apollo provider component
- **useGraphQLQuery**: Type-safe query hook
- **useGraphQLMutation**: Type-safe mutation hook
- **useGraphQLSubscription**: Type-safe subscription hook

#### Socket.IO
- **SocketClient**: Socket.IO client wrapper class
- **createSocketClient**: Create configured Socket client
- **SocketProvider**: Socket provider component
- **useSocket**: Hook for socket connection
- **useSocketEvent**: Hook for listening to events
- **useSocketEmit**: Hook for emitting events with state
- **useSocketClient**: Hook to access socket from context

### Utils

- **QueryParser**: Utilities for converting DTOs to database queries
  - `toTypeORMWhere()`: Convert to TypeORM where clause
  - `toMongoQuery()`: Convert to MongoDB query
  - `buildSort()`: Build sort object

### Filter Operators

- `EQUALS` (eq): Exact match
- `NOT_EQUALS` (ne): Not equal to
- `GREATER_THAN` (gt): Greater than
- `GREATER_THAN_OR_EQUAL` (gte): Greater than or equal
- `LESS_THAN` (lt): Less than
- `LESS_THAN_OR_EQUAL` (lte): Less than or equal
- `LIKE` (like): SQL LIKE pattern
- `IN` (in): Value in array
- `NOT_IN` (nin): Value not in array
- `BETWEEN` (between): Value between range
- `IS_NULL` (null): Value is null
- `IS_NOT_NULL` (notnull): Value is not null
- `CONTAINS` (contains): String contains
- `STARTS_WITH` (startsWith): String starts with
- `ENDS_WITH` (endsWith): String ends with

## Examples

### Complete Backend Example

```typescript
import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { QueryDto, PaginatedResponse, createPaginationMeta, QueryParser } from 'nestjs-dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users with filtering and pagination' })
  async findAll(@Query() query: QueryDto) {
    // Parse filters to database query
    const where = QueryParser.toTypeORMWhere(query.filters, query.logicalOperator);
    const order = QueryParser.buildSort(query.sortBy, query.sortDirection);
    
    // Execute database query
    const [data, total] = await this.usersService.findAndCount({
      where,
      order,
      skip: query.getSkip(),
      take: query.getLimit(),
    });

    // Return paginated response
    return {
      data,
      meta: createPaginationMeta(query.page, query.limit, total),
    };
  }
}
```

### Complete Frontend Example

```typescript
import { ApiClient, FilterOperator, SortDirection } from 'nestjs-dto';

// Initialize client
const api = new ApiClient({
  baseURL: 'http://localhost:3000/api',
  auth: { token: localStorage.getItem('token') },
});

// Fetch users with complex query
async function fetchUsers() {
  const query = api
    .query()
    .paginate(1, 20)
    .sort('createdAt', SortDirection.DESC)
    .search('john')
    .filter('age', FilterOperator.GREATER_THAN_OR_EQUAL, 18)
    .filter('status', FilterOperator.IN, ['active', 'verified'])
    .logicalOperator('AND');

  const response = await api.query_get('/users', query);
  
  console.log('Users:', response.data.data);
  console.log('Total:', response.data.meta.total);
  console.log('Has next page:', response.data.meta.hasNext);
}

fetchUsers();
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT