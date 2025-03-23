"use client";

import * as React from "react";
import SellerWrapper from "../../components/SellerWrapper";
import Stepper, { Step } from "@/app/components/ui/animated/Stepper";
import { FootTypo } from "@/app/components/ui/Typography";
import ImageUpload from "@/app/components/ui/upload/ImageUpload";
import Input from "@/app/components/ui/inputs/Input";
import { TbCurrencyDong } from "react-icons/tb";
import { useForm } from "react-hook-form";
import { Field, Textarea } from "@headlessui/react";
import ExampleNumberField from "@/app/components/ui/Select/NumberField";
import { useGetProviderBySlug } from "@/app/queries/user/provider.query";
import { useGetListProductCategory } from "@/app/queries/list/category.list.query";
import { useUser } from "@/app/providers/userprovider";
import DropdownSelectReturnObj from "@/app/components/ui/Select/DropdownObject";
import Button2 from "@/app/components/ui/Buttons/Button2";
import { useRouter, useSearchParams } from "next/navigation";
import { useGetProductById } from "@/app/queries/product/product.query";
import { useUpdateProduct } from "@/app/queries/product/product.query";
import { toast } from "sonner";

const ProductUpdate = () => {
  const { user } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get("id");

  console.log("Product ID:", productId);

  const { data: productDetails, isLoading: isLoadingProduct } = useGetProductById(productId);
  const { data: dataCategory } = useGetListProductCategory();
  const { data: dataProvider } = useGetProviderBySlug(user?.slug);
  
  const [images, setImages] = React.useState([]);
  const [existingImages, setExistingImages] = React.useState([]);
  const [selectedCategory, setSelectedCategory] = React.useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = React.useState(null);

  const { mutate: mutationUpdate, isPending } = useUpdateProduct();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    control,
    watch,
    reset,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      images: [],
      name: "",
      price: "",
      description: "",
      quantity: 1,
      madein: "",
      shipForm: dataProvider?.address,
      categoryId: "",
      providerId: ""
    },
  });

  // Populate form with product details when available
  React.useEffect(() => {
    if (productDetails) {
      reset({
        name: productDetails.productName,
        price: String(productDetails.productPrice),
        description: productDetails.description,
        quantity: productDetails.quantity,
        madein: productDetails.madeIn,
        shipForm: productDetails.shipFrom || dataProvider?.address,
        categoryId: productDetails.categoryId,
      });

      // Set existing images
      if (productDetails.imageUrls && productDetails.imageUrls.length > 0) {
        setExistingImages(productDetails.imageUrls.map((url, index) => ({
          id: `existing-${index}`,
          url: url,
          isExisting: true
        })));
      }

      // Set selected category
      const category = dataCategory?.find(cat => cat.id === productDetails.categoryId);
      if (category) {
        const categoryOption = {
          value: category.id,
          label: category.categoryName
        };
        setSelectedCategory(categoryOption);
        setSelectedCategoryId(category.id);
      }
    }
  }, [productDetails, dataProvider, dataCategory, reset]);

  const handleImageUpload = (uploadedImages) => {
    setImages(uploadedImages);
    setValue(
      "images",
      uploadedImages.map((img) => img.url)
    );
    console.log("Uploaded Images:", uploadedImages);
  };

  const CategoryOptions =
    dataCategory?.map((category) => ({
      value: category.id,
      label: category.categoryName,
    })) || [];

  const handleCategoryChange = (selected) => {
    if (selected) {
      setSelectedCategory(selected);
      setSelectedCategoryId(selected.value);
      setValue("categoryId", selected.value);
      console.log("Selected Category ID:", selected.value);
    }
  };

  const providerId = dataProvider?.id;

  const onSubmit = React.useCallback(
    async (data) => {
      if (!selectedCategoryId) {
        toast.error("Please select a category before proceeding.");
        return;
      }

      if (images.length === 0 && existingImages.length === 0) {
        toast.error("Please upload at least one image.");
        return;
      }

      const formData = new FormData();
      formData.append("id", productId);
      formData.append("ProductName", data.name);
      formData.append("Description", data.description);
      formData.append("ProductPrice", data.price);
      formData.append("Quantity", data.quantity);
      formData.append("MadeIn", data.madein);
      formData.append("ShipFrom", data.shipForm);
      formData.append("CategoryId", selectedCategoryId);

      existingImages.forEach(img => {
        formData.append("Images", img.url);
      });
      
      images.forEach((img) => {
        formData.append("Images", img);
      });

      console.log("Updating Product with ID:", productId);
      console.log("Existing images count:", existingImages.length);
      console.log("New images count:", images.length);
      console.log("Total images:", existingImages.length + images.length);

      mutationUpdate(formData, {
        onSuccess: (response) => {
          console.log("Product updated successfully:", response);
          toast.success("Product updated successfully");
          router.push("/seller/product");
        },
        onError: (error) => {
          console.error("Error updating product:", error);
          toast.error("Error updating product: " + (error.message || "Unknown error"));
        },
      });
    },
    [selectedCategoryId, images, existingImages, mutationUpdate, productId, providerId, user?.id, router]
  );

  const productName = watch("name");
  const price = watch("price");
  const description = watch("description");
  const quantity = watch("quantity");
  const madein = watch("madein");
  const shipForm = watch("shipForm");

  // Validation function for Step 1
  const validateStep = (step) => {
    if (step === 1) {
      if (
        !productName?.trim() ||
        !price?.trim() ||
        !description?.trim() ||
        (images.length === 0 && existingImages.length === 0)
      ) {
        toast.error("Please fill in all fields before proceeding.");
        return false;
      }
    }

    if (step === 2) {
      if (
        !quantity ||
        !madein?.trim() ||
        !shipForm?.trim() ||
        !selectedCategoryId
      ) {
        toast.error("Please fill in all fields before proceeding.");
        return false;
      }
    }
    return true;
  };

  if (isLoadingProduct) {
    return (
      <SellerWrapper>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </SellerWrapper>
    );
  }

  if (!productDetails && !isLoadingProduct) {
    return (
      <SellerWrapper>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
            <p className="mb-6">The product you are trying to update could not be found.</p>
            <Button2 
              onClick={() => router.push("/seller/product")}
              label="Back to Products"
              btnClass="mt-4"
            />
          </div>
        </div>
      </SellerWrapper>
    );
  }

  return (
    <SellerWrapper>
      <FootTypo
        footlabel="Update product details"
        className="text-lg font-semibold"
      />
      <Stepper
        initialStep={1}
        onStepChange={(step) => {
          console.log(step);
        }}
        backButtonText="Previous"
        nextButtonText="Next"
        validateStep={validateStep}
      >
        <Step validateStep={validateStep}>
          <div className="step-1 form-detail">
            <FootTypo
              footlabel="Basic information"
              className="text-2xl font-semibold border-b-[1px] pt-10 pb-5"
            />
            <div className="form inline-flex items-center w-full h-full gap-5 my-5">
              <FootTypo
                footlabel="Product Images :"
                className="!m-0 text-lg font-semibold"
              />
              <ImageUpload 
                onImageChange={handleImageUpload} 
                existingImages={existingImages}
                onExistingImagesChange={setExistingImages}
              />
            </div>
            <div className="form inline-flex items-center w-full h-full gap-5 my-5">
              <FootTypo
                footlabel="Product Name :"
                className="!m-0 text-lg font-semibold w-40"
              />
              <Input
                id="name"
                placeholder="Product name"
                required
                className=""
                register={register}
              />
            </div>
            <div className="form inline-flex items-center w-full h-full gap-5 my-5">
              <FootTypo
                footlabel="Product Price :"
                className="!m-0 text-lg font-semibold w-40"
              />
              <Input
                id="price"
                placeholder="Price"
                required
                icon={<TbCurrencyDong size={20} />}
                formatPrice
                control={control}
                register={register}
              />
            </div>
            <div className="form inline-flex items-start w-full h-full gap-5 my-5">
              <FootTypo
                footlabel="Descriptions :"
                className="!m-0 text-lg font-semibold w-40"
              />
              <div className="w-full">
                <Field>
                  <Textarea
                    {...register("description", { required: true })}
                    placeholder="descriptions"
                    className={`
      mt-3 block w-full resize-none rounded-lg border-[1px] 
      border-black dark:border-gray-600 py-1.5 px-3 text-sm/6 
      bg-white dark:bg-gray-800 text-black dark:text-white
      placeholder-gray-500 dark:placeholder-gray-400
      focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white
      transition duration-200
    `}
                    rows={10}
                  />
                </Field>
              </div>
            </div>
          </div>
        </Step>
        <Step>
          <div className="step-2 form min-h-screen">
            <FootTypo
              footlabel="Product specifications"
              className="text-2xl font-semibold border-b-[1px] pt-10 pb-5"
            />
            <div className="form inline-flex items-center w-full h-full gap-5 my-5">
              <FootTypo
                footlabel="Product Quantity :"
                className="!m-0 text-lg font-semibold"
              />
              <ExampleNumberField
                onChange={(value) => setValue("quantity", value)}
                value={watch("quantity")}
              />
            </div>
            <div className="form inline-flex items-center w-full h-full gap-5 my-5">
              <FootTypo
                footlabel="Product Origin :"
                className="!m-0 text-lg font-semibold"
              />
              <Input
                id="madein"
                placeholder="Made in"
                type="text"
                required
                register={register}
              />
            </div>
            <div className="form inline-flex items-center w-full h-full gap-5 my-5">
              <FootTypo
                footlabel="Ship From :"
                className="!m-0 text-lg font-semibold"
              />
              <Input
                id="shipForm"
                placeholder=""
                defaultValue={dataProvider?.address}
                disabled={true}
                required
                register={register}
              />
              <FootTypo
                footlabel="Note : If this not your address, please update your profile"
                className="!m-0 text-sm font-semibold"
              />
            </div>
            <div className="form inline-flex items-center w-full h-full gap-5 my-5">
              <FootTypo
                footlabel="Category :"
                className="!m-0 text-lg font-semibold"
              />
              <DropdownSelectReturnObj
                options={CategoryOptions}
                value={selectedCategory}
                onChange={handleCategoryChange}
                labelKey="label"
                valueKey="value"
                returnObject={true}
                lisboxClassName="mt-10"
              />
            </div>
          </div>
        </Step>
        <Step>
          <div className="step-3 form flex flex-col items-center justify-center p-5">
            <FootTypo
              footlabel="Confirm Changes"
              className="text-2xl font-semibold border-b-[1px] pt-10 pb-5"
            />

            <div className="bg-transparent p-5 rounded-lg w-full shadow-md space-y-5">
              <h3 className="text-lg font-semibold mb-2">Update Confirmation</h3>
              <p className="text-sm">
                Before updating your product, please confirm that:
              </p>
              <ul className="list-disc text-sm ml-5 mt-2 space-y-5">
                <li>All changes comply with the marketplace guidelines.</li>
                <li>The updated information is accurate and up to date.</li>
                <li>You are authorized to make these changes.</li>
                <li>Changes will be immediately reflected on your product listing.</li>
              </ul>
            </div>

            <div className="flex items-center mt-10">
              <input
                type="checkbox"
                {...register("agreePolicy", { required: true })}
                className="mr-2 w-5 h-5"
              />
              <label className="text-sm">
                I confirm that all the information provided is correct.
              </label>
            </div>

            {errors.agreePolicy && (
              <p className="text-red text-sm mt-2">
                You must confirm to proceed.
              </p>
            )}

            <Button2
              onClick={handleSubmit(onSubmit)}
              label="Update Product"
              btnClass="my-10"
              loading={isPending}
            />
          </div>
        </Step>
      </Stepper>
    </SellerWrapper>
  );
};

export default ProductUpdate;
