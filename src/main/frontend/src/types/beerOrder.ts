/**
 * Beer Order types definitions
 */

import type {Page} from "./common";

/**
 * Beer Order Line interface
 */
export interface BeerOrderLineDto {
  id?: number;
  version?: number;
  createdDate?: string;
  updateDate?: string;
  beerId?: number;
  beerName?: string;
  beerStyle?: string;
  upc?: string;
  orderQuantity: number;
  quantityAllocated?: number;
  status?: string;
}

/**
 * Beer Order Shipment interface
 */
export interface BeerOrderShipmentDto {
  id?: number;
  version?: number;
  createdDate?: string;
  updateDate?: string;
  shipmentDate?: string;
  carrier?: string;
  trackingNumber?: string;
}

/**
 * Beer Order status enum
 */
export enum BeerOrderStatus {
  NEW = "NEW",
  PAID = "PAID",
  CANCELLED = "CANCELLED",
  INPROCESS = "INPROCESS",
  COMPLETE = "COMPLETE",
}

/**
 * Beer Order interface
 */
export interface BeerOrderDto {
  id?: number;
  version?: number;
  createdDate?: string;
  updateDate?: string;
  customerRef?: string;
  paymentAmount: number;
  status?: BeerOrderStatus;
  beerOrderLines: BeerOrderLineDto[];
  shipments?: BeerOrderShipmentDto[];
}

/**
 * Beer Order page interface for paginated responses
 */
export type BeerOrderPage = Page<BeerOrderDto>;
