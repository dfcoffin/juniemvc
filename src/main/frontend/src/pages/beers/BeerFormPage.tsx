import {useState} from "react";
import {useNavigate} from "react-router-dom";
import type {BeerDto} from "@/types/beer";
import {BeerStyle} from "@/types/beer";
import BeerService from "../../services/beerService";
import PageContainer from "../../components/layout/PageContainer";
import {FormField, FormSubmitButton, ImageUpload, Input, Select,} from "../../components/ui/form";
import {toast} from "../../components/ui/dialog";
import {ArrowLeft} from "lucide-react";
import {minLength, numberRange, pattern, required,} from "../../utils/validation";

const BeerFormPage = () => {
  const navigate = useNavigate();

  // Form state
  const [beer, setBeer] = useState<BeerDto>({
    beerName: "",
    beerStyle: BeerStyle.LAGER, // Default style
    upc: "",
    price: 0,
    quantityOnHand: 0,
    image: undefined,
  });

  // Form validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Loading state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Image handling
  const handleImageChange = (file: File | null) => {
    handleFieldChange("image", file || undefined);
  };

  // Handle field change
  const handleFieldChange = (
    field: keyof BeerDto,
    value: string | number | BeerStyle | File | undefined,
  ) => {
    setBeer({
      ...beer,
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

    // Beer name validation
    const nameError = required(beer.beerName) || minLength(3)(beer.beerName);
    if (nameError) {
      newErrors.beerName = nameError;
    }

    // UPC validation
    const upcError =
      required(beer.upc) ||
      pattern(/^\d{12,13}$/, "UPC must be 12-13 digits")(beer.upc);
    if (upcError) {
      newErrors.upc = upcError;
    }

    // Price validation
    const priceError =
      required(beer.price) || numberRange(0.01, 1000000)(beer.price);
    if (priceError) {
      newErrors.price = priceError;
    }

    // Quantity validation (optional)
    if (beer.quantityOnHand !== undefined) {
      const quantityError = numberRange(0, 1000000)(beer.quantityOnHand);
      if (quantityError) {
        newErrors.quantityOnHand = quantityError;
      }
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
      // Create a copy of the beer object without the image
      const { image, ...beerWithoutImage } = beer;

      // Create the beer
      const newBeer = await BeerService.createBeer(beerWithoutImage);

      // If an image was provided, upload it
      if (image) {
        try {
          await BeerService.uploadBeerImage(newBeer.id!, image);
          toast.success("Beer created successfully with image");
        } catch (imageErr) {
          console.error("Error uploading image:", imageErr);
          toast.warning(
            "Beer created, but image upload failed. You can try uploading the image later.",
          );
        }
      } else {
        toast.success("Beer created successfully");
      }

      navigate(`/beers/${newBeer.id}`);
    } catch (err) {
      console.error("Error creating beer:", err);

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
              "Failed to create beer: " +
                (errorData.message || "Unknown error"),
            );
          }
        } catch {
          toast.error("Failed to create beer. Please try again.");
        }
      } else {
        toast.error("Failed to create beer. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageContainer
      title="Create New Beer"
      description="Add a new beer to your inventory"
      breadcrumbs={[
        { label: "Beers", to: "/beers" },
        { label: "New Beer", to: "/beers/new" },
      ]}
      actions={
        <button
          onClick={() => navigate("/beers")}
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
            id="beerName"
            label="Beer Name"
            error={errors.beerName}
            required
          >
            <Input
              id="beerName"
              value={beer.beerName}
              onChange={(e) => handleFieldChange("beerName", e.target.value)}
              error={!!errors.beerName}
              required
            />
          </FormField>

          <FormField id="beerStyle" label="Beer Style" required>
            <Select
              id="beerStyle"
              value={beer.beerStyle}
              onChange={(e) => handleFieldChange("beerStyle", e.target.value)}
              options={Object.entries(BeerStyle).map(([key, value]) => ({
                value: value,
                label: key
                  .replace(/_/g, " ")
                  .toLowerCase()
                  .split(" ")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" "),
              }))}
              required
            />
          </FormField>

          <FormField
            id="upc"
            label="UPC"
            error={errors.upc}
            description="12-13 digit Universal Product Code"
            required
          >
            <Input
              id="upc"
              value={beer.upc}
              onChange={(e) => handleFieldChange("upc", e.target.value)}
              error={!!errors.upc}
              required
            />
          </FormField>

          <FormField id="price" label="Price" error={errors.price} required>
            <Input
              id="price"
              type="number"
              min="0"
              step="0.01"
              value={beer.price}
              onChange={(e) =>
                handleFieldChange("price", parseFloat(e.target.value))
              }
              error={!!errors.price}
              required
            />
          </FormField>

          <FormField
            id="quantityOnHand"
            label="Quantity On Hand"
            error={errors.quantityOnHand}
          >
            <Input
              id="quantityOnHand"
              type="number"
              min="0"
              value={
                beer.quantityOnHand === undefined ? "" : beer.quantityOnHand
              }
              onChange={(e) =>
                handleFieldChange(
                  "quantityOnHand",
                  parseInt(e.target.value, 10),
                )
              }
              error={!!errors.quantityOnHand}
            />
          </FormField>

          <FormField
            id="beerImage"
            label="Beer Image"
            error={errors.image}
            description="Upload an image of your beer"
          >
            <ImageUpload
              id="beerImage"
              onChange={handleImageChange}
              error={!!errors.image}
            />
          </FormField>
        </div>

        <div className="flex justify-end">
          <FormSubmitButton
            type="submit"
            isLoading={isSubmitting}
            loadingText="Creating..."
          >
            Create Beer
          </FormSubmitButton>
        </div>
      </form>
    </PageContainer>
  );
};

export default BeerFormPage;
