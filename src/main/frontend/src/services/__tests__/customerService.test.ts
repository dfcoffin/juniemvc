import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
import {CustomerService} from "../customerService";
import {apiService} from "../../api/axiosConfig";
import {mockCustomerPage, mockCustomers} from "../../test/mocks/api-mocks";

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

describe("CustomerService", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("getCustomers", () => {
    it("fetches customers with default parameters", async () => {
      // Setup
      vi.mocked(apiService.get).mockResolvedValue(mockCustomerPage);

      // Execute
      const result = await CustomerService.getCustomers();

      // Verify
      expect(apiService.get).toHaveBeenCalledWith("/api/v1/customers", {
        params: {
          pageNumber: 0,
          pageSize: 25,
        },
      });
      expect(result).toEqual(mockCustomerPage);
    });

    it("fetches customers with custom parameters", async () => {
      // Setup
      vi.mocked(apiService.get).mockResolvedValue(mockCustomerPage);
      const params = {
        pageNumber: 1,
        pageSize: 10,
      };

      // Execute
      const result = await CustomerService.getCustomers(
        params.pageNumber,
        params.pageSize,
      );

      // Verify
      expect(apiService.get).toHaveBeenCalledWith("/api/v1/customers", {
        params: {
          pageNumber: 1,
          pageSize: 10,
        },
      });
      expect(result).toEqual(mockCustomerPage);
    });

    it("handles API errors", async () => {
      // Setup
      const errorMessage = "Network Error";
      vi.mocked(apiService.get).mockRejectedValue(new Error(errorMessage));

      // Execute and verify
      await expect(CustomerService.getCustomers()).rejects.toThrow(
        errorMessage,
      );
    });
  });

  describe("getCustomerById", () => {
    it("fetches a customer by ID", async () => {
      // Setup
      const customer = mockCustomers[0];
      vi.mocked(apiService.get).mockResolvedValue(customer);

      // Execute
      const result = await CustomerService.getCustomerById(1);

      // Verify
      expect(apiService.get).toHaveBeenCalledWith("/api/v1/customers/1");
      expect(result).toEqual(customer);
    });

    it("handles API errors", async () => {
      // Setup
      const errorMessage = "Customer not found";
      vi.mocked(apiService.get).mockRejectedValue(new Error(errorMessage));

      // Execute and verify
      await expect(CustomerService.getCustomerById(999)).rejects.toThrow(
        errorMessage,
      );
    });
  });

  describe("createCustomer", () => {
    it("creates a new customer", async () => {
      // Setup
      const newCustomer = {
        customerName: "New Test Customer",
        email: "test@example.com",
        phone: "123-456-7890",
      };
      const createdCustomer = { ...newCustomer, id: 3 };
      vi.mocked(apiService.post).mockResolvedValue(createdCustomer);

      // Execute
      const result = await CustomerService.createCustomer(newCustomer);

      // Verify
      expect(apiService.post).toHaveBeenCalledWith(
        "/api/v1/customers",
        newCustomer,
      );
      expect(result).toEqual(createdCustomer);
    });
  });

  describe("updateCustomer", () => {
    it("updates an existing customer", async () => {
      // Setup
      const customerId = 1;
      const customerToUpdate = {
        customerName: "Updated Customer",
        email: "updated@example.com",
        phone: "987-654-3210",
      };
      const updatedCustomer = { ...customerToUpdate, id: customerId };
      vi.mocked(apiService.put).mockResolvedValue(updatedCustomer);

      // Execute
      const result = await CustomerService.updateCustomer(
        customerId,
        customerToUpdate,
      );

      // Verify
      expect(apiService.put).toHaveBeenCalledWith(
        `/api/v1/customers/${customerId}`,
        customerToUpdate,
      );
      expect(result).toEqual(updatedCustomer);
    });
  });

  describe("deleteCustomer", () => {
    it("deletes a customer", async () => {
      // Setup
      const customerId = 1;
      vi.mocked(apiService.delete).mockResolvedValue(undefined);

      // Execute
      await CustomerService.deleteCustomer(customerId);

      // Verify
      expect(apiService.delete).toHaveBeenCalledWith(
        `/api/v1/customers/${customerId}`,
      );
    });
  });
});
