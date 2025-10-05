# Filter Operators Guide

This guide explains all available filter operators in nestjs-dto and how to use them.

## Basic Operators

### EQUALS (eq)
Match exact value.

```typescript
// Backend
filters: [{ field: 'status', operator: FilterOperator.EQUALS, value: 'active' }]

// Client
query.filter('status', FilterOperator.EQUALS, 'active')

// SQL equivalent: WHERE status = 'active'
```

### NOT_EQUALS (ne)
Match anything except the specified value.

```typescript
filters: [{ field: 'status', operator: FilterOperator.NOT_EQUALS, value: 'deleted' }]

// SQL equivalent: WHERE status != 'deleted'
```

## Comparison Operators

### GREATER_THAN (gt)
Match values greater than the specified value.

```typescript
filters: [{ field: 'age', operator: FilterOperator.GREATER_THAN, value: 18 }]

// SQL equivalent: WHERE age > 18
```

### GREATER_THAN_OR_EQUAL (gte)
Match values greater than or equal to the specified value.

```typescript
filters: [{ field: 'age', operator: FilterOperator.GREATER_THAN_OR_EQUAL, value: 18 }]

// SQL equivalent: WHERE age >= 18
```

### LESS_THAN (lt)
Match values less than the specified value.

```typescript
filters: [{ field: 'price', operator: FilterOperator.LESS_THAN, value: 100 }]

// SQL equivalent: WHERE price < 100
```

### LESS_THAN_OR_EQUAL (lte)
Match values less than or equal to the specified value.

```typescript
filters: [{ field: 'price', operator: FilterOperator.LESS_THAN_OR_EQUAL, value: 100 }]

// SQL equivalent: WHERE price <= 100
```

## String Operators

### LIKE (like)
SQL LIKE pattern matching.

```typescript
filters: [{ field: 'name', operator: FilterOperator.LIKE, value: '%john%' }]

// SQL equivalent: WHERE name LIKE '%john%'
```

### CONTAINS (contains)
Check if string contains the value (case-insensitive).

```typescript
filters: [{ field: 'email', operator: FilterOperator.CONTAINS, value: 'example' }]

// SQL equivalent: WHERE email LIKE '%example%'
// MongoDB equivalent: { email: { $regex: 'example', $options: 'i' } }
```

### STARTS_WITH (startsWith)
Check if string starts with the value.

```typescript
filters: [{ field: 'name', operator: FilterOperator.STARTS_WITH, value: 'John' }]

// SQL equivalent: WHERE name LIKE 'John%'
// MongoDB equivalent: { name: { $regex: '^John', $options: 'i' } }
```

### ENDS_WITH (endsWith)
Check if string ends with the value.

```typescript
filters: [{ field: 'email', operator: FilterOperator.ENDS_WITH, value: '@example.com' }]

// SQL equivalent: WHERE email LIKE '%@example.com'
// MongoDB equivalent: { email: { $regex: '@example.com$', $options: 'i' } }
```

## Array Operators

### IN (in)
Match if value is in the specified array.

```typescript
filters: [{ 
  field: 'status', 
  operator: FilterOperator.IN, 
  value: ['active', 'pending', 'verified'] 
}]

// SQL equivalent: WHERE status IN ('active', 'pending', 'verified')
```

### NOT_IN (nin)
Match if value is NOT in the specified array.

```typescript
filters: [{ 
  field: 'status', 
  operator: FilterOperator.NOT_IN, 
  value: ['deleted', 'banned'] 
}]

// SQL equivalent: WHERE status NOT IN ('deleted', 'banned')
```

## Range Operators

### BETWEEN (between)
Match values between two values (inclusive).

```typescript
filters: [{ 
  field: 'age', 
  operator: FilterOperator.BETWEEN, 
  value: [18, 65] 
}]

// SQL equivalent: WHERE age BETWEEN 18 AND 65
// MongoDB equivalent: { age: { $gte: 18, $lte: 65 } }
```

## Null Operators

### IS_NULL (null)
Match null values.

```typescript
filters: [{ field: 'deletedAt', operator: FilterOperator.IS_NULL }]

// SQL equivalent: WHERE deletedAt IS NULL
```

### IS_NOT_NULL (notnull)
Match non-null values.

```typescript
filters: [{ field: 'email', operator: FilterOperator.IS_NOT_NULL }]

// SQL equivalent: WHERE email IS NOT NULL
```

## Combining Filters

### AND Logic (default)
All conditions must be true.

```typescript
const query = api.query()
  .filter('age', FilterOperator.GREATER_THAN_OR_EQUAL, 18)
  .filter('status', FilterOperator.EQUALS, 'active')
  .logicalOperator('AND');

// SQL equivalent: WHERE age >= 18 AND status = 'active'
```

### OR Logic
Any condition can be true.

```typescript
const query = api.query()
  .filter('role', FilterOperator.EQUALS, 'admin')
  .filter('role', FilterOperator.EQUALS, 'moderator')
  .logicalOperator('OR');

// SQL equivalent: WHERE role = 'admin' OR role = 'moderator'
```

## Complex Examples

### Example 1: User Search
Find active users over 18 with verified email.

```typescript
const query = api.query()
  .paginate(1, 20)
  .sort('createdAt', SortDirection.DESC)
  .filter('age', FilterOperator.GREATER_THAN_OR_EQUAL, 18)
  .filter('status', FilterOperator.EQUALS, 'active')
  .filter('emailVerified', FilterOperator.EQUALS, true)
  .logicalOperator('AND');
```

### Example 2: Product Search
Find products in certain categories within price range.

```typescript
const query = api.query()
  .paginate(1, 50)
  .filter('category', FilterOperator.IN, ['electronics', 'computers', 'accessories'])
  .filter('price', FilterOperator.BETWEEN, [100, 1000])
  .filter('stock', FilterOperator.GREATER_THAN, 0)
  .logicalOperator('AND');
```

### Example 3: Text Search
Find users with names containing "john" or emails ending with company domain.

```typescript
const query = api.query()
  .filter('name', FilterOperator.CONTAINS, 'john')
  .filter('email', FilterOperator.ENDS_WITH, '@company.com')
  .logicalOperator('OR');
```

### Example 4: Excluding Records
Find non-deleted records that are not in draft status.

```typescript
const query = api.query()
  .filter('deletedAt', FilterOperator.IS_NULL)
  .filter('status', FilterOperator.NOT_IN, ['draft', 'archived'])
  .logicalOperator('AND');
```

## Backend Implementation

### With TypeORM

```typescript
import { QueryParser } from 'nestjs-dto';

const where = QueryParser.toTypeORMWhere(query.filters, query.logicalOperator);
const users = await userRepository.find({ where });
```

### With MongoDB/Mongoose

```typescript
import { QueryParser } from 'nestjs-dto';

const mongoQuery = QueryParser.toMongoQuery(query.filters, query.logicalOperator);
const users = await UserModel.find(mongoQuery);
```

## Tips

1. **Use appropriate operators**: Choose the right operator for your data type (string, number, boolean, etc.)
2. **Index your fields**: Add database indexes on fields you frequently filter by
3. **Validate input**: Always validate filter values on the backend
4. **Limit complexity**: Consider limiting the number of filters per query to prevent performance issues
5. **Test edge cases**: Test with null values, empty strings, and boundary conditions
