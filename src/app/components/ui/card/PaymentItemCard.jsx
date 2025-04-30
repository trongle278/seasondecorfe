"use client";

import Image from "next/image";
import { FootTypo } from "@/app/components/ui/Typography";
import { formatCurrency } from "@/app/helpers";
import Link from "next/link";
import Button from "../Buttons/Button";
import { FaStar } from "react-icons/fa";
import { MdStorefront } from "react-icons/md";

const PaymentItemCard = ({
  productName = "",
  productImage = "",
  quantity = 0,
  unitPrice = 0,
  href = "",
  isReview = false,
  handleOpenReviewDialog,
  provider = null,
}) => {
  return (
    <div className="overflow-hidden font-semibold before:ease-in-out dark:bg-transparent after:ease-in-out bg-white group cursor-pointer relative flex flex-row gap-4 justify-between rounded-2xl border hover:after:w-full border-white-222 hover:border-primary duration-300 p-4 md:p-6 px-8 before:h-full before:w-2 hover:before:w-full after:absolute after:top-0 after:left-0 after:h-full after:w-0 after:duration-300 after:opacity-5 after:bg-[url('https://s3-alpha-sig.figma.com/img/6956/4aec/59afa93303a34a23ecc13368dc4094db?Expires=1717977600&amp;Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&amp;Signature=PFrwNwC7QeqlIUsWFsC-jbQzlVTUSh7T5VfJ9vMNaAEsoOS92kRDH-OjWcAX~dmuZ77fPWjZJX0v1kXaZENeqa--USg1BcCN8z~Z1id5y5RQT1ZTU5OR4PRrLISHbowyTAu65h2jCKOSYXCrXN3F6fH8epD-Pm9TCGCYvD9svkhnbTSZxPKZhn8okHm7W~3wWyIhJBaZyQ30qWwD~JAh5r0BRE6XIfIpgTlUWeLq9wwCbwFZQR5RWInuHUfLrfhvAnxmzVVoTO1TxyjHOeXVb68Tc~nJuypwlDmcd0Sg02sJu3-uj7vFXRul6qw0LRfsQrWS5c5RJ~P-z5-eS~1jTA__')] before:duration-300 before:-z-1 before:bg-primary before:absolute before:top-0 before:left-0">
      <Link href={href} className="flex flex-row items-center gap-2">
        <div className="flex-shrink-0 relative w-16 h-16 rounded-lg overflow-hidden">
          <Image
            src={productImage || "/placeholder-product.jpg"}
            alt={productName}
            fill
            className="object-cover"
            unoptimized={productImage?.includes("http")}
          />
        </div>

        <div className="group-hover:z-[5] duration-300 group-hover:text-white flex flex-col items-start gap-2 text-sm ">
          <FootTypo
            footlabel={productName}
            className="font-medium text-lg truncate"
          />
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
            <FootTypo
              footlabel={`Quantity : ${quantity}`}
              className="text-sm text-gray-500"
            />
          </div>
          
          {provider && (
            <div className="flex items-center gap-2 text-xs group-hover:text-white/80 mt-1">
              <MdStorefront size={20} />
              {provider.avatar && (
                <div className="relative w-4 h-4 rounded-full overflow-hidden">
                  <Image
                    src={provider.avatar}
                    alt={provider.businessName}
                    fill
                    className="object-cover"
                    unoptimized={provider.avatar?.includes("http")}
                  />
                </div>
              )}
              <span>{provider.businessName}</span>
            </div>
          )}
        </div>
      </Link>

      <div className="group-hover:z-[5] duration-300 group-hover:text-white flex items-center gap-2 text-right">
        <div className="flex flex-col gap-2">
          <FootTypo
            footlabel={`Total: ${formatCurrency(unitPrice * quantity)}`}
            className="font-bold text-lg"
          />
          {isReview && (
            <Button
              icon={<FaStar />}
              label="Rate"
              className="bg-action text-white w-fit self-end"
              onClick={handleOpenReviewDialog}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentItemCard;
