import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import type {Beer} from "@/types/beer";
import {BeerStyle} from "@/types/beer";
import BeerService from "../../services/beerService";
import PageContainer from "../../components/layout/PageContainer";
import {
    Table,
    TableBody,
    TableCell,
    TableFilter,
    TableHead,
    TableHeader,
    TableHeaderRow,
    TablePagination,
    TableRow,
} from "../../components/ui/table";
import {toast} from "../../components/ui/dialog";
import {Pencil, Plus, Trash2} from "lucide-react";

const BeerListPage = () => {
  const navigate = useNavigate();
  const [beers, setBeers] = useState<Beer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalItems, setTotalItems] = useState<number>(0);

  // Filter state
  const [filters, setFilters] = useState<Record<string, unknown>>({});

  // Define filter options
  const filterOptions = [
    {
      id: "beerName",
      label: "Beer Name",
      type: "text",
    },
    {
      id: "beerStyle",
      label: "Beer Style",
      type: "select",
      options: Object.entries(BeerStyle).map(([key, value]) => ({
        value: value,
        label: key
          .replace(/_/g, " ")
          .toLowerCase()
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" "),
      })),
    },
  ];

  // Load beers with pagination and filtering
  const loadBeers = async () => {
    setLoading(true);
    setError(null);

    try {
      // Convert 1-based pagination (UI) to 0-based (API)
      const pageNumber = currentPage - 1;

      // Extract filter values
      const { beerName, beerStyle } = filters;

      const response = await BeerService.getBeers(
        pageNumber,
        pageSize,
        beerName,
        beerStyle as BeerStyle,
      );

      setBeers(response.content);
      setTotalPages(response.totalPages);
      setTotalItems(response.totalElements);
    } catch (err) {
      setError("Failed to load beers. Please try again.");
      console.error("Error loading beers:", err);
      toast.error("Failed to load beers");
    } finally {
      setLoading(false);
    }
  };

  // Load beers on mount and when pagination/filters change
  useEffect(() => {
    loadBeers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize, filters]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle page size change
  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  // Handle filter change
  const handleFilterChange = (newFilters: Record<string, unknown>) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when applying filters
  };

  // Handle beer creation
  const handleCreateBeer = () => {
    navigate("/beers/new");
  };

  // Handle beer edit
  const handleEditBeer = (id: string) => {
    navigate(`/beers/${id}`);
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <PageContainer
      title="Beer Management"
      description="View, filter, and manage your beer inventory"
      breadcrumbs={[{ label: "Beers", to: "/beers" }]}
      actions={
        <button
          onClick={handleCreateBeer}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-slate-900 text-slate-50 hover:bg-slate-900/90 h-10 px-4 py-2"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New Beer
        </button>
      }
    >
      {/* Filters */}
      <TableFilter
        filters={filterOptions}
        onFilter={handleFilterChange}
        initialFilters={filters}
        className="mb-4"
      />

      {/* Beer table */}
      {loading && <div className="py-10 text-center">Loading beers...</div>}

      {error && (
        <div className="py-10 text-center text-red-500">
          {error}
          <button
            onClick={loadBeers}
            className="ml-2 text-blue-500 hover:text-blue-700 underline"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && beers.length === 0 && (
        <div className="py-10 text-center text-slate-500">
          No beers found. Try adjusting your filters or add a new beer.
        </div>
      )}

      {!loading && !error && beers.length > 0 && (
        <Table>
          <TableHeader>
            <TableHeaderRow>
              <TableHead>Name</TableHead>
              <TableHead>Style</TableHead>
              <TableHead>UPC</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableHeaderRow>
          </TableHeader>
          <TableBody>
            {beers.map((beer) => (
              <TableRow key={beer.id}>
                <TableCell className="font-medium">{beer.beerName}</TableCell>
                <TableCell>{beer.beerStyle}</TableCell>
                <TableCell>{beer.upc}</TableCell>
                <TableCell>{formatCurrency(beer.price)}</TableCell>
                <TableCell>{beer.quantityOnHand || "N/A"}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => beer.id && handleEditBeer(beer.id)}
                      className="p-2 text-slate-700 hover:text-slate-900"
                      title="Edit Beer"
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </button>
                    <button
                      className="p-2 text-red-700 hover:text-red-900"
                      title="Delete Beer"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Pagination */}
      {!loading && totalPages > 0 && (
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={totalItems}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          className="mt-4"
        />
      )}
    </PageContainer>
  );
};

export default BeerListPage;
