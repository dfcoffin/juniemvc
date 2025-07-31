package guru.springframework.juniemvc.service;

import guru.springframework.juniemvc.entities.Customer;
import guru.springframework.juniemvc.mappers.CustomerMapper;
import guru.springframework.juniemvc.models.CustomerDto;
import guru.springframework.juniemvc.repositories.CustomerRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CustomerServiceImplTest {

    @Mock
    CustomerRepository customerRepository;

    @Mock
    CustomerMapper customerMapper;

    @InjectMocks
    CustomerServiceImpl customerService;

    Customer testCustomer;
    CustomerDto testCustomerDto;

    @BeforeEach
    void setUp() {
        // Create test data
        testCustomer = Customer.builder()
                .name("John Doe")
                .email("john.doe@example.com")
                .phoneNumber("555-123-4567")
                .addressLine1("123 Main St")
                .addressLine2("Apt 4B")
                .city("Springfield")
                .state("IL")
                .zipCode("62701")
                .build();
        testCustomer.setId(1);
        testCustomer.setVersion(1);
        testCustomer.setCreateDate(LocalDateTime.now());
        testCustomer.setUpdateDate(LocalDateTime.now());

        testCustomerDto = CustomerDto.builder()
                .name("John Doe")
                .email("john.doe@example.com")
                .phoneNumber("555-123-4567")
                .addressLine1("123 Main St")
                .addressLine2("Apt 4B")
                .city("Springfield")
                .state("IL")
                .zipCode("62701")
                .build();
        testCustomerDto.setId(1);
        testCustomerDto.setVersion(1);
        testCustomerDto.setCreateDate(testCustomer.getCreateDate());
        testCustomerDto.setUpdateDate(testCustomer.getUpdateDate());
    }

    @Test
    void getAllCustomers() {
        // given
        List<Customer> expectedCustomers = Arrays.asList(testCustomer);
        when(customerRepository.findAll()).thenReturn(expectedCustomers);
        when(customerMapper.customerToCustomerDto(testCustomer)).thenReturn(testCustomerDto);

        // when
        List<CustomerDto> actualCustomers = customerService.getAllCustomers();

        // then
        assertThat(actualCustomers).hasSize(1);
        assertThat(actualCustomers.get(0)).isEqualTo(testCustomerDto);
        verify(customerRepository).findAll();
        verify(customerMapper).customerToCustomerDto(testCustomer);
    }

    @Test
    void getCustomerById() {
        // given
        when(customerRepository.findById(1)).thenReturn(Optional.of(testCustomer));
        when(customerMapper.customerToCustomerDto(testCustomer)).thenReturn(testCustomerDto);

        // when
        Optional<CustomerDto> foundCustomer = customerService.getCustomerById(1);

        // then
        assertThat(foundCustomer).isPresent();
        assertThat(foundCustomer.get()).isEqualTo(testCustomerDto);
        verify(customerRepository).findById(1);
        verify(customerMapper).customerToCustomerDto(testCustomer);
    }

    @Test
    void getCustomerByIdNotFound() {
        // given
        when(customerRepository.findById(999)).thenReturn(Optional.empty());

        // when
        Optional<CustomerDto> foundCustomer = customerService.getCustomerById(999);

        // then
        assertThat(foundCustomer).isEmpty();
        verify(customerRepository).findById(999);
    }

    @Test
    void saveCustomer() {
        // given
        CustomerDto customerDtoToSave = CustomerDto.builder()
                .name("Jane Smith")
                .email("jane.smith@example.com")
                .phoneNumber("555-987-6543")
                .addressLine1("456 Oak Ave")
                .addressLine2("Suite 2C")
                .city("Springfield")
                .state("IL")
                .zipCode("62702")
                .build();

        Customer customerToSave = Customer.builder()
                .name("Jane Smith")
                .email("jane.smith@example.com")
                .phoneNumber("555-987-6543")
                .addressLine1("456 Oak Ave")
                .addressLine2("Suite 2C")
                .city("Springfield")
                .state("IL")
                .zipCode("62702")
                .build();

        Customer savedCustomer = Customer.builder()
                .name("Jane Smith")
                .email("jane.smith@example.com")
                .phoneNumber("555-987-6543")
                .addressLine1("456 Oak Ave")
                .addressLine2("Suite 2C")
                .city("Springfield")
                .state("IL")
                .zipCode("62702")
                .build();
        savedCustomer.setId(2);
        savedCustomer.setVersion(1);
        LocalDateTime now = LocalDateTime.now();
        savedCustomer.setCreateDate(now);
        savedCustomer.setUpdateDate(now);

        CustomerDto savedCustomerDto = CustomerDto.builder()
                .name("Jane Smith")
                .email("jane.smith@example.com")
                .phoneNumber("555-987-6543")
                .addressLine1("456 Oak Ave")
                .addressLine2("Suite 2C")
                .city("Springfield")
                .state("IL")
                .zipCode("62702")
                .build();
        savedCustomerDto.setId(2);
        savedCustomerDto.setVersion(1);
        savedCustomerDto.setCreateDate(now);
        savedCustomerDto.setUpdateDate(now);

        when(customerMapper.customerDtoToCustomer(customerDtoToSave)).thenReturn(customerToSave);
        when(customerRepository.save(customerToSave)).thenReturn(savedCustomer);
        when(customerMapper.customerToCustomerDto(savedCustomer)).thenReturn(savedCustomerDto);

        // when
        CustomerDto result = customerService.saveCustomer(customerDtoToSave);

        // then
        assertThat(result).isEqualTo(savedCustomerDto);
        verify(customerMapper).customerDtoToCustomer(customerDtoToSave);
        verify(customerRepository).save(customerToSave);
        verify(customerMapper).customerToCustomerDto(savedCustomer);
    }

    @Test
    void updateCustomerById() {
        // given
        CustomerDto customerDtoToUpdate = CustomerDto.builder()
                .name("John Doe Updated")
                .email("john.updated@example.com")
                .phoneNumber("555-123-4567")
                .addressLine1("123 Main St")
                .addressLine2("Apt 5C")
                .city("Springfield")
                .state("IL")
                .zipCode("62701")
                .build();

        Customer existingCustomer = Customer.builder()
                .name("John Doe")
                .email("john.doe@example.com")
                .phoneNumber("555-123-4567")
                .addressLine1("123 Main St")
                .addressLine2("Apt 4B")
                .city("Springfield")
                .state("IL")
                .zipCode("62701")
                .build();
        existingCustomer.setId(1);
        existingCustomer.setVersion(1);
        LocalDateTime createDate = LocalDateTime.now().minusDays(1);
        LocalDateTime updateDate = LocalDateTime.now();
        existingCustomer.setCreateDate(createDate);
        existingCustomer.setUpdateDate(updateDate);

        Customer updatedCustomer = Customer.builder()
                .name("John Doe Updated")
                .email("john.updated@example.com")
                .phoneNumber("555-123-4567")
                .addressLine1("123 Main St")
                .addressLine2("Apt 5C")
                .city("Springfield")
                .state("IL")
                .zipCode("62701")
                .build();
        updatedCustomer.setId(1);
        updatedCustomer.setVersion(2);
        updatedCustomer.setCreateDate(createDate);
        updatedCustomer.setUpdateDate(LocalDateTime.now());

        CustomerDto updatedCustomerDto = CustomerDto.builder()
                .name("John Doe Updated")
                .email("john.updated@example.com")
                .phoneNumber("555-123-4567")
                .addressLine1("123 Main St")
                .addressLine2("Apt 5C")
                .city("Springfield")
                .state("IL")
                .zipCode("62701")
                .build();
        updatedCustomerDto.setId(1);
        updatedCustomerDto.setVersion(2);
        updatedCustomerDto.setCreateDate(createDate);
        updatedCustomerDto.setUpdateDate(updatedCustomer.getUpdateDate());

        given(customerRepository.findById(1)).willReturn(Optional.of(existingCustomer));
        given(customerRepository.save(any(Customer.class))).willReturn(updatedCustomer);
        given(customerMapper.customerToCustomerDto(updatedCustomer)).willReturn(updatedCustomerDto);

        // when
        Optional<CustomerDto> result = customerService.updateCustomerById(1, customerDtoToUpdate);

        // then
        assertThat(result).isPresent();
        assertThat(result.get()).isEqualTo(updatedCustomerDto);
        verify(customerRepository).findById(1);
        verify(customerRepository).save(any(Customer.class));
        verify(customerMapper).customerToCustomerDto(updatedCustomer);
    }

    @Test
    void updateCustomerByIdNotFound() {
        // given
        CustomerDto customerDtoToUpdate = CustomerDto.builder()
                .name("John Doe Updated")
                .email("john.updated@example.com")
                .phoneNumber("555-123-4567")
                .addressLine1("123 Main St")
                .addressLine2("Apt 5C")
                .city("Springfield")
                .state("IL")
                .zipCode("62701")
                .build();

        given(customerRepository.findById(999)).willReturn(Optional.empty());

        // when
        Optional<CustomerDto> result = customerService.updateCustomerById(999, customerDtoToUpdate);

        // then
        assertThat(result).isEmpty();
        verify(customerRepository).findById(999);
    }

    @Test
    void deleteCustomerById() {
        // given
        given(customerRepository.existsById(1)).willReturn(true);

        // when
        boolean result = customerService.deleteCustomerById(1);

        // then
        assertThat(result).isTrue();
        verify(customerRepository).existsById(1);
        verify(customerRepository).deleteById(1);
    }

    @Test
    void deleteCustomerByIdNotFound() {
        // given
        given(customerRepository.existsById(999)).willReturn(false);

        // when
        boolean result = customerService.deleteCustomerById(999);

        // then
        assertThat(result).isFalse();
        verify(customerRepository).existsById(999);
    }
}