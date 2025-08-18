import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import type {BeerOrderDto} from "../../types";
import {BeerOrderStatus} from "../../types";
import BeerOrderService from "../../services/beerOrderService";
import PageContainer from "../../components/layout/PageContainer";
import {ConfirmationDialog, toast} from "../../components/ui/dialog";
import TabNavigation from "../../components/navigation/TabNavigation";
import {ArrowLeft, Check, Edit, Trash2, TruckIcon, X} from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableHeaderRow,
    TableRow,
} from "../../components/ui/table";

const OrderDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<BeerOrderDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [_activeTab, setActiveTab] = useState("details");
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showShipmentDialog, setShowShipmentDialog] = useState(false);
  const [shipmentData, setShipmentData] = useState<{
    shipmentDate: string;
    carrier: string;
    trackingNumber: string;
  }>({
    shipmentDate: new Date().toISOString().split("T")[0],
    carrier: "",
    trackingNumber: "",
  });
  const [processingAction, setProcessingAction] = useState(false);

  // Load order data
  useEffect(() => {
    const loadOrder = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);

      try {
        const data = await BeerOrderService.getBeerOrderById(parseInt(id, 10));
        setOrder(data);
      } catch (err) {
        setError("Failed to load order details. Please try again.");
        console.error("Error loading order:", err);
        toast.error("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [id]);

  // Handle cancel order
  const handleCancelOrder = async () => {
    if (!order || !order.id) return;

    setProcessingAction(true);

    try {
      const updatedOrder = await BeerOrderService.updateBeerOrderStatus(
        order.id,
        BeerOrderStatus.CANCELLED,
      );

      setOrder(updatedOrder);
      toast.success("Order cancelled successfully");
    } catch (err) {
      console.error("Error cancelling order:", err);
      toast.error("Failed to cancel order");
    } finally {
      setProcessingAction(false);
      setShowCancelConfirm(false);
    }
  };

  // Handle create shipment
  const handleCreateShipment = async () => {
    if (!order || !order.id) return;

    setProcessingAction(true);

    try {
      const updatedOrder = await BeerOrderService.createBeerOrderShipment(
        order.id,
        shipmentData,
      );

      setOrder(updatedOrder);
      toast.success("Shipment created successfully");
    } catch (err) {
      console.error("Error creating shipment:", err);
      toast.error("Failed to create shipment");
    } finally {
      setProcessingAction(false);
      setShowShipmentDialog(false);
    }
  };

  // Handle allocate inventory
  const handleAllocateInventory = async () => {
    if (!order || !order.id) return;

    setProcessingAction(true);

    try {
      const updatedOrder = await BeerOrderService.allocateBeerOrder(order.id);
      setOrder(updatedOrder);
      toast.success("Inventory allocated successfully");
    } catch (err) {
      console.error("Error allocating inventory:", err);
      toast.error("Failed to allocate inventory");
    } finally {
      setProcessingAction(false);
    }
  };

  // Handle deallocate inventory
  const handleDeallocateInventory = async () => {
    if (!order || !order.id) return;

    setProcessingAction(true);

    try {
      const updatedOrder = await BeerOrderService.deallocateBeerOrder(order.id);
      setOrder(updatedOrder);
      toast.success("Inventory deallocated successfully");
    } catch (err) {
      console.error("Error deallocating inventory:", err);
      toast.error("Failed to deallocate inventory");
    } finally {
      setProcessingAction(false);
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";

    return new Date(dateString).toLocaleString();
  };

  // Get status badge color
  const getStatusBadgeClass = (status: BeerOrderStatus) => {
    switch (status) {
      case BeerOrderStatus.NEW:
        return "bg-blue-100 text-blue-800";
      case BeerOrderStatus.PAID:
        return "bg-green-100 text-green-800";
      case BeerOrderStatus.INPROCESS:
        return "bg-yellow-100 text-yellow-800";
      case BeerOrderStatus.COMPLETE:
        return "bg-purple-100 text-purple-800";
      case BeerOrderStatus.CANCELLED:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <PageContainer
        title="Order Details"
        breadcrumbs={[
          { label: "Orders", to: "/orders" },
          { label: "Loading...", to: "#" },
        ]}
      >
        <div className="py-10 text-center">Loading order details...</div>
      </PageContainer>
    );
  }

  if (error || !order) {
    return (
      <PageContainer
        title="Order Details"
        breadcrumbs={[
          { label: "Orders", to: "/orders" },
          { label: "Error", to: "#" },
        ]}
      >
        <div className="py-10 text-center text-red-500">
          {error || "Order not found"}
          <button
            onClick={() => navigate("/orders")}
            className="ml-4 text-blue-500 hover:text-blue-700 underline"
          >
            Return to Order List
          </button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title={`Order #${order.id}`}
      description={
        <span className="flex items-center">
          Status:{" "}
          <span
            className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(order.status || BeerOrderStatus.NEW)}`}
          >
            {order.status}
          </span>
        </span>
      }
      breadcrumbs={[
        { label: "Orders", to: "/orders" },
        { label: `Order #${order.id}`, to: `/orders/${order.id}` },
      ]}
      actions={
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/orders")}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900 h-10 px-4 py-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to List
          </button>

          <button
            onClick={() => navigate(`/orders/${order.id}/edit`)}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 py-2"
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Order
          </button>

          {order.status === BeerOrderStatus.PAID && (
            <button
              onClick={() => setShowShipmentDialog(true)}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-green-600 text-white hover:bg-green-700 h-10 px-4 py-2"
              disabled={processingAction}
            >
              <TruckIcon className="mr-2 h-4 w-4" />
              Create Shipment
            </button>
          )}

          {order.status === BeerOrderStatus.NEW && (
            <>
              <button
                onClick={handleAllocateInventory}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-slate-900 text-slate-50 hover:bg-slate-900/90 h-10 px-4 py-2"
                disabled={processingAction}
              >
                <Check className="mr-2 h-4 w-4" />
                Allocate Inventory
              </button>

              {order.beerOrderLines.some(
                (line) => line.quantityAllocated && line.quantityAllocated > 0,
              ) && (
                <button
                  onClick={handleDeallocateInventory}
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-orange-600 text-white hover:bg-orange-700 h-10 px-4 py-2"
                  disabled={processingAction}
                >
                  <X className="mr-2 h-4 w-4" />
                  Deallocate Inventory
                </button>
              )}

              <button
                onClick={() => setShowCancelConfirm(true)}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-red-500 text-white hover:bg-red-600 h-10 px-4 py-2"
                disabled={processingAction}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Cancel Order
              </button>
            </>
          )}
        </div>
      }
    >
      <TabNavigation
        tabs={[
          { id: "details", label: "Order Details" },
          { id: "items", label: "Line Items" },
          { id: "shipments", label: "Shipments" },
        ]}
        defaultTabId="details"
        onChange={setActiveTab}
      >
        {(tabId) => {
          if (tabId === "details") {
            return (
              <div className="mt-6">
                <div className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <h3 className="text-sm font-medium text-slate-500">
                        Order ID
                      </h3>
                      <p className="mt-1 text-lg">{order.id}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-slate-500">
                        Customer Reference
                      </h3>
                      <p className="mt-1 text-lg">
                        {order.customerRef || "N/A"}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-slate-500">
                        Status
                      </h3>
                      <p className="mt-1">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(order.status || BeerOrderStatus.NEW)}`}
                        >
                          {order.status}
                        </span>
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-slate-500">
                        Payment Amount
                      </h3>
                      <p className="mt-1 text-lg">
                        {formatCurrency(order.paymentAmount)}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-slate-500">
                        Created Date
                      </h3>
                      <p className="mt-1 text-sm text-slate-700">
                        {formatDate(order.createdDate)}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-slate-500">
                        Last Updated
                      </h3>
                      <p className="mt-1 text-sm text-slate-700">
                        {formatDate(order.updateDate)}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-slate-500">
                        Total Items
                      </h3>
                      <p className="mt-1 text-lg">
                        {order.beerOrderLines.length}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-slate-500">
                        Version
                      </h3>
                      <p className="mt-1 text-sm text-slate-700">
                        {order.version}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          } else if (tabId === "items") {
            return (
              <div className="mt-6">
                {order.beerOrderLines.length === 0 ? (
                  <div className="py-10 text-center text-slate-500">
                    No items in this order.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableHeaderRow>
                        <TableHead>Beer</TableHead>
                        <TableHead>Style</TableHead>
                        <TableHead>UPC</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Allocated</TableHead>
                      </TableHeaderRow>
                    </TableHeader>
                    <TableBody>
                      {order.beerOrderLines.map((line, index) => (
                        <TableRow key={line.id || index}>
                          <TableCell className="font-medium">
                            {line.beerName}
                          </TableCell>
                          <TableCell>{line.beerStyle}</TableCell>
                          <TableCell>{line.upc}</TableCell>
                          <TableCell>{line.orderQuantity}</TableCell>
                          <TableCell>{line.quantityAllocated || 0}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            );
          } else if (tabId === "shipments") {
            return (
              <div className="mt-6">
                {!order.shipments || order.shipments.length === 0 ? (
                  <div className="py-10 text-center text-slate-500">
                    No shipments for this order yet.
                    {order.status === BeerOrderStatus.PAID && (
                      <button
                        onClick={() => setShowShipmentDialog(true)}
                        className="ml-4 text-blue-500 hover:text-blue-700 underline"
                        disabled={processingAction}
                      >
                        Create Shipment
                      </button>
                    )}
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableHeaderRow>
                        <TableHead>Shipment ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Carrier</TableHead>
                        <TableHead>Tracking Number</TableHead>
                      </TableHeaderRow>
                    </TableHeader>
                    <TableBody>
                      {order.shipments.map((shipment) => (
                        <TableRow key={shipment.id}>
                          <TableCell className="font-medium">
                            {shipment.id}
                          </TableCell>
                          <TableCell>
                            {formatDate(shipment.shipmentDate)}
                          </TableCell>
                          <TableCell>{shipment.carrier}</TableCell>
                          <TableCell>{shipment.trackingNumber}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            );
          }
          return null;
        }}
      </TabNavigation>

      {/* Cancel Order Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showCancelConfirm}
        onClose={() => setShowCancelConfirm(false)}
        onConfirm={handleCancelOrder}
        title="Cancel Order"
        message={`Are you sure you want to cancel Order #${order.id}? This action cannot be undone.`}
        confirmLabel="Cancel Order"
        cancelLabel="Keep Order"
        type="error"
      />

      {/* Create Shipment Dialog */}
      <ConfirmationDialog
        isOpen={showShipmentDialog}
        onClose={() => setShowShipmentDialog(false)}
        onConfirm={handleCreateShipment}
        title="Create Shipment"
        confirmLabel="Create Shipment"
        cancelLabel="Cancel"
        type="custom"
        customContent={
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="shipmentDate" className="text-right">
                Shipment Date
              </label>
              <input
                id="shipmentDate"
                type="date"
                className="col-span-3 p-2 border rounded"
                value={shipmentData.shipmentDate}
                onChange={(e) =>
                  setShipmentData({
                    ...shipmentData,
                    shipmentDate: e.target.value,
                  })
                }
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="carrier" className="text-right">
                Carrier
              </label>
              <input
                id="carrier"
                className="col-span-3 p-2 border rounded"
                value={shipmentData.carrier}
                onChange={(e) =>
                  setShipmentData({ ...shipmentData, carrier: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="trackingNumber" className="text-right">
                Tracking Number
              </label>
              <input
                id="trackingNumber"
                className="col-span-3 p-2 border rounded"
                value={shipmentData.trackingNumber}
                onChange={(e) =>
                  setShipmentData({
                    ...shipmentData,
                    trackingNumber: e.target.value,
                  })
                }
              />
            </div>
          </div>
        }
      />
    </PageContainer>
  );
};

export default OrderDetailPage;
