package guru.springframework.juniemvc.service;

import guru.springframework.juniemvc.entities.Beer;
import guru.springframework.juniemvc.entities.BeerOrder;
import guru.springframework.juniemvc.entities.BeerOrderLine;
import guru.springframework.juniemvc.entities.OrderLineStatus;
import guru.springframework.juniemvc.entities.OrderStatus;
import guru.springframework.juniemvc.mappers.BeerOrderLineMapper;
import guru.springframework.juniemvc.mappers.BeerOrderMapper;
import guru.springframework.juniemvc.models.BeerOrderDto;
import guru.springframework.juniemvc.models.BeerOrderLineDto;
import guru.springframework.juniemvc.repositories.BeerOrderRepository;
import guru.springframework.juniemvc.repositories.BeerRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * Tests for the BeerOrderServiceImpl class.
 */
@ExtendWith(MockitoExtension.class)
class BeerOrderServiceImplTest {

    @Mock
    BeerOrderRepository beerOrderRepository;

    @Mock
    BeerRepository beerRepository;

    @Mock
    BeerOrderMapper beerOrderMapper;

    @Mock
    BeerOrderLineMapper beerOrderLineMapper;

    @InjectMocks
    BeerOrderServiceImpl beerOrderService;

    private Beer testBeer;
    private BeerOrder testBeerOrder;
    private BeerOrderLine testBeerOrderLine;
    private BeerOrderDto testBeerOrderDto;
    private BeerOrderLineDto testBeerOrderLineDto;

    @BeforeEach
    void setUp() {
        // Set up test beer
        testBeer = Beer.builder()
                .beerName("Test Beer")
                .beerStyle("IPA")
                .upc("123456789012")
                .quantityOnHand(100)
                .price(new BigDecimal("12.99"))
                .build();
        testBeer.setId(1);
        testBeer.setVersion(1);

        // Set up test beer order line
        testBeerOrderLine = BeerOrderLine.builder()
                .beer(testBeer)
                .orderQuantity(10)
                .quantityAllocated(5)
                .lineStatus(OrderLineStatus.NEW)
                .build();
        testBeerOrderLine.setId(1);
        testBeerOrderLine.setVersion(1);

        // Set up test beer order
        testBeerOrder = BeerOrder.builder()
                .customerRef("Test Customer")
                .paymentAmount(new BigDecimal("129.90"))
                .orderStatus(OrderStatus.NEW)
                .build();
        testBeerOrder.setId(1);
        testBeerOrder.setVersion(1);
        testBeerOrder.addBeerOrderLine(testBeerOrderLine);

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
                .lineStatus(OrderLineStatus.NEW)
                .build();

        // Set up test beer order DTO
        Set<BeerOrderLineDto> lineSet = new HashSet<>();
        lineSet.add(testBeerOrderLineDto);
        testBeerOrderDto = BeerOrderDto.builder()
                .id(1)
                .version(1)
                .customerRef("Test Customer")
                .paymentAmount(new BigDecimal("129.90"))
                .orderStatus(OrderStatus.NEW)
                .beerOrderLines(lineSet)
                .build();
    }

    @Test
    void getAllBeerOrders() {
        // given
        List<BeerOrder> expectedBeerOrders = Arrays.asList(testBeerOrder);
        when(beerOrderRepository.findAll()).thenReturn(expectedBeerOrders);
        when(beerOrderMapper.beerOrderToBeerOrderDto(testBeerOrder)).thenReturn(testBeerOrderDto);

        // when
        List<BeerOrderDto> actualBeerOrders = beerOrderService.getAllBeerOrders();

        // then
        assertThat(actualBeerOrders).hasSize(1);
        assertThat(actualBeerOrders.get(0)).isEqualTo(testBeerOrderDto);
        verify(beerOrderRepository).findAll();
        verify(beerOrderMapper).beerOrderToBeerOrderDto(testBeerOrder);
    }

    @Test
    void getBeerOrderById() {
        // given
        when(beerOrderRepository.findById(1)).thenReturn(Optional.of(testBeerOrder));
        when(beerOrderMapper.beerOrderToBeerOrderDto(testBeerOrder)).thenReturn(testBeerOrderDto);

        // when
        Optional<BeerOrderDto> foundBeerOrder = beerOrderService.getBeerOrderById(1);

        // then
        assertThat(foundBeerOrder).isPresent();
        assertThat(foundBeerOrder.get()).isEqualTo(testBeerOrderDto);
        verify(beerOrderRepository).findById(1);
        verify(beerOrderMapper).beerOrderToBeerOrderDto(testBeerOrder);
    }

    @Test
    void getBeerOrderByIdNotFound() {
        // given
        when(beerOrderRepository.findById(999)).thenReturn(Optional.empty());

        // when
        Optional<BeerOrderDto> foundBeerOrder = beerOrderService.getBeerOrderById(999);

        // then
        assertThat(foundBeerOrder).isEmpty();
        verify(beerOrderRepository).findById(999);
    }

