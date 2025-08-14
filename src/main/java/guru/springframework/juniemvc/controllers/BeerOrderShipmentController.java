package guru.springframework.juniemvc.controllers;

import guru.springframework.juniemvc.models.BeerOrderShipmentDto;
import guru.springframework.juniemvc.services.BeerOrderShipmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller for BeerOrderShipment operations
 */
@RestController
@RequestMapping("/api/v1/beer-orders/{beerOrderId}/shipments")
@RequiredArgsConstructor
public class BeerOrderShipmentController {

    private final BeerOrderShipmentService beerOrderShipmentService;

    /**
     * Get all shipments for a beer order
     * @param beerOrderId the beer order id
     * @return the list of shipments
     */
    @GetMapping
    public ResponseEntity<List<BeerOrderShipmentDto>> getAllShipments(@PathVariable Integer beerOrderId) {
        return ResponseEntity.ok(beerOrderShipmentService.getAllShipments(beerOrderId));
    }

    /**
     * Get a shipment by id
     * @param beerOrderId the beer order id
     * @param shipmentId the shipment id
     * @return the shipment
     */
    @GetMapping("/{shipmentId}")
    public ResponseEntity<BeerOrderShipmentDto> getShipmentById(
            @PathVariable Integer beerOrderId,
            @PathVariable Integer shipmentId) {
        return ResponseEntity.ok(beerOrderShipmentService.getShipmentById(beerOrderId, shipmentId));
    }

    /**
     * Create a new shipment
     * @param beerOrderId the beer order id
     * @param shipmentDto the shipment DTO
     * @return the created shipment
     */
    @PostMapping
    public ResponseEntity<BeerOrderShipmentDto> createShipment(
            @PathVariable Integer beerOrderId,
            @Valid @RequestBody BeerOrderShipmentDto shipmentDto) {
        BeerOrderShipmentDto createdShipment = beerOrderShipmentService.createShipment(beerOrderId, shipmentDto);
        return new ResponseEntity<>(createdShipment, HttpStatus.CREATED);
    }

    /**
     * Update a shipment
     * @param beerOrderId the beer order id
     * @param shipmentId the shipment id
     * @param shipmentDto the shipment DTO
     * @return the updated shipment
     */
    @PutMapping("/{shipmentId}")
    public ResponseEntity<BeerOrderShipmentDto> updateShipment(
            @PathVariable Integer beerOrderId,
            @PathVariable Integer shipmentId,
            @Valid @RequestBody BeerOrderShipmentDto shipmentDto) {
        return ResponseEntity.ok(beerOrderShipmentService.updateShipment(beerOrderId, shipmentId, shipmentDto));
    }

    /**
     * Delete a shipment
     * @param beerOrderId the beer order id
     * @param shipmentId the shipment id
     * @return no content
     */
    @DeleteMapping("/{shipmentId}")
    public ResponseEntity<Void> deleteShipment(
            @PathVariable Integer beerOrderId,
            @PathVariable Integer shipmentId) {
        beerOrderShipmentService.deleteShipment(beerOrderId, shipmentId);
        return ResponseEntity.noContent().build();
    }
}