import {apiService} from "../api/axiosConfig";
import type {Customer, CustomerDto, CustomerPage, CustomerPatchDto,} from "@/types/customer";

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
    name?: string,
  ): Promise<CustomerPage> => {
    const params: Record<string, number | string | undefined> = {
      pageNumber,
      pageSize,
    };

    if (name) params.name = name;

    return apiService
      .get<CustomerPage>("/api/v1/customers", { params })
      .then((response) => {
        // Handle response and make sure both name and customerName properties are set
        if (response && response.content && Array.isArray(response.content)) {
          response.content = response.content.map((customer) => {
            // Ensure both name and customerName are set correctly
            if (customer.customerName && !customer.name) {
              customer.name = customer.customerName;
            } else if (customer.name && !customer.customerName) {
              customer.customerName = customer.name;
            }
            return customer;
          });
        }
        return response;
      });
  },

  /**
   * Get a customer by their ID
   * @param id - The customer ID
   * @returns Promise with customer data
   */
  getCustomerById: (id: number): Promise<Customer> => {
    return apiService
      .get<Customer>(`/api/v1/customers/${id}`)
      .then((customer) => {
        // Ensure both name and customerName are set correctly
        if (customer.customerName && !customer.name) {
          customer.name = customer.customerName;
        } else if (customer.name && !customer.customerName) {
          customer.customerName = customer.name;
        }
        return customer;
      });
  },

  /**
   * Create a new customer
   * @param customerDto - The customer data to create
   * @returns Promise with the created customer
   */
  createCustomer: (customerDto: CustomerDto): Promise<Customer> => {
    // Ensure both name properties are consistent in the DTO
    const dto = { ...customerDto };
    if (dto.name) {
      dto.customerName = dto.name;
    }

    return apiService
      .post<Customer>("/api/v1/customers", dto)
      .then((customer) => {
        // Ensure both name and customerName are set correctly in the response
        if (customer.customerName && !customer.name) {
          customer.name = customer.customerName;
        } else if (customer.name && !customer.customerName) {
          customer.customerName = customer.name;
        }
        return customer;
      });
  },

  /**
   * Update a customer
   * @param id - The customer ID
   * @param customerDto - The updated customer data
   * @returns Promise with the updated customer
   */
  updateCustomer: (id: number, customerDto: CustomerDto): Promise<Customer> => {
    // Ensure both name properties are consistent in the DTO
    const dto = { ...customerDto };
    if (dto.name) {
      dto.customerName = dto.name;
    }

    return apiService
      .put<Customer>(`/api/v1/customers/${id}`, dto)
      .then((customer) => {
        // Ensure both name and customerName are set correctly in the response
        if (customer.customerName && !customer.name) {
          customer.name = customer.customerName;
        } else if (customer.name && !customer.customerName) {
          customer.customerName = customer.name;
        }
        return customer;
      });
  },

  /**
   * Partially update a customer
   * @param id - The customer ID
   * @param customerPatchDto - The partial customer data to update
   * @returns Promise with the updated customer
   */
  patchCustomer: (
    id: number,
    customerPatchDto: CustomerPatchDto,
  ): Promise<Customer> => {
    // Ensure both name properties are consistent in the DTO
    const dto = { ...customerPatchDto };
    if (dto.name && !dto.customerName) {
      dto.customerName = dto.name;
    } else if (dto.customerName && !dto.name) {
      dto.name = dto.customerName;
    }

    return apiService
      .patch<Customer>(`/api/v1/customers/${id}`, dto)
      .then((customer) => {
        // Ensure both name and customerName are set correctly in the response
        if (customer.customerName && !customer.name) {
          customer.name = customer.customerName;
        } else if (customer.name && !customer.customerName) {
          customer.customerName = customer.name;
        }
        return customer;
      });
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
    return apiService.get<Customer>(`/api/v1/customers/${id}/beer-orders`);
  },
};

export default CustomerService;
