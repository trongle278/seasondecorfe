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
    <section className="p-7">
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
              <button
                onClick={viewContract}
                className="absolute top-[-10] right-4 p-3 rounded-md hover:text-primary transition-all duration-300 text-sm"
              >
                <span className="flex flex-row gap-2 items-center">
                  <LuBadgeCheck
                    className="text-primary flex-shrink-0"
                    size={30}
                  />
                  <FootTypo footlabel="View Contract" className="!m-0" />
                </span>
              </button>
            ) : (
              <button
                onClick={viewContract}
                className="absolute top-[-10] right-4 bg-primary text-white p-3 rounded-md"
              >
                <FootTypo footlabel="Sign Contract" className="!m-0 text-sm" />
              </button>
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
