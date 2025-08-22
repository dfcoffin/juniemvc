import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import type {Customer} from "@/types/customer";
import CustomerService from "../../services/customerService";
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
import {Mail, Pencil, Phone, Plus, Trash2} from "lucide-react";

const CustomerListPage = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalItems, setTotalItems] = useState<number>(0);

  // Filter state
  const [filters, setFilters] = useState<Record<string, unknown>>({});
  // Explicit type for filters to avoid TS2322 error

  // Define filter options with proper type constraint for the TableFilter component
  const filterOptions: Array<{
    id: string;
    label: string;
    type: "text" | "select" | "date" | "boolean";
    options?: { value: string; label: string }[];
  }> = [
    {
      id: "name",
      label: "Customer Name",
      type: "text",
    },
    {
      id: "city",
      label: "City",
      type: "text",
    },
    {
      id: "state",
      label: "State",
      type: "text",
    },
  ];

  // Load customers with pagination and filtering
  const loadCustomers = async () => {
    setLoading(true);
    setError(null);

    try {
      // Convert 1-based pagination (UI) to 0-based (API)
      const pageNumber = currentPage - 1;

      // Extract filter values
      const { name } = filters;

      const response = await CustomerService.getCustomers(
        pageNumber,
        pageSize,
        name as string | undefined,
      );

      setCustomers(response.content);
      setTotalPages(response.totalPages);
      setTotalItems(response.totalElements);
    } catch (err) {
      setError("Failed to load customers. Please try again.");
      console.error("Error loading customers:", err);
      toast.error("Failed to load customers");
    } finally {
      setLoading(false);
    }
  };

  // Load customers on mount and when pagination/filters change
  useEffect(() => {
    loadCustomers();
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

  // Handle customer creation
  const handleCreateCustomer = () => {
    navigate("/customers/new");
  };

  // Handle customer edit
  const handleEditCustomer = (id: number) => {
    navigate(`/customers/${id}`);
  };

  // Format address
  const formatAddress = (customer: Customer) => {
    const address = [
      customer.addressLine1,
      customer.addressLine2,
      `${customer.city}, ${customer.state} ${customer.postalCode}`,
    ]
      .filter(Boolean)
      .join(", ");

    return address;
  };

  return (
    <PageContainer
      title="Customer Management"
      description="View, filter, and manage your customers"
      breadcrumbs={[{ label: "Customers", to: "/customers" }]}
      actions={
        <button
          onClick={handleCreateCustomer}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-slate-900 text-slate-50 hover:bg-slate-900/90 h-10 px-4 py-2"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New Customer
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

      {/* Customer table */}
      {loading && <div className="py-10 text-center">Loading customers...</div>}

      {error && (
        <div className="py-10 text-center text-red-500">
          {error}
          <button
            onClick={loadCustomers}
            className="ml-2 text-blue-500 hover:text-blue-700 underline"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && customers.length === 0 && (
        <div className="py-10 text-center text-slate-500">
          No customers found. Try adjusting your filters or add a new customer.
        </div>
      )}

      {!loading && !error && customers.length > 0 && (
        <Table>
          <TableHeader>
            <TableHeaderRow>
              <TableHead>Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Address</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableHeaderRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell className="font-medium">{customer.name}</TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {customer.email && (
                      <div className="flex items-center">
                        <Mail className="h-3 w-3 mr-1 text-slate-400" />
                        <a
                          href={`mailto:${customer.email}`}
                          className="text-blue-600 hover:underline"
                        >
                          {customer.email}
                        </a>
                      </div>
                    )}
                    {customer.phoneNumber && (
                      <div className="flex items-center">
                        <Phone className="h-3 w-3 mr-1 text-slate-400" />
                        <a
                          href={`tel:${customer.phoneNumber}`}
                          className="text-blue-600 hover:underline"
                        >
                          {customer.phoneNumber}
                        </a>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="line-clamp-2">
                    {formatAddress(customer)}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() =>
                        customer.id && handleEditCustomer(customer.id)
                      }
                      className="p-2 text-slate-700 hover:text-slate-900"
                      title="Edit Customer"
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </button>
                    <button
                      className="p-2 text-red-700 hover:text-red-900"
                      title="Delete Customer"
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

export default CustomerListPage;