    @Test
    void saveBeerOrder() {
        // given
        BeerOrderLineDto lineDto = BeerOrderLineDto.builder()
                .beerId(1)
                .orderQuantity(10)
                .build();

        Set<BeerOrderLineDto> lineDtos = new HashSet<>();
        lineDtos.add(lineDto);

        BeerOrderDto beerOrderDtoToSave = BeerOrderDto.builder()
                .customerRef("New Customer")
                .paymentAmount(new BigDecimal("129.90"))
                .beerOrderLines(lineDtos)
                .build();

        BeerOrderLine beerOrderLine = BeerOrderLine.builder()
                .orderQuantity(10)
                .build();

        BeerOrder beerOrderToSave = BeerOrder.builder()
                .customerRef("New Customer")
                .paymentAmount(new BigDecimal("129.90"))
                .build();

        BeerOrder savedBeerOrder = BeerOrder.builder()
                .customerRef("New Customer")
                .paymentAmount(new BigDecimal("129.90"))
                .orderStatus(OrderStatus.NEW)
                .build();
        savedBeerOrder.setId(2);
        savedBeerOrder.setVersion(1);
        savedBeerOrder.addBeerOrderLine(beerOrderLine);

        BeerOrderDto savedBeerOrderDto = BeerOrderDto.builder()
                .id(2)
                .version(1)
                .customerRef("New Customer")
                .paymentAmount(new BigDecimal("129.90"))
                .orderStatus(OrderStatus.NEW)
                .beerOrderLines(lineDtos)
                .build();

        when(beerOrderMapper.beerOrderDtoToBeerOrder(beerOrderDtoToSave)).thenReturn(beerOrderToSave);
        when(beerOrderLineMapper.beerOrderLineDtoToBeerOrderLine(lineDto)).thenReturn(beerOrderLine);
        when(beerRepository.findById(1)).thenReturn(Optional.of(testBeer));
        when(beerOrderRepository.save(any(BeerOrder.class))).thenReturn(savedBeerOrder);
        when(beerOrderMapper.beerOrderToBeerOrderDto(savedBeerOrder)).thenReturn(savedBeerOrderDto);

        // when
        BeerOrderDto result = beerOrderService.saveBeerOrder(beerOrderDtoToSave);

        // then
        assertThat(result).isEqualTo(savedBeerOrderDto);
        verify(beerOrderMapper).beerOrderDtoToBeerOrder(beerOrderDtoToSave);
        verify(beerOrderLineMapper).beerOrderLineDtoToBeerOrderLine(lineDto);
        verify(beerRepository).findById(1);
        verify(beerOrderRepository).save(any(BeerOrder.class));
        verify(beerOrderMapper).beerOrderToBeerOrderDto(savedBeerOrder);
    }

    @Test
    void saveBeerOrderWithNullStatus() {
        // given
        BeerOrderLineDto lineDto = BeerOrderLineDto.builder()
                .beerId(1)
                .orderQuantity(10)
                .build();

        Set<BeerOrderLineDto> lineDtos = new HashSet<>();
        lineDtos.add(lineDto);

        BeerOrderDto beerOrderDtoToSave = BeerOrderDto.builder()
                .customerRef("New Customer")
                .paymentAmount(new BigDecimal("129.90"))
                .orderStatus(null) // Explicitly set to null to test default behavior
                .beerOrderLines(lineDtos)
                .build();

        BeerOrderLine beerOrderLine = BeerOrderLine.builder()
                .orderQuantity(10)
                .build();

        BeerOrder beerOrderToSave = BeerOrder.builder()
                .customerRef("New Customer")
                .paymentAmount(new BigDecimal("129.90"))
                .build();

        BeerOrder savedBeerOrder = BeerOrder.builder()
                .customerRef("New Customer")
                .paymentAmount(new BigDecimal("129.90"))
                .orderStatus(OrderStatus.NEW)
                .build();
        savedBeerOrder.setId(2);
        savedBeerOrder.setVersion(1);
        savedBeerOrder.addBeerOrderLine(beerOrderLine);

        BeerOrderDto savedBeerOrderDto = BeerOrderDto.builder()
                .id(2)
                .version(1)
                .customerRef("New Customer")
                .paymentAmount(new BigDecimal("129.90"))
                .orderStatus(OrderStatus.NEW)
                .beerOrderLines(lineDtos)
                .build();

        when(beerOrderMapper.beerOrderDtoToBeerOrder(any(BeerOrderDto.class))).thenReturn(beerOrderToSave);
        when(beerOrderLineMapper.beerOrderLineDtoToBeerOrderLine(lineDto)).thenReturn(beerOrderLine);
        when(beerRepository.findById(1)).thenReturn(Optional.of(testBeer));
        when(beerOrderRepository.save(any(BeerOrder.class))).thenReturn(savedBeerOrder);
        when(beerOrderMapper.beerOrderToBeerOrderDto(savedBeerOrder)).thenReturn(savedBeerOrderDto);

        // when
        BeerOrderDto result = beerOrderService.saveBeerOrder(beerOrderDtoToSave);

        // then
        assertThat(result.getOrderStatus()).isEqualTo(OrderStatus.NEW);
        verify(beerOrderRepository).save(any(BeerOrder.class));
    }

