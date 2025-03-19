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
import { useCreateProduct } from "@/app/queries/product/product.query";
import { useRouter } from "next/navigation";

const ProductCreate = () => {
  const { user } = useUser();
  const router = useRouter();

  const { data: dataCategory } = useGetListProductCategory();

  const { data: dataProvider } = useGetProviderBySlug(user.slug);
  const [images, setImages] = React.useState([]);

  const [selectedCategory, setSelectedCategory] = React.useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = React.useState(null);

  const { mutate: mutationCreate, isPending } = useCreateProduct();

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

  //console.log("Dropdown Options:", CategoryOptions);

  const handleCategoryChange = (selected) => {
    if (selected) {
      setSelectedCategory(selected);
      setSelectedCategoryId(selected.value);
      setValue("categoryId", selected.value);
      console.log("Selected Category ID:", selected.value);
    }
  };

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    control,
    watch,
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

  const providerId = dataProvider?.id;

  const onSubmit = React.useCallback(
    async (data) => {
      if (!selectedCategoryId) {
        alert("Please select a category before proceeding.");
        return;
      }

      if (images.length === 0) {
        alert("Please upload at least one image.");
        return;
      }


      const formData = new FormData();
      formData.append("ProductName", data.name);
      formData.append("Description", data.description);
      formData.append("ProductPrice", data.price);
      formData.append("Quantity", data.quantity);
      formData.append("MadeIn", data.madein);
      formData.append("ShipFrom", data.shipForm);
      formData.append("CategoryId", selectedCategoryId);
      formData.append("ProviderId", providerId);
      formData.append("AccountId", user.id);

      
      // ✅ Append each image as a File
      images.forEach((img) => {
        formData.append("Images", img); 
      });

      console.log("Submitting FormData:", formData);

      mutationCreate(formData, {
        onSuccess: (response) => {
          console.log("Product created successfully:", response);
          router.push("/seller/product");
        },
        onError: (error) => {
          console.error("Error creating product:", error);
        },
      });
    },
    [selectedCategoryId, images, mutationCreate]
  );

  const productName = watch("name");
  const price = watch("price");
  const description = watch("description");

  const quantity = watch("quantity");
  const madein = watch("madein");
  const shipForm = watch("shipForm");
  const categoryId = watch("categoryId");

  // Validation function for Step 1
  const validateStep = (step) => {
    if (step === 1) {
      if (
        !productName?.trim() ||
        !price?.trim() ||
        !description?.trim() ||
        images.length === 0
      ) {
        alert("Please fill in all fields before proceeding.");
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
        alert("Please fill in all fields before proceeding.");
        return false;
      }
    }
    return true;
  };

  const handleQuantityChange = (value) => {
    setValue("quantity", value);
    console.log("Updated Quantity:", value);
  };

  return (
    <SellerWrapper>
      <FootTypo
        footlabel="Provide product details"
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
              <ImageUpload onImageChange={handleImageUpload} />
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
                footlabel="Product Name :"
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
              footlabel="Basic information"
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
              footlabel="Our Policy"
              className="text-2xl font-semibold border-b-[1px] pt-10 pb-5"
            />

            <div className="bg-transparent p-5 rounded-lg w-full  shadow-md space-y-5">
              <h3 className="text-lg font-semibold mb-2">Terms & Conditions</h3>
              <p className="text-sm">
                Before creating a product, please ensure that:
              </p>
              <ul className="list-disc text-sm ml-5 mt-2 space-y-5">
                <li>Your product complies with all legal regulations.</li>
                <li>All provided information is accurate and up to date.</li>
                <li>You agree to follow marketplace policies.</li>
                <li>Failure to comply may result in account suspension.</li>
              </ul>
            </div>

            <div className="flex items-center mt-10">
              <input
                type="checkbox"
                {...register("agreePolicy", { required: true })}
                className="mr-2 w-5 h-5"
              />
              <label className="text-sm">
                I have read and agree to the marketplace policies.
              </label>
            </div>

            {errors.agreePolicy && (
              <p className="text-red text-sm mt-2">
                You must agree to proceed.
              </p>
            )}

            <Button2
              onClick={handleSubmit(onSubmit)}
              label="Accept & Procceed"
              btnClass="my-10"
              loading={isPending}
            />
          </div>
        </Step>
      </Stepper>
    </SellerWrapper>
  );
};

export default ProductCreate;
