"use client";

import React, { useState, useEffect } from "react";
import Container from "@/app/components/layouts/Container";
import { useParams, useSearchParams } from "next/navigation";
import { useGetTrackingByBookingCode } from "@/app/queries/tracking/tracking.query";
import { FootTypo } from "@/app/components/ui/Typography";
import { Timeline } from "@/app/components/ui/animated/TimeLine";
import { formatDate } from "@/app/helpers";
import { Skeleton, Divider, Chip } from "@mui/material";
import Image from "next/image";
import { TbArrowLeft } from "react-icons/tb";
import { useRouter } from "next/navigation";
import { Textarea } from "@headlessui/react";
import { BorderBox } from "@/app/components/ui/BorderBox";
import Button from "@/app/components/ui/Buttons/Button";
import { IoWalletOutline } from "react-icons/io5";
import { IoCheckmarkCircleSharp, IoTimeOutline } from "react-icons/io5";
import Folder from "@/app/components/ui/animated/Folder";
import Avatar from "@/app/components/ui/Avatar/Avatar";
import { BiCommentDetail } from "react-icons/bi";

const ViewTrackingPage = () => {
  const { slug } = useParams();
  const searchParams = useSearchParams();

  const status = Number(searchParams.get("status") || NaN);
  const quotationCode = searchParams.get("quotation-code") || "";

  const provider = searchParams.get("provider") || "";
  const providerAvatar = searchParams.get("avatar") || "";

  console.log(status);

  const { data: trackingData, isPending } = useGetTrackingByBookingCode(slug);
  const [bookingCode, setBookingCode] = useState("");
  const [timelineData, setTimelineData] = useState([]);
  const router = useRouter();

  useEffect(() => {
    // Transform tracking data into timeline format
    if (Array.isArray(trackingData)) {
      const bookingCode = trackingData[0].bookingCode;
      const formattedTimelineData = trackingData.map((item) => ({
        title: formatDate(item.createdAt),
        content: (
          <div className="flex flex-col gap-5 h-full">
            <span>
              <FootTypo footlabel="Task Name" className="text-lg" />
              <Textarea
                as="textarea"
                name="task"
                value={item.task}
                className="block w-full resize-none rounded-2xl bg-gray-100 dark:bg-gray-700
      border border-transparent py-3 px-4  text-gray-800 dark:text-white
      placeholder-gray-400 dark:placeholder-gray-500
      focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white
      transition duration-300 whitespace-pre-wrap shadow-sm"
                placeholder="No task available"
                rows={2}
                disabled
                readOnly
              />
            </span>

            <span>
              <FootTypo footlabel="Note" className="text-lg" />
              <Textarea
                as="textarea"
                name="note"
                value={item.note}
                className="block w-full resize-none rounded-2xl bg-gray-100 dark:bg-gray-700
      border border-transparent py-3 px-4  text-gray-800 dark:text-white
      placeholder-gray-400 dark:placeholder-gray-500
      focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white
      transition duration-300 whitespace-pre-wrap shadow-sm"
                placeholder="No task available"
                rows={5}
                disabled
                readOnly
              />
            </span>

            {item.images && item.images.length > 0 && (
              <div className="grid grid-cols-2 gap-4">
                {item.images.map((img, index) => (
                  <Image
                    key={index}
                    src={img.imageUrl}
                    alt={`Tracking image ${index + 1}`}
                    width={500}
                    height={500}
                    unoptimized={false}
                    className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
                  />
                ))}
              </div>
            )}
          </div>
        ),
      }));
      setTimelineData(formattedTimelineData);
      setBookingCode(bookingCode);
    }
  }, [trackingData]);

  return (
    <Container>
      <button
        className="flex items-center gap-1 mb-5"
        onClick={() => router.back()}
      >
        <TbArrowLeft size={20} />
        <FootTypo footlabel="Go Back" className="!m-0" />
      </button>
      <div className="grid grid-cols-6 grid-rows-1 gap-4">
        <div className="col-span-4">
          <div className="relative w-full overflow-clip ">
            {isPending ? (
              <>
                <Skeleton animation="wave" width="100%" />
                <Skeleton animation="wave" variant="text" width="100%" />
                <Skeleton animation="wave" variant="text" width="100%" />
              </>
            ) : timelineData.length > 0 ? (
              <Timeline
                data={timelineData}
                title={`Tracking Progress ${bookingCode} `}
              />
            ) : (
              <p>No tracking information available</p>
            )}
          </div>
        </div>
        <div className="col-span-2">
          {status === 9 ? (
            <BorderBox className="flex flex-col items-center justify-center p-6 text-center gap-3">
              <FootTypo
                footlabel="Complete Your Experience"
                className="text-lg font-bold"
              />
              <IoCheckmarkCircleSharp
                color="green"
                size={60}
                className="self-center"
              />
              <FootTypo footlabel="Your service has been successfully completed! Check your contract and proceed to final payment." />
              <Folder
                size={0.5}
                color="#00d8ff"
                className="hover:scale-110 transition-transform duration-200"
                onClick={() =>
                  router.push(`/quotation/view-contract/${quotationCode}`)
                }
              />
              <Divider flexItem>
                <Chip
                  label="Or Proceed to"
                  size="small"
                  className="dark:text-white"
                />
              </Divider>
              <Button
                icon={<IoWalletOutline />}
                label="Complete Payment"
                onClick={() =>
                  router.push(`/payment/${bookingCode}?type=final`)
                }
                className="bg-action text-white"
              />
            </BorderBox>
          ) : status === 10 ? (
            <BorderBox className="flex flex-col items-center justify-center p-6 text-center gap-3">
              <FootTypo
                footlabel="Payment successful"
                className="text-lg font-bold"
              />
              <IoCheckmarkCircleSharp
                color="green"
                size={60}
                className="self-center"
              />
              <FootTypo footlabel="Your payment has been successfully completed !" />
              <FootTypo
                footlabel="Waiting for the provider to confirm your payment."
                className="text-sm text-gray-500 dark:text-gray-400 italic"
              />
              <span className="flex flex-row items-center gap-2">
                <Avatar
                  userImg={providerAvatar}
                  name={provider}
                  w={40}
                  h={40}
                />
                <FootTypo footlabel={provider} />{" "}
              </span>
            </BorderBox>
          ) : status === 11 ? (
            <>
              {" "}
              <BorderBox className="flex flex-col items-center justify-center p-6 text-center gap-3">
                <FootTypo
                  footlabel="You service is completed "
                  className="text-lg font-bold"
                />
                <div className="card">
                  <div className="relative bg-black w-[300px] sm:w-[350px] group transition-all duration-700 aspect-video flex items-center justify-center mt-10">
                    <div className="transition-all flex flex-col items-center py-5 justify-start duration-300 group-hover:duration-1000 bg-gray-200 w-full h-full absolute group-hover:-translate-y-16">
                      <FootTypo
                        footlabel="Thank You"
                        className="text-xl sm:text-2xl font-semibold text-gray-500 font-serif"
                      />

                      <FootTypo
                        footlabel="Hope you will feel happy with our service"
                        className="px-10 text-[10px] sm:text-[12px] text-gray-700"
                      />

                      <FootTypo
                        footlabel="Wishing you a fantastic day ahead!"
                        className="font-serif text-[10px] sm:text-[12px text-gray-700"
                      />
                    </div>
                    <button className="seal bg-rose-500 text-red-800 w-10 aspect-square rounded-full z-40 text-[10px] flex items-center justify-center font-semibold [clip-path:polygon(50%_0%,_80%_10%,_100%_35%,_100%_70%,_80%_90%,_50%_100%,_20%_90%,_0%_70%,_0%_35%,_20%_10%)] group-hover:opacity-0 transition-all duration-1000 group-hover:scale-0 group-hover:rotate-180 border-4 border-rose-900"></button>
                    <div className="tp transition-all duration-1000 group-hover:duration-100 bg-neutral-900 absolute group-hover:[clip-path:polygon(50%_0%,_100%_0,_0_0)] w-full h-full [clip-path:polygon(50%_50%,_100%_0,_0_0)]"></div>
                    <div className="lft transition-all duration-700 absolute w-full h-full bg-neutral-900 [clip-path:polygon(50%_50%,_0_0,_0_100%)]"></div>
                    <div className="rgt transition-all duration-700 absolute w-full h-full bg-neutral-900 [clip-path:polygon(50%_50%,_100%_0,_100%_100%)]"></div>
                    <div className="btm transition-all duration-700 absolute w-full h-full bg-neutral-900 [clip-path:polygon(50%_50%,_100%_100%,_0_100%)]"></div>
                  </div>
                </div>
                <span className="flex flex-row items-center gap-2">
                  <FootTypo footlabel="From" />
                  <Avatar
                    userImg={providerAvatar}
                    name={provider}
                    w={40}
                    h={40}
                  />
                  <FootTypo footlabel={provider} />
                </span>
              </BorderBox>
            </>
          ) : (
            <BorderBox className="flex flex-col items-center justify-center p-6 text-center gap-4">
              <IoTimeOutline size={50} color="orange" className="mb-4" />
              <FootTypo
                footlabel="Your Service In Progress"
                className="text-xl font-bold text-orange mb-2"
              />
              <FootTypo footlabel="You will see the task tracking of your service being updated by the provider." />
            </BorderBox>
          )}
        </div>
      </div>
    </Container>
  );
};

export default ViewTrackingPage;
