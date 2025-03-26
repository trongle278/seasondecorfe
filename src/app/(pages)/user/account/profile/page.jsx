"use client";

import React, { useCallback, useState } from 'react';
import { UserWrapper } from "../../components/UserWrapper";
import { FootTypo } from "@/app/components/ui/Typography";
import Input from "@/app/components/ui/inputs/Input";
import DropdownSelect from "@/app/components/ui/Select/DropdownSelect";
import { useForm } from "react-hook-form";
import BasicDatePicker from "@/app/components/ui/Select/DatePicker";
import Button from "@/app/components/ui/Buttons/Button";
import { FaRegSave } from "react-icons/fa";
import { EditAvatar } from "@/app/components/logic/EditAvatar";
import { useUser } from "@/app/providers/userprovider";
import { UserProfileUpdate } from "@/app/api/upload";

const UserProfile = () => {
  const { user, isError } = useUser();

  const [isLoading, setIsLoading] = useState(false);
  const { updateProfile } = UserProfileUpdate();

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
      dob: user?.dateOfBirth,
    },
    //resolver: yupResolver(schema),
  });

  const handleGenderChange = (selectedGender) => {
    setValue("gender", selectedGender);
  };

  const handleDateChange = (date) => {
    setValue("dob", date); //
  };

  const onSubmit = useCallback(async (data) => {

    const userData = {
      firstName: data.firstName,
      lastName: data.lastName,
      slug: data.slug,
      dateOfBirth: data.dob,
      gender: data.gender === "true",
      phone: data.phone,
    };
    try {
      setIsLoading(true);
      console.log(userData);
      await updateProfile(userData);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  }, []);

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
                <EditAvatar userImg={user?.avatar} childStyle="left-14" />

                <div className="inline-flex gap-5 items-center">
                  <FootTypo
                    footlabel="Email :"
                    className="!m-0 font-semibold w-40"
                  />
                  {user?.email || "email"}
                </div>
                <div className="inline-flex gap-5 items-center">
                  <FootTypo
                    footlabel="Slug :"
                    className="!m-0 font-semibold w-40"
                  />
                  <Input
                    id="slug"
                    type="text"
                    placeholder="Abc"
                    className="pl-3"
                    register={register}
                    errors={errors}
                    defaultValue={user?.slug || ""}
                  />
                </div>

                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 mb-4 items-center gap-5">
                  <FootTypo
                    footlabel="First name :"
                    className="!m-0 font-semibold w-40"
                  />
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="Abc"
                    className="pl-3"
                    register={register}
                    errors={errors}
                    defaultValue={user?.firstName || ""}
                  />
                  <FootTypo
                    footlabel="Last name :"
                    className="!m-0 font-semibold w-40"
                  />
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="edff"
                    className="pl-3"
                    register={register}
                    errors={errors}
                    defaultValue={user?.lastName || ""}
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
                    placeholder="Your phone number"
                    className="pl-3"
                    register={register}
                    errors={errors}
                    defaultValue={user?.phone || ""}
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
                    lisboxClassName="mt-9"
                  />
                </div>
                <div className="inline-flex gap-5 items-center">
                  <FootTypo
                    footlabel="Date of birth :"
                    className="!m-0 font-semibold w-40"
                  />
                  <BasicDatePicker
                    selectedDate={watch("dob")}
                    onChange={handleDateChange}
                    required={true}
                  />
                </div>
              </form>
              <Button
                onClick={handleSubmit(onSubmit)}
                isLoading={isLoading}
                icon={<FaRegSave size={20} />}
                label={"Save"}
              />
            </div>
          </div>
        </div>
      </div>
    </UserWrapper>
  );
};

export default UserProfile;
