import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiCreatedResponse,
  getSchemaPath,
  ApiExtraModels,
  ApiResponse,
} from '@nestjs/swagger';
import { BaseResponseDto, ErrorResponseDto } from '../dto/api-response.dto';

export const ApiSuccessResponse = <TModel extends Type<unknown>>(
  model: TModel,
  description = 'Successful response',
  isCreated = false,
): MethodDecorator & ClassDecorator => {
  const ApiDecorator = isCreated ? ApiCreatedResponse : ApiOkResponse;

  return applyDecorators(
    ApiExtraModels(BaseResponseDto, model),
    ApiDecorator({
      description,
      schema: {
        allOf: [
          { $ref: getSchemaPath(BaseResponseDto) },
          {
            properties: {
              data: {
                $ref: getSchemaPath(model),
              },
            },
          },
        ],
      },
    }),
  );
};

export const ApiPaginatedResponse = <TModel extends Type<unknown>>(
  model: TModel,
  description = 'Paginated response',
): MethodDecorator & ClassDecorator => {
  return applyDecorators(
    ApiExtraModels(BaseResponseDto, model),
    ApiOkResponse({
      description,
      schema: {
        allOf: [
          { $ref: getSchemaPath(BaseResponseDto) },
          {
            properties: {
              data: {
                type: 'object',
                properties: {
                  items: {
                    type: 'array',
                    items: { $ref: getSchemaPath(model) },
                  },
                  total: { type: 'number', example: 100 },
                  page: { type: 'number', example: 1 },
                  limit: { type: 'number', example: 10 },
                  pages: { type: 'number', example: 10 },
                },
              },
            },
          },
        ],
      },
    }),
  );
};

export const ApiErrorResponses = (): MethodDecorator & ClassDecorator => {
  return applyDecorators(
    ApiExtraModels(ErrorResponseDto),
    // 400 Bad Request
    ApiResponse({
      status: 400,
      description: 'Bad Request - Validation failed',
      type: ErrorResponseDto,
    }),
    // 401 Unauthorized
    ApiResponse({
      status: 401,
      description: 'Unauthorized - Invalid credentials',
      type: ErrorResponseDto,
    }),
    // 403 Forbidden
    ApiResponse({
      status: 403,
      description: 'Forbidden - Insufficient permissions',
      type: ErrorResponseDto,
    }),
    // 404 Not Found
    ApiResponse({
      status: 404,
      description: 'Not Found - Resource does not exist',
      type: ErrorResponseDto,
    }),
    // 500 Internal Server Error
    ApiResponse({
      status: 500,
      description: 'Internal Server Error',
      type: ErrorResponseDto,
    }),
  );
};
