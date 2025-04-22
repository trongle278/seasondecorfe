"use client";

import React from "react";
import Container from "@/app/components/layouts/Container";
import { BodyTypo, FootTypo } from "@/app/components/ui/Typography";
import { useParams, useRouter } from "next/navigation";
import { useGetContractFile } from "@/app/queries/contract/contract.query";
import { Divider, Paper, Skeleton } from "@mui/material";
import Button from "@/app/components/ui/Buttons/Button";
import { useSignContract } from "@/app/queries/contract/contract.query";
import { TbArrowLeft } from "react-icons/tb";
import {
  LuBadgeCheck,
  LuBanknote,
  LuUser,
  LuBuilding,
  LuBadgeX,
} from "react-icons/lu";
import { HiOutlineDocumentText } from "react-icons/hi";
import { TbSignature } from "react-icons/tb";
import { BsFileEarmarkPdf } from "react-icons/bs";
import { formatCurrency } from "@/app/helpers";
import { IoIosArrowForward } from "react-icons/io";
import { Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { BsCheckCircleFill } from "react-icons/bs";
import { FaHammer,  FaCalendarDay  } from "react-icons/fa";
import { formatDate } from "@/app/helpers";
import { MdNotes } from "react-icons/md";

const ViewContractPage = () => {
  const router = useRouter();
  const { slug } = useParams();

  const { data: contractFile, isLoading: isContractLoading } =
    useGetContractFile(slug);

  const { mutate: signContract, isPending: isSigningContract } =
    useSignContract();

  const handleSignContract = () => {
    signContract(contractFile?.data.contractCode, {
      onSuccess: () => {},
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

      <section className="flex flex-row justify-between items-center mb-6">
        <BodyTypo bodylabel="Contract Summary" />
      </section>

      {isContractLoading ? (
        <Paper
          elevation={0}
          className="rounded-lg mb-10 bg-white dark:bg-transparent"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-start gap-3">
                <Skeleton variant="circular" width={40} height={40} />
                <div className="flex-1">
                  <Skeleton variant="text" width="40%" height={20} />
                  <Skeleton variant="text" width="60%" height={24} />
                </div>
              </div>
            ))}
          </div>
        </Paper>
      ) : (
        <Paper
          elevation={0}
          className="rounded-lg mb-10 bg-white dark:bg-transparent"
        >
          <div className="summary grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
            <div className="flex items-start gap-4">
              <div className=" dark:bg-blue-900/20 p-2 rounded-lg">
                <HiOutlineDocumentText
                  className="text-blue-600 dark:text-blue-400"
                  size={24}
                />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Contract ID
                </p>
                <p className="font-medium text-slate-900 dark:text-white">
                  {contractFile?.data.contractCode}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-purple-50 dark:bg-purple-900/20 p-2 rounded-lg">
                <BsFileEarmarkPdf
                  className="text-amber-600 dark:text-amber-400"
                  size={24}
                />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Related Booking
                </p>
                <p className="font-medium text-slate-900 dark:text-white">
                  {contractFile?.data.bookingCode}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-amber-50 dark:bg-amber-900/20 p-2 rounded-lg">
                <LuBanknote
                  className="text-amber-600 dark:text-amber-400"
                  size={24}
                />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Deposit Amount
                </p>
                <p className="font-medium text-slate-900 dark:text-white">
                  {formatCurrency(contractFile?.data.depositAmount || 0)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded-lg">
                <TbSignature
                  className="text-amber-600 dark:text-amber-400"
                  size={24}
                />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Signature Status
                </p>
                <div className="font-medium text-slate-900 dark:text-white">
                  {contractFile?.data.isSigned ? (
                    <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400">
                      <LuBadgeCheck
                        size={18}
                        className="text-amber-600 dark:text-amber-400"
                      />
                      <span className="text-sm font-medium">Signed</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400">
                      <LuBadgeX
                        size={18}
                        className="text-amber-600 dark:text-amber-400"
                      />
                      <span className="text-sm font-medium">Pending</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-rose-50 dark:bg-rose-900/20 p-2 rounded-lg">
                <LuUser
                  className="text-rose-600 dark:text-rose-400"
                  size={24}
                />
              </div>
              <div>
                <FootTypo
                  footlabel="Customer"
                  className="text-slate-500 dark:text-slate-400"
                />
                <FootTypo
                  footlabel={contractFile?.data.customerName}
                  className="text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-indigo-50 dark:bg-indigo-900/20 p-2 rounded-lg">
                <LuBuilding
                  className="text-indigo-600 dark:text-indigo-400"
                  size={24}
                />
              </div>
              <div>
                <FootTypo
                  footlabel="Provider"
                  className="text-slate-500 dark:text-slate-400"
                />
                <FootTypo
                  footlabel={contractFile?.data.providerName}
                  className="text-slate-900 dark:text-white"
                />
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-indigo-50 dark:bg-indigo-900/20 p-2 rounded-lg">
                <FaHammer
                  className="text-indigo-600 dark:text-indigo-400"
                  size={24}
                />
              </div>
              <div>
                <FootTypo
                  footlabel="Construction Date"
                  className="text-slate-500 dark:text-slate-400"
                />
                <FootTypo
                  footlabel={formatDate(contractFile?.data.constructionDate)}
                  className="text-slate-900 dark:text-white"
                />
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-indigo-50 dark:bg-indigo-900/20 p-2 rounded-lg">
                <FaCalendarDay
                  className="text-indigo-600 dark:text-indigo-400"
                  size={24}
                />
              </div>
              <div>
                <FootTypo
                  footlabel="Survey Date"
                  className="text-slate-500 dark:text-slate-400"
                />
                <FootTypo
                  footlabel={formatDate(contractFile?.data.surveyDate)}
                  className="text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>
          <div className="customer-note p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg my-6">
            <div className="flex items-start gap-3">
              <div className="text-blue-600 dark:text-blue-400 mt-0.5">
                <MdNotes size={20} />
              </div>
              <div>
                <FootTypo
                  footlabel="Customer Note"
                  className="font-semibold text-blue-800 dark:text-blue-300 mb-1 block"
                />
                <FootTypo
                  footlabel={
                    contractFile?.data.note ||
                    "You have no specific requirements from the customer."
                  }
                  className={`${
                    contractFile?.data.note
                      ? "text-slate-900 dark:text-white whitespace-pre-wrap"
                      : "text-gray-500 dark:text-gray-400 italic"
                  }`}
                />
              </div>
            </div>
          </div>
        </Paper>
      )}

      <section className="flex flex-row justify-between items-center my-5">
        <BodyTypo bodylabel="Contract Document" />
      </section>

      <div className="flex flex-col h-[800px] bg-gray-100 dark:bg-slate-900 rounded-lg overflow-hidden shadow-sm">
        {isContractLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="animate-pulse text-center">
              <BsFileEarmarkPdf
                size={48}
                className="mx-auto mb-4 text-gray-400"
              />
              <p className="text-gray-500">Loading contract document...</p>
            </div>
          </div>
        ) : (
          <div className="pdf-viewer-container w-full h-full bg-white dark:bg-gray-800">
            {contractFile?.data.fileUrl ? (
              <Viewer fileUrl={contractFile?.data.fileUrl} defaultScale={1.5} />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <p>No PDF document available</p>
              </div>
            )}
          </div>
        )}
      </div>

      <Divider variant="middle" flexItem className="my-6" />

      <section className="flex flex-row justify-center items-center my-10">
        {contractFile?.data.isSigned && !contractFile?.data.isDeposited ? (
          <Button
            icon={<IoIosArrowForward />}
            label="Deposite Proceed"
            className="bg-primary text-white"
            onClick={() =>
              router.push(
                `/payment/${contractFile?.data.contractCode}?type=deposit&bookingCode=${contractFile?.data.bookingCode}`
              )
            }
          />
        ) : contractFile?.data.isDeposited ? (
          <div className="flex items-center gap-2 bg-green text-white p-2 rounded-lg">
            <BsCheckCircleFill size={24} />
            <FootTypo footlabel="Your contract is deposited" />
          </div>
        ) : (
          <Button
            label="Sign Contract"
            className="bg-primary text-white"
            onClick={handleSignContract}
            disabled={isSigningContract}
            isLoading={isSigningContract}
          />
        )}
      </section>
    </Container>
  );
};

export default ViewContractPage;
