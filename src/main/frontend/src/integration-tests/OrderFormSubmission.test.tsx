import {describe, expect, it, vi} from "vitest";
import {render, waitFor} from "@testing-library/react";
import OrderFormPage from "../pages/orders/OrderFormPage";
import {MemoryRouter, Route, Routes} from "react-router-dom";
import {act} from "react";

// Mock the toast
vi.mock("../components/ui/dialog", () => {
  return {
    toast: {
      success: vi.fn(),
      error: vi.fn(),
      warning: vi.fn(),
      info: vi.fn(),
    },
    ToastProvider: ({ children }) => children,
  };
});

// Mock the services
vi.mock("../services/beerOrderService", () => {
  const BeerOrderService = {
    createBeerOrder: vi.fn(),
  };
  return {
    BeerOrderService,
    default: BeerOrderService,
  };
});

vi.mock("../services/beerService", () => {
  const BeerService = {
    getBeers: vi.fn().mockResolvedValue({
      content: [
        { id: 1, beerName: "Test Beer 1", beerStyle: "IPA" },
        { id: 2, beerName: "Test Beer 2", beerStyle: "Stout" },
      ],
      totalElements: 2,
      totalPages: 1,
      number: 0,
      size: 25,
    }),
  };
  return {
    BeerService,
    default: BeerService,
  };
});

vi.mock("../services/customerService", () => {
  const CustomerService = {
    getCustomers: vi.fn().mockResolvedValue({
      content: [
        { id: 1, customerName: "Test Customer 1", email: "test1@example.com" },
        { id: 2, customerName: "Test Customer 2", email: "test2@example.com" },
      ],
      totalElements: 2,
      totalPages: 1,
      number: 0,
      size: 25,
    }),
  };
  return {
    CustomerService,
    default: CustomerService,
  };
});

// Mock router navigation
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("Order Form Integration", () => {
  it("renders the order form", async () => {
    let result;

    await act(async () => {
      result = render(
        <MemoryRouter initialEntries={["/orders/new"]}>
          <Routes>
            <Route path="/orders/new" element={<OrderFormPage />} />
          </Routes>
        </MemoryRouter>,
      );
    });

    // Wait for async operations to complete
    await waitFor(() => {
      expect(result.getByText("Create New Order")).toBeInTheDocument();
    });
  });
});
