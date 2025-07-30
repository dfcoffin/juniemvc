package guru.springframework.juniemvc.entities;

/**
 * Enum representing the status of a beer order line.
 */
public enum OrderLineStatus {
    NEW, ALLOCATED, PENDING_INVENTORY, DELIVERED, CANCELLED
}