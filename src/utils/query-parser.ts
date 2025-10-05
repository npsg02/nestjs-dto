import { FilterCondition, FilterOperator, LogicalOperator } from '../dto/filter.dto';

/**
 * Query parser utilities for converting DTO to database queries
 */
export class QueryParser {
  /**
   * Convert filter conditions to SQL WHERE clause (for TypeORM)
   */
  static toTypeORMWhere(
    filters?: FilterCondition[],
    logicalOperator: LogicalOperator = LogicalOperator.AND
  ): any {
    if (!filters || filters.length === 0) {
      return {};
    }

    const conditions = filters.map(filter => this.parseFilterCondition(filter));

    if (logicalOperator === LogicalOperator.OR) {
      return conditions;
    }

    return conditions.reduce((acc, condition) => ({ ...acc, ...condition }), {});
  }

  /**
   * Parse a single filter condition
   */
  private static parseFilterCondition(filter: FilterCondition): any {
    const { field, operator, value } = filter;

    switch (operator) {
      case FilterOperator.EQUALS:
        return { [field]: value };
      case FilterOperator.NOT_EQUALS:
        return { [field]: { $ne: value } };
      case FilterOperator.GREATER_THAN:
        return { [field]: { $gt: value } };
      case FilterOperator.GREATER_THAN_OR_EQUAL:
        return { [field]: { $gte: value } };
      case FilterOperator.LESS_THAN:
        return { [field]: { $lt: value } };
      case FilterOperator.LESS_THAN_OR_EQUAL:
        return { [field]: { $lte: value } };
      case FilterOperator.LIKE:
      case FilterOperator.CONTAINS:
        return { [field]: { $like: `%${value}%` } };
      case FilterOperator.STARTS_WITH:
        return { [field]: { $like: `${value}%` } };
      case FilterOperator.ENDS_WITH:
        return { [field]: { $like: `%${value}` } };
      case FilterOperator.IN:
        return { [field]: { $in: value } };
      case FilterOperator.NOT_IN:
        return { [field]: { $nin: value } };
      case FilterOperator.BETWEEN:
        return { [field]: { $between: value } };
      case FilterOperator.IS_NULL:
        return { [field]: null };
      case FilterOperator.IS_NOT_NULL:
        return { [field]: { $ne: null } };
      default:
        return { [field]: value };
    }
  }

  /**
   * Convert filter conditions to MongoDB query
   */
  static toMongoQuery(
    filters?: FilterCondition[],
    logicalOperator: LogicalOperator = LogicalOperator.AND
  ): any {
    if (!filters || filters.length === 0) {
      return {};
    }

    const conditions = filters.map(filter => this.parseMongoFilterCondition(filter));

    if (logicalOperator === LogicalOperator.OR) {
      return { $or: conditions };
    }

    return { $and: conditions };
  }

  /**
   * Parse a single filter condition for MongoDB
   */
  private static parseMongoFilterCondition(filter: FilterCondition): any {
    const { field, operator, value } = filter;

    switch (operator) {
      case FilterOperator.EQUALS:
        return { [field]: value };
      case FilterOperator.NOT_EQUALS:
        return { [field]: { $ne: value } };
      case FilterOperator.GREATER_THAN:
        return { [field]: { $gt: value } };
      case FilterOperator.GREATER_THAN_OR_EQUAL:
        return { [field]: { $gte: value } };
      case FilterOperator.LESS_THAN:
        return { [field]: { $lt: value } };
      case FilterOperator.LESS_THAN_OR_EQUAL:
        return { [field]: { $lte: value } };
      case FilterOperator.LIKE:
      case FilterOperator.CONTAINS:
        return { [field]: { $regex: value, $options: 'i' } };
      case FilterOperator.STARTS_WITH:
        return { [field]: { $regex: `^${value}`, $options: 'i' } };
      case FilterOperator.ENDS_WITH:
        return { [field]: { $regex: `${value}$`, $options: 'i' } };
      case FilterOperator.IN:
        return { [field]: { $in: value } };
      case FilterOperator.NOT_IN:
        return { [field]: { $nin: value } };
      case FilterOperator.BETWEEN:
        return { [field]: { $gte: value[0], $lte: value[1] } };
      case FilterOperator.IS_NULL:
        return { [field]: null };
      case FilterOperator.IS_NOT_NULL:
        return { [field]: { $ne: null } };
      default:
        return { [field]: value };
    }
  }

  /**
   * Build sort object for database queries
   */
  static buildSort(sortBy?: string, sortDirection?: string): any {
    if (!sortBy) {
      return {};
    }

    const direction = sortDirection?.toUpperCase() === 'DESC' ? -1 : 1;
    return { [sortBy]: direction };
  }
}
