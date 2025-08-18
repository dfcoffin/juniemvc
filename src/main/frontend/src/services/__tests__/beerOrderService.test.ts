import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
import {BeerOrderService} from "../beerOrderService";
import {apiService} from "../../api/axiosConfig";
import {BeerOrderStatus} from "../../types/beerOrder";
import {mockBeerOrderPage, mockBeerOrders} from "../../test/mocks/api-mocks";

// Mock the axios-based API service
vi.mock("../../api/axiosConfig", () => ({
  apiService: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("BeerOrderService", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("getBeerOrders", () => {
    it("fetches beer orders with default parameters", async () => {
      // Setup
      vi.mocked(apiService.get).mockResolvedValue(mockBeerOrderPage);

      // Execute
      const result = await BeerOrderService.getBeerOrders();

      // Verify
      expect(apiService.get).toHaveBeenCalledWith("/api/v1/beer-orders", {
        params: {
          pageNumber: 0,
          pageSize: 25,
        },
      });
      expect(result).toEqual(mockBeerOrderPage);
    });

    it("fetches beer orders with custom parameters", async () => {
      // Setup
      vi.mocked(apiService.get).mockResolvedValue(mockBeerOrderPage);
      const params = {
        pageNumber: 1,
        pageSize: 10,
        customerId: 1,
        status: BeerOrderStatus.PAID,
      };

      // Execute
      const result = await BeerOrderService.getBeerOrders(
        params.pageNumber,
        params.pageSize,
        params.customerId,
        params.status,
      );

      // Verify
      expect(apiService.get).toHaveBeenCalledWith("/api/v1/beer-orders", {
        params: {
          pageNumber: 1,
          pageSize: 10,
          customerId: 1,
          status: BeerOrderStatus.PAID,
        },
      });
      expect(result).toEqual(mockBeerOrderPage);
    });

    it("handles API errors", async () => {
      // Setup
      const errorMessage = "Network Error";
      vi.mocked(apiService.get).mockRejectedValue(new Error(errorMessage));

      // Execute and verify
      await expect(BeerOrderService.getBeerOrders()).rejects.toThrow(
        errorMessage,
      );
    });
  });

  describe("getBeerOrderById", () => {
    it("fetches a beer order by ID", async () => {
      // Setup
      const order = mockBeerOrders[0];
      vi.mocked(apiService.get).mockResolvedValue(order);

      // Execute
      const result = await BeerOrderService.getBeerOrderById(1);

      // Verify
      expect(apiService.get).toHaveBeenCalledWith("/api/v1/beer-orders/1");
      expect(result).toEqual(order);
    });

    it("handles API errors", async () => {
      // Setup
      const errorMessage = "Order not found";
      vi.mocked(apiService.get).mockRejectedValue(new Error(errorMessage));

      // Execute and verify
      await expect(BeerOrderService.getBeerOrderById(999)).rejects.toThrow(
        errorMessage,
      );
    });
  });

  describe("createBeerOrder", () => {
    it("creates a new beer order", async () => {
      // Setup
      const newOrder = {
        customerRef: "Test Customer",
        paymentAmount: 24.99,
        beerOrderLines: [
          {
            beerId: 1,
            orderQuantity: 2,
          },
        ],
      };
      const createdOrder = {
        ...newOrder,
        id: 3,
        status: BeerOrderStatus.NEW,
      };
      vi.mocked(apiService.post).mockResolvedValue(createdOrder);

      // Execute
      const result = await BeerOrderService.createBeerOrder(newOrder);

      // Verify
      expect(apiService.post).toHaveBeenCalledWith(
        "/api/v1/beer-orders",
        newOrder,
      );
      expect(result).toEqual(createdOrder);
    });
  });

  describe("updateBeerOrder", () => {
    it("updates an existing beer order", async () => {
      // Setup
      const orderId = 1;
      const orderToUpdate = {
        customerRef: "Updated Customer",
        paymentAmount: 34.99,
        status: BeerOrderStatus.PAID,
        beerOrderLines: [
          {
            beerId: 2,
            orderQuantity: 3,
          },
        ],
      };
      const updatedOrder = { ...orderToUpdate, id: orderId };
      vi.mocked(apiService.put).mockResolvedValue(updatedOrder);

      // Execute
      const result = await BeerOrderService.updateBeerOrder(
        orderId,
        orderToUpdate,
      );

      // Verify
      expect(apiService.put).toHaveBeenCalledWith(
        `/api/v1/beer-orders/${orderId}`,
        orderToUpdate,
      );
      expect(result).toEqual(updatedOrder);
    });
  });

  describe("updateBeerOrderStatus", () => {
    it("updates a beer order status", async () => {
      // Setup
      const orderId = 1;
      const newStatus = BeerOrderStatus.PAID;
      const updatedOrder = {
        ...mockBeerOrders[0],
        status: newStatus,
      };
      vi.mocked(apiService.patch).mockResolvedValue(updatedOrder);

      // Execute
      const result = await BeerOrderService.updateBeerOrderStatus(
        orderId,
        newStatus,
      );

      // Verify
      expect(apiService.patch).toHaveBeenCalledWith(
        `/api/v1/beer-orders/${orderId}/status`,
        { status: newStatus },
      );
      expect(result).toEqual(updatedOrder);
    });
  });

  describe("deleteBeerOrder", () => {
    it("deletes a beer order", async () => {
      // Setup
      const orderId = 1;
      vi.mocked(apiService.delete).mockResolvedValue(undefined);

      // Execute
      await BeerOrderService.deleteBeerOrder(orderId);

      // Verify
      expect(apiService.delete).toHaveBeenCalledWith(
        `/api/v1/beer-orders/${orderId}`,
      );
    });
  });

  describe("createBeerOrderShipment", () => {
    it("creates a shipment for a beer order", async () => {
      // Setup
      const orderId = 1;
      const shipmentData = {
        shipmentDate: "2023-08-16",
        carrier: "FedEx",
        trackingNumber: "FDX123456789",
      };
      const updatedOrder = {
        ...mockBeerOrders[0],
        status: BeerOrderStatus.COMPLETE,
        shipments: [
          {
            id: 1,
            ...shipmentData,
          },
        ],
      };
      vi.mocked(apiService.post).mockResolvedValue(updatedOrder);

      // Execute
      const result = await BeerOrderService.createBeerOrderShipment(
        orderId,
        shipmentData,
      );

      // Verify
      expect(apiService.post).toHaveBeenCalledWith(
        `/api/v1/beer-orders/${orderId}/shipments`,
        shipmentData,
      );
      expect(result).toEqual(updatedOrder);
    });
  });

  describe("allocateBeerOrder", () => {
    it("allocates inventory for a beer order", async () => {
      // Setup
      const orderId = 1;
      const updatedOrder = {
        ...mockBeerOrders[0],
        status: BeerOrderStatus.INPROCESS,
        beerOrderLines: mockBeerOrders[0].beerOrderLines.map((line) => ({
          ...line,
          quantityAllocated: line.orderQuantity,
        })),
      };
      vi.mocked(apiService.post).mockResolvedValue(updatedOrder);

      // Execute
      const result = await BeerOrderService.allocateBeerOrder(orderId);

      // Verify
      expect(apiService.post).toHaveBeenCalledWith(
        `/api/v1/beer-orders/${orderId}/allocate`,
        {},
      );
      expect(result).toEqual(updatedOrder);
    });
  });

  describe("deallocateBeerOrder", () => {
    it("deallocates inventory for a beer order", async () => {
      // Setup
      const orderId = 1;
      const updatedOrder = {
        ...mockBeerOrders[0],
        status: BeerOrderStatus.NEW,
        beerOrderLines: mockBeerOrders[0].beerOrderLines.map((line) => ({
          ...line,
          quantityAllocated: 0,
        })),
      };
      vi.mocked(apiService.post).mockResolvedValue(updatedOrder);

      // Execute
      const result = await BeerOrderService.deallocateBeerOrder(orderId);

      // Verify
      expect(apiService.post).toHaveBeenCalledWith(
        `/api/v1/beer-orders/${orderId}/deallocate`,
        {},
      );
      expect(result).toEqual(updatedOrder);
    });
  });
});
