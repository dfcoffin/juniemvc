package guru.springframework.juniemvc.repositories;

import guru.springframework.juniemvc.entities.Customer;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class CustomerRepositoryTest {

    @Autowired
    CustomerRepository customerRepository;

    @Test
    void testSaveCustomer() {
        // Given
        Customer customer = Customer.builder()
                .name("John Doe")
                .email("john.doe@example.com")
                .phoneNumber("555-123-4567")
                .addressLine1("123 Main St")
                .addressLine2("Apt 4B")
                .city("Springfield")
                .state("IL")
                .zipCode("62701")
                .build();

        // When
        Customer savedCustomer = customerRepository.save(customer);

        // Then
        assertThat(savedCustomer).isNotNull();
        assertThat(savedCustomer.getId()).isNotNull();
        assertThat(savedCustomer.getCreateDate()).isNotNull();
        assertThat(savedCustomer.getUpdateDate()).isNotNull();
    }

    @Test
    void testGetCustomerById() {
        // Given
        Customer customer = Customer.builder()
                .name("John Doe")
                .email("john.doe@example.com")
                .phoneNumber("555-123-4567")
                .addressLine1("123 Main St")
                .addressLine2("Apt 4B")
                .city("Springfield")
                .state("IL")
                .zipCode("62701")
                .build();
        Customer savedCustomer = customerRepository.save(customer);

        // When
        Optional<Customer> fetchedCustomerOptional = customerRepository.findById(savedCustomer.getId());

        // Then
        assertThat(fetchedCustomerOptional).isPresent();
        Customer fetchedCustomer = fetchedCustomerOptional.get();
        assertThat(fetchedCustomer.getName()).isEqualTo("John Doe");
        assertThat(fetchedCustomer.getEmail()).isEqualTo("john.doe@example.com");
        assertThat(fetchedCustomer.getAddressLine1()).isEqualTo("123 Main St");
    }

    @Test
    void testUpdateCustomer() {
        // Given
        Customer customer = Customer.builder()
                .name("Original Name")
                .email("original@example.com")
                .phoneNumber("555-123-4567")
                .addressLine1("123 Main St")
                .addressLine2("Apt 4B")
                .city("Springfield")
                .state("IL")
                .zipCode("62701")
                .build();
        Customer savedCustomer = customerRepository.save(customer);

        // Ensure the entity is persisted before updating
        customerRepository.flush();

        // Get a fresh copy of the entity from the database
        Customer fetchedCustomer = customerRepository.findById(savedCustomer.getId()).orElseThrow();

        // When
        fetchedCustomer.setName("Updated Name");
        fetchedCustomer.setEmail("updated@example.com");
        Customer updatedCustomer = customerRepository.save(fetchedCustomer);

        // Ensure the update is persisted
        customerRepository.flush();

        // Then
        assertThat(updatedCustomer.getName()).isEqualTo("Updated Name");
        assertThat(updatedCustomer.getEmail()).isEqualTo("updated@example.com");
        assertThat(updatedCustomer.getVersion()).isEqualTo(1); // Version should be incremented
    }

    @Test
    void testDeleteCustomer() {
        // Given
        Customer customer = Customer.builder()
                .name("Delete Me")
                .email("delete@example.com")
                .phoneNumber("555-123-4567")
                .addressLine1("123 Main St")
                .addressLine2("Apt 4B")
                .city("Springfield")
                .state("IL")
                .zipCode("62701")
                .build();
        Customer savedCustomer = customerRepository.save(customer);

        // When
        customerRepository.deleteById(savedCustomer.getId());
        Optional<Customer> deletedCustomerOptional = customerRepository.findById(savedCustomer.getId());

        // Then
        assertThat(deletedCustomerOptional).isEmpty();
    }

    @Test
    void testListCustomers() {
        // Given
        Customer customer1 = Customer.builder()
                .name("Customer One")
                .email("one@example.com")
                .phoneNumber("555-111-1111")
                .addressLine1("111 First St")
                .city("Springfield")
                .state("IL")
                .zipCode("62701")
                .build();

        Customer customer2 = Customer.builder()
                .name("Customer Two")
                .email("two@example.com")
                .phoneNumber("555-222-2222")
                .addressLine1("222 Second St")
                .city("Springfield")
                .state("IL")
                .zipCode("62702")
                .build();

        customerRepository.save(customer1);
        customerRepository.save(customer2);

        // When
        List<Customer> customers = customerRepository.findAll();

        // Then
        assertThat(customers).isNotEmpty();
        assertThat(customers.size()).isGreaterThanOrEqualTo(2);
    }
}
