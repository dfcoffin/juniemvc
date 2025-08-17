import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {BeerOrderDto, BeerOrderLineDto, BeerOrderStatus} from '../../types/beerOrder';
import BeerOrderService from '../../services/beerOrderService';
import BeerService from '../../services/beerService';
import CustomerService from '../../services/customerService';
import {Beer} from '../../types/beer';
import {Customer} from '../../types/customer';
import {PageContainer} from '../../components/layout/PageContainer';
import {FormField, FormSubmitButton, Input, Select} from '../../components/ui/form';
import {toast} from '../../components/ui/dialog';
import {ArrowLeft, Plus, Trash2} from 'lucide-react';
import {minLength, required} from '../../utils/validation';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableHeaderRow, TableRow} from '../../components/ui/table';

const OrderFormPage = () => {
  const navigate = useNavigate();
  
  // Form state
  const [order, setOrder] = useState<Partial<BeerOrderDto>>({
    customerRef: '',
    paymentAmount: 0,
    status: BeerOrderStatus.NEW,
    beerOrderLines: []
  });
  
  // Form validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Loading state
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Customer selection
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [customersLoading, setCustomersLoading] = useState(true);
  
  // Beer selection for line items
  const [beers, setBeers] = useState<Beer[]>([]);
  const [beersLoading, setBeersLoading] = useState(true);
  
  // New line item
  const [newLineItem, setNewLineItem] = useState<Partial<BeerOrderLineDto>>({
    beerId: undefined,
    orderQuantity: 1
  });

  // Load customers and beers
  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const response = await CustomerService.getCustomers(0, 100);
        setCustomers(response.content);
      } catch (err) {
        console.error('Error loading customers:', err);
        toast.error('Failed to load customers');
      } finally {
        setCustomersLoading(false);
      }
    };
    
    const loadBeers = async () => {
      try {
        const response = await BeerService.getBeers(0, 100);
        setBeers(response.content);
      } catch (err) {
        console.error('Error loading beers:', err);
        toast.error('Failed to load beers');
      } finally {
        setBeersLoading(false);
      }
    };
    
    loadCustomers();
    loadBeers();
  }, []);

  // Handle field change
  const handleFieldChange = (field: keyof BeerOrderDto, value: any) => {
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

  // Handle customer selection
  const handleCustomerChange = (customerId: string) => {
    setSelectedCustomer(customerId);
    
    if (customerId) {
      const selected = customers.find(c => c.id === parseInt(customerId, 10));
      if (selected) {
        handleFieldChange('customerRef', selected.customerName);
      }
    } else {
      handleFieldChange('customerRef', '');
    }
  };

  // Handle new line item field change
  const handleLineItemChange = (field: keyof BeerOrderLineDto, value: any) => {
    setNewLineItem({
      ...newLineItem,
      [field]: value,
    });
  };

  // Add line item to order
  const handleAddLineItem = () => {
    if (!newLineItem.beerId || !newLineItem.orderQuantity) {
      toast.error('Please select a beer and quantity');
      return;
    }
    
    // Find beer details
    const selectedBeer = beers.find(b => b.id === newLineItem.beerId);
    if (!selectedBeer) {
      toast.error('Selected beer not found');
      return;
    }
    
    // Create line item with beer details
    const lineItem: BeerOrderLineDto = {
      beerId: newLineItem.beerId,
      beerName: selectedBeer.beerName,
      beerStyle: selectedBeer.beerStyle,
      upc: selectedBeer.upc,
      orderQuantity: newLineItem.orderQuantity,
      quantityAllocated: 0
    };
    
    // Calculate total payment amount
    const lineItemTotal = selectedBeer.price * newLineItem.orderQuantity;
    const currentTotal = order.paymentAmount || 0;
    
    // Add to order
    setOrder({
      ...order,
      beerOrderLines: [...(order.beerOrderLines || []), lineItem],
      paymentAmount: currentTotal + lineItemTotal
    });
    
    // Reset new line item
    setNewLineItem({
      beerId: undefined,
      orderQuantity: 1
    });
  };

  // Remove line item from order
  const handleRemoveLineItem = (index: number) => {
    const lineItem = order.beerOrderLines?.[index];
    if (!lineItem || !lineItem.beerId) return;
    
    // Find beer to calculate price reduction
    const beer = beers.find(b => b.id === lineItem.beerId);
    if (!beer) return;
    
    // Calculate new payment amount
    const lineItemTotal = beer.price * lineItem.orderQuantity;
    const currentTotal = order.paymentAmount || 0;
    
    // Remove from order
    const newLines = [...(order.beerOrderLines || [])];
    newLines.splice(index, 1);
    
    setOrder({
      ...order,
      beerOrderLines: newLines,
      paymentAmount: currentTotal - lineItemTotal
    });
  };

  // Validate the form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Customer reference validation
    const customerRefError = required(order.customerRef) || minLength(3)(order.customerRef || '');
    if (customerRefError) {
      newErrors.customerRef = customerRefError;
    }
    
    // Line items validation
    if (!order.beerOrderLines || order.beerOrderLines.length === 0) {
      newErrors.beerOrderLines = 'At least one beer must be added to the order';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const newOrder = await BeerOrderService.createBeerOrder(order as BeerOrderDto);
      toast.success('Order created successfully');
      navigate(`/orders/${newOrder.id}`);
    } catch (err) {
      console.error('Error creating order:', err);
      
      // Handle API validation errors
      if (err instanceof Error) {
        try {
          const errorData = JSON.parse(err.message);
          if (errorData.fieldErrors) {
            const fieldErrors: Record<string, string> = {};
            Object.entries(errorData.fieldErrors).forEach(([field, messages]) => {
              fieldErrors[field] = Array.isArray(messages) ? messages[0] : messages as string;
            });
            setErrors(fieldErrors);
          } else {
            toast.error('Failed to create order: ' + (errorData.message || 'Unknown error'));
          }
        } catch {
          toast.error('Failed to create order. Please try again.');
        }
      } else {
        toast.error('Failed to create order. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <PageContainer
      title="Create New Order"
      description="Create a new beer order"
      breadcrumbs={[
        { label: 'Orders', to: '/orders' },
        { label: 'New Order', to: '/orders/new' },
      ]}
      actions={
        <button
          onClick={() => navigate('/orders')}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900 h-10 px-4 py-2"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to List
        </button>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Customer Selection */}
        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <h2 className="text-lg font-semibold mb-4">Customer Information</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              id="customer"
              label="Select Customer"
              error={errors.customerRef}
              required
            >
              <Select
                id="customer"
                value={selectedCustomer}
                onChange={(e) => handleCustomerChange(e.target.value)}
                options={[
                  { value: '', label: 'Select a customer...' },
                  ...customers.map(customer => ({
                    value: customer.id?.toString() || '',
                    label: customer.customerName
                  }))
                ]}
                disabled={customersLoading}
                required
              />
            </FormField>
            
            <FormField
              id="customerRef"
              label="Customer Reference"
              error={errors.customerRef}
              required
            >
              <Input
                id="customerRef"
                value={order.customerRef || ''}
                onChange={(e) => handleFieldChange('customerRef', e.target.value)}
                error={!!errors.customerRef}
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
            <FormField
              id="beerId"
              label="Beer"
              required
            >
              <Select
                id="beerId"
                value={newLineItem.beerId?.toString() || ''}
                onChange={(e) => handleLineItemChange('beerId', parseInt(e.target.value, 10))}
                options={[
                  { value: '', label: 'Select a beer...' },
                  ...beers.map(beer => ({
                    value: beer.id?.toString() || '',
                    label: `${beer.beerName} (${formatCurrency(beer.price)})`
                  }))
                ]}
                disabled={beersLoading}
              />
            </FormField>
            
            <FormField
              id="orderQuantity"
              label="Quantity"
              required
            >
              <Input
                id="orderQuantity"
                type="number"
                min="1"
                value={newLineItem.orderQuantity || 1}
                onChange={(e) => handleLineItemChange('orderQuantity', parseInt(e.target.value, 10))}
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
          {(!order.beerOrderLines || order.beerOrderLines.length === 0) ? (
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
                    <TableHead className="w-24">Actions</TableHead>
                  </TableHeaderRow>
                </TableHeader>
                <TableBody>
                  {order.beerOrderLines.map((line, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{line.beerName}</TableCell>
                      <TableCell>{line.beerStyle}</TableCell>
                      <TableCell>{line.upc}</TableCell>
                      <TableCell>{line.orderQuantity}</TableCell>
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
                  <span className="font-bold">{formatCurrency(order.paymentAmount || 0)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex justify-end">
          <FormSubmitButton
            type="submit"
            isLoading={isSubmitting}
            loadingText="Creating..."
            disabled={!order.customerRef || !order.beerOrderLines || order.beerOrderLines.length === 0}
          >
            Create Order
          </FormSubmitButton>
        </div>
      </form>
    </PageContainer>
  );
};

export default OrderFormPage;