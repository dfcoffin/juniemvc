package guru.springframework.juniemvc.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import guru.springframework.juniemvc.entities.OrderStatus;
import guru.springframework.juniemvc.models.BeerOrderDto;
import guru.springframework.juniemvc.models.BeerOrderLineDto;
import guru.springframework.juniemvc.models.CustomerDto;
import guru.springframework.juniemvc.service.BeerOrderService;
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

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Tests for the BeerOrderController.
 */
@SpringBootTest
@AutoConfigureMockMvc
class BeerOrderControllerTest {

    @TestConfiguration
    static class TestConfig {
        @Bean
        @Primary
        BeerOrderService beerOrderService() {
            return Mockito.mock(BeerOrderService.class);
        }
    }

    @Autowired
    MockMvc mockMvc;

    @Autowired
    ObjectMapper objectMapper;

    @Autowired
    BeerOrderService beerOrderService;

    BeerOrderDto testBeerOrderDto;
    BeerOrderLineDto testBeerOrderLineDto;

    @BeforeEach
    void setUp() {
        // Set up test beer order line DTO
        testBeerOrderLineDto = BeerOrderLineDto.builder()
                .id(1)
                .version(1)
                .beerId(1)
                .beerName("Test Beer")
                .beerStyle("IPA")
                .upc("123456789012")
                .price(new BigDecimal("12.99"))
                .orderQuantity(10)
                .quantityAllocated(5)
                .build();

        // Set up test customer DTO
        CustomerDto testCustomerDto = CustomerDto.builder()
                .id(1)
                .version(1)
                .name("Test Customer")
                .email("test@example.com")
                .phoneNumber("555-123-4567")
                .addressLine1("123 Test St")
                .city("Test City")
                .state("TS")
                .zipCode("12345")
                .build();

        // Set up test beer order DTO
        Set<BeerOrderLineDto> lineSet = new HashSet<>();
        lineSet.add(testBeerOrderLineDto);
        testBeerOrderDto = BeerOrderDto.builder()
                .id(1)
                .version(1)
                .customer(testCustomerDto)
                .paymentAmount(new BigDecimal("129.90"))
                .orderStatus(OrderStatus.NEW)
                .beerOrderLines(lineSet)
                .build();
    }

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

