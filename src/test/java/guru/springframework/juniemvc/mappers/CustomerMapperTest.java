package guru.springframework.juniemvc.mappers;

import guru.springframework.juniemvc.entities.Customer;
import guru.springframework.juniemvc.models.CustomerDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;

class CustomerMapperTest {

    private CustomerMapper customerMapper;
    private Customer testCustomer;

    @BeforeEach
    void setUp() {
        customerMapper = Mappers.getMapper(CustomerMapper.class);

        // Create test customer
        testCustomer = Customer.builder()
                .name("John Doe")
                .email("john.doe@example.com")
                .phoneNumber("555-123-4567")
                .addressLine1("123 Main St")
                .addressLine2("Apt 4B")
                .city("Springfield")
                .state("IL")
                .postalCode("62701")
                .build();
        testCustomer.setId(1);
        testCustomer.setCreatedDate(LocalDateTime.now());
        testCustomer.setUpdateDate(LocalDateTime.now());
    }

    @Test
    void testCustomerToCustomerDto() {
        // When
        CustomerDto customerDto = customerMapper.customerToCustomerDto(testCustomer);

        // Then
        assertThat(customerDto).isNotNull();
        assertThat(customerDto.getId()).isEqualTo(testCustomer.getId());
        assertThat(customerDto.getName()).isEqualTo(testCustomer.getName());
        assertThat(customerDto.getEmail()).isEqualTo(testCustomer.getEmail());
        assertThat(customerDto.getPhoneNumber()).isEqualTo(testCustomer.getPhoneNumber());
        assertThat(customerDto.getAddressLine1()).isEqualTo(testCustomer.getAddressLine1());
        assertThat(customerDto.getAddressLine2()).isEqualTo(testCustomer.getAddressLine2());
        assertThat(customerDto.getCity()).isEqualTo(testCustomer.getCity());
        assertThat(customerDto.getState()).isEqualTo(testCustomer.getState());
        assertThat(customerDto.getPostalCode()).isEqualTo(testCustomer.getPostalCode());
        assertThat(customerDto.getCreatedDate()).isEqualTo(testCustomer.getCreatedDate());
        assertThat(customerDto.getUpdateDate()).isEqualTo(testCustomer.getUpdateDate());
        // beerOrders should be ignored in the mapping
        assertThat(customerDto.getBeerOrders()).isNull();
    }

    @Test
    void testCustomerDtoToCustomer() {
        // Given
        CustomerDto customerDto = CustomerDto.builder()
                .id(2)
                .name("Jane Smith")
                .email("jane.smith@example.com")
                .phoneNumber("555-987-6543")
                .addressLine1("456 Oak Ave")
                .city("Shelbyville")
                .state("IL")
                .postalCode("62565")
                .build();

        // When
        Customer customer = customerMapper.customerDtoToCustomer(customerDto);

        // Then
        assertThat(customer).isNotNull();
        assertThat(customer.getName()).isEqualTo(customerDto.getName());
        assertThat(customer.getEmail()).isEqualTo(customerDto.getEmail());
        assertThat(customer.getPhoneNumber()).isEqualTo(customerDto.getPhoneNumber());
        assertThat(customer.getAddressLine1()).isEqualTo(customerDto.getAddressLine1());
        assertThat(customer.getAddressLine2()).isEqualTo(customerDto.getAddressLine2());
        assertThat(customer.getCity()).isEqualTo(customerDto.getCity());
        assertThat(customer.getState()).isEqualTo(customerDto.getState());
        assertThat(customer.getPostalCode()).isEqualTo(customerDto.getPostalCode());
        // beerOrders should be ignored in the mapping
        assertThat(customer.getBeerOrders()).isNotNull();
        assertThat(customer.getBeerOrders()).isEmpty();
    }
}
