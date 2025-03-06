"use client";

import Container from "@/app/components/layouts/Container";
import { GlowingCard } from "@/app/components/ui/animated/GlowingEffect";
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
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { IoMdHome } from "react-icons/io";
import { GoPackage } from "react-icons/go";
import { MdMiscellaneousServices } from "react-icons/md";
import HomeTab from "../components/HomeTab";
import ProductsTab from "../components/ProductTab";
import ServicesTab from "../components/ServiceTab";
import VoucherTab from "../components/VoucherTab";
import { TbGiftCardFilled } from "react-icons/tb";

const tabs = [
  { icon: IoMdHome, name: "Home", component: HomeTab },
  { icon: GoPackage, name: "Products", component: ProductsTab },
  { icon: MdMiscellaneousServices, name: "Services", component: ServicesTab },
  { icon: TbGiftCardFilled, name: "Vouchers", component: VoucherTab },
];

const ProviderDetailPage = () => {
  return (
    <Container>
      <div className="seller-info py-5">
        <section className="pt-5 flex items-start">
          <GlowingCard
            icon={
              <Avatar userImg={""} w={72} h={72} className="cursor-pointer" />
            }
            userDetails="ten user"
            btn1={
              <Button label="Follow" icon={<FaPlus />} className="bg-primary" />
            }
            btn2={
              <Button label="Message" icon={<IoChatboxEllipsesOutline />} />
            }
            className="w-[24rem]"
          />
          <section className="pl-7 w-full">
            <div className="grid grid-cols-[repeat(2,auto)] gap-9">
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
      <div className="tabs-pannel">
        <TabGroup>
          <TabList className="flex gap-base border-b-[1px] pb-9 justify-center">
            {tabs.map(({ name, icon: Icon }) => (
              <Tab
                key={name}
                className="flex items-center gap-2 rounded-full py-1 px-3 font-semibold text-lg focus:outline-none 
                 data-[selected]:border-b-[2px] data-[selected]:border-red
                 data-[hover]:bg-white/5 
                 data-[selected]:data-[hover]:bg-white/10 
                 data-[focus]:outline-1 data-[focus]:outline-white"
              >
                <Icon className="text-xl" /> {name}
              </Tab>
            ))}
          </TabList>

          <TabPanels className="mt-3">
            {tabs.map(({ name, component: Component }) => (
              <TabPanel key={name} className="rounded-xl bg-white/5 p-3">
                <Component />
              </TabPanel>
            ))}
          </TabPanels>
        </TabGroup>
      </div>
    </Container>
  );
};

export default ProviderDetailPage;
