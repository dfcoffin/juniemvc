package guru.springframework.juniemvc.mappers;

import guru.springframework.juniemvc.entities.Beer;
import guru.springframework.juniemvc.models.BeerPatchDto;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.*;

class BeerMapperTest {

    private final BeerMapper beerMapper = Mappers.getMapper(BeerMapper.class);

    @Test
    void updateBeerFromPatchDto_ShouldUpdateOnlyNonNullFields() {
        // Given
        Beer beer = Beer.builder()
                .id(1)
                .beerName("Original Beer")
                .beerStyle("IPA")
                .upc("123456")
                .price(new BigDecimal("12.99"))
                .quantityOnHand(100)
                .description("Original description")
                .build();

        BeerPatchDto patchDto = BeerPatchDto.builder()
                .beerName("Updated Beer")
                .price(new BigDecimal("14.99"))
                .build();

        // When
        beerMapper.updateBeerFromPatchDto(patchDto, beer);

        // Then
        assertThat(beer.getId()).isEqualTo(1); // Should not change
        assertThat(beer.getBeerName()).isEqualTo("Updated Beer"); // Should be updated
        assertThat(beer.getBeerStyle()).isEqualTo("IPA"); // Should not change
        assertThat(beer.getUpc()).isEqualTo("123456"); // Should not change
        assertThat(beer.getPrice()).isEqualTo(new BigDecimal("14.99")); // Should be updated
        assertThat(beer.getQuantityOnHand()).isEqualTo(100); // Should not change
        assertThat(beer.getDescription()).isEqualTo("Original description"); // Should not change
    }
}