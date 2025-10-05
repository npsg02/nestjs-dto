import { ApiPropertyOptional } from '@nestjs/swagger';
import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsEnum, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * Filter operator enum for complex queries
 */
export enum FilterOperator {
  EQUALS = 'eq',
  NOT_EQUALS = 'ne',
  GREATER_THAN = 'gt',
  GREATER_THAN_OR_EQUAL = 'gte',
  LESS_THAN = 'lt',
  LESS_THAN_OR_EQUAL = 'lte',
  LIKE = 'like',
  IN = 'in',
  NOT_IN = 'nin',
  BETWEEN = 'between',
  IS_NULL = 'null',
  IS_NOT_NULL = 'notnull',
  CONTAINS = 'contains',
  STARTS_WITH = 'startsWith',
  ENDS_WITH = 'endsWith',
}

/**
 * Logical operator for combining filters
 */
export enum LogicalOperator {
  AND = 'AND',
  OR = 'OR',
}

/**
 * Single filter condition
 */
@InputType()
export class FilterCondition {
  @ApiPropertyOptional({
    description: 'Field name to filter',
  })
  @Field({ description: 'Field name to filter' })
  @IsString()
  field: string;

  @ApiPropertyOptional({
    description: 'Filter operator',
    enum: FilterOperator,
  })
  @Field(() => String, { description: 'Filter operator' })
  @IsEnum(FilterOperator)
  operator: FilterOperator;

  @ApiPropertyOptional({
    description: 'Filter value(s)',
  })
  @Field(() => String, { nullable: true, description: 'Filter value' })
  @IsOptional()
  value?: any;
}

/**
 * Base filter DTO for complex queries
 */
@InputType({ isAbstract: true })
export class FilterDto {
  @ApiPropertyOptional({
    description: 'Search query string',
  })
  @Field({ nullable: true, description: 'Search query string' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Array of filter conditions',
    type: [FilterCondition],
  })
  @Field(() => [FilterCondition], { nullable: true, description: 'Array of filter conditions' })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => FilterCondition)
  filters?: FilterCondition[];

  @ApiPropertyOptional({
    description: 'Logical operator to combine filters',
    enum: LogicalOperator,
    default: LogicalOperator.AND,
  })
  @Field(() => String, { nullable: true, description: 'Logical operator (AND or OR)' })
  @IsOptional()
  @IsEnum(LogicalOperator)
  logicalOperator?: LogicalOperator = LogicalOperator.AND;
}
