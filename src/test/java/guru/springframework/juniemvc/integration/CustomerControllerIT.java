package guru.springframework.juniemvc.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import guru.springframework.juniemvc.entities.Customer;
import guru.springframework.juniemvc.models.CustomerDto;
import guru.springframework.juniemvc.repositories.CustomerRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the Customer API.
 * Tests the complete flow from controller to repository and back.
 */
@SpringBootTest
@AutoConfigureMockMvc
class CustomerControllerIT {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    ObjectMapper objectMapper;

    @Autowired
    CustomerRepository customerRepository;

    @BeforeEach
    void setUp() {
        // Clean up any existing test data
        customerRepository.deleteAll();
    }

    @Test
    @Transactional
    @Rollback
    void testCreateAndGetCustomer() throws Exception {
        // Create a customer DTO to save
        CustomerDto customerDtoToSave = CustomerDto.builder()
                .name("John Doe")
                .email("john.doe@example.com")
                .phoneNumber("555-123-4567")
                .addressLine1("123 Main St")
                .addressLine2("Apt 4B")
                .city("Springfield")
                .state("IL")
                .zipCode("62701")
                .build();

        // Create the customer via POST request
        MvcResult postResult = mockMvc.perform(post("/api/v1/customers")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(customerDtoToSave)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name", is("John Doe")))
                .andExpect(jsonPath("$.email", is("john.doe@example.com")))
                .andReturn();

        // Extract the created customer from the response
        String responseContent = postResult.getResponse().getContentAsString();
        CustomerDto createdCustomerDto = objectMapper.readValue(responseContent, CustomerDto.class);
        Integer customerId = createdCustomerDto.getId();

        // Verify the customer was saved to the database
        assertThat(customerRepository.findById(customerId)).isPresent();

        // Get the customer via GET request
        mockMvc.perform(get("/api/v1/customers/" + customerId)
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id", is(customerId)))
                .andExpect(jsonPath("$.name", is("John Doe")))
                .andExpect(jsonPath("$.email", is("john.doe@example.com")))
                .andExpect(jsonPath("$.addressLine1", is("123 Main St")));
    }

    @Test
    @Transactional
    @Rollback
    void testCreateUpdateAndDeleteCustomer() throws Exception {
        // Create a customer DTO to save
        CustomerDto customerDtoToSave = CustomerDto.builder()
                .name("John Doe")
                .email("john.doe@example.com")
                .phoneNumber("555-123-4567")
                .addressLine1("123 Main St")
                .addressLine2("Apt 4B")
                .city("Springfield")
                .state("IL")
                .zipCode("62701")
                .build();

        // Create the customer via POST request
        MvcResult postResult = mockMvc.perform(post("/api/v1/customers")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(customerDtoToSave)))
                .andExpect(status().isCreated())
                .andReturn();

        // Extract the created customer from the response
        String responseContent = postResult.getResponse().getContentAsString();
        CustomerDto createdCustomerDto = objectMapper.readValue(responseContent, CustomerDto.class);
        Integer customerId = createdCustomerDto.getId();

        // Create an updated customer DTO
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

        // Update the customer via PUT request
        mockMvc.perform(put("/api/v1/customers/" + customerId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(customerDtoToUpdate)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(customerId)))
                .andExpect(jsonPath("$.name", is("John Doe Updated")))
                .andExpect(jsonPath("$.email", is("john.updated@example.com")))
                .andExpect(jsonPath("$.addressLine2", is("Apt 5C")));

        // Delete the customer via DELETE request
        mockMvc.perform(delete("/api/v1/customers/" + customerId))
                .andExpect(status().isNoContent());

        // Verify the customer was deleted from the database
        assertThat(customerRepository.findById(customerId)).isEmpty();
    }

    @Test
    @Transactional
    @Rollback
    void testGetAllCustomers() throws Exception {
        // Clean up any existing customers to ensure a clean state
        customerRepository.deleteAll();

        // Create customer DTOs to save
        CustomerDto customer1 = CustomerDto.builder()
                .name("John Doe")
                .email("john.doe@example.com")
                .phoneNumber("555-123-4567")
                .addressLine1("123 Main St")
                .city("Springfield")
                .state("IL")
                .zipCode("62701")
                .build();

        CustomerDto customer2 = CustomerDto.builder()
                .name("Jane Smith")
                .email("jane.smith@example.com")
                .phoneNumber("555-987-6543")
                .addressLine1("456 Oak Ave")
                .city("Springfield")
                .state("IL")
                .zipCode("62702")
                .build();

        // Create the customers via POST requests and store the results
        MvcResult postResult1 = mockMvc.perform(post("/api/v1/customers")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(customer1)))
                .andExpect(status().isCreated())
                .andReturn();

        String responseContent1 = postResult1.getResponse().getContentAsString();
        System.out.println("[DEBUG_LOG] First customer created: " + responseContent1);

        MvcResult postResult2 = mockMvc.perform(post("/api/v1/customers")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(customer2)))
                .andExpect(status().isCreated())
                .andReturn();

        String responseContent2 = postResult2.getResponse().getContentAsString();
        System.out.println("[DEBUG_LOG] Second customer created: " + responseContent2);

        // Verify that the customers were saved to the database
        System.out.println("[DEBUG_LOG] Number of customers in database: " + customerRepository.count());

        // Get all customers via GET request
        MvcResult getResult = mockMvc.perform(get("/api/v1/customers")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andReturn();

        String getAllResponseContent = getResult.getResponse().getContentAsString();
        System.out.println("[DEBUG_LOG] Get all customers response: " + getAllResponseContent);

        // Now perform the assertions
        mockMvc.perform(get("/api/v1/customers")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(3))) // There are 3 customers: Default Customer + 2 we created
                .andExpect(jsonPath("$[0].name").exists())
                .andExpect(jsonPath("$[1].name").exists())
                .andExpect(jsonPath("$[2].name").exists());
    }

    @Test
    @Transactional
    @Rollback
    void testValidationErrors() throws Exception {
        // Create an invalid customer DTO
        CustomerDto invalidCustomerDto = CustomerDto.builder()
                .name("") // Invalid: empty name
                .email("invalid-email") // Invalid: not a valid email
                .phoneNumber("555-123-4567")
                .addressLine1("") // Invalid: empty address line 1
                .city("") // Invalid: empty city
                .state("") // Invalid: empty state
                .zipCode("") // Invalid: empty zip code
                .build();

        // Attempt to create the invalid customer via POST request
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
}
