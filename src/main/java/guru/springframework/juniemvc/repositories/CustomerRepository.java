package guru.springframework.juniemvc.repositories;

import guru.springframework.juniemvc.entities.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repository for Customer entity
 */
public interface CustomerRepository extends JpaRepository<Customer, Integer> {
    // Spring Data JPA will implement basic CRUD operations
    
    /**
     * Find customers with name containing the given string (case-insensitive)
     * @param name the name to search for
     * @param pageable pagination information
     * @return Page of customers matching the criteria
     */
    Page<Customer> findByNameContainingIgnoreCase(String name, Pageable pageable);
}