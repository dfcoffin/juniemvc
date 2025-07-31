package guru.springframework.juniemvc.controllers;

import guru.springframework.juniemvc.models.CustomerDto;
import guru.springframework.juniemvc.service.CustomerService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * REST Controller for Customer operations.
 */
@RestController
@RequestMapping(path = "/api/v1/customers", produces = MediaType.APPLICATION_JSON_VALUE)
public class CustomerController {

    private final CustomerService customerService;

    /**
     * Constructor for dependency injection.
     * 
     * @param customerService The service for Customer operations
     */
    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    /**
     * Get all customers.
     * 
     * @return List of all customers
     */
    @GetMapping
    public List<CustomerDto> getAllCustomers() {
        return customerService.getAllCustomers();
    }

    /**
     * Get a customer by its ID.
     * 
     * @param id The ID of the customer to retrieve
     * @return ResponseEntity containing the customer if found, or 404 Not Found
     */
    @GetMapping("/{id}")
    public ResponseEntity<CustomerDto> getCustomerById(@PathVariable Integer id) {
        Optional<CustomerDto> customerOptional = customerService.getCustomerById(id);

        return customerOptional
                .map(customer -> new ResponseEntity<>(customer, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * Create a new customer.
     * 
     * @param customerDto The customer to create
     * @return The created customer with status 201 Created
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CustomerDto createCustomer(@Valid @RequestBody CustomerDto customerDto) {
        return customerService.saveCustomer(customerDto);
    }

    /**
     * Update an existing customer.
     * 
     * @param id The ID of the customer to update
     * @param customerDto The updated customer data
     * @return ResponseEntity containing the updated customer if found and updated, or 404 Not Found
     */
    @PutMapping("/{id}")
    public ResponseEntity<CustomerDto> updateCustomer(@PathVariable Integer id, @Valid @RequestBody CustomerDto customerDto) {
        Optional<CustomerDto> updatedCustomerOptional = customerService.updateCustomerById(id, customerDto);

        return updatedCustomerOptional
                .map(updatedCustomer -> new ResponseEntity<>(updatedCustomer, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * Delete a customer by its ID.
     * 
     * @param id The ID of the customer to delete
     * @return ResponseEntity with 204 No Content if deleted, or 404 Not Found
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable Integer id) {
        boolean deleted = customerService.deleteCustomerById(id);

        return deleted ? 
                new ResponseEntity<>(HttpStatus.NO_CONTENT) : 
                new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}