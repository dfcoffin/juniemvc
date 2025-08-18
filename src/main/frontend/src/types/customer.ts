/**
 * Customer types definitions
 */

import type {BeerOrderDto} from "./beerOrder";

/**
 * Customer interface representing a customer entity
 */
export interface Customer {
  id?: number;
  version?: number;
  createdDate?: string;
  updateDate?: string;
  name: string;
  customerName: string; // Added for backward compatibility with existing code
  email?: string;
  phoneNumber?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  beerOrders?: BeerOrderDto[];
}

/**
 * Customer page interface for paginated responses
 */
export interface CustomerPage {
  content: Customer[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
  };
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

/**
 * Customer DTO for creating/updating customers
 */
export interface CustomerDto {
  name: string;
  customerName?: string; // Added for backward compatibility
  email?: string;
  phoneNumber?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
}

/**
 * Customer patch DTO for partially updating customer properties
 */
export interface CustomerPatchDto {
  name?: string;
  customerName?: string; // Added for backward compatibility
  email?: string;
  phoneNumber?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
}
