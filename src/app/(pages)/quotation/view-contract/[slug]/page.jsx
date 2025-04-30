"use client";

import React from "react";
import Container from "@/app/components/layouts/Container";
import { BodyTypo, FootTypo } from "@/app/components/ui/Typography";
import { useParams, useRouter } from "next/navigation";
import { useGetContractFile } from "@/app/queries/contract/contract.query";
import { Paper, Skeleton } from "@mui/material";
import Button from "@/app/components/ui/Buttons/Button";
import { useSignContract } from "@/app/queries/contract/contract.query";
import { TbArrowLeft } from "react-icons/tb";
import { LuUser, LuBuilding, LuBadgeX } from "react-icons/lu";
import { HiOutlineDocumentText } from "react-icons/hi";
import { BsFileEarmarkPdf } from "react-icons/bs";
import { formatCurrency } from "@/app/helpers";
import { IoIosArrowForward } from "react-icons/io";
import { Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { BsCheckCircleFill } from "react-icons/bs";
import { FaCalendarDay } from "react-icons/fa";
import { formatDate } from "@/app/helpers";
import { MdNotes } from "react-icons/md";
import { FaMapMarkerAlt } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { FaPenNib } from "react-icons/fa6";

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
        <div className="flex items-center">
          <HiOutlineDocumentText
            className="text-blue-600 dark:text-blue-400 mr-2"
            size={28}
          />
          <BodyTypo bodylabel="Contract Summary" className="text-xl" />
        </div>
        {!isContractLoading && (
          <div className="flex items-center bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full">
            <HiOutlineDocumentText
              className="text-blue-600 dark:text-blue-400 mr-2"
              size={18}
            />
            <FootTypo
              footlabel={contractFile?.data.contractCode}
              className="text-blue-600 dark:text-blue-400 font-medium text-sm"
            />
          </div>
        )}
      </section>

      {isContractLoading ? (
        <Paper
          elevation={0}
          className="rounded-lg mb-10 bg-white dark:bg-transparent"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
            {[...Array(6)].map((_, i) => (
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
          elevation={2}
          className="rounded-xl mb-10 bg-white dark:bg-transparent overflow-hidden dark:text-white shadow-xl"
        >
          <TabGroup>
            <TabList className="flex space-x-1 p-1">
              <Tab
                className={({ selected }) =>
                  `w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-all duration-200 ease-in-out
                  ${
                    selected
                      ? "bg-white dark:bg-gray-900 text-primary shadow-lg"
                      : "hover:bg-white/[0.12] hover:text-primary"
                  }`
                }
              >
                <div className="flex items-center justify-center gap-2">
                  <HiOutlineDocumentText size={18} />
                  <FootTypo
                    footlabel="Contract Details"
                    className="!m-0 dark:text-white"
                  />
                </div>
              </Tab>
              <Tab
                className={({ selected }) =>
                  `w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-all duration-200 ease-in-out
                  ${
                    selected
                      ? "bg-white dark:bg-gray-900 text-primary shadow-lg"
                      : "hover:bg-white/[0.12] hover:text-primary"
                  }`
                }
              >
                <div className="flex items-center justify-center gap-2">
                  <MdNotes size={18} />
                  <FootTypo
                    footlabel="Requirements"
                    className="!m-0 dark:text-white"
                  />
                </div>
              </Tab>
            </TabList>

            <TabPanels className="mt-2 relative overflow-hidden">
              <TabPanel className="rounded-xl bg-white dark:bg-gray-900 p-3 animate-tab-fade-in">
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="rounded-lg p-4">
                      <h3 className="text-blue-700 dark:text-blue-400 font-semibold mb-4 flex items-center">
                        <HiOutlineDocumentText size={18} className="mr-2" />
                        Contract Information
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <FootTypo
                            footlabel="Contract Code"
                            className=" text-gray-500 dark:text-gray-400"
                          />

                          <FootTypo
                            footlabel={contractFile?.data.contractCode}
                            className="font-medium text-gray-900 dark:text-white"
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <FootTypo
                            footlabel="Related Booking"
                            className="text-gray-500 dark:text-gray-400"
                          />
                          <FootTypo
                            footlabel={contractFile?.data.bookingCode}
                            className="font-medium text-gray-900 dark:text-white"
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <FootTypo
                            footlabel="Deposit Amount"
                            className="text-gray-500 dark:text-gray-400"
                          />
                          <FootTypo
                            footlabel={formatCurrency(
                              contractFile?.data.depositAmount || 0
                            )}
                            className="font-medium text-gray-900 dark:text-white"
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <FootTypo
                            footlabel="Signature Status"
                            className="text-gray-500 dark:text-gray-400"
                          />
                          {contractFile?.data.isSigned ? (
                            <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-2 py-1 rounded-full">
                              <BsCheckCircleFill size={14} />
                              <FootTypo
                                footlabel="Signed"
                                className="text-sm font-medium"
                              />
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 px-2 py-1 rounded-full">
                              <LuBadgeX size={14} />
                              <FootTypo
                                footlabel="Pending"
                                className="text-sm font-medium"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="bg-purple-50 dark:bg-purple-900/10 rounded-lg p-4">
                      <h3 className="text-purple-700 dark:text-purple-400 font-semibold mb-4 flex items-center">
                        <FaCalendarDay size={18} className="mr-2" />
                        Schedule Information
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <FootTypo
                            footlabel="Survey Date"
                            className="text-gray-500 dark:text-gray-400"
                          />
                          <FootTypo
                            footlabel={formatDate(
                              contractFile?.data.surveyDate
                            )}
                            className="font-medium text-gray-900 dark:text-white"
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <FootTypo
                            footlabel="Construction Date"
                            className="text-gray-500 dark:text-gray-400"
                          />
                          <FootTypo
                            footlabel={formatDate(
                              contractFile?.data.constructionDate
                            )}
                            className="font-medium text-gray-900 dark:text-white"
                          />
                        </div>
                        <div className="flex justify-start items-center">
                          {contractFile?.data.isSigned &&
                          !contractFile?.data.isDeposited ? (
                            <Button
                              icon={<IoIosArrowForward />}
                              label="Proceed to Deposit Payment"
                              className="bg-primary text-white px-6 py-3 rounded-full hover:bg-opacity-90 transition-all shadow-md"
                              onClick={() =>
                                router.push(
                                  `/payment/${contractFile?.data.contractCode}?type=deposit&bookingCode=${contractFile?.data.bookingCode}`
                                )
                              }
                            />
                          ) : contractFile?.data.isDeposited ? (
                            <div className="flex items-center gap-3 bg-green text-white p-3 px-6 rounded-full shadow-md">
                              <BsCheckCircleFill size={20} />
                              <FootTypo
                                footlabel="Your contract is deposited successfully"
                                className="font-medium"
                              />
                            </div>
                          ) : (
                            <Button
                              icon={<FaPenNib />}
                              label="Sign Contract"
                              className="bg-action text-white px-6 py-3 rounded-full hover:bg-opacity-90 transition-all shadow-md"
                              onClick={handleSignContract}
                              disabled={isSigningContract}
                              isLoading={isSigningContract}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div className="bg-rose-50 dark:bg-rose-900/10 rounded-lg p-4">
                      <h3 className="text-rose-700 dark:text-rose-400 font-semibold mb-4 flex items-center">
                        <LuUser size={18} className="mr-2" />
                        Customer Information
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-rose-100 dark:bg-rose-900/30 p-2 rounded-full">
                            <LuUser
                              className="text-rose-600 dark:text-rose-400"
                              size={20}
                            />
                          </div>
                          <div>
                            <FootTypo
                              footlabel="Name"
                              className="text-sm text-gray-500 dark:text-gray-400 mr-2"
                            />
                            <FootTypo
                              footlabel={contractFile?.data.customerName}
                              className="font-medium text-gray-900 dark:text-white"
                            />
                          </div>
                        </div>
                        {contractFile?.data.customerEmail && (
                          <div className="flex items-center gap-3">
                            <div className="bg-rose-100 dark:bg-rose-900/30 p-2 rounded-full">
                              <MdOutlineEmail
                                className="text-rose-600 dark:text-rose-400"
                                size={20}
                              />
                            </div>
                            <div>
                              <FootTypo
                                footlabel="Email"
                                className="text-sm text-gray-500 dark:text-gray-400 mr-2"
                              />
                              <FootTypo
                                footlabel={contractFile?.data.customerEmail}
                                className="font-medium text-gray-900 dark:text-white"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-indigo-50 dark:bg-indigo-900/10 rounded-lg p-4">
                      <h3 className="text-indigo-700 dark:text-indigo-400 font-semibold mb-4 flex items-center">
                        <LuBuilding size={18} className="mr-2" />
                        Provider Information
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-full">
                            <LuBuilding
                              className="text-indigo-600 dark:text-indigo-400"
                              size={20}
                            />
                          </div>
                          <div>
                            <FootTypo
                              footlabel="Name"
                              className="text-sm text-gray-500 dark:text-gray-400 mr-2"
                            />
                            <FootTypo
                              footlabel={contractFile?.data.providerName}
                              className="font-medium text-gray-900 dark:text-white"
                            />
                          </div>
                        </div>
                        {contractFile?.data.providerEmail && (
                          <div className="flex items-center gap-3">
                            <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-full">
                              <MdOutlineEmail
                                className="text-indigo-600 dark:text-indigo-400"
                                size={20}
                              />
                            </div>
                            <div>
                              <FootTypo
                                footlabel="Email"
                                className="text-sm text-gray-500 dark:text-gray-400 mr-2"
                              />
                              <FootTypo
                                footlabel={contractFile?.data.providerEmail}
                                className="font-medium text-gray-900 dark:text-white"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {contractFile?.data.address && (
                    <div className="bg-amber-50 dark:bg-amber-900/10 rounded-lg p-4 mt-6">
                      <h3 className="text-amber-700 dark:text-amber-400 font-semibold mb-4 flex items-center">
                        <FaMapMarkerAlt size={18} className="mr-2" />
                        Service Location
                      </h3>
                      <div className="flex items-center gap-3">
                        <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-full">
                          <FaMapMarkerAlt
                            className="text-amber-600 dark:text-amber-400"
                            size={20}
                          />
                        </div>
                        <div>
                          <FootTypo
                            footlabel="Address"
                            className="text-sm text-gray-500 dark:text-gray-400"
                          />
                          <FootTypo
                            footlabel={contractFile?.data.address}
                            className="font-medium text-gray-900 dark:text-white"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </TabPanel>

              <TabPanel className="rounded-xl bg-white dark:bg-gray-900 p-3 animate-tab-slide-right">
                <div className="p-4">
                  <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg p-5">
                    <div className="flex items-start gap-4">
                      <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full flex-shrink-0">
                        <MdNotes
                          className="text-blue-600 dark:text-blue-400"
                          size={24}
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2 text-lg">
                          Requirements
                        </h3>

                        <FootTypo
                          footlabel={
                            contractFile?.data.note ||
                            "You have no specific requirements for the provider."
                          }
                          className={`${
                            contractFile?.data.note
                              ? "text-slate-700 dark:text-slate-300 whitespace-pre-wrap"
                              : "text-gray-500 dark:text-gray-400 italic"
                          }`}
                        />

                        {contractFile?.data.note && (
                          <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-700">
                            <FootTypo
                              footlabel="These requirements will be taken into consideration during the project execution"
                              className="text-sm text-blue-600 dark:text-blue-400"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </TabPanel>
            </TabPanels>
          </TabGroup>
        </Paper>
      )}

      <section className="flex flex-row justify-between items-center my-5">
        <div className="flex items-center">
          <BsFileEarmarkPdf
            className="text-amber-600 dark:text-amber-400 mr-2"
            size={24}
          />
          <BodyTypo bodylabel="Contract Document" className="text-lg" />
        </div>
      </section>

      <div className="flex flex-col h-[100vh] bg-gray-100 dark:bg-slate-900 rounded-xl overflow-hidden shadow-md border border-gray-200 dark:border-gray-700">
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
    </Container>
  );
};

export default ViewContractPage;
