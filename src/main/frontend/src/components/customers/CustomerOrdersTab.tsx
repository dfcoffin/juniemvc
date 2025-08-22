import {useState} from "react";
import {useNavigate} from "react-router-dom";
import type {Customer} from "@/types/customer";
import {Eye, Plus} from "lucide-react";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableHeaderRow, TableRow,} from "../ui/table";

interface CustomerOrdersTabProps {
  customer: Customer;
}

const CustomerOrdersTab = ({ customer }: CustomerOrdersTabProps) => {
  const navigate = useNavigate();
  const [_loadingOrders, _setLoadingOrders] = useState(false);

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Beer Orders</h3>
        <button
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-slate-900 text-slate-50 hover:bg-slate-900/90 h-9 px-3"
          onClick={() => navigate(`/orders/new?customerId=${customer.id}`)}
        >
          <Plus className="mr-1 h-4 w-4" />
          New Order
        </button>
      </div>

      {customer.beerOrders && customer.beerOrders.length > 0 ? (
        <Table>
          <TableHeader>
            <TableHeaderRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Items</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableHeaderRow>
          </TableHeader>
          <TableBody>
            {customer.beerOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{formatDate(order.createdDate)}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      order.status === "READY"
                        ? "bg-green-100 text-green-800"
                        : order.status === "PENDING_INVENTORY"
                          ? "bg-yellow-100 text-yellow-800"
                          : order.status === "PICKED_UP"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-slate-100 text-slate-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </TableCell>
                <TableCell>{order.beerOrderLines?.length || 0} items</TableCell>
                <TableCell>
                  <button
                    onClick={() => navigate(`/orders/${order.id}`)}
                    className="p-2 text-slate-700 hover:text-slate-900"
                    title="View Order"
                  >
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">View</span>
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="text-center py-10 text-slate-500">
          No orders found for this customer.
        </div>
      )}
    </div>
  );
};

export default CustomerOrdersTab;