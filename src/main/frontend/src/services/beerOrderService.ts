import {apiService} from "../api/axiosConfig";
import type {BeerOrderDto, BeerOrderPage} from "@/types/beerOrder";
import {BeerOrderStatus} from "@/types/beerOrder";

/**
 * Beer Order service for handling beer order-related API operations
 */
export const BeerOrderService = {
  /**
   * Get a paginated list of beer orders with optional filtering
   * @param pageNumber - The page number to retrieve
   * @param pageSize - The number of items per page
   * @param customerId - Optional customer ID filter
   * @param status - Optional order status filter
   * @returns Promise with paginated beer order data
   */
  getBeerOrders: (
    pageNumber: number = 0,
    pageSize: number = 25,
    customerId?: number,
    status?: BeerOrderStatus,
  ): Promise<BeerOrderPage> => {
    const params: Record<string, number | string | undefined> = {
      pageNumber,
      pageSize,
    };

    if (customerId) params.customerId = customerId;
    if (status) params.status = status;

    return apiService.get<BeerOrderPage>("/api/v1/beer-orders", { params });
  },

  /**
   * Get a beer order by its ID
   * @param id - The beer order ID
   * @returns Promise with beer order data
   */
  getBeerOrderById: (id: number): Promise<BeerOrderDto> => {
    return apiService.get<BeerOrderDto>(`/api/v1/beer-orders/${id}`);
  },

  /**
   * Create a new beer order
   * @param beerOrderDto - The beer order data to create
   * @returns Promise with the created beer order
   */
  createBeerOrder: (beerOrderDto: BeerOrderDto): Promise<BeerOrderDto> => {
    return apiService.post<BeerOrderDto>("/api/v1/beer-orders", beerOrderDto);
  },

  /**
   * Update a beer order
   * @param id - The beer order ID
   * @param beerOrderDto - The updated beer order data
   * @returns Promise with the updated beer order
   */
  updateBeerOrder: (
    id: number,
    beerOrderDto: BeerOrderDto,
  ): Promise<BeerOrderDto> => {
    return apiService.put<BeerOrderDto>(
      `/api/v1/beer-orders/${id}`,
      beerOrderDto,
    );
  },

  /**
   * Delete a beer order
   * @param id - The beer order ID
   * @returns Promise with void
   */
  deleteBeerOrder: (id: number): Promise<void> => {
    return apiService.delete<void>(`/api/v1/beer-orders/${id}`);
  },

  /**
   * Update beer order status
   * @param id - The beer order ID
   * @param status - The new status
   * @returns Promise with the updated beer order
   */
  updateBeerOrderStatus: (
    id: number,
    status: BeerOrderStatus,
  ): Promise<BeerOrderDto> => {
    return apiService.patch<BeerOrderDto>(`/api/v1/beer-orders/${id}/status`, {
      status,
    });
  },

  /**
   * Get beer orders for a specific customer
   * @param customerId - The customer ID
   * @returns Promise with the customer's beer orders
   */
  getCustomerBeerOrders: (customerId: number): Promise<BeerOrderPage> => {
    return BeerOrderService.getBeerOrders(0, 25, customerId);
  },

  /**
   * Create a shipment for a beer order
   * @param orderId - The beer order ID
   * @param shipmentData - The shipment data
   * @returns Promise with the updated beer order
   */
  createBeerOrderShipment: (
    orderId: number,
    shipmentData: {
      shipmentDate: string;
      carrier: string;
      trackingNumber: string;
    },
  ): Promise<BeerOrderDto> => {
    return apiService.post<BeerOrderDto>(
      `/api/v1/beer-orders/${orderId}/shipments`,
      shipmentData,
    );
  },

  /**
   * Allocate inventory for a beer order
   * @param orderId - The beer order ID
   * @returns Promise with the updated beer order
   */
  allocateBeerOrder: (orderId: number): Promise<BeerOrderDto> => {
    return apiService.post<BeerOrderDto>(
      `/api/v1/beer-orders/${orderId}/allocate`,
      {},
    );
  },

  /**
   * Deallocate inventory for a beer order
   * @param orderId - The beer order ID
   * @returns Promise with the updated beer order
   */
  deallocateBeerOrder: (orderId: number): Promise<BeerOrderDto> => {
    return apiService.post<BeerOrderDto>(
      `/api/v1/beer-orders/${orderId}/deallocate`,
      {},
    );
  },
};

export default BeerOrderService;
