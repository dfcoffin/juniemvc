package guru.springframework.juniemvc.controllers;

import guru.springframework.juniemvc.models.CustomerDto;
import guru.springframework.juniemvc.services.CustomerService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * REST Controller for Customer operations
 */
@RestController
@RequestMapping("/api/v1/customers")
public class CustomerController {

    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    /**
     * Get all customers
     * @return List of all customers
     */
    @GetMapping
    public List<CustomerDto> getAllCustomers() {
        return customerService.getAllCustomers();
    }

    /**
     * Get a customer by its ID
     * @param id the customer ID
     * @return ResponseEntity with the customer if found, or 404 Not Found
     */
    @GetMapping("/{id}")
    public ResponseEntity<CustomerDto> getCustomerById(@PathVariable Integer id) {
        Optional<CustomerDto> customerOptional = customerService.getCustomerById(id);

        return customerOptional
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Create a new customer
     * @param customerDto the customer to create
     * @return ResponseEntity with the created customer and 201 Created status
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CustomerDto createCustomer(@Valid @RequestBody CustomerDto customerDto) {
        // Ensure a new customer is created, not an update
        customerDto.setId(null);
        return customerService.saveCustomer(customerDto);
    }

    /**
     * Update an existing customer
     * @param id the customer ID
     * @param customerDto the updated customer data
     * @return ResponseEntity with the updated customer if found, or 404 Not Found
     */
    @PutMapping("/{id}")
    public ResponseEntity<CustomerDto> updateCustomer(@PathVariable Integer id, @Valid @RequestBody CustomerDto customerDto) {
        Optional<CustomerDto> updatedCustomer = customerService.updateCustomer(id, customerDto);

        return updatedCustomer
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Delete a customer by its ID
     * @param id the customer ID
     * @return ResponseEntity with no content if successful, or 404 Not Found
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable Integer id) {
        Optional<CustomerDto> customerOptional = customerService.getCustomerById(id);

        if (customerOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        customerService.deleteCustomerById(id);
        return ResponseEntity.noContent().build();
    }
}