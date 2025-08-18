import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import type {Beer} from "@/types/beer";
import {BeerStyle} from "@/types/beer";
import BeerService from "../../services/beerService";
import PageContainer from "../../components/layout/PageContainer";
import {ConfirmationDialog, toast} from "../../components/ui/dialog";
import TabNavigation from "../../components/navigation/TabNavigation";
import {ArrowLeft, Save, Trash2} from "lucide-react";
import {FormField, FormSubmitButton, Input, Select,} from "../../components/ui/form";

const BeerDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [beer, setBeer] = useState<Beer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [_activeTab, setActiveTab] = useState("details");
  const [isEditing, setIsEditing] = useState(false);
  const [editedBeer, setEditedBeer] = useState<Beer | null>(null);
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Load beer data
  useEffect(() => {
    const loadBeer = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);

      try {
        const data = await BeerService.getBeerById(id);
        setBeer(data);
        setEditedBeer(data);
      } catch (err) {
        setError("Failed to load beer details. Please try again.");
        console.error("Error loading beer:", err);
        toast.error("Failed to load beer details");
      } finally {
        setLoading(false);
      }
    };

    loadBeer();
  }, [id]);

  // Handle edit toggle
  const toggleEdit = () => {
    if (isEditing) {
      // Cancel editing - reset to original data
      setEditedBeer(beer);
    }
    setIsEditing(!isEditing);
  };

  // Handle field change
  const handleFieldChange = (
    field: keyof Beer,
    value: string | number | BeerStyle,
  ) => {
    if (!editedBeer) return;

    setEditedBeer({
      ...editedBeer,
      [field]: value,
    });
  };

  // Handle save
  const handleSave = async () => {
    if (!editedBeer || !id) return;

    setSaving(true);

    try {
      const updatedBeer = await BeerService.updateBeer(id, {
        beerName: editedBeer.beerName,
        beerStyle: editedBeer.beerStyle,
        upc: editedBeer.upc,
        price: editedBeer.price,
        quantityOnHand: editedBeer.quantityOnHand,
      });

      setBeer(updatedBeer);
      setEditedBeer(updatedBeer);
      setIsEditing(false);
      toast.success("Beer updated successfully");
    } catch (err) {
      console.error("Error updating beer:", err);
      toast.error("Failed to update beer");
    } finally {
      setSaving(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!id) return;

    try {
      await BeerService.deleteBeer(id);
      toast.success("Beer deleted successfully");
      navigate("/beers");
    } catch (err) {
      console.error("Error deleting beer:", err);
      toast.error("Failed to delete beer");
    } finally {
      setShowDeleteConfirm(false);
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

  if (loading) {
    return (
      <PageContainer
        title="Beer Details"
        breadcrumbs={[
          { label: "Beers", to: "/beers" },
          { label: "Loading...", to: "#" },
        ]}
      >
        <div className="py-10 text-center">Loading beer details...</div>
      </PageContainer>
    );
  }

  if (error || !beer) {
    return (
      <PageContainer
        title="Beer Details"
        breadcrumbs={[
          { label: "Beers", to: "/beers" },
          { label: "Error", to: "#" },
        ]}
      >
        <div className="py-10 text-center text-red-500">
          {error || "Beer not found"}
          <button
            onClick={() => navigate("/beers")}
            className="ml-4 text-blue-500 hover:text-blue-700 underline"
          >
            Return to Beer List
          </button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title={isEditing ? "Edit Beer" : beer.beerName}
      description={
        isEditing ? "Update beer details" : `Style: ${beer.beerStyle}`
      }
      breadcrumbs={[
        { label: "Beers", to: "/beers" },
        { label: beer.beerName, to: `/beers/${beer.id}` },
      ]}
      actions={
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/beers")}
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
                Edit Beer
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-red-500 text-white hover:bg-red-600 h-10 px-4 py-2"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Beer
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
                disabled={!editedBeer}
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
          { id: "inventory", label: "Inventory" },
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
                    <FormField id="beerName" label="Beer Name" required>
                      <Input
                        id="beerName"
                        value={editedBeer?.beerName || ""}
                        onChange={(e) =>
                          handleFieldChange("beerName", e.target.value)
                        }
                        required
                      />
                    </FormField>

                    <FormField id="beerStyle" label="Beer Style" required>
                      <Select
                        id="beerStyle"
                        value={editedBeer?.beerStyle || ""}
                        onChange={(e) =>
                          handleFieldChange("beerStyle", e.target.value)
                        }
                        options={Object.entries(BeerStyle).map(
                          ([key, value]) => ({
                            value: value,
                            label: key
                              .replace(/_/g, " ")
                              .toLowerCase()
                              .split(" ")
                              .map(
                                (word) =>
                                  word.charAt(0).toUpperCase() + word.slice(1),
                              )
                              .join(" "),
                          }),
                        )}
                        required
                      />
                    </FormField>

                    <FormField id="upc" label="UPC" required>
                      <Input
                        id="upc"
                        value={editedBeer?.upc || ""}
                        onChange={(e) =>
                          handleFieldChange("upc", e.target.value)
                        }
                        required
                      />
                    </FormField>

                    <FormField id="price" label="Price" required>
                      <Input
                        id="price"
                        type="number"
                        min="0"
                        step="0.01"
                        value={editedBeer?.price || 0}
                        onChange={(e) =>
                          handleFieldChange("price", parseFloat(e.target.value))
                        }
                        required
                      />
                    </FormField>

                    <FormField id="quantityOnHand" label="Quantity On Hand">
                      <Input
                        id="quantityOnHand"
                        type="number"
                        min="0"
                        value={editedBeer?.quantityOnHand || 0}
                        onChange={(e) =>
                          handleFieldChange(
                            "quantityOnHand",
                            parseInt(e.target.value, 10),
                          )
                        }
                      />
                    </FormField>
                  </div>
                ) : (
                  // View Details
                  <div className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <h3 className="text-sm font-medium text-slate-500">
                          Beer Name
                        </h3>
                        <p className="mt-1 text-lg">{beer.beerName}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-slate-500">
                          Beer Style
                        </h3>
                        <p className="mt-1 text-lg">{beer.beerStyle}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-slate-500">
                          UPC
                        </h3>
                        <p className="mt-1 text-lg">{beer.upc}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-slate-500">
                          Price
                        </h3>
                        <p className="mt-1 text-lg">
                          {formatCurrency(beer.price)}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-slate-500">
                          Quantity On Hand
                        </h3>
                        <p className="mt-1 text-lg">
                          {beer.quantityOnHand || "N/A"}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-slate-500">
                          ID
                        </h3>
                        <p className="mt-1 text-sm font-mono text-slate-700">
                          {beer.id}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-slate-500">
                          Created Date
                        </h3>
                        <p className="mt-1 text-sm text-slate-700">
                          {formatDate(beer.createdDate)}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-slate-500">
                          Last Updated
                        </h3>
                        <p className="mt-1 text-sm text-slate-700">
                          {formatDate(beer.updatedDate)}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-slate-500">
                          Version
                        </h3>
                        <p className="mt-1 text-sm text-slate-700">
                          {beer.version}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          } else if (tabId === "inventory") {
            return (
              <div className="mt-6">
                <p className="text-center text-slate-500 py-10">
                  Inventory tracking features coming soon.
                </p>
              </div>
            );
          }
          return null;
        }}
      </TabNavigation>

      <ConfirmationDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Beer"
        message={`Are you sure you want to delete "${beer.beerName}"? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        type="error"
      />
    </PageContainer>
  );
};

export default BeerDetailPage;
