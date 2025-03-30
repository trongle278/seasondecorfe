"use client";

import { FootTypo } from "@/app/components/ui/Typography";
import { formatCurrency } from "@/app/helpers";
import StatusChip from "@/app/components/ui/statusChip/StatusChip";
import { formatDateVN } from "@/app/helpers";
import Button from "@/app/components/ui/Buttons/Button";
import { TbCreditCardPay } from "react-icons/tb";
import { TbCancel } from "react-icons/tb";

const OrderCard = ({ name, code, price, status, orderDate, isPending, detailClick, cancelClick, procceedClick }) => {
  return (
    <div className="bg-transparent rounded-lg shadow-lg p-5">
      <div className="flex items-center gap-4 justify-between">
        <div className="flex flex-col justify-between gap-3 font-semibold ">
          <div className="inline-flex items-center gap-2">
            <FootTypo footlabel="Order Code" className="!m-0 text-sm" />
            <FootTypo
              footlabel={code}
              className="!m-0 text-sm bg-primary p-1 rounded-md"
            />
          </div>
          <div className="flex items-center gap-2">
            <FootTypo footlabel="Total Price" className="!m-0 text-sm" />
            <FootTypo
              footlabel={formatCurrency(price)}
              className="!m-0 text-sm underline"
            />
          </div>

          <FootTypo
            footlabel={formatDateVN(orderDate)}
            className="!m-0 text-sm"
          />
          <div className="flex items-center gap-2">
            <FootTypo footlabel="Status" className="!m-0 text-sm" />
            <StatusChip status={status} />
          </div>

          <button className="text-sm underline self-start" onClick={detailClick}>
            View Details
          </button>
        </div>

        {isPending && (
          <div className="flex items-center gap-2">
            <Button
              label="Procceed"
              onClick={procceedClick}
              icon={<TbCreditCardPay size={20} />}
            />
            <Button
              label="Cancel"
              onClick={cancelClick}
              className="bg-red text-white"
              icon={<TbCancel size={20} />}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderCard;
