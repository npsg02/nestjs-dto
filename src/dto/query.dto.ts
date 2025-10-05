import { ApiPropertyOptional } from '@nestjs/swagger';
import { InputType } from '@nestjs/graphql';
import { PaginationDto } from './pagination.dto';
import { SortDto } from './sort.dto';
import { FilterDto } from './filter.dto';

/**
 * Combined query DTO that includes pagination, sorting, and filtering
 * Can be extended for specific use cases
 */
@InputType({ isAbstract: true })
export class QueryDto extends PaginationDto {
  // Inherit pagination fields

  @ApiPropertyOptional({
    description: 'Field name to sort by',
  })
  sortBy?: string;

  @ApiPropertyOptional({
    description: 'Sort direction',
  })
  sortDirection?: string;

  @ApiPropertyOptional({
    description: 'Search query string',
  })
  search?: string;

  @ApiPropertyOptional({
    description: 'Array of filter conditions',
  })
  filters?: any[];

  @ApiPropertyOptional({
    description: 'Logical operator to combine filters',
  })
  logicalOperator?: string;
}

// Apply mixins for sorting and filtering
Object.getOwnPropertyNames(SortDto.prototype).forEach(name => {
  if (name !== 'constructor') {
    Object.defineProperty(
      QueryDto.prototype,
      name,
      Object.getOwnPropertyDescriptor(SortDto.prototype, name)
    );
  }
});

Object.getOwnPropertyNames(FilterDto.prototype).forEach(name => {
  if (name !== 'constructor') {
    Object.defineProperty(
      QueryDto.prototype,
      name,
      Object.getOwnPropertyDescriptor(FilterDto.prototype, name)
    );
  }
});
