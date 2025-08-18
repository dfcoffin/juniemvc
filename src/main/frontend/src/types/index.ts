/**
 * Re-export all types from type files
 */

// Import Beer types
import type {Beer, BeerDto, BeerPage, BeerPatchDto} from "./beer";
import {BeerStyle} from "./beer";

// Import Customer types
import type {Customer, CustomerDto, CustomerPage, CustomerPatchDto,} from "./customer";

// Import BeerOrder types
import type {BeerOrderDto, BeerOrderLineDto, BeerOrderPage, BeerOrderShipmentDto,} from "./beerOrder";
import {BeerOrderStatus} from "./beerOrder";

// Re-export all types
export type {
  Beer,
  BeerDto,
  BeerPage,
  BeerPatchDto,
  Customer,
  CustomerDto,
  CustomerPage,
  CustomerPatchDto,
  BeerOrderDto,
  BeerOrderLineDto,
  BeerOrderPage,
  BeerOrderShipmentDto,
};

export { BeerStyle, BeerOrderStatus };

// Export non-enum types as values as well to satisfy imports
// This is needed because some files are importing these types without the 'type' keyword
export { Beer, BeerOrderDto, BeerOrderLineDto, BeerOrderPage, Customer };
