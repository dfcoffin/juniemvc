package guru.springframework.juniemvc.mappers;

import guru.springframework.juniemvc.entities.BeerOrder;
import guru.springframework.juniemvc.entities.BeerOrderLine;
import guru.springframework.juniemvc.entities.Customer;
import guru.springframework.juniemvc.entities.OrderStatus;
import guru.springframework.juniemvc.models.BeerOrderDto;
import guru.springframework.juniemvc.models.BeerOrderLineDto;
import guru.springframework.juniemvc.models.CustomerDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

class BeerOrderMapperTest {

    private BeerOrderMapper beerOrderMapper;
    private BeerOrder beerOrder;
    private BeerOrderDto beerOrderDto;
    private Customer customer;
    private CustomerDto customerDto;

    @BeforeEach
    void setUp() {
        // Get the mapper instances
        beerOrderMapper = Mappers.getMapper(BeerOrderMapper.class);
        CustomerMapper customerMapper = Mappers.getMapper(CustomerMapper.class);
        BeerOrderLineMapper beerOrderLineMapper = Mappers.getMapper(BeerOrderLineMapper.class);

        // Set the dependencies using reflection
        BeerOrderMapperImpl mapperImpl = (BeerOrderMapperImpl) beerOrderMapper;
        try {
            java.lang.reflect.Field customerMapperField = BeerOrderMapperImpl.class.getDeclaredField("customerMapper");
            customerMapperField.setAccessible(true);
            customerMapperField.set(mapperImpl, customerMapper);

            java.lang.reflect.Field beerOrderLineMapperField = BeerOrderMapperImpl.class.getDeclaredField("beerOrderLineMapper");
            beerOrderLineMapperField.setAccessible(true);
            beerOrderLineMapperField.set(mapperImpl, beerOrderLineMapper);
        } catch (Exception e) {
            throw new RuntimeException("Failed to set mapper dependencies", e);
        }

        // Create a test Customer entity
        customer = Customer.builder()
                .name("Test Customer")
                .email("test@example.com")
                .build();
        customer.setId(1);
//        customer.setVersion(1);
//        customer.setCreateDate(LocalDateTime.now());
//        customer.setUpdateDate(LocalDateTime.now());

        // Create a test CustomerDto
        customerDto = CustomerDto.builder()
                .name("Test Customer DTO")
                .email("testdto@example.com")
                .build();
        customerDto.setId(2);
//        customerDto.setVersion(1);
//        customerDto.setCreateDate(LocalDateTime.now());
//        customerDto.setUpdateDate(LocalDateTime.now());

        // Create a test BeerOrderLine entity
        BeerOrderLine beerOrderLine = BeerOrderLine.builder()
                .orderQuantity(10)
                .quantityAllocated(5)
                .lineStatus(guru.springframework.juniemvc.entities.OrderLineStatus.NEW)
                .build();
        beerOrderLine.setId(1);
//        beerOrderLine.setVersion(1);
//        beerOrderLine.setCreateDate(LocalDateTime.now());
//        beerOrderLine.setUpdateDate(LocalDateTime.now());

        // Create a test BeerOrderLineDto
        BeerOrderLineDto beerOrderLineDto = BeerOrderLineDto.builder()
                .beerId(1)
                .beerName("Test Beer")
                .beerStyle("IPA")
                .upc("1234567890123")
                .price(new BigDecimal("12.99"))
                .orderQuantity(20)
                .quantityAllocated(10)
                .lineStatus(guru.springframework.juniemvc.entities.OrderLineStatus.ALLOCATED)
                .build();
        beerOrderLineDto.setId(2);
//        beerOrderLineDto.setVersion(1);
//        beerOrderLineDto.setCreateDate(LocalDateTime.now());
//        beerOrderLineDto.setUpdateDate(LocalDateTime.now());

        // Create a test BeerOrder entity
        beerOrder = BeerOrder.builder()
                .customer(customer)
                .paymentAmount(new BigDecimal("129.90"))
                .orderStatus(OrderStatus.NEW)
                .build();
        beerOrder.setId(1);
//        beerOrder.setVersion(1);
//        beerOrder.setCreateDate(LocalDateTime.now());
//        beerOrder.setUpdateDate(LocalDateTime.now());

        // Add beer order line to beer order
        Set<BeerOrderLine> beerOrderLines = new HashSet<>();
        beerOrderLines.add(beerOrderLine);
        beerOrder.setBeerOrderLines(beerOrderLines);
        beerOrderLine.setBeerOrder(beerOrder);

        // Create a test BeerOrderDto
        beerOrderDto = BeerOrderDto.builder()
                .customer(customerDto)
                .paymentAmount(new BigDecimal("99.90"))
                .orderStatus(OrderStatus.PENDING)
                .build();
        beerOrderDto.setId(2);
//        beerOrderDto.setVersion(1);
//        beerOrderDto.setCreateDate(LocalDateTime.now());
//        beerOrderDto.setUpdateDate(LocalDateTime.now());

        // Add beer order line dto to beer order dto
        Set<BeerOrderLineDto> beerOrderLineDtos = new HashSet<>();
        beerOrderLineDtos.add(beerOrderLineDto);
        beerOrderDto.setBeerOrderLines(beerOrderLineDtos);
    }

