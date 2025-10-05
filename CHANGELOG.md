# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-10-05

### Added
- Initial release of nestjs-dto
- Core DTO classes for pagination, sorting, filtering, and query operations
- Support for REST API with Swagger decorators
- Support for GraphQL with Field and InputType decorators
- Generic response wrappers (PaginatedResponse, ApiResponse)
- API client with Axios for frontend integration
- Query builder with fluent interface for constructing complex queries
- Multiple filter operators:
  - Basic: EQUALS, NOT_EQUALS
  - Comparison: GREATER_THAN, GREATER_THAN_OR_EQUAL, LESS_THAN, LESS_THAN_OR_EQUAL
  - String: LIKE, CONTAINS, STARTS_WITH, ENDS_WITH
  - Array: IN, NOT_IN
  - Range: BETWEEN
  - Null: IS_NULL, IS_NOT_NULL
- Query parser utilities for TypeORM and MongoDB
- Support for both offset-based and cursor-based pagination
- Logical operators (AND/OR) for combining filters
- TypeScript support with full type safety
- Comprehensive documentation and examples
- Quick start guide
- Filter operators guide
- MIT License

### Features
- 🔄 Reusable DTOs across REST API, GraphQL, and WebSocket
- 🔍 Complex query support with flexible filtering
- 📄 Pagination with multiple strategies
- 🎯 Generic types for type-safe responses
- 🌐 Full-featured API client
- 🔧 Query builder for constructing queries
- 📊 Multiple database support (TypeORM, MongoDB)
- ✨ Decorator-based validation

### Examples
- Backend REST API example
- Backend GraphQL example
- Frontend client usage examples with 14+ scenarios

### Documentation
- Comprehensive README with API reference
- Quick start guide for rapid development
- Detailed filter operators guide
- Usage examples for various scenarios
