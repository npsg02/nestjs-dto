import { Resolver, Query, Args } from '@nestjs/graphql';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  QueryDto,
  PaginatedResponse,
  createPaginationMeta,
  QueryParser,
} from 'nestjs-dto';

// Define GraphQL types
@ObjectType()
class User {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field(() => Int)
  age: number;

  @Field()
  status: string;
}

@ObjectType()
class UserPaginatedResponse extends PaginatedResponse(User) {}

// Example service (mock)
class UsersService {
  async findAndCount(options: any): Promise<[User[], number]> {
    // Mock implementation - replace with actual database query
    const users: User[] = [
      { id: 1, name: 'John Doe', email: 'john@example.com', age: 30, status: 'active' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 25, status: 'active' },
    ];
    return [users, users.length];
  }
}

@Resolver(() => User)
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Query(() => UserPaginatedResponse)
  async users(@Args() query: QueryDto): Promise<UserPaginatedResponse> {
    // Parse filters to database query
    const where = QueryParser.toMongoQuery(query.filters, query.logicalOperator);
    const sort = QueryParser.buildSort(query.sortBy, query.sortDirection);

    // Execute database query
    const [data, total] = await this.usersService.findAndCount({
      where,
      sort,
      skip: query.getSkip(),
      limit: query.getLimit(),
    });

    // Return paginated response
    return {
      data,
      meta: createPaginationMeta(query.page, query.limit, total),
    };
  }
}

/**
 * Example GraphQL query:
 * 
 * query GetUsers {
 *   users(
 *     page: 1
 *     limit: 10
 *     sortBy: "name"
 *     sortDirection: "ASC"
 *     search: "john"
 *     filters: [
 *       { field: "age", operator: "gte", value: "18" }
 *       { field: "status", operator: "eq", value: "active" }
 *     ]
 *     logicalOperator: "AND"
 *   ) {
 *     data {
 *       id
 *       name
 *       email
 *       age
 *       status
 *     }
 *     meta {
 *       page
 *       limit
 *       total
 *       totalPages
 *       hasNext
 *       hasPrevious
 *     }
 *   }
 * }
 */
