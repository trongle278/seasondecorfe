"use client";

import SellerWrapper from "../components/SellerWrapper";
import Button from "@/app/components/ui/Buttons/Button";
import { useRouter } from "next/navigation";
import { MdOutlineFileUpload } from "react-icons/md";
const SellerServiceManage = () => {
  const router = useRouter();
  return (
    <SellerWrapper>
      <>
        <div className="section-1 flex flex-row gap-3 items-center">
          <Button
            onClick={() => router.push("/seller/service/create")}
            label="Create new service"
            className="bg-primary"
            icon={<MdOutlineFileUpload size={20} />}
          />
        </div>
        <div className="section-2 data-table">data</div>
      </>
    </SellerWrapper>
  );
};

export default SellerServiceManage;
