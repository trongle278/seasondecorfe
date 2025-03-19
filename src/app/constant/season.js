import { TbSunset, TbSnowflake, TbLeaf, TbSun } from "react-icons/tb";
import { TbChristmasTree } from "react-icons/tb";
import { GiPartyPopper } from "react-icons/gi";

export const seasons = [
    { label: "Spring", value: "spring", icon: <TbLeaf color="green" /> },
    { label: "Summer", value: "summer", icon: <TbSun color="orange" /> },
    { label: "Autumn", value: "autumn", icon: <TbSunset color="brown" /> },
    { label: "Winter", value: "winter", icon: <TbSnowflake color="blue" /> },
    { label: "Christmas", value: "christmas", icon: <TbChristmasTree color="red" /> },
    { label: "New Year", value: "new-year", icon: <GiPartyPopper /> }
  ];