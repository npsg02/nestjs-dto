# nestjs-dto Quick Reference

## Installation
```bash
npm install nestjs-dto
```

## Basic Imports
```typescript
// Backend imports
import { QueryDto, PaginatedResponse, createPaginationMeta, QueryParser } from 'nestjs-dto';

// Client imports
import { ApiClient, FilterOperator, SortDirection } from 'nestjs-dto';
```

## Backend Usage

### Simple Controller
```typescript
@Get()
async findAll(@Query() query: QueryDto) {
  const [data, total] = await this.service.find({
    skip: query.getSkip(),
    take: query.getLimit(),
  });
  
  return {
    data,
    meta: createPaginationMeta(query.page, query.limit, total),
  };
}
```

### With Query Parser
```typescript
// TypeORM
const where = QueryParser.toTypeORMWhere(query.filters, query.logicalOperator);
const order = QueryParser.buildSort(query.sortBy, query.sortDirection);

// MongoDB
const mongoQuery = QueryParser.toMongoQuery(query.filters, query.logicalOperator);
```

## Client Usage

### Initialize
```typescript
const api = new ApiClient({ baseURL: 'http://localhost:3000/api' });
api.setAuthToken('your-token');
```

### Simple Query
```typescript
const response = await api.get('/users');
const paginated = await api.getPaginated('/users', 1, 10);
```

### Complex Query
```typescript
const query = api.query()
  .paginate(1, 20)
  .sort('createdAt', SortDirection.DESC)
  .search('john')
  .filter('age', FilterOperator.GREATER_THAN_OR_EQUAL, 18)
  .filter('status', FilterOperator.IN, ['active', 'verified'])
  .logicalOperator('AND');

const response = await api.query_get('/users', query);
```

## Filter Operators

| Operator | Code | Example |
|----------|------|---------|
| Equals | `EQUALS` | `.filter('status', FilterOperator.EQUALS, 'active')` |
| Not Equals | `NOT_EQUALS` | `.filter('status', FilterOperator.NOT_EQUALS, 'deleted')` |
| Greater Than | `GREATER_THAN` | `.filter('age', FilterOperator.GREATER_THAN, 18)` |
| Greater/Equal | `GREATER_THAN_OR_EQUAL` | `.filter('age', FilterOperator.GREATER_THAN_OR_EQUAL, 18)` |
| Less Than | `LESS_THAN` | `.filter('price', FilterOperator.LESS_THAN, 100)` |
| Less/Equal | `LESS_THAN_OR_EQUAL` | `.filter('price', FilterOperator.LESS_THAN_OR_EQUAL, 100)` |
| Contains | `CONTAINS` | `.filter('name', FilterOperator.CONTAINS, 'john')` |
| Starts With | `STARTS_WITH` | `.filter('name', FilterOperator.STARTS_WITH, 'John')` |
| Ends With | `ENDS_WITH` | `.filter('email', FilterOperator.ENDS_WITH, '@example.com')` |
| In Array | `IN` | `.filter('status', FilterOperator.IN, ['active', 'pending'])` |
| Not In Array | `NOT_IN` | `.filter('status', FilterOperator.NOT_IN, ['deleted'])` |
| Between | `BETWEEN` | `.filter('age', FilterOperator.BETWEEN, [18, 65])` |
| Is Null | `IS_NULL` | `.filter('deletedAt', FilterOperator.IS_NULL)` |
| Not Null | `IS_NOT_NULL` | `.filter('email', FilterOperator.IS_NOT_NULL)` |

## Query Parameters (REST API)

```
GET /api/users?page=1&limit=10&sortBy=name&sortDirection=ASC&search=john&filters[0][field]=age&filters[0][operator]=gte&filters[0][value]=18&logicalOperator=AND
```

## GraphQL Query

```graphql
query {
  users(
    page: 1
    limit: 10
    sortBy: "name"
    sortDirection: "ASC"
    filters: [
      { field: "age", operator: "gte", value: "18" }
      { field: "status", operator: "eq", value: "active" }
    ]
    logicalOperator: "AND"
  ) {
    data { id name email }
    meta { total totalPages hasNext }
  }
}
```

## Type Safety

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

const response = await api.get<User>('/users/1');
const user: User = response.data;
```

## More Info

- 📖 Full docs: [README.md](./README.md)
- 🚀 Quick start: [QUICKSTART.md](./QUICKSTART.md)
- 🔍 Filter guide: [FILTERS.md](./FILTERS.md)
- 💡 Examples: [examples/](./examples/)
