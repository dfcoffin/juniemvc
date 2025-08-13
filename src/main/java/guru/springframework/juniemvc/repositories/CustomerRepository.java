package guru.springframework.juniemvc.repositories;

import guru.springframework.juniemvc.entities.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repository for Customer entity
 */
public interface CustomerRepository extends JpaRepository<Customer, Integer> {
    // Spring Data JPA will implement basic CRUD operations
    // Custom query methods can be added here if needed
}