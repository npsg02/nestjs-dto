import { ApiPropertyOptional } from '@nestjs/swagger';
import { Field, InputType, Int } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsOptional, IsInt, Min, Max } from 'class-validator';

/**
 * Base pagination DTO for REST API and GraphQL
 * Supports both offset-based and cursor-based pagination
 */
@InputType({ isAbstract: true })
export class PaginationDto {
  @ApiPropertyOptional({
    description: 'Page number (1-indexed)',
    minimum: 1,
    default: 1,
  })
  @Field(() => Int, { nullable: true, description: 'Page number (1-indexed)' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    minimum: 1,
    maximum: 100,
    default: 10,
  })
  @Field(() => Int, { nullable: true, description: 'Number of items per page' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Skip number of items (alternative to page)',
    minimum: 0,
  })
  @Field(() => Int, { nullable: true, description: 'Skip number of items' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  skip?: number;

  @ApiPropertyOptional({
    description: 'Cursor for cursor-based pagination',
  })
  @Field({ nullable: true, description: 'Cursor for cursor-based pagination' })
  @IsOptional()
  cursor?: string;

  /**
   * Get the skip value for database queries
   */
  getSkip(): number {
    if (this.skip !== undefined) {
      return this.skip;
    }
    return (this.page - 1) * this.limit;
  }

  /**
   * Get the limit value
   */
  getLimit(): number {
    return this.limit;
  }
}
