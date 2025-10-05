import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import {
  QueryDto,
  PaginatedResponse,
  createPaginationMeta,
  QueryParser,
} from 'nestjs-dto';

// Example entity
class User {
  id: number;
  name: string;
  email: string;
  age: number;
  status: string;
}

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

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users with filtering, sorting, and pagination' })
  async findAll(@Query() query: QueryDto) {
    // Parse filters to database query (TypeORM example)
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

/**
 * Example API calls:
 * 
 * 1. Basic pagination:
 *    GET /users?page=1&limit=10
 * 
 * 2. With sorting:
 *    GET /users?page=1&limit=10&sortBy=createdAt&sortDirection=DESC
 * 
 * 3. With search:
 *    GET /users?page=1&limit=10&search=john
 * 
 * 4. With filters:
 *    GET /users?page=1&limit=10&filters[0][field]=age&filters[0][operator]=gte&filters[0][value]=18
 * 
 * 5. Complex query:
 *    GET /users?page=1&limit=10&sortBy=name&sortDirection=ASC&search=john&filters[0][field]=age&filters[0][operator]=gte&filters[0][value]=18&filters[1][field]=status&filters[1][operator]=eq&filters[1][value]=active&logicalOperator=AND
 */
