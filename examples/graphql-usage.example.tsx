import React from 'react';
import { gql } from '@apollo/client';
import {
  createApolloClient,
  GraphQLProvider,
  useGraphQLQuery,
  useGraphQLMutation,
} from 'nestjs-dto';

// Create Apollo Client
const apolloClient = createApolloClient({
  uri: 'http://localhost:3000/graphql',
  authToken: 'your-jwt-token-here',
});

// Define GraphQL queries and mutations
const GET_USERS = gql`
  query GetUsers($page: Int!, $limit: Int!, $sortBy: String, $sortDirection: String) {
    users(page: $page, limit: $limit, sortBy: $sortBy, sortDirection: $sortDirection) {
      data {
        id
        name
        email
        age
        status
      }
      meta {
        page
        limit
        total
        totalPages
        hasNext
        hasPrevious
      }
    }
  }
`;

const CREATE_USER = gql`
  mutation CreateUser($name: String!, $email: String!, $age: Int!, $status: String!) {
    createUser(name: $name, email: $email, age: $age, status: $status) {
      id
      name
      email
      age
      status
    }
  }
`;

const GET_USER = gql`
  query GetUser($id: Int!) {
    user(id: $id) {
      id
      name
      email
      age
      status
    }
  }
`;

// Example User type
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  status: string;
}

interface UsersData {
  users: {
    data: User[];
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrevious: boolean;
    };
  };
}

interface CreateUserData {
  createUser: User;
}

interface CreateUserVariables {
  name: string;
  email: string;
  age: number;
  status: string;
}

/**
 * Example component using GraphQL query
 */
function UsersList() {
  const { data, loading, error, refetch } = useGraphQLQuery<UsersData>(GET_USERS, {
    variables: {
      page: 1,
      limit: 10,
      sortBy: 'createdAt',
      sortDirection: 'DESC',
    },
  });

  const [createUser, { loading: createLoading }] = useGraphQLMutation<
    CreateUserData,
    CreateUserVariables
  >(CREATE_USER, {
    onCompleted: () => {
      refetch();
    },
  });

  const handleCreateUser = () => {
    createUser({
      variables: {
        name: 'John Doe',
        email: 'john@example.com',
        age: 30,
        status: 'active',
      },
    });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Users List (GraphQL)</h1>
      <button onClick={handleCreateUser} disabled={createLoading}>
        Create User
      </button>
      <ul>
        {data?.users.data.map((user) => (
          <li key={user.id}>
            {user.name} - {user.email}
          </li>
        ))}
      </ul>
      <div>
        <p>
          Page {data?.users.meta.page} of {data?.users.meta.totalPages} - Total: {data?.users.meta.total}
        </p>
      </div>
    </div>
  );
}

/**
 * Example component for fetching single user
 */
function UserDetail({ userId }: { userId: number }) {
  const { data, loading, error } = useGraphQLQuery<{ user: User }>(GET_USER, {
    variables: { id: userId },
  });

  if (loading) return <div>Loading user...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data?.user) return <div>User not found</div>;

  return (
    <div>
      <h2>User Detail</h2>
      <p>Name: {data.user.name}</p>
      <p>Email: {data.user.email}</p>
      <p>Age: {data.user.age}</p>
      <p>Status: {data.user.status}</p>
    </div>
  );
}

/**
 * Root App component with GraphQL Provider
 */
export function App() {
  return (
    <GraphQLProvider client={apolloClient}>
      <div>
        <UsersList />
        <hr />
        <UserDetail userId={1} />
      </div>
    </GraphQLProvider>
  );
}