    @Test
    void testBeerOrderToBeerOrderDto() {
        // Convert BeerOrder to BeerOrderDto
        BeerOrderDto dto = beerOrderMapper.beerOrderToBeerOrderDto(beerOrder);

        // Verify the conversion
        assertThat(dto).isNotNull();
        assertThat(dto.getId()).isEqualTo(beerOrder.getId());
//        assertThat(dto.getVersion()).isEqualTo(beerOrder.getVersion());
        assertThat(dto.getPaymentAmount()).isEqualTo(beerOrder.getPaymentAmount());
        assertThat(dto.getOrderStatus()).isEqualTo(beerOrder.getOrderStatus());
//        assertThat(dto.getCreateDate()).isEqualTo(beerOrder.getCreateDate());
//        assertThat(dto.getUpdateDate()).isEqualTo(beerOrder.getUpdateDate());

        // Verify customer mapping
        assertThat(dto.getCustomer()).isNotNull();
        assertThat(dto.getCustomer().getId()).isEqualTo(customer.getId());
        assertThat(dto.getCustomer().getName()).isEqualTo(customer.getName());

        // Verify beer order lines mapping
        assertThat(dto.getBeerOrderLines()).isNotNull();
        assertThat(dto.getBeerOrderLines()).hasSize(1);
    }

    @Test
    void testBeerOrderDtoToBeerOrder() {
        // Convert BeerOrderDto to BeerOrder
        BeerOrder entity = beerOrderMapper.beerOrderDtoToBeerOrder(beerOrderDto);

        // Verify the conversion
        assertThat(entity).isNotNull();
        assertThat(entity.getPaymentAmount()).isEqualTo(beerOrderDto.getPaymentAmount());
        assertThat(entity.getOrderStatus()).isEqualTo(beerOrderDto.getOrderStatus());

        // Verify customer mapping
        assertThat(entity.getCustomer()).isNotNull();
        assertThat(entity.getCustomer().getId()).isEqualTo(customerDto.getId());
        assertThat(entity.getCustomer().getName()).isEqualTo(customerDto.getName());

        // beerOrderLines should be ignored in the mapping as specified in the mapper
        assertThat(entity.getBeerOrderLines()).isNotNull();
        assertThat(entity.getBeerOrderLines()).isEmpty();
    }

    @Test
    void testNullBeerOrder() {
        // Test null handling
        BeerOrderDto dto = beerOrderMapper.beerOrderToBeerOrderDto(null);
        assertThat(dto).isNull();
    }

    @Test
    void testNullBeerOrderDto() {
        // Test null handling
        BeerOrder entity = beerOrderMapper.beerOrderDtoToBeerOrder(null);
        assertThat(entity).isNull();
    }
}
