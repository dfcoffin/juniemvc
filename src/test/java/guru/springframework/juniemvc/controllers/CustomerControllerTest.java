package guru.springframework.juniemvc.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import guru.springframework.juniemvc.models.CustomerDto;
import guru.springframework.juniemvc.service.CustomerService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Optional;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class CustomerControllerTest {

    @TestConfiguration
    static class TestConfig {
        @Bean
        @Primary
        CustomerService customerService() {
            return Mockito.mock(CustomerService.class);
        }
    }

    @Autowired
    MockMvc mockMvc;

    @Autowired
    ObjectMapper objectMapper;

    @Autowired
    CustomerService customerService;

    CustomerDto testCustomerDto;

    @BeforeEach
    void setUp() {
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
        testCustomerDto.setCreateDate(LocalDateTime.now());
        testCustomerDto.setUpdateDate(LocalDateTime.now());
    }

    @Test
    void getAllCustomers() throws Exception {
        given(customerService.getAllCustomers()).willReturn(Arrays.asList(testCustomerDto));

        mockMvc.perform(get("/api/v1/customers")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id", is(1)))
                .andExpect(jsonPath("$[0].name", is("John Doe")));
    }

    @Test
    void getCustomerById() throws Exception {
        given(customerService.getCustomerById(1)).willReturn(Optional.of(testCustomerDto));

        mockMvc.perform(get("/api/v1/customers/1")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.name", is("John Doe")));
    }

    @Test
    void getCustomerByIdNotFound() throws Exception {
        given(customerService.getCustomerById(999)).willReturn(Optional.empty());

        mockMvc.perform(get("/api/v1/customers/999")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    void createCustomer() throws Exception {
        CustomerDto customerToSave = CustomerDto.builder()
                .name("Jane Smith")
                .email("jane.smith@example.com")
                .phoneNumber("555-987-6543")
                .addressLine1("456 Oak Ave")
                .addressLine2("Suite 2C")
                .city("Springfield")
                .state("IL")
                .zipCode("62702")
                .build();

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
        savedCustomerDto.setCreateDate(LocalDateTime.now());
        savedCustomerDto.setUpdateDate(LocalDateTime.now());

        given(customerService.saveCustomer(any(CustomerDto.class))).willReturn(savedCustomerDto);

        mockMvc.perform(post("/api/v1/customers")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(customerToSave)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", is(2)))
                .andExpect(jsonPath("$.name", is("Jane Smith")));
    }

    @Test
    void createCustomerWithValidationError() throws Exception {
        CustomerDto invalidCustomerDto = CustomerDto.builder()
                .name("") // Invalid: empty name
                .email("invalid-email") // Invalid: not a valid email
                .phoneNumber("555-987-6543")
                .addressLine1("") // Invalid: empty address line 1
                .addressLine2("Suite 2C")
                .city("") // Invalid: empty city
                .state("") // Invalid: empty state
                .zipCode("") // Invalid: empty zip code
                .build();

        mockMvc.perform(post("/api/v1/customers")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidCustomerDto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.name").exists())
                .andExpect(jsonPath("$.email").exists())
                .andExpect(jsonPath("$.addressLine1").exists())
                .andExpect(jsonPath("$.city").exists())
                .andExpect(jsonPath("$.state").exists())
                .andExpect(jsonPath("$.zipCode").exists());
    }

    @Test
    void updateCustomer() throws Exception {
        CustomerDto customerToUpdate = CustomerDto.builder()
                .name("John Doe Updated")
                .email("john.updated@example.com")
                .phoneNumber("555-123-4567")
                .addressLine1("123 Main St")
                .addressLine2("Apt 5C")
                .city("Springfield")
                .state("IL")
                .zipCode("62701")
                .build();

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
        updatedCustomerDto.setCreateDate(LocalDateTime.now().minusDays(1));
        updatedCustomerDto.setUpdateDate(LocalDateTime.now());

        given(customerService.updateCustomerById(anyInt(), any(CustomerDto.class))).willReturn(Optional.of(updatedCustomerDto));

        mockMvc.perform(put("/api/v1/customers/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(customerToUpdate)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.version", is(2)))
                .andExpect(jsonPath("$.name", is("John Doe Updated")))
                .andExpect(jsonPath("$.email", is("john.updated@example.com")));

        verify(customerService).updateCustomerById(eq(1), any(CustomerDto.class));
    }

    @Test
    void updateCustomerWithValidationError() throws Exception {
        CustomerDto invalidCustomerDto = CustomerDto.builder()
                .name("") // Invalid: empty name
                .email("invalid-email") // Invalid: not a valid email
                .phoneNumber("555-987-6543")
                .addressLine1("") // Invalid: empty address line 1
                .addressLine2("Suite 2C")
                .city("") // Invalid: empty city
                .state("") // Invalid: empty state
                .zipCode("") // Invalid: empty zip code
                .build();

        mockMvc.perform(put("/api/v1/customers/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidCustomerDto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.name").exists())
                .andExpect(jsonPath("$.email").exists())
                .andExpect(jsonPath("$.addressLine1").exists())
                .andExpect(jsonPath("$.city").exists())
                .andExpect(jsonPath("$.state").exists())
                .andExpect(jsonPath("$.zipCode").exists());
    }

    @Test
    void updateCustomerNotFound() throws Exception {
        CustomerDto customerToUpdate = CustomerDto.builder()
                .name("John Doe Updated")
                .email("john.updated@example.com")
                .phoneNumber("555-123-4567")
                .addressLine1("123 Main St")
                .addressLine2("Apt 5C")
                .city("Springfield")
                .state("IL")
                .zipCode("62701")
                .build();

        given(customerService.updateCustomerById(anyInt(), any(CustomerDto.class))).willReturn(Optional.empty());

        mockMvc.perform(put("/api/v1/customers/999")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(customerToUpdate)))
                .andExpect(status().isNotFound());

        verify(customerService).updateCustomerById(eq(999), any(CustomerDto.class));
    }

    @Test
    void deleteCustomer() throws Exception {
        given(customerService.deleteCustomerById(1)).willReturn(true);

        mockMvc.perform(delete("/api/v1/customers/1"))
                .andExpect(status().isNoContent());

        verify(customerService).deleteCustomerById(1);
    }

    @Test
    void deleteCustomerNotFound() throws Exception {
        given(customerService.deleteCustomerById(999)).willReturn(false);

        mockMvc.perform(delete("/api/v1/customers/999"))
                .andExpect(status().isNotFound());

        verify(customerService).deleteCustomerById(999);
    }
}