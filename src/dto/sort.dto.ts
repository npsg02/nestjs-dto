import { ApiPropertyOptional } from '@nestjs/swagger';
import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsEnum, IsString } from 'class-validator';

/**
 * Sort direction enum
 */
export enum SortDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

/**
 * Base sorting DTO
 */
@InputType({ isAbstract: true })
export class SortDto {
  @ApiPropertyOptional({
    description: 'Field name to sort by',
  })
  @Field({ nullable: true, description: 'Field name to sort by' })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiPropertyOptional({
    description: 'Sort direction',
    enum: SortDirection,
    default: SortDirection.ASC,
  })
  @Field(() => String, { nullable: true, description: 'Sort direction (ASC or DESC)' })
  @IsOptional()
  @IsEnum(SortDirection)
  sortDirection?: SortDirection = SortDirection.ASC;
}
