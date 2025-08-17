import {apiService} from '../api/axiosConfig';
import {Customer, CustomerDto, CustomerPage, CustomerPatchDto} from '../types/customer';

/**
 * Customer service for handling customer-related API operations
 */
export const CustomerService = {
  /**
   * Get a paginated list of customers with optional filtering
   * @param pageNumber - The page number to retrieve
   * @param pageSize - The number of items per page
   * @param name - Optional customer name filter
   * @returns Promise with paginated customer data
   */
  getCustomers: (
    pageNumber: number = 0,
    pageSize: number = 25,
    name?: string
  ): Promise<CustomerPage> => {
    const params: Record<string, any> = {
      pageNumber,
      pageSize,
    };

    if (name) params.name = name;

    return apiService.get<CustomerPage>('/api/v1/customers', { params });
  },

  /**
   * Get a customer by their ID
   * @param id - The customer ID
   * @returns Promise with customer data
   */
  getCustomerById: (id: number): Promise<Customer> => {
    return apiService.get<Customer>(`/api/v1/customers/${id}`);
  },

  /**
   * Create a new customer
   * @param customerDto - The customer data to create
   * @returns Promise with the created customer
   */
  createCustomer: (customerDto: CustomerDto): Promise<Customer> => {
    return apiService.post<Customer>('/api/v1/customers', customerDto);
  },

  /**
   * Update a customer
   * @param id - The customer ID
   * @param customerDto - The updated customer data
   * @returns Promise with the updated customer
   */
  updateCustomer: (id: number, customerDto: CustomerDto): Promise<Customer> => {
    return apiService.put<Customer>(`/api/v1/customers/${id}`, customerDto);
  },

  /**
   * Partially update a customer
   * @param id - The customer ID
   * @param customerPatchDto - The partial customer data to update
   * @returns Promise with the updated customer
   */
  patchCustomer: (id: number, customerPatchDto: CustomerPatchDto): Promise<Customer> => {
    return apiService.patch<Customer>(`/api/v1/customers/${id}`, customerPatchDto);
  },

  /**
   * Delete a customer
   * @param id - The customer ID
   * @returns Promise with void
   */
  deleteCustomer: (id: number): Promise<void> => {
    return apiService.delete<void>(`/api/v1/customers/${id}`);
  },

  /**
   * Get beer orders for a specific customer
   * @param id - The customer ID
   * @returns Promise with the customer's beer orders
   */
  getCustomerBeerOrders: (id: number): Promise<Customer> => {
    return apiService.get<Customer>(`/api/v1/customers/${id}/orders`);
  }
};

export default CustomerService;