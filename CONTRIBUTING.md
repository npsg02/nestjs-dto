# Contributing to nestjs-dto

Thank you for your interest in contributing to nestjs-dto! This document provides guidelines and instructions for contributing.

## How to Contribute

### Reporting Issues

If you find a bug or have a feature request:

1. Check if the issue already exists in the [GitHub Issues](https://github.com/npsg02/nestjs-dto/issues)
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce (for bugs)
   - Expected vs actual behavior
   - Your environment (Node version, NestJS version, etc.)
   - Code examples if applicable

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Make your changes**:
   - Write clean, readable code
   - Follow the existing code style
   - Add comments for complex logic
3. **Test your changes**:
   - Ensure the code compiles: `npm run build`
   - Test with your own examples
4. **Update documentation**:
   - Update README.md if adding features
   - Add examples in the `examples/` directory
   - Update CHANGELOG.md
5. **Submit the pull request**:
   - Provide a clear description of the changes
   - Reference any related issues

## Development Setup

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/nestjs-dto.git
cd nestjs-dto

# Install dependencies
npm install

# Build the project
npm run build
```

### Project Structure

```
nestjs-dto/
├── src/
│   ├── dto/              # DTO classes
│   ├── client/           # API client and query builder
│   ├── utils/            # Utility functions
│   ├── types/            # TypeScript type definitions
│   └── index.ts          # Main export file
├── examples/             # Usage examples
├── dist/                 # Compiled JavaScript (generated)
└── README.md            # Documentation
```

## Code Style

- Use TypeScript
- Follow existing code formatting
- Use meaningful variable and function names
- Add JSDoc comments for public APIs
- Keep functions focused and small

## Adding New Features

When adding a new feature:

1. **Plan the API**: Design the public interface first
2. **Implement**: Write the implementation
3. **Document**: Add JSDoc comments and update README
4. **Examples**: Create examples showing how to use the feature
5. **Test**: Verify it works in different scenarios

### Example: Adding a New Filter Operator

1. Add the operator to `FilterOperator` enum in `filter.dto.ts`
2. Implement handling in `QueryParser.parseFilterCondition()`
3. Implement MongoDB version in `QueryParser.parseMongoFilterCondition()`
4. Document in `FILTERS.md`
5. Add usage examples

## Documentation

Good documentation is crucial:

- **README.md**: Main documentation with examples
- **QUICKSTART.md**: Quick start guide for new users
- **FILTERS.md**: Detailed filter operators documentation
- **Examples**: Code examples in `examples/` directory
- **JSDoc**: Inline documentation in code

## Version Control

### Commit Messages

Use clear, descriptive commit messages:

```
feat: add cursor-based pagination support
fix: resolve issue with filter operator parsing
docs: update README with GraphQL examples
refactor: simplify query builder API
```

### Branches

- `main`: Stable releases
- `develop`: Development branch (if used)
- Feature branches: `feature/your-feature-name`
- Bug fixes: `fix/issue-description`

## Release Process

(For maintainers)

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Run `npm run build`
4. Create a git tag: `git tag v1.x.x`
5. Push tag: `git push origin v1.x.x`
6. Publish to npm: `npm publish`
7. Create GitHub release with changelog

## Questions?

If you have questions about contributing:

- Open a discussion in GitHub Discussions
- Create an issue for clarification
- Reach out to maintainers

## Code of Conduct

Be respectful and professional in all interactions. We aim to create a welcoming environment for all contributors.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to nestjs-dto! 🎉
