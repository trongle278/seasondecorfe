"use client";

import { BorderBox } from "@/app/components/ui/BorderBox";
import { FootTypo } from "@/app/components/ui/Typography";
import { Element } from "react-scroll";

const CommentSection = () => {
  return (
    <Element name="commentSection">
      <BorderBox className="my-5">
        <section className="px-3 pt-3">
          <FootTypo
            footlabel="PRODUCT REVIEWS"
            className="text-lg !mx-0 font-semibold p-3 bg-gray-50 capitalize w-full dark:bg-zinc-800"
          />
          <div className="mt-3 mx-3 mb-3"></div>
        </section>
      </BorderBox>
    </Element>
  );
};

export default CommentSection;
