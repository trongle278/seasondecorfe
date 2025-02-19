"use client";

import * as React from "react";

import { UserWrapper } from "../../components/UserWrapper";
import { FootTypo } from "@/app/components/ui/typography";
import Input from "@/app/components/ui/inputs/Input";
import DropdownSelect from "@/app/components/ui/select/DropdownSelect";
import { useForm } from "react-hook-form";
import BasicDatePicker from "@/app/components/ui/select/DatePicker";
import Button from "@/app/components/ui/buttons/Button";
import { ClipLoader } from "react-spinners";
import { FaRegSave } from "react-icons/fa";
import { EditAvatar } from "@/app/components/logic/EditAvatar";
import { useSession } from "next-auth/react";

const UserProfile = () => {
   const { data } = useSession();
  const [isLoading, setIsLoading] = React.useState(false);

  const genderOptions = [
    { id: 0, name: "Female" },
    { id: 1, name: "Male" },
  ];

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    //resolver: yupResolver(schema),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      gender: "",
      phone: "",
      address: "",
      dob: "",
    },
    //resolver: yupResolver(schema),
  });

  const handleGenderChange = (selectedGender) => {
    setValue("gender", selectedGender); // Update form value
  };

  return (
    <UserWrapper>
      <div className="flex-grow ml-6 relative ">
        <div className="flex flex-col relative ">
          <div className="pb-5 border-b-[1px]">
            <FootTypo
              footlabel="My Profile"
              className="!m-0 text-lg font-semibold"
            />
            <FootTypo
              footlabel="Manage profile information for secure account"
              className="!m-0"
            />
          </div>
          <div className="pt-7">
            <div className="flex-1 pr-12">
              <form className="flex flex-col gap-7 mb-10">
                <EditAvatar userImg={data?.user?.image} childStyle="left-14"/>

                <div className="inline-flex gap-5">
                  <FootTypo
                    footlabel="Email :"
                    className="!m-0 font-semibold w-40"
                  />
                  adsasd@ldfda
                </div>
                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 mb-4 items-center gap-5">
                  <FootTypo
                    footlabel="First name :"
                    className="!m-0 font-semibold w-40"
                  />
                  <Input
                    id="Firstname"
                    type="text"
                    placeholder="Abc"
                    className="pl-3"
                  />
                  <FootTypo
                    footlabel="Last name :"
                    className="!m-0 font-semibold w-40"
                  />
                  <Input
                    id="Lastname"
                    type="text"
                    placeholder="edff"
                    className="pl-3"
                  />
                </div>
                <div className="inline-flex gap-5 items-center">
                  <FootTypo
                    footlabel="Phone number :"
                    className="!m-0 font-semibold w-40"
                  />
                  <Input
                    id="phone"
                    type="text"
                    placeholder="edff"
                    className="pl-3"
                  />
                </div>
                <div className="inline-flex gap-5">
                  <FootTypo
                    footlabel="Gender :"
                    className="!m-0 font-semibold w-40"
                  />
                  <DropdownSelect
                    options={genderOptions}
                    value="Male"
                    onChange={handleGenderChange}
                  />
                </div>
                <div className="inline-flex gap-5 items-center">
                  <FootTypo
                    footlabel="Date of birth :"
                    className="!m-0 font-semibold w-40"
                  />
                  <BasicDatePicker />
                </div>
              </form>
              <Button
                onClick={() => {}}
                disabled={isLoading}
                icon={<FaRegSave size={20} />}
                label={
                  isLoading ? (
                    <ClipLoader size={20} color={"#fff"} />
                  ) : (
                    "Update profile"
                  )
                }
              />
            </div>
          </div>
        </div>
      </div>
    </UserWrapper>
  );
};

export default UserProfile;
