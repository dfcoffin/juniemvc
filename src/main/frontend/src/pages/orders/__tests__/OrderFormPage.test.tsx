import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
import {render, screen, waitFor} from "@testing-library/react";
import OrderFormPage from "../OrderFormPage";
import {apiService} from "../../../api/axiosConfig";
import {BrowserRouter} from "react-router-dom";
import {mockBeerPage, mockCustomerPage} from "../../../test/mocks/api-mocks";

// Mock the API service
vi.mock("../../../api/axiosConfig", () => ({
  apiService: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

// Mock the react-router-dom
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

describe("OrderFormPage", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should load and display customers", async () => {
    // Mock API responses
    vi.mocked(apiService.get).mockImplementation((url) => {
      if (url.includes("/customers")) {
        return Promise.resolve(mockCustomerPage);
      } else if (url.includes("/beers")) {
        return Promise.resolve(mockBeerPage);
      }
      return Promise.reject(new Error("Unknown URL"));
    });

    // Render the component
    render(
      <BrowserRouter>
        <OrderFormPage />
      </BrowserRouter>,
    );

    // Verify loading state first
    expect(screen.getByText(/Select a customer/i)).toBeInTheDocument();

    // Wait for customers to load
    await waitFor(() => {
      expect(apiService.get).toHaveBeenCalledWith(
        "/api/v1/customers",
        expect.any(Object),
      );
    });

    // Verify customers are loaded in the dropdown
    await waitFor(() => {
      const customerSelect = screen.getByLabelText(/Select Customer/i);
      expect(customerSelect).toBeInTheDocument();

      // Customer mock data should have elements in the select dropdown
      const options = screen.getAllByRole("option");
      expect(options.length).toBeGreaterThan(1); // At least default option + customers

      // Check if the customer names are present in the options
      const customerOptions = mockCustomerPage.content.map(
        (c) => c.customerName,
      );
      customerOptions.forEach((name) => {
        const option = screen.queryByText(name);
        expect(option).toBeInTheDocument();
      });
    });
  });

  it("should handle empty customer data gracefully", async () => {
    // Mock API responses with empty customer data
    vi.mocked(apiService.get).mockImplementation((url) => {
      if (url.includes("/customers")) {
        return Promise.resolve({
          content: [],
          totalPages: 0,
          totalElements: 0,
          size: 0,
          number: 0,
        });
      } else if (url.includes("/beers")) {
        return Promise.resolve(mockBeerPage);
      }
      return Promise.reject(new Error("Unknown URL"));
    });

    // Render the component
    render(
      <BrowserRouter>
        <OrderFormPage />
      </BrowserRouter>,
    );

    // Wait for API calls to complete
    await waitFor(() => {
      expect(apiService.get).toHaveBeenCalledWith(
        "/api/v1/customers",
        expect.any(Object),
      );
    });

    // Verify customer dropdown doesn't contain any customer options (only default)
    await waitFor(() => {
      const customerSelect = screen.getByLabelText(/Select Customer/i);
      expect(customerSelect).toBeInTheDocument();

      // There should be at least the default option "Select a customer..."
      const options = screen.getAllByRole("option");

      // Check that no options match the customer mock data (since it's empty)
      const johnDoeOption = screen.queryByText("John Doe");
      const janeSmithOption = screen.queryByText("Jane Smith");
      expect(johnDoeOption).not.toBeInTheDocument();
      expect(janeSmithOption).not.toBeInTheDocument();

      // At least one option should be the default
      expect(options[0].textContent).toContain("Select a customer");
    });
  });

  it("should handle customer API errors gracefully", async () => {
    // Mock customer API error
    vi.mocked(apiService.get).mockImplementation((url) => {
      if (url.includes("/customers")) {
        return Promise.reject(new Error("Failed to load customers"));
      } else if (url.includes("/beers")) {
        return Promise.resolve(mockBeerPage);
      }
      return Promise.reject(new Error("Unknown URL"));
    });

    // Render the component
    render(
      <BrowserRouter>
        <OrderFormPage />
      </BrowserRouter>,
    );

    // Wait for API calls to complete
    await waitFor(() => {
      expect(apiService.get).toHaveBeenCalledWith(
        "/api/v1/customers",
        expect.any(Object),
      );
    });

    // Verify select is still present with default option
    await waitFor(() => {
      const customerSelect = screen.getByLabelText(/Select Customer/i);
      expect(customerSelect).toBeInTheDocument();

      // There should be at least the default option "Select a customer..."
      const options = screen.getAllByRole("option");

      // Check that no options match the customer mock data (since it failed to load)
      const johnDoeOption = screen.queryByText("John Doe");
      const janeSmithOption = screen.queryByText("Jane Smith");
      expect(johnDoeOption).not.toBeInTheDocument();
      expect(janeSmithOption).not.toBeInTheDocument();

      // At least one option should be the default
      expect(options[0].textContent).toContain("Select a customer");
    });
  });
});
