import {describe, expect, it, vi} from "vitest";
import {render, waitFor} from "@testing-library/react";
import BeerFormPage from "../pages/beers/BeerFormPage";
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

// Mock the BeerService
vi.mock("../services/beerService", () => {
  const BeerService = {
    createBeer: vi.fn(),
    uploadBeerImage: vi.fn(),
  };
  return {
    BeerService,
    default: BeerService,
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

describe("Beer Form Integration", () => {
  it("renders the beer form", async () => {
    let result;

    await act(async () => {
      result = render(
        <MemoryRouter initialEntries={["/beers/new"]}>
          <Routes>
            <Route path="/beers/new" element={<BeerFormPage />} />
          </Routes>
        </MemoryRouter>,
      );
    });

    // Wait for any async operations to complete
    await waitFor(() => {
      expect(result.getByText("Create New Beer")).toBeInTheDocument();
    });
  });
});
