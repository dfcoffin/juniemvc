package guru.springframework.juniemvc.service;

import guru.springframework.juniemvc.models.CustomerDto;

import java.util.List;
import java.util.Optional;

/**
 * Service interface for Customer operations.
 */
public interface CustomerService {

    /**
     * Get all customers.
     * 
     * @return List of all customers
     */
    List<CustomerDto> getAllCustomers();

    /**
     * Get a customer by its ID.
     * 
     * @param id The ID of the customer to retrieve
     * @return Optional containing the customer if found, empty otherwise
     */
    Optional<CustomerDto> getCustomerById(Integer id);

    /**
     * Save a customer.
     * 
     * @param customerDto The customer to save
     * @return The saved customer with updated ID
     */
    CustomerDto saveCustomer(CustomerDto customerDto);

    /**
     * Update an existing customer.
     * 
     * @param id The ID of the customer to update
     * @param customerDto The updated customer data
     * @return Optional containing the updated customer if found and updated, empty otherwise
     */
    Optional<CustomerDto> updateCustomerById(Integer id, CustomerDto customerDto);

    /**
     * Delete a customer by its ID.
     * 
     * @param id The ID of the customer to delete
     * @return true if the customer was found and deleted, false otherwise
     */
    boolean deleteCustomerById(Integer id);
}