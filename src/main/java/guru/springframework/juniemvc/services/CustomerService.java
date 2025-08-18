package guru.springframework.juniemvc.services;

import guru.springframework.juniemvc.models.CustomerDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

/**
 * Service interface for Customer operations
 */
public interface CustomerService {

    /**
     * Get all customers
     * @return List of all customers
     */
    List<CustomerDto> getAllCustomers();
    
    /**
     * Get customers with pagination and optional filtering
     * @param pageable pagination information
     * @param name optional name filter
     * @return Page of customers
     */
    Page<CustomerDto> getAllCustomers(Pageable pageable, String name);

    /**
     * Get a customer by its ID
     * @param id the customer ID
     * @return Optional containing the customer if found
     */
    Optional<CustomerDto> getCustomerById(Integer id);

    /**
     * Save a new customer or update an existing one
     * @param customerDto the customer to save
     * @return the saved customer
     */
    CustomerDto saveCustomer(CustomerDto customerDto);

    /**
     * Update an existing customer
     * @param id the customer ID
     * @param customerDto the updated customer data
     * @return the updated customer
     */
    Optional<CustomerDto> updateCustomer(Integer id, CustomerDto customerDto);

    /**
     * Delete a customer by its ID
     * @param id the customer ID
     */
    void deleteCustomerById(Integer id);
}