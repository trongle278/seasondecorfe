import { TbSunset, TbSnowflake, TbLeaf, TbSun } from "react-icons/tb";
import { TbChristmasTree } from "react-icons/tb";
import { FaHeart, FaEgg, FaGhost } from "react-icons/fa";
import { GiPartyPopper, GiDiamondRing, GiStairsCake } from "react-icons/gi";
import { LuPartyPopper } from "react-icons/lu";
import { RiFireLine } from "react-icons/ri";

export const seasons = [
  // Seasons
  { label: "Spring", value: "spring", icon: <TbLeaf size={18} /> },
  { label: "Summer", value: "summer", icon: <TbSun size={18} /> },
  { label: "Autumn", value: "autumn", icon: <TbSunset size={18} /> },
  { label: "Winter", value: "winter", icon: <TbSnowflake size={18} /> },
  
  // Holidays
  { label: "Christmas", value: "christmas", icon: <TbChristmasTree size={18} /> },
  { label: "New Year", value: "new-year", icon: <GiPartyPopper size={18} /> },
  { label: "Halloween", value: "halloween", icon: <FaGhost size={18} /> },
  { label: "Easter", value: "easter", icon: <FaEgg size={18} /> },
  { label: "Valentine", value: "valentine", icon: <FaHeart size={18} /> },
  { label: "Tet", value: "tet", icon: <RiFireLine size={18} /> },
  
  // Personal Events
  { label: "Birthday", value: "birthday", icon: <GiStairsCake size={18} /> },
  { label: "Wedding", value: "wedding", icon: <GiDiamondRing size={18} /> },
  { label: "Anniversary", value: "anniversary", icon: <LuPartyPopper size={18} /> },
];
