import { ApiClient, FilterOperator, SortDirection } from 'nestjs-dto';

// Initialize the API client
const api = new ApiClient({
  baseURL: 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Set authentication token (if needed)
const token = 'your-jwt-token-here';
api.setAuthToken(token);

// Example 1: Basic GET request
async function basicGet() {
  const response = await api.get('/users');
  console.log('Users:', response.data);
}

// Example 2: Simple pagination
async function simplePagination() {
  const response = await api.getPaginated('/users', 1, 10);
  console.log('Users:', response.data.data);
  console.log('Total pages:', response.data.meta.totalPages);
}

// Example 3: Query with sorting
async function withSorting() {
  const query = api
    .query()
    .paginate(1, 20)
    .sort('createdAt', SortDirection.DESC);

  const response = await api.query_get('/users', query);
  console.log('Users:', response.data);
}

// Example 4: Query with search
async function withSearch() {
  const query = api
    .query()
    .paginate(1, 10)
    .search('john');

  const response = await api.query_get('/users', query);
  console.log('Search results:', response.data);
}

// Example 5: Simple filtering
async function simpleFiltering() {
  const query = api
    .query()
    .paginate(1, 10)
    .filter('age', FilterOperator.GREATER_THAN_OR_EQUAL, 18)
    .filter('status', FilterOperator.EQUALS, 'active');

  const response = await api.query_get('/users', query);
  console.log('Filtered users:', response.data);
}

// Example 6: Advanced filtering with IN operator
async function advancedFiltering() {
  const query = api
    .query()
    .paginate(1, 10)
    .filter('status', FilterOperator.IN, ['active', 'pending', 'verified'])
    .filter('age', FilterOperator.BETWEEN, [18, 65])
    .logicalOperator('AND');

  const response = await api.query_get('/users', query);
  console.log('Filtered users:', response.data);
}

// Example 7: Complex query with multiple conditions
async function complexQuery() {
  const query = api
    .query()
    .paginate(1, 20)
    .sort('createdAt', SortDirection.DESC)
    .search('john')
    .filter('age', FilterOperator.GREATER_THAN_OR_EQUAL, 18)
    .filter('email', FilterOperator.ENDS_WITH, '@example.com')
    .filter('status', FilterOperator.IN, ['active', 'verified'])
    .filter('name', FilterOperator.CONTAINS, 'smith')
    .logicalOperator('AND');

  const response = await api.query_get('/users', query);
  console.log('Complex query results:', response.data);
}

// Example 8: POST request
async function createUser() {
  const newUser = {
    name: 'John Doe',
    email: 'john@example.com',
    age: 30,
  };

  const response = await api.post('/users', newUser);
  console.log('Created user:', response.data);
}

// Example 9: PUT request
async function updateUser() {
  const updatedData = {
    name: 'John Smith',
    age: 31,
  };

  const response = await api.put('/users/1', updatedData);
  console.log('Updated user:', response.data);
}

// Example 10: DELETE request
async function deleteUser() {
  const response = await api.delete('/users/1');
  console.log('Deleted user:', response.status);
}

// Example 11: Using TypeScript generics
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  status: string;
}

async function typeScriptGenerics() {
  // Type-safe GET request
  const response = await api.get<User>('/users/1');
  const user: User = response.data;
  console.log('User name:', user.name);

  // Type-safe paginated request
  const paginatedResponse = await api.getPaginated<User>('/users', 1, 10);
  const users: User[] = paginatedResponse.data.data;
  console.log('First user:', users[0].name);
}

// Example 12: Clone and modify query
async function cloneQuery() {
  // Create base query
  const baseQuery = api
    .query()
    .filter('status', FilterOperator.EQUALS, 'active')
    .sort('createdAt', SortDirection.DESC);

  // Clone and modify for page 1
  const page1Query = baseQuery.clone().paginate(1, 10);
  const page1Response = await api.query_get('/users', page1Query);

  // Clone and modify for page 2
  const page2Query = baseQuery.clone().paginate(2, 10);
  const page2Response = await api.query_get('/users', page2Query);

  console.log('Page 1:', page1Response.data);
  console.log('Page 2:', page2Response.data);
}

// Example 13: Error handling
async function errorHandling() {
  try {
    const response = await api.get('/non-existent-endpoint');
    console.log('Response:', response.data);
  } catch (error: any) {
    console.error('Error status:', error.status);
    console.error('Error message:', error.message);
    console.error('Error data:', error.data);
  }
}

// Example 14: Custom parameters
async function customParameters() {
  const query = api
    .query()
    .paginate(1, 10)
    .param('includeDeleted', false)
    .param('fields', 'id,name,email');

  const response = await api.query_get('/users', query);
  console.log('Users with custom params:', response.data);
}

// Run examples
async function main() {
  try {
    await basicGet();
    await simplePagination();
    await withSorting();
    await withSearch();
    await simpleFiltering();
    await advancedFiltering();
    await complexQuery();
    await createUser();
    await updateUser();
    await typeScriptGenerics();
    await cloneQuery();
    await errorHandling();
    await customParameters();
  } catch (error) {
    console.error('Error:', error);
  }
}

// Uncomment to run
// main();

export {
  basicGet,
  simplePagination,
  withSorting,
  withSearch,
  simpleFiltering,
  advancedFiltering,
  complexQuery,
  createUser,
  updateUser,
  deleteUser,
  typeScriptGenerics,
  cloneQuery,
  errorHandling,
  customParameters,
};
