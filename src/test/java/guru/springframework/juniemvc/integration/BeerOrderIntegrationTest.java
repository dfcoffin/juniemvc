package guru.springframework.juniemvc.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import guru.springframework.juniemvc.entities.Beer;
import guru.springframework.juniemvc.entities.OrderLineStatus;
import guru.springframework.juniemvc.entities.OrderStatus;
import guru.springframework.juniemvc.models.BeerOrderDto;
import guru.springframework.juniemvc.models.BeerOrderLineDto;
import guru.springframework.juniemvc.models.CustomerDto;
import guru.springframework.juniemvc.repositories.BeerOrderRepository;
import guru.springframework.juniemvc.repositories.BeerRepository;
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

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the Beer Order system.
 * Tests the complete flow from controller to repository and back.
 */
@SpringBootTest
@AutoConfigureMockMvc
class BeerOrderIntegrationTest {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    ObjectMapper objectMapper;

    @Autowired
    BeerRepository beerRepository;

    @Autowired
    BeerOrderRepository beerOrderRepository;

    private Beer testBeer;

    /**
     * Helper method to create a CustomerDto with a given name
     */
    private CustomerDto createTestCustomerDto(String name) {
        return CustomerDto.builder()
                .name(name)
                .email(name.toLowerCase().replace(' ', '.') + "@example.com")
                .phoneNumber("555-123-4567")
                .addressLine1("123 Test St")
                .city("Test City")
                .state("TS")
                .zipCode("12345")
                .build();
    }

    @BeforeEach
    void setUp() {
        // Clean up any existing test data
        beerOrderRepository.deleteAll();

        // Make sure we have a test beer in the database
        testBeer = beerRepository.findAll().stream()
                .findFirst()
                .orElseGet(() -> {
                    Beer beer = Beer.builder()
                            .beerName("Test Integration Beer")
                            .beerStyle("IPA")
                            .upc("123456789012")
                            .quantityOnHand(100)
                            .price(new BigDecimal("12.99"))
                            .build();
                    return beerRepository.save(beer);
                });
    }