    @Test
    void updateBeerOrderById() {
        // given
        BeerOrderLineDto lineDto = BeerOrderLineDto.builder()
                .beerId(1)
                .orderQuantity(20)
                .build();

        Set<BeerOrderLineDto> lineDtos = new HashSet<>();
        lineDtos.add(lineDto);

        BeerOrderDto beerOrderDtoToUpdate = BeerOrderDto.builder()
                .customerRef("Updated Customer")
                .paymentAmount(new BigDecimal("259.80"))
                .orderStatus(OrderStatus.PROCESSING)
                .beerOrderLines(lineDtos)
                .build();

        BeerOrderLine updatedBeerOrderLine = BeerOrderLine.builder()
                .orderQuantity(20)
                .build();

        BeerOrder existingBeerOrder = BeerOrder.builder()
                .customerRef("Test Customer")
                .paymentAmount(new BigDecimal("129.90"))
                .orderStatus(OrderStatus.NEW)
                .build();
        existingBeerOrder.setId(1);
        existingBeerOrder.setVersion(1);
        existingBeerOrder.addBeerOrderLine(testBeerOrderLine);

        BeerOrder updatedBeerOrder = BeerOrder.builder()
                .customerRef("Updated Customer")
                .paymentAmount(new BigDecimal("259.80"))
                .orderStatus(OrderStatus.PROCESSING)
                .build();
        updatedBeerOrder.setId(1);
        updatedBeerOrder.setVersion(1);
        updatedBeerOrder.addBeerOrderLine(updatedBeerOrderLine);

        BeerOrderDto updatedBeerOrderDto = BeerOrderDto.builder()
                .id(1)
                .version(1)
                .customerRef("Updated Customer")
                .paymentAmount(new BigDecimal("259.80"))
                .orderStatus(OrderStatus.PROCESSING)
                .beerOrderLines(lineDtos)
                .build();

        when(beerOrderRepository.findById(1)).thenReturn(Optional.of(existingBeerOrder));
        when(beerOrderLineMapper.beerOrderLineDtoToBeerOrderLine(lineDto)).thenReturn(updatedBeerOrderLine);
        when(beerRepository.findById(1)).thenReturn(Optional.of(testBeer));
        when(beerOrderRepository.save(any(BeerOrder.class))).thenReturn(updatedBeerOrder);
        when(beerOrderMapper.beerOrderToBeerOrderDto(updatedBeerOrder)).thenReturn(updatedBeerOrderDto);

        // when
        Optional<BeerOrderDto> result = beerOrderService.updateBeerOrderById(1, beerOrderDtoToUpdate);

        // then
        assertThat(result).isPresent();
        assertThat(result.get()).isEqualTo(updatedBeerOrderDto);
        verify(beerOrderRepository).findById(1);
        verify(beerOrderLineMapper).beerOrderLineDtoToBeerOrderLine(lineDto);
        verify(beerRepository).findById(1);
        verify(beerOrderRepository).save(any(BeerOrder.class));
        verify(beerOrderMapper).beerOrderToBeerOrderDto(updatedBeerOrder);
    }

    @Test
    void updateBeerOrderByIdNotFound() {
        // given
        BeerOrderDto beerOrderDtoToUpdate = BeerOrderDto.builder()
                .customerRef("Updated Customer")
                .paymentAmount(new BigDecimal("259.80"))
                .orderStatus(OrderStatus.PROCESSING)
                .build();

        when(beerOrderRepository.findById(999)).thenReturn(Optional.empty());

        // when
        Optional<BeerOrderDto> result = beerOrderService.updateBeerOrderById(999, beerOrderDtoToUpdate);

        // then
        assertThat(result).isEmpty();
        verify(beerOrderRepository).findById(999);
    }

    @Test
    void deleteBeerOrderById() {
        // given
        when(beerOrderRepository.existsById(1)).thenReturn(true);

        // when
        boolean result = beerOrderService.deleteBeerOrderById(1);

        // then
        assertThat(result).isTrue();
        verify(beerOrderRepository).existsById(1);
        verify(beerOrderRepository).deleteById(1);
    }

    @Test
    void deleteBeerOrderByIdNotFound() {
        // given
        when(beerOrderRepository.existsById(999)).thenReturn(false);

        // when
        boolean result = beerOrderService.deleteBeerOrderById(999);

        // then
        assertThat(result).isFalse();
        verify(beerOrderRepository).existsById(999);
    }
}
