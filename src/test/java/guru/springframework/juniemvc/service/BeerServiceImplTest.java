package guru.springframework.juniemvc.service;

import guru.springframework.juniemvc.entities.Beer;
import guru.springframework.juniemvc.repositories.BeerRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class BeerServiceImplTest {

    @Mock
    BeerRepository beerRepository;

    @InjectMocks
    BeerServiceImpl beerService;

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
    void getAllBeers() {
        // given
        List<Beer> expectedBeers = Arrays.asList(testBeer);
        when(beerRepository.findAll()).thenReturn(expectedBeers);

        // when
        List<Beer> actualBeers = beerService.getAllBeers();

        // then
        assertThat(actualBeers).isEqualTo(expectedBeers);
        verify(beerRepository).findAll();
    }

    @Test
    void getBeerById() {
        // given
        when(beerRepository.findById(1)).thenReturn(Optional.of(testBeer));

        // when
        Optional<Beer> foundBeer = beerService.getBeerById(1);

        // then
        assertThat(foundBeer).isPresent();
        assertThat(foundBeer.get()).isEqualTo(testBeer);
        verify(beerRepository).findById(1);
    }

    @Test
    void getBeerByIdNotFound() {
        // given
        when(beerRepository.findById(999)).thenReturn(Optional.empty());

        // when
        Optional<Beer> foundBeer = beerService.getBeerById(999);

        // then
        assertThat(foundBeer).isEmpty();
        verify(beerRepository).findById(999);
    }

    @Test
    void saveBeer() {
        // given
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

        when(beerRepository.save(beerToSave)).thenReturn(savedBeer);

        // when
        Beer result = beerService.saveBeer(beerToSave);

        // then
        assertThat(result).isEqualTo(savedBeer);
        verify(beerRepository).save(beerToSave);
    }

    @Test
    void updateBeerById() {
        // given
        Beer beerToUpdate = Beer.builder()
                .beerName("Updated Beer")
                .beerStyle("Stout")
                .upc("789012")
                .quantityOnHand(75)
                .price(new BigDecimal("14.99"))
                .build();

        Beer existingBeer = Beer.builder()
                .id(1)
                .version(1)
                .beerName("Test Beer")
                .beerStyle("IPA")
                .upc("123456")
                .quantityOnHand(100)
                .price(new BigDecimal("12.99"))
                .build();

        Beer updatedBeer = Beer.builder()
                .id(1)
                .version(1)
                .beerName("Updated Beer")
                .beerStyle("Stout")
                .upc("789012")
                .quantityOnHand(75)
                .price(new BigDecimal("14.99"))
                .build();

        given(beerRepository.findById(1)).willReturn(Optional.of(existingBeer));
        given(beerRepository.save(any(Beer.class))).willReturn(updatedBeer);

        // when
        Optional<Beer> result = beerService.updateBeerById(1, beerToUpdate);

        // then
        assertThat(result).isPresent();
        assertThat(result.get()).isEqualTo(updatedBeer);
        verify(beerRepository).findById(1);
        verify(beerRepository).save(any(Beer.class));
    }

    @Test
    void updateBeerByIdNotFound() {
        // given
        Beer beerToUpdate = Beer.builder()
                .beerName("Updated Beer")
                .beerStyle("Stout")
                .upc("789012")
                .quantityOnHand(75)
                .price(new BigDecimal("14.99"))
                .build();

        given(beerRepository.findById(999)).willReturn(Optional.empty());

        // when
        Optional<Beer> result = beerService.updateBeerById(999, beerToUpdate);

        // then
        assertThat(result).isEmpty();
        verify(beerRepository).findById(999);
    }

    @Test
    void deleteBeerById() {
        // given
        given(beerRepository.existsById(1)).willReturn(true);

        // when
        boolean result = beerService.deleteBeerById(1);

        // then
        assertThat(result).isTrue();
        verify(beerRepository).existsById(1);
        verify(beerRepository).deleteById(1);
    }

    @Test
    void deleteBeerByIdNotFound() {
        // given
        given(beerRepository.existsById(999)).willReturn(false);

        // when
        boolean result = beerService.deleteBeerById(999);

        // then
        assertThat(result).isFalse();
        verify(beerRepository).existsById(999);
    }
}