    @Test
    void getAllBeerOrders() throws Exception {
        given(beerOrderService.getAllBeerOrders()).willReturn(Arrays.asList(testBeerOrderDto));

        mockMvc.perform(get("/api/v1/beerorder")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id", is(1)))
                .andExpect(jsonPath("$[0].customer.name", is("Test Customer")));
    }

    @Test
    void getBeerOrderById() throws Exception {
        given(beerOrderService.getBeerOrderById(1)).willReturn(Optional.of(testBeerOrderDto));

        mockMvc.perform(get("/api/v1/beerorder/1")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.customer.name", is("Test Customer")))
                .andExpect(jsonPath("$.beerOrderLines", hasSize(1)))
                .andExpect(jsonPath("$.beerOrderLines[0].beerId", is(1)));
    }

    @Test
    void getBeerOrderByIdNotFound() throws Exception {
        given(beerOrderService.getBeerOrderById(999)).willReturn(Optional.empty());

        mockMvc.perform(get("/api/v1/beerorder/999")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    void createBeerOrder() throws Exception {
        // Create a beer order DTO to save
        BeerOrderLineDto lineDto = BeerOrderLineDto.builder()
                .beerId(1)
                .orderQuantity(10)
                .build();

        Set<BeerOrderLineDto> lineDtos = new HashSet<>();
        lineDtos.add(lineDto);

        CustomerDto customerDto = createTestCustomerDto("New Customer");

        BeerOrderDto beerOrderDtoToSave = BeerOrderDto.builder()
                .customer(customerDto)
                .paymentAmount(new BigDecimal("129.90"))
                .beerOrderLines(lineDtos)
                .build();

        // Create a saved beer order DTO
        BeerOrderDto savedBeerOrderDto = BeerOrderDto.builder()
                .id(2)
                .version(1)
                .customer(customerDto)
                .paymentAmount(new BigDecimal("129.90"))
                .orderStatus(OrderStatus.NEW)
                .beerOrderLines(lineDtos)
                .build();

        given(beerOrderService.saveBeerOrder(any(BeerOrderDto.class))).willReturn(savedBeerOrderDto);

        mockMvc.perform(post("/api/v1/beerorder")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(beerOrderDtoToSave)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", is(2)))
                .andExpect(jsonPath("$.customer.name", is("New Customer")))
                .andExpect(jsonPath("$.orderStatus", is("NEW")));
    }

    @Test
    void createBeerOrderWithValidationError() throws Exception {
        // Create an invalid customer DTO (missing required fields)
        CustomerDto invalidCustomerDto = CustomerDto.builder()
                .name("") // Invalid: empty name
                .email("invalid-email") // Invalid: not a valid email
                .build(); // Missing required fields: addressLine1, city, state, zipCode

        // Create an invalid beer order DTO
        BeerOrderDto invalidBeerOrderDto = BeerOrderDto.builder()
                .customer(invalidCustomerDto) // Invalid: customer with missing required fields
                .paymentAmount(new BigDecimal("-1.00")) // Invalid: negative payment amount
                .beerOrderLines(new HashSet<>()) // Invalid: empty beer order lines
                .build();

        mockMvc.perform(post("/api/v1/beerorder")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidBeerOrderDto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$['customer.name']").exists())
                .andExpect(jsonPath("$['customer.email']").exists())
                .andExpect(jsonPath("$['customer.addressLine1']").exists())
                .andExpect(jsonPath("$['customer.city']").exists())
                .andExpect(jsonPath("$['customer.state']").exists())
                .andExpect(jsonPath("$['customer.zipCode']").exists())
                .andExpect(jsonPath("$['paymentAmount']").exists())
                .andExpect(jsonPath("$['beerOrderLines']").exists());
    }

    @Test
    void updateBeerOrder() throws Exception {
        // Create a beer order DTO to update
        BeerOrderLineDto lineDto = BeerOrderLineDto.builder()
                .beerId(1)
                .orderQuantity(20)
                .build();

        Set<BeerOrderLineDto> lineDtos = new HashSet<>();
        lineDtos.add(lineDto);

        CustomerDto customerDto = createTestCustomerDto("Updated Customer");

        BeerOrderDto beerOrderDtoToUpdate = BeerOrderDto.builder()
                .customer(customerDto)
                .paymentAmount(new BigDecimal("259.80"))
                .orderStatus(OrderStatus.PROCESSING)
                .beerOrderLines(lineDtos)
                .build();

        // Create an updated beer order DTO
        BeerOrderDto updatedBeerOrderDto = BeerOrderDto.builder()
                .id(1)
                .version(2)
                .customer(customerDto)
                .paymentAmount(new BigDecimal("259.80"))
                .orderStatus(OrderStatus.PROCESSING)
                .beerOrderLines(lineDtos)
                .build();

        given(beerOrderService.updateBeerOrderById(anyInt(), any(BeerOrderDto.class))).willReturn(Optional.of(updatedBeerOrderDto));

        mockMvc.perform(put("/api/v1/beerorder/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(beerOrderDtoToUpdate)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.version", is(2)))
                .andExpect(jsonPath("$.customer.name", is("Updated Customer")))
                .andExpect(jsonPath("$.orderStatus", is("PROCESSING")));

        verify(beerOrderService).updateBeerOrderById(eq(1), any(BeerOrderDto.class));
    }

    @Test
    void updateBeerOrderWithValidationError() throws Exception {
        // Create an invalid customer DTO (missing required fields)
        CustomerDto invalidCustomerDto = CustomerDto.builder()
                .name("") // Invalid: empty name
                .email("invalid-email") // Invalid: not a valid email
                .build(); // Missing required fields: addressLine1, city, state, zipCode

        // Create an invalid beer order DTO
        BeerOrderDto invalidBeerOrderDto = BeerOrderDto.builder()
                .customer(invalidCustomerDto) // Invalid: customer with missing required fields
                .paymentAmount(new BigDecimal("-1.00")) // Invalid: negative payment amount
                .beerOrderLines(new HashSet<>()) // Invalid: empty beer order lines
                .build();

        mockMvc.perform(put("/api/v1/beerorder/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidBeerOrderDto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$['customer.name']").exists())
                .andExpect(jsonPath("$['customer.email']").exists())
                .andExpect(jsonPath("$['customer.addressLine1']").exists())
                .andExpect(jsonPath("$['customer.city']").exists())
                .andExpect(jsonPath("$['customer.state']").exists())
                .andExpect(jsonPath("$['customer.zipCode']").exists())
                .andExpect(jsonPath("$['paymentAmount']").exists())
                .andExpect(jsonPath("$['beerOrderLines']").exists());
    }

    @Test
    void updateBeerOrderNotFound() throws Exception {
        // Create a beer order DTO to update
        BeerOrderLineDto lineDto = BeerOrderLineDto.builder()
                .beerId(1)
                .orderQuantity(20)
                .build();

        Set<BeerOrderLineDto> lineDtos = new HashSet<>();
        lineDtos.add(lineDto);

        CustomerDto customerDto = createTestCustomerDto("Updated Customer");

        BeerOrderDto beerOrderDtoToUpdate = BeerOrderDto.builder()
                .customer(customerDto)
                .paymentAmount(new BigDecimal("259.80"))
                .orderStatus(OrderStatus.PROCESSING)
                .beerOrderLines(lineDtos)
                .build();

        given(beerOrderService.updateBeerOrderById(anyInt(), any(BeerOrderDto.class))).willReturn(Optional.empty());

        mockMvc.perform(put("/api/v1/beerorder/999")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(beerOrderDtoToUpdate)))
                .andExpect(status().isNotFound());

        verify(beerOrderService).updateBeerOrderById(eq(999), any(BeerOrderDto.class));
    }

    @Test
    void deleteBeerOrder() throws Exception {
        given(beerOrderService.deleteBeerOrderById(1)).willReturn(true);

        mockMvc.perform(delete("/api/v1/beerorder/1"))
                .andExpect(status().isNoContent());

        verify(beerOrderService).deleteBeerOrderById(1);
    }

    @Test
    void deleteBeerOrderNotFound() throws Exception {
        given(beerOrderService.deleteBeerOrderById(999)).willReturn(false);

        mockMvc.perform(delete("/api/v1/beerorder/999"))
                .andExpect(status().isNotFound());

        verify(beerOrderService).deleteBeerOrderById(999);
    }
}
