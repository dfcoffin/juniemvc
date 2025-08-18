import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import type {Beer, BeerOrderDto, BeerOrderLineDto} from "../../types";
import {BeerOrderStatus} from "../../types";
import BeerOrderService from "../../services/beerOrderService";
import BeerService from "../../services/beerService";
import PageContainer from "../../components/layout/PageContainer";
import {FormField, FormSubmitButton, Input, Select,} from "../../components/ui/form";
import {toast} from "../../components/ui/dialog";
import {ArrowLeft, Plus, Trash2} from "lucide-react";
import {minLength, required} from "../../utils/validation";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableHeaderRow,
    TableRow,
} from "../../components/ui/table";

const OrderUpdatePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Form state
  const [order, setOrder] = useState<BeerOrderDto | null>(null);
  const [originalOrder, setOriginalOrder] = useState<BeerOrderDto | null>(null);

  // Form validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Beer selection for line items
  const [beers, setBeers] = useState<Beer[]>([]);
  const [beersLoading, setBeersLoading] = useState(true);

  // New line item
  const [newLineItem, setNewLineItem] = useState<Partial<BeerOrderLineDto>>({
    beerId: undefined,
    orderQuantity: 1,
  });

  // Load order and beers
  useEffect(() => {
    const loadOrder = async () => {
      if (!id) return;

      try {
        const data = await BeerOrderService.getBeerOrderById(parseInt(id, 10));
        setOrder(data);
        setOriginalOrder(JSON.parse(JSON.stringify(data))); // Deep copy for comparison
      } catch (err) {
        console.error("Error loading order:", err);
        toast.error("Failed to load order details");
        navigate("/orders");
      } finally {
        setIsLoading(false);
      }
    };

    const loadBeers = async () => {
      try {
        const response = await BeerService.getBeers(0, 100);
        setBeers(response.content);
      } catch (err) {
        console.error("Error loading beers:", err);
        toast.error("Failed to load beers");
      } finally {
        setBeersLoading(false);
      }
    };

    loadOrder();
    loadBeers();
  }, [id, navigate]);

  // Handle field change
  const handleFieldChange = (
    field: keyof BeerOrderDto,
    value:
      | string
      | number
      | BeerOrderStatus
      | BeerOrderLineDto[]
      | BeerOrderShipmentDto[]
      | undefined,
  ) => {
    if (!order) return;

    setOrder({
      ...order,
      [field]: value,
    });

    // Clear error when field is updated
    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  // Handle new line item field change
  const handleLineItemChange = (
    field: keyof BeerOrderLineDto,
    value: string | number | undefined,
  ) => {
    setNewLineItem({
      ...newLineItem,
      [field]: value,
    });
  };

  // Add line item to order
  const handleAddLineItem = () => {
    if (!order || !newLineItem.beerId || !newLineItem.orderQuantity) {
      toast.error("Please select a beer and quantity");
      return;
    }

    // Find beer details
    const selectedBeer = beers.find((b) => b.id === newLineItem.beerId);
    if (!selectedBeer) {
      toast.error("Selected beer not found");
      return;
    }

    // Create line item with beer details
    const lineItem: BeerOrderLineDto = {
      beerId: newLineItem.beerId,
      beerName: selectedBeer.beerName,
      beerStyle: selectedBeer.beerStyle,
      upc: selectedBeer.upc,
      orderQuantity: newLineItem.orderQuantity,
      quantityAllocated: 0,
    };

    // Calculate total payment amount
    const lineItemTotal = selectedBeer.price * newLineItem.orderQuantity;
    const currentTotal = order.paymentAmount || 0;

    // Add to order
    setOrder({
      ...order,
      beerOrderLines: [...(order.beerOrderLines || []), lineItem],
      paymentAmount: currentTotal + lineItemTotal,
    });

    // Reset new line item
    setNewLineItem({
      beerId: undefined,
      orderQuantity: 1,
    });
  };

  // Remove line item from order
  const handleRemoveLineItem = (index: number) => {
    if (!order || !order.beerOrderLines) return;

    const lineItem = order.beerOrderLines[index];
    if (!lineItem || !lineItem.beerId) return;

    // Find beer to calculate price reduction
    const beer = beers.find((b) => b.id === lineItem.beerId);
    if (!beer) return;

    // Calculate new payment amount
    const lineItemTotal = beer.price * lineItem.orderQuantity;
    const currentTotal = order.paymentAmount || 0;

    // Remove from order
    const newLines = [...order.beerOrderLines];
    newLines.splice(index, 1);

    setOrder({
      ...order,
      beerOrderLines: newLines,
      paymentAmount: currentTotal - lineItemTotal,
    });
  };

  // Handle status change
  const handleStatusChange = (status: BeerOrderStatus) => {
    if (!order) return;

    setOrder({
      ...order,
      status,
    });
  };

  // Validate the form
  const validateForm = (): boolean => {
    if (!order) return false;

    const newErrors: Record<string, string> = {};

    // Customer reference validation
    const customerRefError =
      required(order.customerRef) || minLength(3)(order.customerRef || "");
    if (customerRefError) {
      newErrors.customerRef = customerRefError;
    }

    // Line items validation
    if (!order.beerOrderLines || order.beerOrderLines.length === 0) {
      newErrors.beerOrderLines = "At least one beer must be added to the order";
    }

    // Check if anything has changed
    if (JSON.stringify(order) === JSON.stringify(originalOrder)) {
      newErrors.general = "No changes have been made to the order";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!order || !order.id || !validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const updatedOrder = await BeerOrderService.updateBeerOrder(
        order.id,
        order,
      );
      toast.success("Order updated successfully");
      navigate(`/orders/${updatedOrder.id}`);
    } catch (err) {
      console.error("Error updating order:", err);

      // Handle API validation errors
      if (err instanceof Error) {
        try {
          const errorData = JSON.parse(err.message);
          if (errorData.fieldErrors) {
            const fieldErrors: Record<string, string> = {};
            Object.entries(errorData.fieldErrors).forEach(
              ([field, messages]) => {
                fieldErrors[field] = Array.isArray(messages)
                  ? messages[0]
                  : (messages as string);
              },
            );
            setErrors(fieldErrors);
          } else {
            toast.error(
              "Failed to update order: " +
                (errorData.message || "Unknown error"),
            );
          }
        } catch {
          toast.error("Failed to update order. Please try again.");
        }
      } else {
        toast.error("Failed to update order. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  if (isLoading) {
    return (
      <PageContainer
        title="Update Order"
        breadcrumbs={[
          { label: "Orders", to: "/orders" },
          { label: "Loading...", to: "#" },
        ]}
      >
        <div className="py-10 text-center">Loading order details...</div>
      </PageContainer>
    );
  }

  if (!order) {
    return (
      <PageContainer
        title="Update Order"
        breadcrumbs={[
          { label: "Orders", to: "/orders" },
          { label: "Error", to: "#" },
        ]}
      >
        <div className="py-10 text-center text-red-500">
          Order not found
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
      title={`Update Order #${order.id}`}
      description="Modify an existing beer order"
      breadcrumbs={[
        { label: "Orders", to: "/orders" },
        { label: `Order #${order.id}`, to: `/orders/${order.id}` },
        { label: "Update", to: `/orders/${order.id}/edit` },
      ]}
      actions={
        <button
          onClick={() => navigate(`/orders/${order.id}`)}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900 h-10 px-4 py-2"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Details
        </button>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        {errors.general && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {errors.general}
          </div>
        )}

        {/* Order Information */}
        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <h2 className="text-lg font-semibold mb-4">Order Information</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              id="customerRef"
              label="Customer Reference"
              error={errors.customerRef}
              required
            >
              <Input
                id="customerRef"
                value={order.customerRef || ""}
                onChange={(e) =>
                  handleFieldChange("customerRef", e.target.value)
                }
                error={!!errors.customerRef}
                required
              />
            </FormField>

            <FormField id="status" label="Order Status" required>
              <Select
                id="status"
                value={order.status}
                onChange={(e) =>
                  handleStatusChange(e.target.value as BeerOrderStatus)
                }
                options={Object.values(BeerOrderStatus).map((status) => ({
                  value: status,
                  label: status,
                }))}
                required
              />
            </FormField>
          </div>
        </div>

        {/* Line Items */}
        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <h2 className="text-lg font-semibold mb-4">Order Items</h2>

          {/* Add New Item */}
          <div className="grid gap-4 md:grid-cols-3 mb-6">
            <FormField id="beerId" label="Beer" required>
              <Select
                id="beerId"
                value={newLineItem.beerId?.toString() || ""}
                onChange={(e) =>
                  handleLineItemChange("beerId", parseInt(e.target.value, 10))
                }
                options={[
                  { value: "", label: "Select a beer..." },
                  ...beers.map((beer) => ({
                    value: beer.id?.toString() || "",
                    label: `${beer.beerName} (${formatCurrency(beer.price)})`,
                  })),
                ]}
                disabled={beersLoading}
              />
            </FormField>

            <FormField id="orderQuantity" label="Quantity" required>
              <Input
                id="orderQuantity"
                type="number"
                min="1"
                value={newLineItem.orderQuantity || 1}
                onChange={(e) =>
                  handleLineItemChange(
                    "orderQuantity",
                    parseInt(e.target.value, 10),
                  )
                }
              />
            </FormField>

            <div className="flex items-end">
              <button
                type="button"
                onClick={handleAddLineItem}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-slate-900 text-slate-50 hover:bg-slate-900/90 h-10 px-4 py-2"
                disabled={beersLoading || !newLineItem.beerId}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add to Order
              </button>
            </div>
          </div>

          {/* Error message */}
          {errors.beerOrderLines && (
            <div className="text-red-500 mb-4">{errors.beerOrderLines}</div>
          )}

          {/* Line Items Table */}
          {!order.beerOrderLines || order.beerOrderLines.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              No items added to this order yet. Add at least one beer above.
            </div>
          ) : (
            <div>
              <Table>
                <TableHeader>
                  <TableHeaderRow>
                    <TableHead>Beer</TableHead>
                    <TableHead>Style</TableHead>
                    <TableHead>UPC</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Allocated</TableHead>
                    <TableHead className="w-24">Actions</TableHead>
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
                      <TableCell>
                        <button
                          type="button"
                          onClick={() => handleRemoveLineItem(index)}
                          className="p-2 text-red-700 hover:text-red-900"
                          title="Remove Item"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remove</span>
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-4 flex justify-end">
                <div className="bg-slate-50 p-4 rounded-md">
                  <span className="font-medium">Total Amount: </span>
                  <span className="font-bold">
                    {formatCurrency(order.paymentAmount || 0)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <FormSubmitButton
            type="submit"
            isLoading={isSubmitting}
            loadingText="Updating..."
            disabled={
              !order.customerRef ||
              !order.beerOrderLines ||
              order.beerOrderLines.length === 0
            }
          >
            Update Order
          </FormSubmitButton>
        </div>
      </form>
    </PageContainer>
  );
};

export default OrderUpdatePage;
