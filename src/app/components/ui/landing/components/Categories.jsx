import { LuLamp } from "react-icons/lu";
import { IoMdClock } from "react-icons/io";
import {
  MdBed,
  MdChair,
  MdTableRestaurant,
} from "react-icons/md";
import {
  GiLockedChest,
  GiSofa,
  GiBookshelf,
} from "react-icons/gi";
import { PiDesk } from "react-icons/pi";
import { GiHanger } from "react-icons/gi";
import { BiCabinet, BiCloset } from "react-icons/bi";
import { FaCouch, FaBath } from "react-icons/fa";
import CategoryBox from "./CategoryBox";
import { useSearchParams, useRouter } from "next/navigation";
import { HeadTypo, BodyTypo } from "../../Typography";
import { useGetListProductCategory } from "@/app/queries/list/category.list.query";
import { Skeleton } from "@mui/material";

export const categories = [
  {
    label: "Lamp",
    icon: <LuLamp size={26} />,
    descripton: "This is a lamp",
  },
  {
    label: "Clock",
    icon: <IoMdClock size={26} />,
    descripton: "This is a clock",
  },
  {
    label: "Bed",
    icon: <MdBed size={26} />,
    descripton: "This is a bed",
  },
  {
    label: "Chest",
    icon: <GiLockedChest size={26} />,
    descripton: "This is a chest",
  },
  {
    label: "Desk",
    icon: <PiDesk size={26} />,
    descripton: "This is a desk",
  },
  {
    label: "Cabinet",
    icon: <BiCabinet size={26} />,
    descripton: "This is a cabinet",
  },
  {
    label: "Chair",
    icon: <MdChair size={26} />,
    descripton: "This is a chair",
  },
  {
    label: "Sofa",
    icon: <GiSofa size={26} />,
    descripton: "This is a sofa",
  },
  {
    label: "Bookshelf",
    icon: <GiBookshelf size={26} />,
    descripton: "This is a bookshelf",
  },
  {
    label: "Table",
    icon: <MdTableRestaurant size={26} />,
    descripton: "This is a dining table",
  },
  {
    label: "Couch",
    icon: <FaCouch size={26} />,
    descripton: "This is a couch",
  },
  {
    label: "Hanger",
    icon: <GiHanger size={26} />,
    descripton: "This is a coat hanger",
  },
  {
    label: "Closet",
    icon: <BiCloset size={26} />,
    descripton: "This is a closet",
  },
  {
    label: "Vanity",
    icon: <FaBath size={26} />,
    descripton: "This is a bathroom vanity",
  },
];

const Categories = () => {
  const params = useSearchParams();
  const router = useRouter();
  const selectedCategory = params?.get("category");
  const selectedCategoryId = params?.get("categoryId");

  const {
    data: categoriesData,
    isLoading,
    isError,
  } = useGetListProductCategory();

  const categoriesList = Array.isArray(categoriesData) ? categoriesData : [];

  const mappedCategories = categoriesList.map((item) => ({
    id: item.id,
    label: item.categoryName, // Map categoryName to label
    icon: categories.find((c) => c.label === item.categoryName)?.icon || null, // Match predefined icon
  }));

  return (
    <>
      <div className="flex flex-col items-center justify-center my-20">
        <HeadTypo label="Explore funitures from all categories" />
        <BodyTypo bodylabel="Explore funitures from all categories" />
      </div>

      <div className="pt-4 flex flex-row items-center justify-center overflow-x-auto ">
        {isLoading ? (
          <Skeleton animation="wave" width={200} height={100} />
        ) : isError ? (
          <p className="text-center text-red-500">Failed to load categories</p>
        ) : (
          <div className="pt-4 flex flex-row items-center justify-between gap-5 overflow-x-auto">
            {mappedCategories.map((item) => (
              <CategoryBox
                key={item.id || item.label}
                id={item.id}
                label={item.label}
                icon={item.icon}
                selected={selectedCategoryId == item.id}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Categories;
