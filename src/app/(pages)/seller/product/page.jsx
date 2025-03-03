"use client";

import SellerWrapper from "../components/SellerWrapper";
import Button from "@/app/components/ui/Buttons/Button";
import { useRouter } from "next/navigation";

const SellerProductManage = () => {
  const router = useRouter();
  return (
    <SellerWrapper>
      <>
        <div className="section-1 flex flex-row gap-3 items-center">
          <Button
            onClick={() => router.push("/seller/product/create")}
            label="Create new product"
            className="bg-primary"
          />
        </div>
        <div className="section-2 data-table">data</div>
      </>
    </SellerWrapper>
  );
};

export default SellerProductManage;
