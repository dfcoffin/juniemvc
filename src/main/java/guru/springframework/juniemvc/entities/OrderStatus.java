package guru.springframework.juniemvc.entities;

/**
 * Enum representing the status of a beer order.
 */
public enum OrderStatus {
    NEW, PENDING, PROCESSING, COMPLETED, CANCELLED, DELIVERY_EXCEPTION
}