"use client";

import React, { useState, useEffect, useMemo } from "react";
import SellerWrapper from "../../../components/SellerWrapper";
import { FootTypo } from "@/app/components/ui/Typography";
import Button from "@/app/components/ui/Buttons/Button";
import { MdAdd, MdDelete, MdModeEdit, MdPreview } from "react-icons/md";
import { IoDownloadOutline } from "react-icons/io5";
import { BorderBox } from "@/app/components/ui/BorderBox";
import { useForm } from "react-hook-form";
import { useParams, useSearchParams } from "next/navigation";
import MaterialTab from "../../components/MaterialTab";
import ConstructionTab from "../../components/ConstructionTab";
import TermTab from "../../components/TermTab";
import { formatCurrency } from "@/app/helpers";
import { useCreateQuotation } from "@/app/queries/quotation/quotation.query";
import { useUploadQuotationFile } from "@/app/queries/quotation/quotation.query";
import { AiOutlineUpload } from "react-icons/ai";
import { TbArrowLeft } from "react-icons/tb";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const QuotationPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const searchParams = useSearchParams();
  const fullName = searchParams.get("fullName") || "";
  const email = searchParams.get("email") || "";

  const { mutate: createQuotation, isLoading: isCreatingQuotation } =
    useCreateQuotation();
  const { mutate: uploadQuotationFile, isLoading: isUploadingFile } =
    useUploadQuotationFile();

  const [showEditor, setShowEditor] = useState(true);
  const [activeTab, setActiveTab] = useState("Information");
  const [isPdfReady, setIsPdfReady] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [quotationData, setQuotationData] = useState({
    quotationCode: id,
    customerName: fullName || "John Doe",
    customerEmail: email || "john.doe@example.com",
    terms:
      "Payment due within 30 days. Cancelation policy: 50% refund if canceled 30 days before the event.",
    materials: [
      {
        materialName: "",
        quantity: 1,
        cost: 0,
        category: "",
      },
    ],
    constructionTasks: [
      {
        taskName: "",
        cost: 0,
        unit: "",
        length: 0,
        width: 0,
      },
    ],
  });

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors },
    control,
  } = useForm({
    defaultValues: {},
  });

  // Initialize form data on component mount
  useEffect(() => {
    // Register terms and deposit percentage
    setValue("terms", quotationData.terms);
    setValue("depositPercentage", quotationData.depositPercentage || 20);

    // Register material fields
    quotationData.materials.forEach((material, index) => {
      Object.keys(material).forEach((key) => {
        setValue(`materials.${index}.${key}`, material[key]);
      });
    });

    // Register construction task fields
    quotationData.constructionTasks.forEach((task, index) => {
      Object.keys(task).forEach((key) => {
        setValue(`constructionTasks.${index}.${key}`, task[key]);
      });
    });
  }, []);

  // Handle terms change
  const handleTermsChange = (e) => {
    const terms = e.target.value;
    setQuotationData((prev) => ({
      ...prev,
      terms,
    }));
    setValue("terms", terms);
  };

  // Handle deposit percentage change
  const handleDepositChange = (e) => {
    const depositPercentage = parseInt(e.target.value) || 0;
    setQuotationData((prev) => ({
      ...prev,
      depositPercentage,
    }));
    setValue("depositPercentage", depositPercentage);
  };

  // Material handling functions
  const handleMaterialChange = (index, field, value) => {
    const updatedMaterials = [...quotationData.materials];

    // Ensure cost is stored as a number, not a string
    if (field === "cost") {
      value = parseFloat(value) || 0;
    } else if (field === "quantity") {
      value = parseInt(value) || 0;
    }

    updatedMaterials[index] = {
      ...updatedMaterials[index],
      [field]: value,
    };

    // Update state
    setQuotationData((prev) => ({
      ...prev,
      materials: updatedMaterials,
    }));

    // Also update the form value
    setValue(`materials.${index}.${field}`, value);
  };

  const addMaterial = () => {
    const newMaterial = {
      materialName: "",
      quantity: 1,
      cost: 0,
      category: "",
    };

    const newIndex = quotationData.materials.length;

    // First update the state
    setQuotationData((prev) => ({
      ...prev,
      materials: [...prev.materials, newMaterial],
    }));

    // Then register each field with react-hook-form
    Object.keys(newMaterial).forEach((key) => {
      setValue(`materials.${newIndex}.${key}`, newMaterial[key]);
    });
  };

  const removeMaterial = (index) => {
    // Prevent removing if it's the last item
    if (quotationData.materials.length <= 1) {
      alert("At least one material item must remain in the list.");
      return;
    }

    const updatedMaterials = [...quotationData.materials];
    updatedMaterials.splice(index, 1);

    // Update state
    setQuotationData((prev) => ({
      ...prev,
      materials: updatedMaterials,
    }));

    // Re-register all remaining materials with updated indices
    updatedMaterials.forEach((material, idx) => {
      Object.keys(material).forEach((key) => {
        setValue(`materials.${idx}.${key}`, material[key]);
      });
    });
  };

  // Construction task handling functions
  const handleTaskChange = (index, field, value) => {
    const updatedTasks = [...quotationData.constructionTasks];

    // Ensure cost, length, and width are stored as numbers, not strings
    if (field === "cost") {
      value = parseFloat(value) || 0;
    } else if (field === "length" || field === "width") {
      value = parseInt(value) || 0;
    }

    updatedTasks[index] = {
      ...updatedTasks[index],
      [field]: value,
    };

    // Update state
    setQuotationData((prev) => ({
      ...prev,
      constructionTasks: updatedTasks,
    }));

    // Also update the form value
    setValue(`constructionTasks.${index}.${field}`, value);
  };

  const addTask = () => {
    const newTask = {
      taskName: "",
      cost: 0,
      unit: "",
      length: 0,
      width: 0,
    };

    const newIndex = quotationData.constructionTasks.length;

    // First update the state
    setQuotationData((prev) => ({
      ...prev,
      constructionTasks: [...prev.constructionTasks, newTask],
    }));

    // Then register each field with react-hook-form
    Object.keys(newTask).forEach((key) => {
      setValue(`constructionTasks.${newIndex}.${key}`, newTask[key]);
    });
  };

  const removeTask = (index) => {
    // Prevent removing if it's the last item
    if (quotationData.constructionTasks.length <= 1) {
      alert("At least one construction task must remain in the list.");
      return;
    }

    const updatedTasks = [...quotationData.constructionTasks];
    updatedTasks.splice(index, 1);

    // Update state
    setQuotationData((prev) => ({
      ...prev,
      constructionTasks: updatedTasks,
    }));

    // Re-register all remaining tasks with updated indices
    updatedTasks.forEach((task, idx) => {
      Object.keys(task).forEach((key) => {
        setValue(`constructionTasks.${idx}.${key}`, task[key]);
      });
    });
  };

  // Helper function to parse potentially formatted number strings
  const parseFormattedNumber = (value) => {
    if (typeof value === "number") return value;
    if (!value) return 0;

    // First convert to string
    const stringValue = value.toString();

    // Check if this is a number already formatted by our Input component with formatPrice
    // These values often are formatted in Vietnamese format (e.g., "1.000.000")

    // Remove all dots, commas and spaces
    const cleanStr = stringValue.replace(/[.,\s]/g, "");
    const result = parseFloat(cleanStr);

    // Log the parsing for debugging
    console.log(`Parsing "${value}" -> "${cleanStr}" -> ${result}`);

    return isNaN(result) ? 0 : result;
  };

  // Total calculation for display
  const calculateMaterialTotal = () => {
    return quotationData.materials.reduce((sum, item) => {
      const cost = parseFormattedNumber(item.cost);
      const quantity = parseFormattedNumber(item.quantity) || 1;
      // console.log(`Calculating material: ${item.materialName}, raw cost=${item.cost}, parsed cost=${cost}, qty=${quantity}`);
      return sum + cost * quantity;
    }, 0);
  };

  const calculateConstructionTotal = () => {
    return quotationData.constructionTasks.reduce((sum, item) => {
      const cost = parseFormattedNumber(item.cost);
      console.log(
        `Calculating task: ${item.taskName}, raw cost=${item.cost}, parsed cost=${cost}`
      );
      return sum + cost;
    }, 0);
  };

  const calculateGrandTotal = () => {
    return calculateMaterialTotal() + calculateConstructionTotal();
  };

  // Helper function to check if an item is valid
  const isItemValid = (item, type) => {
    if (type === "material") {
      return item.materialName && item.materialName.trim() !== "";
    } else if (type === "construction") {
      return item.taskName && item.taskName.trim() !== "";
    }
    return false;
  };

  // Helper function to check if an item is empty
  const isItemEmpty = (item, type) => {
    if (type === "material") {
      return !item.materialName || item.materialName.trim() === "";
    } else if (type === "construction") {
      return !item.taskName || item.taskName.trim() === "";
    }
    return true;
  };

  // Check if quotation data is valid for submission
  const isQuotationValid = () => {
    // Check if there's at least one valid material
    const hasValidMaterials = quotationData.materials.some((item) =>
      isItemValid(item, "material")
    );

    // Check if there's at least one valid construction task
    const hasValidTasks = quotationData.constructionTasks.some((item) =>
      isItemValid(item, "construction")
    );

    // Check if there are any empty items (newly added but not filled)
    const hasEmptyMaterials = quotationData.materials.some((item) =>
      isItemEmpty(item, "material")
    );

    const hasEmptyTasks = quotationData.constructionTasks.some((item) =>
      isItemEmpty(item, "construction")
    );

    // Both must have at least one valid item and no empty items
    return (
      hasValidMaterials && hasValidTasks && !hasEmptyMaterials && !hasEmptyTasks
    );
  };

  // Function to submit quotation and upload PDF
  const onSubmit = async () => {
    try {
      setIsProcessing(true);

      // Use current state rather than form values to ensure deleted items stay deleted
      const currentState = { ...quotationData };

      // Get deposit percentage from form
      const formData = getValues();
      const depositPercentage =
        parseInt(formData.depositPercentage) ||
        currentState.depositPercentage ||
        20;

      // Use the current state data for API submission
      const quotationPayload = {
        bookingCode: id, 
        materials: currentState.materials,
        constructionTasks: currentState.constructionTasks,
        depositPercentage: depositPercentage,
      };

      console.log("Submitting payload:", quotationPayload);

      // First API call: Create quotation
      createQuotation(quotationPayload, {
        onSuccess: (response) => {
          console.log("Quotation created successfully:", response);

          // Generate PDF blob for upload using the current state
          generatePdfBlob()
            .then((pdfBlob) => {
              // Prepare form data for file upload
              const formData = new FormData();
              formData.append("file", pdfBlob, `quotation_${id}.pdf`);
              formData.append("bookingCode", id);

              // Second API call: Upload PDF file
              uploadQuotationFile(formData, {
                onSuccess: (uploadResponse) => {
                  console.log("PDF uploaded successfully:", uploadResponse);
                  setIsProcessing(false);
                  toast.success("Quotation submitted and PDF uploaded successfully!");
                  // Navigate back to seller requests page
                  router.push('/seller/request');
                },
                onError: (error) => {
                  console.error("Error uploading PDF:", error);
                  setIsProcessing(false);
                  toast.error(
                    "Quotation was created but PDF upload failed. Please try again."
                  );
                },
              });
            })
            .catch((error) => {
              console.error("Error generating PDF:", error);
              setIsProcessing(false);
              toast.error("Error generating PDF. Please try again.");
            });
        },
        onError: (error) => {
          console.error("Error creating quotation:", error);
          setIsProcessing(false);
          toast.error(
            "Failed to create quotation. Please check your data and try again."
          );
        },
      });
    } catch (error) {
      console.error("Unexpected error:", error);
      setIsProcessing(false);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  // Helper function to generate PDF blob
  const generatePdfBlob = () => {
    return new Promise((resolve, reject) => {
      // Use the current state directly to ensure deleted items stay deleted
      const pdfData = { ...quotationData };

      import("../[id]/QuotationPdf")
        .then((module) => {
          if (module.generatePdfBlob) {
            module
              .generatePdfBlob(pdfData)
              .then((blob) => resolve(blob))
              .catch((err) => reject(err));
          } else {
            // If the function doesn't exist, we need to add it to QuotationPdf.js
            reject(new Error("PDF generation function not found"));
          }
        })
        .catch((err) => reject(err));
    });
  };

  // Function to preview PDF
  const previewPdf = () => {
    // Reset PDF ready state first to force a complete refresh
    setIsPdfReady(false);

    // Use the current state directly
    // No need to update the state since we're using it directly

    // Show the PDF viewer
    setShowEditor(false);

    // Lazy load PDF preview components with slight delay to ensure state updates
    setTimeout(() => {
      import("../[id]/QuotationPdf").then(() => {
        setIsPdfReady(true);
      });
    }, 50);
  };

  return (
    <SellerWrapper>
      <button
        className="flex items-center gap-1 mb-5"
        onClick={() => router.back()}
      >
        <TbArrowLeft size={20} />
        <FootTypo footlabel="Go Back" className="!m-0" />
      </button>
      <div className="w-full">
        <div className="mb-6 flex justify-between items-center">
          <div className="flex flex-row gap-2 items-center">
            <FootTypo footlabel="Quotation" />
            <FootTypo
              footlabel={`#${id}`}
              className="bg-primary text-white rounded-md p-2 font-semibold"
            />
          </div>

          <div className="flex gap-3">
            <Button
              label={showEditor ? "Preview PDF" : "Edit Quotation"}
              icon={
                showEditor ? <MdPreview size={20} /> : <MdModeEdit size={20} />
              }
              className="bg-primary h-fit"
              onClick={() => (showEditor ? previewPdf() : setShowEditor(true))}
            />

            <div className="flex flex-col">
              <Button
                label={isProcessing ? "Processing..." : "Submit Quotation"}
                icon={<AiOutlineUpload size={20} />}
                className={isQuotationValid() ? "bg-yellow" : ""}
                onClick={handleSubmit(onSubmit)}
                disabled={
                  isProcessing ||
                  isCreatingQuotation ||
                  isUploadingFile ||
                  !isQuotationValid()
                }
              />

              {/* Show validation message when there are unfilled items */}
              {!isQuotationValid() &&
                quotationData.materials.some((item) =>
                  isItemEmpty(item, "material")
                ) && (
                  <span className="text-red text-xs mt-1">
                    Please fill in all material names
                  </span>
                )}
            </div>

            {!showEditor && isPdfReady && (
              <QuotationDownloadButton
                quotationData={quotationData}
                key={new Date().getTime()}
              />
            )}
          </div>
        </div>

        <div className="w-full flex flex-col">
          {showEditor ? (
            <BorderBox className="w-full shadow-xl">
              {/* Tabs Navigation */}
              <div className="flex flex-wrap">
                <button
                  className={`py-3 px-6 font-medium ${
                    activeTab === "Information"
                      ? "border-b-2 border-primary text-primary"
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("Information")}
                >
                  Information
                </button>
                <button
                  className={`py-3 px-6 font-medium ${
                    activeTab === "Materials"
                      ? "border-b-2 border-primary text-primary"
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("Materials")}
                >
                  Materials
                </button>
                <button
                  className={`py-3 px-6 font-medium ${
                    activeTab === "Construction"
                      ? "border-b-2 border-primary text-primary"
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("Construction")}
                >
                  Construction
                </button>
                <button
                  className={`py-3 px-6 font-medium ${
                    activeTab === "Terms"
                      ? "border-b-2 border-primary text-primary"
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("Terms")}
                >
                  Terms
                </button>
                <button
                  className={`py-3 px-6 font-medium ${
                    activeTab === "Summary"
                      ? "border-b-2 border-primary text-primary"
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("Summary")}
                >
                  Summary
                </button>
              </div>

              {/* Tab Content */}
              <div className="p-6 font-semibold">
                {/* Client Info Tab */}
                {activeTab === "Information" && (
                  <div className="space-y-4">
                    <div className="flex flex-row gap-3 items-center">
                      <FootTypo footlabel="Name" className="!m-0 text-sm" />
                      <FootTypo footlabel={fullName} className="!m-0" />
                    </div>
                    <div className="flex flex-row gap-3 items-center">
                      <FootTypo footlabel="Email" className="!m-0 text-sm" />
                      <FootTypo footlabel={email} className="!m-0" />
                    </div>
                  </div>
                )}

                {/* Materials Tab */}
                {activeTab === "Materials" && (
                  <MaterialTab
                    materials={quotationData.materials}
                    onMaterialChange={handleMaterialChange}
                    onAddMaterial={addMaterial}
                    onRemoveMaterial={removeMaterial}
                    calculateMaterialTotal={calculateMaterialTotal}
                    register={register}
                    control={control}
                  />
                )}

                {/* Construction Tab */}
                {activeTab === "Construction" && (
                  <ConstructionTab
                    constructionTasks={quotationData.constructionTasks}
                    onTaskChange={handleTaskChange}
                    onAddTask={addTask}
                    onRemoveTask={removeTask}
                    calculateConstructionTotal={calculateConstructionTotal}
                    register={register}
                    control={control}
                  />
                )}

                {/* Terms Tab */}
                {activeTab === "Terms" && (
                  <TermTab
                    register={register}
                    value={quotationData.terms}
                    depositPercentage={quotationData.depositPercentage}
                    onTermsChange={handleTermsChange}
                    onDepositChange={handleDepositChange}
                  />
                )}

                {/* Summary Tab */}
                {activeTab === "Summary" && (
                  <div className="space-y-4">
                    <div className="border-b pb-4">
                      <h3 className="text-lg font-bold mb-4">
                        Quotation Summary
                      </h3>
                      <div className="flex justify-between items-center mb-2">
                        <span>Materials Total:</span>
                        <span className="font-bold">
                          {formatCurrency(calculateMaterialTotal())}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span>Construction Total:</span>
                        <span className="font-bold">
                          {formatCurrency(calculateConstructionTotal())}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mb-2 text-lg">
                      <span>Grand Total:</span>
                      <span className="font-bold">
                        {formatCurrency(calculateGrandTotal())}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </BorderBox>
          ) : (
            <div className="bg-transparent h-[800px]">
              {isPdfReady ? (
                <PdfPreview
                  quotationData={quotationData}
                  key={new Date().getTime()}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading PDF preview...</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </SellerWrapper>
  );
};

// We only load the PDF components when needed
const PdfPreview = ({ quotationData }) => {
  const [Component, setComponent] = useState(null);

  console.log("PdfPreview received data:", quotationData);

  useEffect(() => {
    import("../[id]/QuotationPdf").then((module) => {
      setComponent(() => module.PdfPreview);
    });
  }, []);

  if (!Component) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Use the data directly without any caching or refs
  return <Component quotationData={quotationData} />;
};

const QuotationDownloadButton = ({ quotationData }) => {
  const [Component, setComponent] = useState(null);

  useEffect(() => {
    import("../[id]/QuotationPdf").then((module) => {
      setComponent(() => module.PdfDownloadButton);
    });
  }, []);

  if (!Component) {
    return (
      <Button
        label="Loading..."
        icon={<IoDownloadOutline size={20} />}
        className="bg-gray-400"
        disabled
      />
    );
  }

  // Use the data directly
  return <Component quotationData={quotationData} />;
};

export default QuotationPage;
