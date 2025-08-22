/**
 * Customer types definitions
 */

import type {BeerOrderDto} from "./beerOrder";
import type {Page} from "./common";

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
export type CustomerPage = Page<Customer>;

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
