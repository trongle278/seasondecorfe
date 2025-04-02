import { TbSunset, TbSnowflake, TbLeaf, TbSun } from "react-icons/tb";
import { TbChristmasTree } from "react-icons/tb";
import { GiPartyPopper } from "react-icons/gi";

export const seasons = [
  { label: "Spring", value: "spring", icon: <TbLeaf size={18} /> },
  { label: "Summer", value: "summer", icon: <TbSun size={18} /> },
  { label: "Autumn", value: "autumn", icon: <TbSunset size={18} /> },
  { label: "Winter", value: "winter", icon: <TbSnowflake size={18} /> },
  { label: "Christmas", value: "christmas", icon: <TbChristmasTree size={18} /> },
  { label: "New Year", value: "new-year", icon: <GiPartyPopper size={18} /> },
];