    @Test
    @Transactional
    @Rollback
    void testCreateAndGetBeerOrder() throws Exception {
        // Create a beer order DTO to save
        BeerOrderLineDto lineDto = BeerOrderLineDto.builder()
                .beerId(testBeer.getId())
                .orderQuantity(10)
                .build();

        Set<BeerOrderLineDto> lineDtos = new HashSet<>();
        lineDtos.add(lineDto);

        CustomerDto testCustomerDto = createTestCustomerDto("Integration Test Customer");

        BeerOrderDto beerOrderDtoToSave = BeerOrderDto.builder()
                .customer(testCustomerDto)
                .paymentAmount(new BigDecimal("129.90"))
                .beerOrderLines(lineDtos)
                .build();

        // Create the beer order via POST request
        MvcResult postResult = mockMvc.perform(post("/api/v1/beerorder")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(beerOrderDtoToSave)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.customer.name", is("Integration Test Customer")))
                .andExpect(jsonPath("$.orderStatus", is("NEW")))
                .andReturn();

        // Extract the created beer order from the response
        String responseContent = postResult.getResponse().getContentAsString();
        BeerOrderDto createdBeerOrderDto = objectMapper.readValue(responseContent, BeerOrderDto.class);
        Integer orderId = createdBeerOrderDto.getId();

        // Verify the beer order was saved to the database
        assertThat(beerOrderRepository.findById(orderId)).isPresent();

        // Get the beer order via GET request
        mockMvc.perform(get("/api/v1/beerorder/" + orderId)
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id", is(orderId)))
                .andExpect(jsonPath("$.customer.name", is("Integration Test Customer")))
                .andExpect(jsonPath("$.orderStatus", is("NEW")))
                .andExpect(jsonPath("$.beerOrderLines", hasSize(1)))
                .andExpect(jsonPath("$.beerOrderLines[0].beerId", is(testBeer.getId())));
    }

    @Test
    @Transactional
    @Rollback
    void testCreateUpdateAndDeleteBeerOrder() throws Exception {
        // Create a beer order DTO to save
        BeerOrderLineDto lineDto = BeerOrderLineDto.builder()
                .beerId(testBeer.getId())
                .orderQuantity(10)
                .build();

        Set<BeerOrderLineDto> lineDtos = new HashSet<>();
        lineDtos.add(lineDto);

        CustomerDto testCustomerDto = createTestCustomerDto("Integration Test Customer");

        BeerOrderDto beerOrderDtoToSave = BeerOrderDto.builder()
                .customer(testCustomerDto)
                .paymentAmount(new BigDecimal("129.90"))
                .beerOrderLines(lineDtos)
                .build();

        // Create the beer order via POST request
        MvcResult postResult = mockMvc.perform(post("/api/v1/beerorder")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(beerOrderDtoToSave)))
                .andExpect(status().isCreated())
                .andReturn();

        // Extract the created beer order from the response
        String responseContent = postResult.getResponse().getContentAsString();
        BeerOrderDto createdBeerOrderDto = objectMapper.readValue(responseContent, BeerOrderDto.class);
        Integer orderId = createdBeerOrderDto.getId();

        // Create an updated beer order DTO
        BeerOrderLineDto updatedLineDto = BeerOrderLineDto.builder()
                .beerId(testBeer.getId())
                .orderQuantity(20)
                .lineStatus(OrderLineStatus.ALLOCATED)
                .build();

        Set<BeerOrderLineDto> updatedLineDtos = new HashSet<>();
        updatedLineDtos.add(updatedLineDto);

        CustomerDto updatedCustomerDto = createTestCustomerDto("Updated Integration Test Customer");

        BeerOrderDto beerOrderDtoToUpdate = BeerOrderDto.builder()
                .customer(updatedCustomerDto)
                .paymentAmount(new BigDecimal("259.80"))
                .orderStatus(OrderStatus.PROCESSING)
                .beerOrderLines(updatedLineDtos)
                .build();

        // Update the beer order via PUT request
        mockMvc.perform(put("/api/v1/beerorder/" + orderId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(beerOrderDtoToUpdate)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(orderId)))
                .andExpect(jsonPath("$.customer.name", is("Updated Integration Test Customer")))
                .andExpect(jsonPath("$.orderStatus", is("PROCESSING")))
                .andExpect(jsonPath("$.beerOrderLines", hasSize(1)))
                .andExpect(jsonPath("$.beerOrderLines[0].orderQuantity", is(20)));

        // Delete the beer order via DELETE request
        mockMvc.perform(delete("/api/v1/beerorder/" + orderId))
                .andExpect(status().isNoContent());

        // Verify the beer order was deleted from the database
        assertThat(beerOrderRepository.findById(orderId)).isEmpty();
    }

    @Test
    @Transactional
    @Rollback
    void testGetAllBeerOrders() throws Exception {
        // Create a beer order DTO to save
        BeerOrderLineDto lineDto = BeerOrderLineDto.builder()
                .beerId(testBeer.getId())
                .orderQuantity(10)
                .build();

        Set<BeerOrderLineDto> lineDtos = new HashSet<>();
        lineDtos.add(lineDto);

        CustomerDto testCustomerDto = createTestCustomerDto("Integration Test Customer");

        BeerOrderDto beerOrderDtoToSave = BeerOrderDto.builder()
                .customer(testCustomerDto)
                .paymentAmount(new BigDecimal("129.90"))
                .beerOrderLines(lineDtos)
                .build();

        // Create the beer order via POST request
        mockMvc.perform(post("/api/v1/beerorder")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(beerOrderDtoToSave)))
                .andExpect(status().isCreated());

        // Get all beer orders via GET request
        mockMvc.perform(get("/api/v1/beerorder")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].customer.name", is("Integration Test Customer")));
    }

    @Test
    @Transactional
    @Rollback
    void testValidationErrors() throws Exception {
        // Create an invalid beer order DTO
        CustomerDto invalidCustomerDto = CustomerDto.builder()
                .name("") // Invalid: empty name
                .addressLine1("") // Invalid: empty address line 1
                .city("") // Invalid: empty city
                .state("") // Invalid: empty state
                .zipCode("") // Invalid: empty zip code
                .build();

        BeerOrderDto invalidBeerOrderDto = BeerOrderDto.builder()
                .customer(invalidCustomerDto) // Invalid: customer with empty required fields
                .paymentAmount(new BigDecimal("-1.00")) // Invalid: negative payment amount
                .beerOrderLines(new HashSet<>()) // Invalid: empty beer order lines
                .build();

        // Attempt to create the invalid beer order via POST request
        mockMvc.perform(post("/api/v1/beerorder")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidBeerOrderDto)))
                .andExpect(status().isBadRequest())
                // Check that validation errors exist for all required fields
                .andExpect(jsonPath("$['customer.name']").exists())
                .andExpect(jsonPath("$['customer.addressLine1']").exists())
                .andExpect(jsonPath("$['customer.city']").exists())
                .andExpect(jsonPath("$['customer.state']").exists())
                .andExpect(jsonPath("$['customer.zipCode']").exists())
                .andExpect(jsonPath("$['paymentAmount']").exists())
                .andExpect(jsonPath("$['beerOrderLines']").exists());
    }
}
