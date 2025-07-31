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
    private Customer customer;
    private CustomerDto customerDto;

    @BeforeEach
    void setUp() {
        // Get the mapper instance
        customerMapper = Mappers.getMapper(CustomerMapper.class);

        // Create a test Customer entity
        customer = Customer.builder()
                .name("John Doe")
                .email("john.doe@example.com")
                .phoneNumber("555-123-4567")
                .addressLine1("123 Main St")
                .addressLine2("Apt 4B")
                .city("Springfield")
                .state("IL")
                .zipCode("62701")
                .build();
        customer.setId(1);
//        customer.setCreateDate(LocalDateTime.now());
//        customer.setUpdateDate(LocalDateTime.now());

        // Create a test CustomerDto
        customerDto = CustomerDto.builder()
                .name("Jane Smith")
                .email("jane.smith@example.com")
                .phoneNumber("555-987-6543")
                .addressLine1("456 Oak Ave")
                .addressLine2("Suite 2C")
                .city("Springfield")
                .state("IL")
                .zipCode("62702")
                .build();
        customerDto.setId(2);
//        customerDto.setCreateDate(LocalDateTime.now());
//        customerDto.setUpdateDate(LocalDateTime.now());
    }

    @Test
    void testCustomerToCustomerDto() {
        // Convert Customer to CustomerDto
        CustomerDto dto = customerMapper.customerToCustomerDto(customer);

        // Verify the conversion
        assertThat(dto).isNotNull();
        assertThat(dto.getId()).isEqualTo(customer.getId());
//        assertThat(dto.getVersion()).isEqualTo(customer.getVersion());
        assertThat(dto.getName()).isEqualTo(customer.getName());
        assertThat(dto.getEmail()).isEqualTo(customer.getEmail());
        assertThat(dto.getPhoneNumber()).isEqualTo(customer.getPhoneNumber());
        assertThat(dto.getAddressLine1()).isEqualTo(customer.getAddressLine1());
        assertThat(dto.getAddressLine2()).isEqualTo(customer.getAddressLine2());
        assertThat(dto.getCity()).isEqualTo(customer.getCity());
        assertThat(dto.getState()).isEqualTo(customer.getState());
        assertThat(dto.getZipCode()).isEqualTo(customer.getZipCode());
//        assertThat(dto.getCreateDate()).isEqualTo(customer.getCreateDate());
//        assertThat(dto.getUpdateDate()).isEqualTo(customer.getUpdateDate());
    }

    @Test
    void testCustomerDtoToCustomer() {
        // Convert CustomerDto to Customer
        Customer entity = customerMapper.customerDtoToCustomer(customerDto);

        // Verify the conversion
        assertThat(entity.getName()).isEqualTo(customerDto.getName());
        assertThat(entity.getEmail()).isEqualTo(customerDto.getEmail());
        assertThat(entity.getPhoneNumber()).isEqualTo(customerDto.getPhoneNumber());
        assertThat(entity.getAddressLine1()).isEqualTo(customerDto.getAddressLine1());
        assertThat(entity.getAddressLine2()).isEqualTo(customerDto.getAddressLine2());
        assertThat(entity.getCity()).isEqualTo(customerDto.getCity());
        assertThat(entity.getState()).isEqualTo(customerDto.getState());
        assertThat(entity.getZipCode()).isEqualTo(customerDto.getZipCode());
        // beerOrders should be ignored in the mapping
        assertThat(entity.getBeerOrders()).isNotNull();
        assertThat(entity.getBeerOrders()).isEmpty();
    }

    @Test
    void testNullCustomer() {
        // Test null handling
        CustomerDto dto = customerMapper.customerToCustomerDto(null);
        assertThat(dto).isNull();
    }

    @Test
    void testNullCustomerDto() {
        // Test null handling
        Customer entity = customerMapper.customerDtoToCustomer(null);
        assertThat(entity).isNull();
    }
}
