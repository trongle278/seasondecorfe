"use client";

import { FootTypo } from "../Typography";
import { formatDateVN } from "@/app/helpers";
import { TbFileInvoice } from "react-icons/tb";
import { HiOutlineStatusOnline } from "react-icons/hi";
import { BorderBox } from "../BorderBox";
import { MdChevronRight } from "react-icons/md";
import StatusChip from "../statusChip/StatusChip";
import { FaBarcode } from "react-icons/fa";
import { LuBadgeCheck } from "react-icons/lu";
import Folder from "../animated/Folder";

const QuotationCard = ({
  quotationCode,
  createdDate,
  status,
  onClick,
  isContractExist,
  viewContract,
  serviceName,
  isSigned,
}) => {
  return (
    <section className="py-4">
      <BorderBox className="w-full font-semibold relative">
        <div className="absolute top-[-10px] left-4">
          <FootTypo
            footlabel={formatDateVN(createdDate)}
            className="!m-0 text-sm"
          />
        </div>
        {isContractExist && (
          <>
            {isSigned ? (
              <div className="absolute top-[-10] right-4 rounded-md hover:text-primary transition-all duration-300 text-sm">
                <span className="flex flex-row gap-2 items-center">
                  <LuBadgeCheck
                    className="text-primary flex-shrink-0"
                    size={30}
                  />
                  <FootTypo footlabel="Contract Signed" className="!m-0 text-sm" />
                  <Folder
                    size={0.4}
                    color="#00d8ff"
                    className="hover:scale-110 transition-transform duration-200"
                    onClick={viewContract}
                  />
                </span>
              </div>
            ) : (
              <div className="absolute top-[-10] right-4">
                <span className="flex flex-row items-center">
                  <FootTypo
                    footlabel="View Contract"
                    className="!m-0 text-sm"
                  />
                  <Folder
                    size={0.4}
                    color="#00d8ff"
                    className="hover:scale-110 transition-transform duration-200"
                    onClick={viewContract}
                  />
                </span>
              </div>
            )}
          </>
        )}

        <div className="space-y-2">
          <div className="flex flex-row gap-2 items-center">
            <FaBarcode className="text-primary flex-shrink-0" size={20} />
            <FootTypo footlabel="Quotation Code" className="!m-0 text-sm" />
            <FootTypo
              footlabel={quotationCode}
              className="!m-0 text-lg underline"
            />
          </div>
          <div className="flex flex-row gap-2 items-center">
            <TbFileInvoice className="text-primary flex-shrink-0" size={20} />
            <FootTypo footlabel="Service name" className="!m-0 text-sm" />
            <FootTypo footlabel={serviceName} className="!m-0 text-lg" />
          </div>
          <div className="flex flex-row gap-2 items-center">
            <HiOutlineStatusOnline
              className="text-primary flex-shrink-0"
              size={20}
            />
            <FootTypo footlabel="Status" className="!m-0 text-sm" />
            <StatusChip status={status} isQuotation={true} />
          </div>
        </div>
        <button
          onClick={onClick}
          className="flex flex-row gap-2 items-center text-sm hover:translate-x-3 transition-all duration-300"
        >
          View Quotation
          <MdChevronRight size={20} />
        </button>
      </BorderBox>
    </section>
  );
};

export default QuotationCard;
