import {useState} from "react";
import {useNavigate} from "react-router-dom";
import type {CustomerDto} from "@/types/customer";
import CustomerService from "../../services/customerService";
import PageContainer from "../../components/layout/PageContainer";
import {FormField, FormSubmitButton, Input, Select,} from "../../components/ui/form";
import {toast} from "../../components/ui/dialog";
import {ArrowLeft} from "lucide-react";
import {minLength, pattern, required} from "../../utils/validation";

// US states for dropdown
const US_STATES = [
  { value: "AL", label: "Alabama" },
  { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" },
  { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" },
  { value: "DE", label: "Delaware" },
  { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" },
  { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" },
  { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" },
  { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" },
  { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" },
  { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" },
  { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" },
  { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" },
  { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" },
  { value: "NV", label: "Nevada" },
  { value: "NH", label: "New Hampshire" },
  { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" },
  { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" },
  { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" },
  { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" },
  { value: "PA", label: "Pennsylvania" },
  { value: "RI", label: "Rhode Island" },
  { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" },
  { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" },
  { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" },
  { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" },
  { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" },
  { value: "WY", label: "Wyoming" },
];

const CustomerFormPage = () => {
  const navigate = useNavigate();

  // Form state
  const [customer, setCustomer] = useState<CustomerDto>({
    name: "",
    email: "",
    phoneNumber: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "CA", // Default state
    postalCode: "",
  });

  // Form validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Loading state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle field change
  const handleFieldChange = (
    field: keyof CustomerDto,
    value: string | undefined,
  ) => {
    setCustomer({
      ...customer,
      [field]: value,
    });

    // Clear error when field is updated
    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  // Validate the form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Name validation
    const nameError = required(customer.name) || minLength(3)(customer.name);
    if (nameError) {
      newErrors.name = nameError;
    }

    // Email validation (optional)
    if (customer.email) {
      const emailError = pattern(
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please enter a valid email address",
      )(customer.email);
      if (emailError) {
        newErrors.email = emailError;
      }
    }

    // Phone validation (optional)
    if (customer.phoneNumber) {
      const phoneError = pattern(
        /^\+?[0-9\s()-]{10,15}$/,
        "Please enter a valid phone number",
      )(customer.phoneNumber);
      if (phoneError) {
        newErrors.phoneNumber = phoneError;
      }
    }

    // Address validation
    const addressError = required(customer.addressLine1);
    if (addressError) {
      newErrors.addressLine1 = addressError;
    }

    // City validation
    const cityError = required(customer.city);
    if (cityError) {
      newErrors.city = cityError;
    }

    // State validation
    const stateError = required(customer.state);
    if (stateError) {
      newErrors.state = stateError;
    }

    // Postal code validation
    const postalCodeError =
      required(customer.postalCode) ||
      pattern(
        /^\d{5}(-\d{4})?$/,
        "Please enter a valid postal code (e.g., 12345 or 12345-6789)",
      )(customer.postalCode);
    if (postalCodeError) {
      newErrors.postalCode = postalCodeError;
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
      // Check for duplicate customers first
      const existingCustomers = await CustomerService.getCustomers(
        0,
        100,
        customer.name,
      );

      // If customers with same name exist, prevent creation
      if (
        existingCustomers &&
        existingCustomers.content &&
        existingCustomers.content.some(
          (c) =>
            c.name.toLowerCase() === customer.name.toLowerCase() ||
            (c.customerName &&
              c.customerName.toLowerCase() === customer.name.toLowerCase()),
        )
      ) {
        // Set a validation error instead of a confirmation dialog
        setErrors({
          name: `A customer with the name "${customer.name}" already exists. Please use a different name.`,
        });
        setIsSubmitting(false);
        return;
      }

      // Create the customer only if no duplicates
      const newCustomer = await CustomerService.createCustomer(customer);
      toast.success("Customer created successfully");

      // Force refresh of customer data in all pages
      try {
        // Attempt to refresh the customer list in the background
        await CustomerService.getCustomers(0, 100);
      } catch (refreshErr) {
        console.error("Error refreshing customer data:", refreshErr);
      }

      navigate(`/customers/${newCustomer.id}`);
    } catch (err) {
      console.error("Error creating customer:", err);

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
              "Failed to create customer: " +
                (errorData.message || "Unknown error"),
            );
          }
        } catch {
          toast.error("Failed to create customer. Please try again.");
        }
      } else {
        toast.error("Failed to create customer. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageContainer
      title="Create New Customer"
      description="Add a new customer to your system"
      breadcrumbs={[
        { label: "Customers", to: "/customers" },
        { label: "New Customer", to: "/customers/new" },
      ]}
      actions={
        <button
          onClick={() => navigate("/customers")}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900 h-10 px-4 py-2"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to List
        </button>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            id="name"
            label="Customer Name"
            error={errors.name}
            required
          >
            <Input
              id="name"
              value={customer.name}
              onChange={(e) => handleFieldChange("name", e.target.value)}
              error={!!errors.name}
              required
            />
          </FormField>

          <FormField id="email" label="Email" error={errors.email}>
            <Input
              id="email"
              type="email"
              value={customer.email || ""}
              onChange={(e) => handleFieldChange("email", e.target.value)}
              error={!!errors.email}
            />
          </FormField>

          <FormField
            id="phoneNumber"
            label="Phone Number"
            error={errors.phoneNumber}
          >
            <Input
              id="phoneNumber"
              value={customer.phoneNumber || ""}
              onChange={(e) => handleFieldChange("phoneNumber", e.target.value)}
              error={!!errors.phoneNumber}
            />
          </FormField>

          <FormField
            id="addressLine1"
            label="Address Line 1"
            error={errors.addressLine1}
            required
          >
            <Input
              id="addressLine1"
              value={customer.addressLine1}
              onChange={(e) =>
                handleFieldChange("addressLine1", e.target.value)
              }
              error={!!errors.addressLine1}
              required
            />
          </FormField>

          <FormField
            id="addressLine2"
            label="Address Line 2"
            error={errors.addressLine2}
          >
            <Input
              id="addressLine2"
              value={customer.addressLine2 || ""}
              onChange={(e) =>
                handleFieldChange("addressLine2", e.target.value)
              }
              error={!!errors.addressLine2}
            />
          </FormField>

          <FormField id="city" label="City" error={errors.city} required>
            <Input
              id="city"
              value={customer.city}
              onChange={(e) => handleFieldChange("city", e.target.value)}
              error={!!errors.city}
              required
            />
          </FormField>

          <FormField id="state" label="State" error={errors.state} required>
            <Select
              id="state"
              value={customer.state}
              onChange={(e) => handleFieldChange("state", e.target.value)}
              options={US_STATES}
              error={!!errors.state}
              required
            />
          </FormField>

          <FormField
            id="postalCode"
            label="Postal Code"
            error={errors.postalCode}
            required
          >
            <Input
              id="postalCode"
              value={customer.postalCode}
              onChange={(e) => handleFieldChange("postalCode", e.target.value)}
              error={!!errors.postalCode}
              required
            />
          </FormField>
        </div>

        <div className="flex justify-end">
          <FormSubmitButton
            type="submit"
            isLoading={isSubmitting}
            loadingText="Creating..."
          >
            Create Customer
          </FormSubmitButton>
        </div>
      </form>
    </PageContainer>
  );
};

export default CustomerFormPage;
