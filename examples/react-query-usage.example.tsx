import React from 'react';
import {
  ApiClient,
  ApiQueryProvider,
  createDefaultQueryClient,
  useApiQuery,
  useApiPost,
  FilterOperator,
  SortDirection,
} from 'nestjs-dto';

// Initialize API client
const apiClient = new ApiClient({
  baseURL: 'http://localhost:3000/api',
  timeout: 10000,
});

// Create Query Client
const queryClient = createDefaultQueryClient();

// Example User type
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  status: string;
}

/**
 * Example component using React Query hooks
 */
function UsersList() {
  // GET request with React Query
  const { data, isLoading, error, refetch } = useApiQuery<{ data: User[]; meta: any }>(
    ['users'],
    apiClient,
    '/users',
    { page: 1, limit: 10 }
  );

  // POST request with React Query
  const createUserMutation = useApiPost<User, Partial<User>>(
    apiClient,
    '/users',
    {
      onSuccess: () => {
        // Invalidate and refetch users list
        refetch();
      },
    }
  );

  const handleCreateUser = () => {
    createUserMutation.mutate({
      name: 'John Doe',
      email: 'john@example.com',
      age: 30,
      status: 'active',
    });
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Users List</h1>
      <button onClick={handleCreateUser} disabled={createUserMutation.isPending}>
        Create User
      </button>
      <ul>
        {data?.data.data.map((user) => (
          <li key={user.id}>
            {user.name} - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Example component using Query Builder with React Query
 */
function FilteredUsersList() {
  const queryBuilder = apiClient
    .query<User>()
    .paginate(1, 10)
    .sort('createdAt', SortDirection.DESC)
    .filter('age', FilterOperator.GREATER_THAN_OR_EQUAL, 18)
    .filter('status', FilterOperator.IN, ['active', 'verified'])
    .logicalOperator('AND');

  const { data, isLoading, error } = useApiQuery(
    ['users', 'filtered'],
    apiClient,
    '/users',
    queryBuilder.build()
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Filtered Users</h1>
      <ul>
        {data?.data.data?.map((user: User) => (
          <li key={user.id}>
            {user.name} - Age: {user.age}
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Root App component with React Query Provider
 */
export function App() {
  return (
    <ApiQueryProvider queryClient={queryClient}>
      <div>
        <UsersList />
        <hr />
        <FilteredUsersList />
      </div>
    </ApiQueryProvider>
  );
}
