# Quick Start Guide

Get started with nestjs-dto in minutes!

## Installation

```bash
npm install nestjs-dto
```

Install peer dependencies:

```bash
npm install @nestjs/common @nestjs/graphql @nestjs/swagger class-validator class-transformer reflect-metadata
```

## 5-Minute Setup

### Backend (NestJS Controller)

```typescript
import { Controller, Get, Query } from '@nestjs/common';
import { QueryDto, PaginatedResponse, createPaginationMeta } from 'nestjs-dto';

@Controller('users')
export class UsersController {
  @Get()
  async findAll(@Query() query: QueryDto) {
    // Your database query logic here
    const users = [
      { id: 1, name: 'John', email: 'john@example.com' },
      { id: 2, name: 'Jane', email: 'jane@example.com' },
    ];
    
    return {
      data: users,
      meta: createPaginationMeta(query.page, query.limit, users.length),
    };
  }
}
```

That's it! Your endpoint now supports:
- ✅ Pagination: `?page=1&limit=10`
- ✅ Sorting: `?sortBy=name&sortDirection=DESC`
- ✅ Search: `?search=john`
- ✅ Filtering: `?filters[0][field]=age&filters[0][operator]=gte&filters[0][value]=18`

### Frontend (Client)

```typescript
import { ApiClient, FilterOperator, SortDirection } from 'nestjs-dto';

// 1. Initialize client
const api = new ApiClient({
  baseURL: 'http://localhost:3000/api',
});

// 2. Build and execute query
const query = api.query()
  .paginate(1, 10)
  .sort('createdAt', SortDirection.DESC)
  .filter('status', FilterOperator.EQUALS, 'active');

const response = await api.query_get('/users', query);
console.log(response.data);
```

## Common Use Cases

### 1. Basic Pagination

**Backend:**
```typescript
@Get()
async findAll(@Query() query: QueryDto) {
  const skip = query.getSkip();  // Calculate skip automatically
  const limit = query.getLimit();
  // Use in your query...
}
```

**Frontend:**
```typescript
const response = await api.getPaginated('/users', 1, 10);
```

### 2. Sorting

**Backend:**
```typescript
import { QueryParser } from 'nestjs-dto';

const sort = QueryParser.buildSort(query.sortBy, query.sortDirection);
// Returns: { createdAt: -1 } for DESC or { createdAt: 1 } for ASC
```

**Frontend:**
```typescript
const query = api.query()
  .sort('createdAt', SortDirection.DESC);
```

### 3. Filtering

**Frontend:**
```typescript
const query = api.query()
  .filter('age', FilterOperator.GREATER_THAN_OR_EQUAL, 18)
  .filter('status', FilterOperator.IN, ['active', 'verified']);
```

**Backend:**
```typescript
import { QueryParser } from 'nestjs-dto';

// For TypeORM
const where = QueryParser.toTypeORMWhere(query.filters);

// For MongoDB
const mongoQuery = QueryParser.toMongoQuery(query.filters);
```

### 4. Complex Query

**Frontend:**
```typescript
const query = api.query()
  .paginate(1, 20)
  .sort('name', SortDirection.ASC)
  .search('john')
  .filter('age', FilterOperator.BETWEEN, [18, 65])
  .filter('status', FilterOperator.IN, ['active', 'verified'])
  .logicalOperator('AND');

const response = await api.query_get('/users', query);
```

## REST API Endpoints

After implementing the backend, your API will accept these query parameters:

```
GET /users?page=1&limit=10&sortBy=name&sortDirection=ASC&search=john&filters[0][field]=age&filters[0][operator]=gte&filters[0][value]=18
```

Or use the client to build it automatically!

## GraphQL Support

```typescript
import { Resolver, Query, Args } from '@nestjs/graphql';
import { QueryDto } from 'nestjs-dto';

@Resolver()
export class UsersResolver {
  @Query(() => [User])
  async users(@Args() query: QueryDto) {
    // Same as REST API!
    return this.usersService.find(query);
  }
}
```

GraphQL query:
```graphql
query {
  users(
    page: 1
    limit: 10
    sortBy: "name"
    sortDirection: "ASC"
    search: "john"
    filters: [
      { field: "age", operator: "gte", value: "18" }
    ]
  ) {
    id
    name
    email
  }
}
```

## TypeScript Support

Full type safety with generics:

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

// Type-safe request
const response = await api.get<User>('/users/1');
const user: User = response.data;

// Type-safe paginated response
const paginatedResponse = await api.getPaginated<User>('/users', 1, 10);
const users: User[] = paginatedResponse.data.data;
```

## Next Steps

- 📖 Read the [full README](./README.md) for detailed documentation
- 🔍 Check out [FILTERS.md](./FILTERS.md) for all filter operators
- 💡 Browse [examples](./examples/) for more use cases
- 🚀 Start building your API!

## Need Help?

- Check the examples in the `examples/` directory
- Read the filter operators guide in `FILTERS.md`
- Review the comprehensive README

Happy coding! 🎉
