/**
 * Common type definitions used across the application
 */

/**
 * Sort interface for paginated responses
 */
export interface Sort {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}

/**
 * Pageable interface for pagination information
 */
export interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: Sort;
}

/**
 * Generic Page interface for all paginated responses
 */
export interface Page<T> {
  content: T[];
  pageable: Pageable;
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
  sort: Sort;
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}
