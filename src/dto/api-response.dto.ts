import { ApiProperty } from '@nestjs/swagger';
import { Field, ObjectType } from '@nestjs/graphql';

/**
 * Generic API response wrapper
 */
export function ApiResponse<T>(classRef: any) {
  @ObjectType({ isAbstract: true })
  abstract class ApiResponseClass {
    @ApiProperty({ description: 'Success status' })
    @Field({ description: 'Success status' })
    success: boolean;

    @ApiProperty({ description: 'Response message' })
    @Field({ nullable: true, description: 'Response message' })
    message?: string;

    @ApiProperty({
      description: 'Response data',
      type: classRef,
    })
    @Field(() => classRef, { nullable: true, description: 'Response data' })
    data?: T;

    @ApiProperty({ description: 'Error details', required: false })
    @Field({ nullable: true, description: 'Error details' })
    error?: string;
  }

  return ApiResponseClass as any;
}
