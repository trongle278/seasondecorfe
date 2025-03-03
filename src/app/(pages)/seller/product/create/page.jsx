"use client";

import * as React from "react";
import SellerWrapper from "../../components/SellerWrapper";
import Stepper, { Step } from "@/app/components/ui/animated/Stepper";
import { FootTypo } from "@/app/components/ui/Typography";
import ImageUpload from "@/app/components/ui/upload/ImageUpload";
import Input from "@/app/components/ui/inputs/Input";
import { TbCurrencyDong } from "react-icons/tb";
import { useForm } from "react-hook-form";
import { Description, Field, Label, Textarea } from "@headlessui/react";
import ExampleNumberField from "@/app/components/ui/Select/NumberField";
import { useGetProviderById } from "@/app/queries/user/provider.query";
import { useGetListProductCategory } from "@/app/queries/list/category.list.query";
import { useUser } from "@/app/providers/userprovider";
import DropdownSelect from "@/app/components/ui/Select/DropdownSelect";

const ProductCreate = () => {
  const { user } = useUser();

  const { data: dataCategory } = useGetListProductCategory();

  const { data: dataProvider } = useGetProviderById(user.id);
  const [images, setImages] = React.useState([]);
  const handleImageUpload = (images) => {
    setImages(images);
    console.log(images);
  };

  const CategoryOptions =
    dataCategory?.map((category) => ({
      value: category.id, 
      label: category.categoryName,
    })) || [];

  //console.log("Dropdown Options:", CategoryOptions);

  const [selectedCategory, setSelectedCategory] = React.useState(null);

  const {
    register,
    handleSubmit,
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
      quantity: "",
      madein: "",
      shipForm: dataProvider?.address,
      categoryId: "",
    },
  });

  const productName = watch("productname");
  const price = watch("price");
  const description = watch("description");

  // Validation function for Step 1
  const validateStep = (step) => {
    if (step === 1) {
      if (!productName || !price || !description || images.length === 0) {
        alert("Please fill in all fields before proceeding.");
        return false;
      }
    }
    return true;
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
        <Step>
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
              <ImageUpload />
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
          <div className="step-2 form">
            <FootTypo
              footlabel="Basic information"
              className="text-2xl font-semibold border-b-[1px] pt-10 pb-5"
            />
            <div className="form inline-flex items-center w-full h-full gap-5 my-5">
              <FootTypo
                footlabel="Product Quantity :"
                className="!m-0 text-lg font-semibold"
              />
              <ExampleNumberField />
            </div>
            <div className="form inline-flex items-center w-full h-full gap-5 my-5">
              <FootTypo
                footlabel="Product Origin :"
                className="!m-0 text-lg font-semibold"
              />
              <Input
                id="madein"
                placeholder="Made in"
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
              <DropdownSelect
                options={CategoryOptions} 
                value={selectedCategory} 
                onChange={(selected) => setSelectedCategory(selected)} 
                labelKey="label"
                lisboxClassName="mt-10"
              />
            </div>
          </div>
        </Step>
        <Step>
          <h2>How about an input?</h2>
        </Step>
      </Stepper>
    </SellerWrapper>
  );
};

export default ProductCreate;
