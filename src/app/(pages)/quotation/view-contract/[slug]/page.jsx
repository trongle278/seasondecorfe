"use client";

import React from "react";
import Container from "@/app/components/layouts/Container";
import MuiBreadcrumbs from "@/app/components/ui/breadcrums/Breadcrums";
import { BodyTypo } from "@/app/components/ui/Typography";
import { useParams } from "next/navigation";
import { useGetContractFile } from "@/app/queries/contract/contract.query";
import { Divider } from "@mui/material";
import Button from "@/app/components/ui/Buttons/Button";
import { useSignContract } from "@/app/queries/contract/contract.query";
import { TbArrowLeft } from "react-icons/tb";
import { useRouter } from "next/navigation";
import { FootTypo } from "@/app/components/ui/Typography";
import { LuBadgeCheck } from "react-icons/lu";

const ViewContractPage = () => {
  const router = useRouter();
  const { slug } = useParams();

  const { data: contractFile, isLoading: isContractLoading } =
    useGetContractFile(slug);

  const { mutate: signContract, isLoading: isSigningContract } = useSignContract();

  const handleSignContract = () => {
    signContract(contractFile?.data.contractCode, {
      onSuccess: () => {
        alert("Contract signed successfully");
      },
      onError: () => {
        alert("Failed to sign contract");
      },
    });
  };
  return (
    <Container>
     <button
        className="flex items-center gap-1 mb-5"
        onClick={() => router.back()}
      >
        <TbArrowLeft size={20} />
        <FootTypo footlabel="Go Back" className="!m-0" />
      </button>
      <section className="flex flex-row justify-between items-center my-5">
        <BodyTypo bodylabel={`Review Contract - ${contractFile?.data.contractCode}`} />
      </section>
      <div className="flex flex-col h-[800px]">
        <iframe src={contractFile?.data.fileUrl} className="w-full h-full rounded-lg" />
      </div>
      <Divider variant="middle" flexItem />
      <section className="flex flex-row justify-center items-center my-10">
      {contractFile?.data.isSigned ? (
         <div className="flex flex-row justify-center gap-2 items-center">
          <LuBadgeCheck className="text-primary flex-shrink-0" size={30} />
          <FootTypo footlabel="Contract Signed" className="!m-0" />
         </div>
      ) : (
        <Button label="Sign Contract" className="!m-0 self-center" onClick={handleSignContract} disabled={isSigningContract} loading={isSigningContract}/>
      )}
      </section>
    </Container>
  );
};

export default ViewContractPage;
