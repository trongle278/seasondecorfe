"use client";

import SellerWrapper from "../../../components/SellerWrapper";
import { useSearchParams } from "next/navigation";
import Stepper, { Step } from "@/app/components/ui/animated/Stepper";
import {
  useCreateContractByQuotationCode,
  useGetContractFile,
} from "@/app/queries/contract/contract.query";
import { Calendar } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { useState, useEffect } from "react";
import { BodyTypo, FootTypo } from "@/app/components/ui/Typography";
import { BorderBox } from "@/app/components/ui/BorderBox";
import { customCalendarStyles } from "@/app/(pages)/booking/components/PickDate";
import { format } from "date-fns";
import Spinner from "@/app/components/Spinner";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { TbArrowLeft } from "react-icons/tb";
import { Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";

const CreateContractPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const quotationCode = searchParams.get("quotationCode");
  const { mutate: createContract, isPending } =
    useCreateContractByQuotationCode();
  const [constructionDate, setConstructionDate] = useState(new Date());
  const {
    data: contractFile,
    isLoading: isContractFileLoading,
    refetch: refetchContractFile,
  } = useGetContractFile(quotationCode);
  const [currentStep, setCurrentStep] = useState(1);
  const [isCreatingContract, setIsCreatingContract] = useState(false);

  useEffect(() => {
    if (contractFile?.data) {
      setCurrentStep(2);
    }
  }, [contractFile?.data]);

  const handleCreateContract = () => {
    setIsCreatingContract(true);
    const formattedDate = format(
      constructionDate,
      "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
    );
    createContract(
      {
        quotationCode: quotationCode,
        constructionDate: formattedDate,
      },
      {
        onSuccess: async () => {
          toast.success("Contract created successfully");
          // Wait a bit for the file to be processed
          setTimeout(async () => {
            await refetchContractFile();
            setIsCreatingContract(false);
          }, 2000);
        },
        onError: (error) => {
          console.error("Error creating contract:", error);
          toast.error("Failed to create contract");
          setIsCreatingContract(false);
        },
      }
    );
  };

  const validateStep = (step) => {
    if (step === 1) {
      if (!constructionDate) {
        toast.error("Please select a construction date before proceeding.");
        return false;
      }
      handleCreateContract();
      return false; // Don't proceed to next step until file is loaded
    }
    return true;
  };

  if (isContractFileLoading || isCreatingContract) {
    return (
      <SellerWrapper>
        <BodyTypo bodylabel="Create Contract" className="!m-0 mb-5" />
        <div className="flex flex-col items-center justify-center self-center h-[600px] gap-4">
          <Spinner />
          <FootTypo
            footlabel={
              isCreatingContract
                ? "Creating contract..."
                : "Loading contract file..."
            }
            className="!m-0 text-gray-500"
          />
        </div>
      </SellerWrapper>
    );
  }

  return (
    <SellerWrapper>
      <button
        className="flex items-center gap-1 mb-5"
        onClick={() => router.back()}
      >
        <TbArrowLeft size={20} />
        <FootTypo footlabel="Go Back" className="!m-0" />
      </button>
      <BodyTypo bodylabel={contractFile?.data ? "View Contract" : "Create Contract"} className="!m-0 mb-5" />
      <Stepper
        initialStep={currentStep}
        onStepChange={(step) => {
          setCurrentStep(step);
        }}
        backButtonText="Previous"
        nextButtonText="Next"
        validateStep={validateStep}
        isContractStep={true}
      >
        <Step>
          <div className="flex flex-col gap-6">
            <BorderBox className="flex flex-col gap-4 border shadow-xl p-6">
              <FootTypo
                footlabel="Select Construction Date"
                className="!m-0 text-lg font-semibold"
              />
              <FootTypo
                footlabel="Please choose when you will start the construction"
                className="!m-0 text-sm text-gray-500"
              />
              <div className="flex justify-center w-full">
                <style jsx global>
                  {customCalendarStyles}
                </style>

                <Calendar
                  date={constructionDate}
                  onChange={(date) => setConstructionDate(date)}
                  minDate={new Date()}
                  color="#2563eb"
                />
              </div>
              <div className="flex items-center gap-2 mt-2">
                <FootTypo footlabel="Selected date:" className="!m-0 text-sm" />
                <FootTypo
                  footlabel={constructionDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                  className="!m-0 text-sm font-medium"
                />
              </div>
            </BorderBox>
          </div>
        </Step>
        <Step>
          <div className="flex flex-col gap-6">
            <FootTypo
              footlabel="Contract preview"
              className="!m-0 text-lg font-semibold self-center"
            />
            <div className="h-[800px] flex flex-col border rounded-md">
              {contractFile?.data ? (
                <Viewer fileUrl={contractFile?.data.fileUrl} defaultScale={1.5} />
              ) : (
                <div className="flex items-center justify-center h-[600px] bg-gray-50">
                  <FootTypo
                    footlabel="No contract file available yet"
                    className="!m-0 text-sm text-gray-500"
                  />
                </div>
              )}
            </div>
          </div>
        </Step>
      </Stepper>
    </SellerWrapper>
  );
};

export default CreateContractPage;
