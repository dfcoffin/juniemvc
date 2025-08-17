import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {BeerOrderDto, BeerOrderStatus} from '../../types/beerOrder';
import BeerOrderService from '../../services/beerOrderService';
import {PageContainer} from '../../components/layout/PageContainer';
import {
    Table,
    TableBody,
    TableCell,
    TableFilter,
    TableHead,
    TableHeader,
    TableHeaderRow,
    TablePagination,
    TableRow
} from '../../components/ui/table';
import {toast} from '../../components/ui/dialog';
import {Pencil, Plus, Trash2, TruckIcon} from 'lucide-react';

const OrderListPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<BeerOrderDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalItems, setTotalItems] = useState<number>(0);
  
  // Filter state
  const [filters, setFilters] = useState<Record<string, any>>({});

  // Define filter options
  const filterOptions = [
    {
      id: 'customerId',
      label: 'Customer ID',
      type: 'text'
    },
    {
      id: 'status',
      label: 'Order Status',
      type: 'select',
      options: Object.entries(BeerOrderStatus).map(([key, value]) => ({
        value: value,
        label: key
      }))
    }
  ];

  // Load orders with pagination and filtering
  const loadOrders = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Convert 1-based pagination (UI) to 0-based (API)
      const pageNumber = currentPage - 1;
      
      // Extract filter values
      const { customerId, status } = filters;
      
      const response = await BeerOrderService.getBeerOrders(
        pageNumber, 
        pageSize, 
        customerId, 
        status as BeerOrderStatus
      );
      
      setOrders(response.content);
      setTotalPages(response.totalPages);
      setTotalItems(response.totalElements);
    } catch (err) {
      setError('Failed to load orders. Please try again.');
      console.error('Error loading orders:', err);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  // Load orders on mount and when pagination/filters change
  useEffect(() => {
    loadOrders();
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
  const handleFilterChange = (newFilters: Record<string, any>) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when applying filters
  };

  // Handle order creation
  const handleCreateOrder = () => {
    navigate('/orders/new');
  };

  // Handle order edit
  const handleEditOrder = (id: number) => {
    navigate(`/orders/${id}`);
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get status badge color
  const getStatusBadgeClass = (status: BeerOrderStatus) => {
    switch (status) {
      case BeerOrderStatus.NEW:
        return 'bg-blue-100 text-blue-800';
      case BeerOrderStatus.PAID:
        return 'bg-green-100 text-green-800';
      case BeerOrderStatus.INPROCESS:
        return 'bg-yellow-100 text-yellow-800';
      case BeerOrderStatus.COMPLETE:
        return 'bg-purple-100 text-purple-800';
      case BeerOrderStatus.CANCELLED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <PageContainer
      title="Order Management"
      description="View, filter, and manage your beer orders"
      breadcrumbs={[{ label: 'Orders', to: '/orders' }]}
      actions={
        <button
          onClick={handleCreateOrder}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-slate-900 text-slate-50 hover:bg-slate-900/90 h-10 px-4 py-2"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create New Order
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

      {/* Order table */}
      {loading && <div className="py-10 text-center">Loading orders...</div>}
      
      {error && (
        <div className="py-10 text-center text-red-500">
          {error}
          <button 
            onClick={loadOrders}
            className="ml-2 text-blue-500 hover:text-blue-700 underline"
          >
            Retry
          </button>
        </div>
      )}
      
      {!loading && !error && orders.length === 0 && (
        <div className="py-10 text-center text-slate-500">
          No orders found. Try adjusting your filters or create a new order.
        </div>
      )}
      
      {!loading && !error && orders.length > 0 && (
        <Table>
          <TableHeader>
            <TableHeaderRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer Ref</TableHead>
              <TableHead>Created Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Items</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableHeaderRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">#{order.id}</TableCell>
                <TableCell>{order.customerRef || 'N/A'}</TableCell>
                <TableCell>{formatDate(order.createdDate)}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(order.status || BeerOrderStatus.NEW)}`}>
                    {order.status}
                  </span>
                </TableCell>
                <TableCell>{formatCurrency(order.paymentAmount)}</TableCell>
                <TableCell>{order.beerOrderLines.length} items</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => order.id && handleEditOrder(order.id)}
                      className="p-2 text-slate-700 hover:text-slate-900"
                      title="View Order Details"
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">View</span>
                    </button>
                    {order.status === BeerOrderStatus.PAID && (
                      <button
                        className="p-2 text-green-700 hover:text-green-900"
                        title="Process Shipment"
                      >
                        <TruckIcon className="h-4 w-4" />
                        <span className="sr-only">Ship</span>
                      </button>
                    )}
                    {order.status === BeerOrderStatus.NEW && (
                      <button
                        className="p-2 text-red-700 hover:text-red-900"
                        title="Cancel Order"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Cancel</span>
                      </button>
                    )}
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

export default OrderListPage;