import { LuLamp } from "react-icons/lu";
import { IoMdClock } from "react-icons/io";
import {
  MdBed,
  MdChair,
  MdTableRestaurant,
  MdOutlineDeck,
} from "react-icons/md";
import {
  GiLockedChest,
  GiSofa,
  GiBookshelf,
  GiTrophyCup,
} from "react-icons/gi";
import { PiDesk } from "react-icons/pi";
import { GiHanger } from "react-icons/gi";
import { BiCabinet, BiCloset } from "react-icons/bi";
import { FaCouch, FaBath, FaChair, FaUtensils } from "react-icons/fa";
import { RiComputerLine, RiSheoLine } from "react-icons/ri";
import CategoryBox from "./CategoryBox";
import { useSearchParams } from "next/navigation";
import { HeadTypo, BodyTypo } from "../../Typography";

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
  const category = params?.get("category");

  return (
    <>
      <div className="flex flex-col items-center justify-center my-20">
        <HeadTypo label="Explore funitures from all categories" />
        <BodyTypo bodylabel="Explore funitures from all categories" />
      </div>

      <div className="pt-4 flex flex-row items-center justify-between overflow-x-auto ">
        {categories.map((item) => (
          <CategoryBox
            key={item.label}
            label={item.label}
            descripton={item.descripton}
            icon={item.icon}
            selected={category === item.label}
          />
        ))}
      </div>
    </>
  );
};

export default Categories;
