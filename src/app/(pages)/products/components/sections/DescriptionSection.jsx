"use client";

import { BorderBox } from "@/app/components/ui/BorderBox";
import { FootTypo } from "@/app/components/ui/Typography";

const DescrriptionSection = ({ description }) => {
  return (
    <BorderBox>
      <section className="px-3 pt-3 whitespace-pre-line">
        <FootTypo
          footlabel="DESCRIPTION"
          className="text-lg !mx-0 font-semibold p-3 bg-gray-50 capitalize w-full dark:bg-zinc-800"
        />
        <div className="mt-3 mx-3 mb-3">{description}</div>
      </section>
    </BorderBox>
  );
};

export default DescrriptionSection;
