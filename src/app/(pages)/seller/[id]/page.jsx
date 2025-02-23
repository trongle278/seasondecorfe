"use client";

import Container from "@/app/components/layouts/Container";
import {
  GlowingEffect,
  GridItem,
} from "@/app/components/ui/animated/GlowingEffect";
import Avatar from "@/app/components/ui/Avatar/Avatar";
import Button from "@/app/components/ui/Buttons/Button";
import { FaPlus } from "react-icons/fa";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { FootTypo } from "@/app/components/ui/Typography";
import { BsBoxSeam } from "react-icons/bs";
import { GiShadowFollower } from "react-icons/gi";
import { RiUserFollowLine } from "react-icons/ri";
import { FaRegStar } from "react-icons/fa";
import { LuUsers } from "react-icons/lu";

const Seller = () => {
  return (
    <Container>
      <div className="seller-info py-5">
        <section className="pt-5 flex">
          <GridItem
            area="md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]"
            icon={
              <Avatar userImg={""} w={72} h={72} className="cursor-pointer" />
            }
            userDetails="ten user"
            btn1={<Button label="Follow" icon={<FaPlus />} />}
            btn2={
              <Button label="Message" icon={<IoChatboxEllipsesOutline />} />
            }
          />
          <section className="pl-7 w-full">
            <div className="grid grid-cols-[repeat(2,auto)] gap-7">
              <div className="flex justify-between outline-none overflow-visible relative">
                <span className="inline-flex items-center gap-2">
                  <BsBoxSeam />
                  <FootTypo footlabel="Products" className="text-sm !mx-0" />
                </span>

                <FootTypo
                  footlabel="100"
                  className="text-sm !mx-0 text-red font-semibold"
                />
              </div>
              <div className="flex justify-between outline-none overflow-visible relative">
                <span className="inline-flex items-center gap-2">
                  <GiShadowFollower />
                  <FootTypo footlabel="Followers" className="text-sm !mx-0" />
                </span>

                <FootTypo
                  footlabel="1"
                  className="text-sm !mx-0 text-red font-semibold"
                />
              </div>
              <div className="flex justify-between outline-none overflow-visible relative">
                <span className="inline-flex items-center gap-2">
                  <RiUserFollowLine />
                  <FootTypo footlabel="Following" className="text-sm !mx-0" />
                </span>
                <FootTypo
                  footlabel="1"
                  className="text-sm !mx-0 text-red font-semibold"
                />
              </div>
              <div className="flex justify-between outline-none overflow-visible relative">
                <span className="inline-flex items-center gap-2">
                  <FaRegStar />
                  <FootTypo footlabel="Rating" className="text-sm !mx-0" />
                </span>
                <FootTypo
                  footlabel="4"
                  className="text-sm !mx-0 text-red font-semibold"
                />
              </div>
              <div className="flex justify-between outline-none overflow-visible relative">
                <span className="inline-flex items-center gap-2">
                  <IoChatboxEllipsesOutline />
                  <FootTypo
                    footlabel="Chat performance"
                    className="text-sm !mx-0"
                  />
                </span>
                <FootTypo
                  footlabel="80%"
                  className="text-sm !mx-0 text-red font-semibold"
                />
              </div>
              <div className="flex justify-between outline-none overflow-visible relative">
                <span className="inline-flex items-center gap-2">
                  <LuUsers />
                  <FootTypo footlabel="Joined" className="text-sm !mx-0" />
                </span>
                <FootTypo
                  footlabel="1 week ago"
                  className="text-sm !mx-0 text-red font-semibold"
                />
              </div>
            </div>
          </section>
        </section>
      </div>
    </Container>
  );
};

export default Seller;
