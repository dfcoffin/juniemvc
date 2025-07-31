package guru.springframework.juniemvc.service;

import guru.springframework.juniemvc.entities.BeerOrder;
import guru.springframework.juniemvc.entities.BeerOrderLine;
import guru.springframework.juniemvc.entities.Customer;
import guru.springframework.juniemvc.entities.OrderLineStatus;
import guru.springframework.juniemvc.entities.OrderStatus;
import guru.springframework.juniemvc.mappers.BeerOrderLineMapper;
import guru.springframework.juniemvc.mappers.BeerOrderMapper;
import guru.springframework.juniemvc.mappers.CustomerMapper;
import guru.springframework.juniemvc.models.BeerOrderDto;
import guru.springframework.juniemvc.models.BeerOrderLineDto;
import guru.springframework.juniemvc.models.CustomerDto;
import guru.springframework.juniemvc.repositories.BeerOrderRepository;
import guru.springframework.juniemvc.repositories.BeerRepository;
import guru.springframework.juniemvc.repositories.CustomerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Implementation of the BeerOrderService interface.
 */
@Service
@Transactional
public class BeerOrderServiceImpl implements BeerOrderService {

    private final BeerOrderRepository beerOrderRepository;
    private final BeerRepository beerRepository;
    private final CustomerRepository customerRepository;
    private final BeerOrderMapper beerOrderMapper;
    private final BeerOrderLineMapper beerOrderLineMapper;
    private final CustomerMapper customerMapper;

    /**
     * Constructor for dependency injection.
     *
     * @param beerOrderRepository Repository for beer orders
     * @param beerRepository Repository for beers
     * @param customerRepository Repository for customers
     * @param beerOrderMapper Mapper for beer orders
     * @param beerOrderLineMapper Mapper for beer order lines
     * @param customerMapper Mapper for customers
     */
    public BeerOrderServiceImpl(BeerOrderRepository beerOrderRepository,
                               BeerRepository beerRepository,
                               CustomerRepository customerRepository,
                               BeerOrderMapper beerOrderMapper,
                               BeerOrderLineMapper beerOrderLineMapper,
                               CustomerMapper customerMapper) {
        this.beerOrderRepository = beerOrderRepository;
        this.beerRepository = beerRepository;
        this.customerRepository = customerRepository;
        this.beerOrderMapper = beerOrderMapper;
        this.beerOrderLineMapper = beerOrderLineMapper;
        this.customerMapper = customerMapper;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional(readOnly = true)
    public List<BeerOrderDto> getAllBeerOrders() {
        return beerOrderRepository.findAll().stream()
                .map(beerOrderMapper::beerOrderToBeerOrderDto)
                .collect(Collectors.toList());
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<BeerOrderDto> getBeerOrderById(Integer id) {
        return beerOrderRepository.findById(id)
                .map(beerOrderMapper::beerOrderToBeerOrderDto);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public BeerOrderDto saveBeerOrder(BeerOrderDto beerOrderDto) {
        // Set initial status for new orders
        if (beerOrderDto.getOrderStatus() == null) {
            beerOrderDto.setOrderStatus(OrderStatus.NEW);
        }

        // Save the customer first
        CustomerDto customerDto = beerOrderDto.getCustomer();
        if (customerDto != null) {
            Customer customer = customerMapper.customerDtoToCustomer(customerDto);
            customer = customerRepository.save(customer);

            // Convert DTO to entity
            BeerOrder beerOrder = beerOrderMapper.beerOrderDtoToBeerOrder(beerOrderDto);

            // Set the saved customer
            beerOrder.setCustomer(customer);

            // Process each line item
            if (beerOrderDto.getBeerOrderLines() != null) {
                beerOrderDto.getBeerOrderLines().forEach(lineDto -> {
                    // Set initial status for new line items
                    if (lineDto.getLineStatus() == null) {
                        lineDto.setLineStatus(OrderLineStatus.NEW);
                    }

                    // Convert line DTO to entity
                    BeerOrderLine line = beerOrderLineMapper.beerOrderLineDtoToBeerOrderLine(lineDto);

                    // Set beer reference
                    beerRepository.findById(lineDto.getBeerId())
                        .ifPresent(line::setBeer);

                    // Add line to order
                    beerOrder.addBeerOrderLine(line);
                });
            }

            // Save order
            BeerOrder savedBeerOrder = beerOrderRepository.save(beerOrder);

            // Convert back to DTO
            return beerOrderMapper.beerOrderToBeerOrderDto(savedBeerOrder);
        } else {
            throw new IllegalArgumentException("Customer is required");
        }
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Optional<BeerOrderDto> updateBeerOrderById(Integer id, BeerOrderDto beerOrderDto) {
        return beerOrderRepository.findById(id)
                .map(existingOrder -> {
                    // Save the customer first
                    CustomerDto customerDto = beerOrderDto.getCustomer();
                    if (customerDto != null) {
                        Customer customer = customerMapper.customerDtoToCustomer(customerDto);
                        customer = customerRepository.save(customer);

                        // Update basic fields
                        existingOrder.setCustomer(customer);
                        existingOrder.setPaymentAmount(beerOrderDto.getPaymentAmount());
                        existingOrder.setOrderStatus(beerOrderDto.getOrderStatus());

                        // Clear existing lines and add new ones
                        existingOrder.getBeerOrderLines().clear();

                        if (beerOrderDto.getBeerOrderLines() != null) {
                            beerOrderDto.getBeerOrderLines().forEach(lineDto -> {
                                BeerOrderLine line = beerOrderLineMapper.beerOrderLineDtoToBeerOrderLine(lineDto);

                                beerRepository.findById(lineDto.getBeerId())
                                    .ifPresent(line::setBeer);

                                existingOrder.addBeerOrderLine(line);
                            });
                        }

                        return beerOrderRepository.save(existingOrder);
                    } else {
                        throw new IllegalArgumentException("Customer is required");
                    }
                })
                .map(beerOrderMapper::beerOrderToBeerOrderDto);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public boolean deleteBeerOrderById(Integer id) {
        if (beerOrderRepository.existsById(id)) {
            beerOrderRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
