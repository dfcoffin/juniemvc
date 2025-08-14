package guru.springframework.juniemvc.services;

import guru.springframework.juniemvc.entities.BeerOrder;
import guru.springframework.juniemvc.entities.BeerOrderShipment;
import guru.springframework.juniemvc.exceptions.NotFoundException;
import guru.springframework.juniemvc.mappers.BeerOrderShipmentMapper;
import guru.springframework.juniemvc.models.BeerOrderShipmentDto;
import guru.springframework.juniemvc.repositories.BeerOrderRepository;
import guru.springframework.juniemvc.repositories.BeerOrderShipmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementation of BeerOrderShipmentService
 */
@Service
@RequiredArgsConstructor
public class BeerOrderShipmentServiceImpl implements BeerOrderShipmentService {

    private final BeerOrderRepository beerOrderRepository;
    private final BeerOrderShipmentRepository beerOrderShipmentRepository;
    private final BeerOrderShipmentMapper beerOrderShipmentMapper;

    @Override
    @Transactional(readOnly = true)
    public List<BeerOrderShipmentDto> getAllShipments(Integer beerOrderId) {
        return beerOrderShipmentRepository.findByBeerOrderId(beerOrderId)
                .stream()
                .map(beerOrderShipmentMapper::beerOrderShipmentToBeerOrderShipmentDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public BeerOrderShipmentDto getShipmentById(Integer beerOrderId, Integer shipmentId) {
        BeerOrderShipment shipment = getShipmentEntity(beerOrderId, shipmentId);
        return beerOrderShipmentMapper.beerOrderShipmentToBeerOrderShipmentDto(shipment);
    }

    @Override
    @Transactional
    public BeerOrderShipmentDto createShipment(Integer beerOrderId, BeerOrderShipmentDto shipmentDto) {
        BeerOrder beerOrder = beerOrderRepository.findById(beerOrderId)
                .orElseThrow(() -> new NotFoundException("Beer Order not found with id: " + beerOrderId));

        BeerOrderShipment shipment = beerOrderShipmentMapper.beerOrderShipmentDtoToBeerOrderShipment(shipmentDto);
        beerOrder.addShipment(shipment);
        
        BeerOrderShipment savedShipment = beerOrderShipmentRepository.save(shipment);
        return beerOrderShipmentMapper.beerOrderShipmentToBeerOrderShipmentDto(savedShipment);
    }

    @Override
    @Transactional
    public BeerOrderShipmentDto updateShipment(Integer beerOrderId, Integer shipmentId, BeerOrderShipmentDto shipmentDto) {
        BeerOrderShipment shipment = getShipmentEntity(beerOrderId, shipmentId);
        
        // Update fields
        shipment.setShipmentDate(shipmentDto.getShipmentDate());
        shipment.setCarrier(shipmentDto.getCarrier());
        shipment.setTrackingNumber(shipmentDto.getTrackingNumber());
        
        BeerOrderShipment savedShipment = beerOrderShipmentRepository.save(shipment);
        return beerOrderShipmentMapper.beerOrderShipmentToBeerOrderShipmentDto(savedShipment);
    }

    @Override
    @Transactional
    public void deleteShipment(Integer beerOrderId, Integer shipmentId) {
        BeerOrderShipment shipment = getShipmentEntity(beerOrderId, shipmentId);
        BeerOrder beerOrder = shipment.getBeerOrder();
        beerOrder.removeShipment(shipment);
        beerOrderShipmentRepository.delete(shipment);
    }
    
    private BeerOrderShipment getShipmentEntity(Integer beerOrderId, Integer shipmentId) {
        BeerOrderShipment shipment = beerOrderShipmentRepository.findById(shipmentId)
                .orElseThrow(() -> new NotFoundException("Shipment not found with id: " + shipmentId));
        
        if (!shipment.getBeerOrder().getId().equals(beerOrderId)) {
            throw new NotFoundException("Shipment not found for Beer Order with id: " + beerOrderId);
        }
        
        return shipment;
    }
}