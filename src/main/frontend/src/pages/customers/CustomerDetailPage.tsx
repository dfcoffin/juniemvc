import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import type {Customer, CustomerDto} from "@/types/customer";
import type {BeerOrderDto} from "@/types/beerOrder";
import CustomerService from "../../services/customerService";
import PageContainer from "../../components/layout/PageContainer";
import {ConfirmationDialog, toast} from "../../components/ui/dialog";
import TabNavigation from "../../components/navigation/TabNavigation";
import {ArrowLeft, Save, ShoppingCart, Trash2} from "lucide-react";
import {FormField, FormSubmitButton, Input, Select,} from "../../components/ui/form";
import CustomerOrdersTab from "../../components/customers/CustomerOrdersTab";
import {US_STATES} from "@/utils/constants.ts";

const CustomerDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [_activeTab, setActiveTab] = useState("details");
  const [isEditing, setIsEditing] = useState(false);
  const [editedCustomer, setEditedCustomer] = useState<Customer | null>(null);
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [_loadingOrders, _setLoadingOrders] = useState(false);

  // Load customer data
  useEffect(() => {
    const loadCustomer = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);

      try {
        const data = await CustomerService.getCustomerById(parseInt(id, 10));
        setCustomer(data);
        setEditedCustomer(data);
      } catch (err) {
        setError("Failed to load customer details. Please try again.");
        console.error("Error loading customer:", err);
        toast.error("Failed to load customer details");
      } finally {
        setLoading(false);
      }
    };

    // Properly handle the Promise
    loadCustomer().catch(err => {
      console.error("Unhandled error in loadCustomer:", err);
    });
  }, [id]);

  // Handle edit toggle
  const toggleEdit = () => {
    if (isEditing) {
      // Cancel editing - reset to original data
      setEditedCustomer(customer);
    }
    setIsEditing(!isEditing);
  };

  // Handle field change
  const handleFieldChange = (
    field: keyof Customer,
    value: string | number | BeerOrderDto[] | undefined,
  ) => {
    if (!editedCustomer) return;

    setEditedCustomer({
      ...editedCustomer,
      [field]: value,
    });
  };

  // Handle save
  const handleSave = async () => {
    if (!editedCustomer || !id) return;

    setSaving(true);

    try {
      const customerDto: CustomerDto = {
        name: editedCustomer.name,
        email: editedCustomer.email,
        phoneNumber: editedCustomer.phoneNumber,
        addressLine1: editedCustomer.addressLine1,
        addressLine2: editedCustomer.addressLine2,
        city: editedCustomer.city,
        state: editedCustomer.state,
        postalCode: editedCustomer.postalCode,
      };

      const updatedCustomer = await CustomerService.updateCustomer(
        parseInt(id, 10),
        customerDto,
      );
      setCustomer(updatedCustomer);
      setEditedCustomer(updatedCustomer);
      setIsEditing(false);
      toast.success("Customer updated successfully");
    } catch (err) {
      console.error("Error updating customer:", err);
      toast.error("Failed to update customer");
    } finally {
      setSaving(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!id) return;

    try {
      await CustomerService.deleteCustomer(parseInt(id, 10));
      toast.success("Customer deleted successfully");
      navigate("/customers");
    } catch (err) {
      console.error("Error deleting customer:", err);
      toast.error("Failed to delete customer");
    } finally {
      setShowDeleteConfirm(false);
    }
  };

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";

    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <PageContainer
        title="Customer Details"
        breadcrumbs={[
          { label: "Customers", to: "/customers" },
          { label: "Loading...", to: "#" },
        ]}
      >
        <div className="py-10 text-center">Loading customer details...</div>
      </PageContainer>
    );
  }

  if (error || !customer) {
    return (
      <PageContainer
        title="Customer Details"
        breadcrumbs={[
          { label: "Customers", to: "/customers" },
          { label: "Error", to: "#" },
        ]}
      >
        <div className="py-10 text-center text-red-500">
          {error || "Customer not found"}
          <button
            onClick={() => navigate("/customers")}
            className="ml-4 text-blue-500 hover:text-blue-700 underline"
          >
            Return to Customer List
          </button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title={isEditing ? "Edit Customer" : customer.name}
      description={
        isEditing ? "Update customer details" : `Customer ID: ${customer.id}`
      }
      breadcrumbs={[
        { label: "Customers", to: "/customers" },
        { label: customer.name, to: `/customers/${customer.id}` },
      ]}
      actions={
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/customers")}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900 h-10 px-4 py-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to List
          </button>
          {!isEditing ? (
            <>
              <button
                onClick={toggleEdit}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-slate-900 text-slate-50 hover:bg-slate-900/90 h-10 px-4 py-2"
              >
                Edit Customer
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-red-500 text-white hover:bg-red-600 h-10 px-4 py-2"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Customer
              </button>
              <button
                onClick={() => navigate(`/customers/${customer.id}/orders`)}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-500 text-white hover:bg-blue-600 h-10 px-4 py-2"
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                View Orders
              </button>
            </>
          ) : (
            <>
              <button
                onClick={toggleEdit}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900 h-10 px-4 py-2"
                disabled={saving}
              >
                Cancel
              </button>
              <FormSubmitButton
                onClick={handleSave}
                isLoading={saving}
                loadingText="Saving..."
                disabled={!editedCustomer}
              >
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </FormSubmitButton>
            </>
          )}
        </div>
      }
    >
      <TabNavigation
        tabs={[
          { id: "details", label: "Details" },
          { id: "orders", label: "Orders" },
        ]}
        defaultTabId="details"
        onChange={setActiveTab}
      >
        {(tabId) => {
          if (tabId === "details") {
            return (
              <div className="mt-6">
                {isEditing ? (
                  // Edit Form
                  <div className="grid gap-6 md:grid-cols-2">
                    <FormField id="name" label="Name" required>
                      <Input
                        id="name"
                        value={editedCustomer?.name || ""}
                        onChange={(e) =>
                          handleFieldChange("name", e.target.value)
                        }
                        required
                      />
                    </FormField>

                    <FormField id="email" label="Email">
                      <Input
                        id="email"
                        type="email"
                        value={editedCustomer?.email || ""}
                        onChange={(e) =>
                          handleFieldChange("email", e.target.value)
                        }
                      />
                    </FormField>

                    <FormField id="phoneNumber" label="Phone Number">
                      <Input
                        id="phoneNumber"
                        value={editedCustomer?.phoneNumber || ""}
                        onChange={(e) =>
                          handleFieldChange("phoneNumber", e.target.value)
                        }
                      />
                    </FormField>

                    <FormField
                      id="addressLine1"
                      label="Address Line 1"
                      required
                    >
                      <Input
                        id="addressLine1"
                        value={editedCustomer?.addressLine1 || ""}
                        onChange={(e) =>
                          handleFieldChange("addressLine1", e.target.value)
                        }
                        required
                      />
                    </FormField>

                    <FormField id="addressLine2" label="Address Line 2">
                      <Input
                        id="addressLine2"
                        value={editedCustomer?.addressLine2 || ""}
                        onChange={(e) =>
                          handleFieldChange("addressLine2", e.target.value)
                        }
                      />
                    </FormField>

                    <FormField id="city" label="City" required>
                      <Input
                        id="city"
                        value={editedCustomer?.city || ""}
                        onChange={(e) =>
                          handleFieldChange("city", e.target.value)
                        }
                        required
                      />
                    </FormField>

                    <FormField id="state" label="State" required>
                      <Select
                        id="state"
                        value={editedCustomer?.state || ""}
                        onChange={(e) =>
                          handleFieldChange("state", e.target.value)
                        }
                        options={US_STATES}
                        required
                      />
                    </FormField>

                    <FormField id="postalCode" label="Postal Code" required>
                      <Input
                        id="postalCode"
                        value={editedCustomer?.postalCode || ""}
                        onChange={(e) =>
                          handleFieldChange("postalCode", e.target.value)
                        }
                        required
                      />
                    </FormField>
                  </div>
                ) : (
                  // View Details
                  <div className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <h3 className="text-sm font-medium text-slate-500">
                          Name
                        </h3>
                        <p className="mt-1 text-lg" data-testid="customer-name">
                          {customer.name}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-slate-500">
                          Email
                        </h3>
                        <p className="mt-1 text-lg">
                          {customer.email ? (
                            <a
                              href={`mailto:${customer.email}`}
                              className="text-blue-600 hover:underline"
                            >
                              {customer.email}
                            </a>
                          ) : (
                            "N/A"
                          )}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-slate-500">
                          Phone
                        </h3>
                        <p className="mt-1 text-lg">
                          {customer.phoneNumber ? (
                            <a
                              href={`tel:${customer.phoneNumber}`}
                              className="text-blue-600 hover:underline"
                            >
                              {customer.phoneNumber}
                            </a>
                          ) : (
                            "N/A"
                          )}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-slate-500">
                          Address
                        </h3>
                        <p className="mt-1">
                          {customer.addressLine1}
                          <br />
                          {customer.addressLine2 && (
                            <>
                              {customer.addressLine2}
                              <br />
                            </>
                          )}
                          {customer.city}, {customer.state}{" "}
                          {customer.postalCode}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-slate-500">
                          ID
                        </h3>
                        <p className="mt-1 text-sm font-mono text-slate-700">
                          {customer.id}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-slate-500">
                          Created Date
                        </h3>
                        <p className="mt-1 text-sm text-slate-700">
                          {formatDate(customer.createdDate)}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-slate-500">
                          Last Updated
                        </h3>
                        <p className="mt-1 text-sm text-slate-700">
                          {formatDate(customer.updateDate)}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-slate-500">
                          Version
                        </h3>
                        <p className="mt-1 text-sm text-slate-700">
                          {customer.version}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          } else if (tabId === "orders") {
            return <CustomerOrdersTab customer={customer} />;
          }
          return null;
        }}
      </TabNavigation>

      <ConfirmationDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Customer"
        message={`Are you sure you want to delete "${customer.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        type="error"
      />
    </PageContainer>
  );
};

export default CustomerDetailPage;
