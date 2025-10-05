import { ApiProperty } from '@nestjs/swagger';
import { Field, ObjectType, Int } from '@nestjs/graphql';
import { Type as TransformType } from 'class-transformer';
import { Type } from '../types';

/**
 * Pagination metadata
 */
@ObjectType()
export class PaginationMeta {
  @ApiProperty({ description: 'Current page number' })
  @Field(() => Int, { description: 'Current page number' })
  page: number;

  @ApiProperty({ description: 'Items per page' })
  @Field(() => Int, { description: 'Items per page' })
  limit: number;

  @ApiProperty({ description: 'Total number of items' })
  @Field(() => Int, { description: 'Total number of items' })
  total: number;

  @ApiProperty({ description: 'Total number of pages' })
  @Field(() => Int, { description: 'Total number of pages' })
  totalPages: number;

  @ApiProperty({ description: 'Whether there is a next page' })
  @Field({ description: 'Whether there is a next page' })
  hasNext: boolean;

  @ApiProperty({ description: 'Whether there is a previous page' })
  @Field({ description: 'Whether there is a previous page' })
  hasPrevious: boolean;
}

/**
 * Generic paginated response
 */
export function PaginatedResponse<T>(classRef: Type<T>) {
  @ObjectType({ isAbstract: true })
  abstract class PaginatedResponseClass {
    @ApiProperty({
      description: 'Array of items',
      type: [classRef],
    })
    @Field(() => [classRef], { description: 'Array of items' })
    data: T[];

    @ApiProperty({
      description: 'Pagination metadata',
      type: PaginationMeta,
    })
    @Field(() => PaginationMeta, { description: 'Pagination metadata' })
    meta: PaginationMeta;
  }

  return PaginatedResponseClass as any;
}

/**
 * Helper function to create pagination metadata
 */
export function createPaginationMeta(
  page: number,
  limit: number,
  total: number
): PaginationMeta {
  const totalPages = Math.ceil(total / limit);
  return {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrevious: page > 1,
  };
}
