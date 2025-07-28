package guru.springframework.juniemvc.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import guru.springframework.juniemvc.entities.Beer;
import guru.springframework.juniemvc.service.BeerService;
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
class BeerControllerTest {

    @TestConfiguration
    static class TestConfig {
        @Bean
        @Primary
        BeerService beerService() {
            return Mockito.mock(BeerService.class);
        }
    }

    @Autowired
    MockMvc mockMvc;

    @Autowired
    ObjectMapper objectMapper;

    @Autowired
    BeerService beerService;

    Beer testBeer;

    @BeforeEach
    void setUp() {
        testBeer = Beer.builder()
                .id(1)
                .version(1)
                .beerName("Test Beer")
                .beerStyle("IPA")
                .upc("123456")
                .quantityOnHand(100)
                .price(new BigDecimal("12.99"))
                .build();
    }

    @Test
    void getAllBeers() throws Exception {
        given(beerService.getAllBeers()).willReturn(Arrays.asList(testBeer));

        mockMvc.perform(get("/api/v1/beer")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id", is(1)))
                .andExpect(jsonPath("$[0].beerName", is("Test Beer")));
    }

    @Test
    void getBeerById() throws Exception {
        given(beerService.getBeerById(1)).willReturn(Optional.of(testBeer));

        mockMvc.perform(get("/api/v1/beer/1")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.beerName", is("Test Beer")));
    }

    @Test
    void getBeerByIdNotFound() throws Exception {
        given(beerService.getBeerById(1)).willReturn(Optional.empty());

        mockMvc.perform(get("/api/v1/beer/1")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Autowired
    private org.springframework.web.context.WebApplicationContext webApplicationContext;

    @Test
    void debugTest() {
        System.out.println("[DEBUG_LOG] Test is running");
        System.out.println("[DEBUG_LOG] MockMvc: " + mockMvc);
        System.out.println("[DEBUG_LOG] BeerService: " + beerService);

        // Print all bean names in the application context
        String[] beanNames = webApplicationContext.getBeanDefinitionNames();
        System.out.println("[DEBUG_LOG] Bean count: " + beanNames.length);
        for (String beanName : beanNames) {
            System.out.println("[DEBUG_LOG] Bean: " + beanName);
        }
    }

    @Test
    void createBeer() throws Exception {
        Beer beerToSave = Beer.builder()
                .beerName("New Beer")
                .beerStyle("Lager")
                .upc("654321")
                .quantityOnHand(50)
                .price(new BigDecimal("9.99"))
                .build();

        Beer savedBeer = Beer.builder()
                .id(2)
                .version(1)
                .beerName("New Beer")
                .beerStyle("Lager")
                .upc("654321")
                .quantityOnHand(50)
                .price(new BigDecimal("9.99"))
                .build();

        given(beerService.saveBeer(any(Beer.class))).willReturn(savedBeer);

        mockMvc.perform(post("/api/v1/beer")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(beerToSave)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", is(2)))
                .andExpect(jsonPath("$.beerName", is("New Beer")));
    }

    @Test
    void updateBeer() throws Exception {
        Beer beerToUpdate = Beer.builder()
                .beerName("Updated Beer")
                .beerStyle("Stout")
                .upc("789012")
                .quantityOnHand(75)
                .price(new BigDecimal("14.99"))
                .build();

        Beer updatedBeer = Beer.builder()
                .id(1)
                .version(2)
                .beerName("Updated Beer")
                .beerStyle("Stout")
                .upc("789012")
                .quantityOnHand(75)
                .price(new BigDecimal("14.99"))
                .build();

        given(beerService.updateBeerById(anyInt(), any(Beer.class))).willReturn(Optional.of(updatedBeer));

        mockMvc.perform(put("/api/v1/beer/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(beerToUpdate)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.version", is(2)))
                .andExpect(jsonPath("$.beerName", is("Updated Beer")))
                .andExpect(jsonPath("$.beerStyle", is("Stout")));

        verify(beerService).updateBeerById(eq(1), any(Beer.class));
    }

    @Test
    void updateBeerNotFound() throws Exception {
        Beer beerToUpdate = Beer.builder()
                .beerName("Updated Beer")
                .beerStyle("Stout")
                .upc("789012")
                .quantityOnHand(75)
                .price(new BigDecimal("14.99"))
                .build();

        given(beerService.updateBeerById(anyInt(), any(Beer.class))).willReturn(Optional.empty());

        mockMvc.perform(put("/api/v1/beer/999")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(beerToUpdate)))
                .andExpect(status().isNotFound());

        verify(beerService).updateBeerById(eq(999), any(Beer.class));
    }

    @Test
    void deleteBeer() throws Exception {
        given(beerService.deleteBeerById(1)).willReturn(true);

        mockMvc.perform(delete("/api/v1/beer/1"))
                .andExpect(status().isNoContent());

        verify(beerService).deleteBeerById(1);
    }

    @Test
    void deleteBeerNotFound() throws Exception {
        given(beerService.deleteBeerById(999)).willReturn(false);

        mockMvc.perform(delete("/api/v1/beer/999"))
                .andExpect(status().isNotFound());

        verify(beerService).deleteBeerById(999);
    }
}
