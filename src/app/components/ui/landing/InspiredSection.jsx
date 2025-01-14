"use client";

import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { PiArmchair } from "react-icons/pi";
import { IoIosBed } from "react-icons/io";
import { MdBrunchDining } from "react-icons/md";
import { FaBath } from "react-icons/fa";
import CompareCard from "./components/CompareCard";

const InspiredSection = () => {
  const [value, setValue] = React.useState(0);
  const [nestedValue, setNestedValue] = React.useState({});

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleNestedChange = (index) => (event, newValue) => {
    setNestedValue((prev) => ({
      ...prev,
      [index]: newValue,
    }));
  };

  // Configuration for main tabs and nested tabs
  const tabsConfig = [
    {
      label: "Living Room",
      icon: <PiArmchair size={25} />,
      nestedTabs: [
        {
          label: "Spring's Living room",
          content: (
            <CompareCard
              firsImage="https://havenly.com/blog/wp-content/uploads/2023/05/Screen-Shot-2022-01-24-at-4.26.21-PM-700x455.jpg"
              secondImage="https://havenly.com/blog/wp-content/uploads/2023/05/kyliefitts_havenly_melissashome_7-3-700x466.jpg"
            />
          ),
        },

        {
          label: "Jenna's Living room",
          content: (
            <CompareCard
              firsImage="https://havenly.com/blog/wp-content/uploads/2022/06/phpL8m1FZ-700x525.jpeg"
              secondImage="https://havenly.com/blog/wp-content/uploads/2022/06/laurenmurdoch_020420_685575_01-700x473.jpg"
            />
          ),
        },
        {
          label: "Veronica's Living room",
          content: (
            <CompareCard
              firsImage="https://havenly.com/blog/wp-content/uploads/2023/05/Autumn_Before_4-1-700x453.png"
              secondImage="https://havenly.com/blog/wp-content/uploads/2023/05/kyliefitts_havenly_autumnwilliams-02-2-700x466.jpg"
            />
          ),
        },
      ],
    },
    {
      label: "Bedroom",
      icon: <IoIosBed size={25} />,
      nestedTabs: [
        {
          label: "Spring's Bedroom",
          content: (
            <CompareCard
              firsImage="https://havenly.com/blog/wp-content/uploads/2022/06/php5kBn3J-700x525.jpeg"
              secondImage="https://havenly.com/blog/wp-content/uploads/2022/06/kyliefitts_havenly_julibauer_16-700x457.jpg"
            />
          ),
        },

        {
          label: "Jenna's Bedroom",
          content: (
            <CompareCard
              firsImage="https://havenly.com/blog/wp-content/uploads/2023/11/daniellechiprut_021220_designerhometour_before06-700x452.jpg"
              secondImage="https://havenly.com/blog/wp-content/uploads/2023/11/daniellechiprut_021220_designerhometour_22-2-700x448.jpg"
            />
          ),
        },
        {
          label: "Veronica's Bedroom",
          content: (
            <CompareCard
              firsImage="https://havenly.com/blog/wp-content/uploads/2022/06/phpaqJYCM-700x432.jpeg"
              secondImage="https://havenly.com/blog/wp-content/uploads/2022/06/kyliefitts_havenlyveronicasullivan40525thst_03-1-700x891.jpg"
            />
          ),
        },
      ],
    },
    {
      label: "Dining Room",
      icon: <MdBrunchDining size={25} />,
      nestedTabs: [
        {
          label: "Spring's Dining room",
          content: (
            <CompareCard
              firsImage="https://havenly.com/blog/wp-content/uploads/2023/05/IMG_2180-1-700x933.jpg"
              secondImage="https://havenly.com/blog/wp-content/uploads/2023/05/kyliefitts_havenly_bradyburke_19-1-700x993.jpg"
            />
          ),
        },

        {
          label: "Jenna's Dining room",
          content: (
            <CompareCard
              firsImage="https://havenly.com/blog/wp-content/uploads/2022/08/kyliefitts_havenly_cecilystrong_13-700x945.jpg"
              secondImage="https://havenly.com/blog/wp-content/uploads/2022/08/MorganLevy-3252-700x1050.jpg"
            />
          ),
        },
      ],
    },
    {
      label: "Bathroom",
      icon: <FaBath size={25} />,
      nestedTabs: [
        {
          label: "Spring's Bathroom",
          content: (
            <CompareCard
              firsImage="https://havenly.com/blog/wp-content/uploads/2022/06/83f085b3f15ab843a8d27e40397d876a-uncropped_scaled_within_1536_1152-700x467.jpg"
              secondImage="https://havenly.com/blog/wp-content/uploads/2022/06/kyliefitts_havenly-process_51-3-700x1015.jpg"
            />
          ),
        },

        {
          label: "Jenna's Bathroom",
          content: (
            <CompareCard
              firsImage="https://havenly.com/blog/wp-content/uploads/2022/08/IMG_8850-1-960x1317.jpg"
              secondImage="https://havenly.com/blog/wp-content/uploads/2022/08/IMG_1503-960x1317.jpg"
            />
          ),
        },
      ],
    },
  ];

  return (
    <section className="flex flex-col justify-center items-center w-full bg-transparent">
      <div className="max-w-[84rem] m-0 w-full overflow-hidden py-[2.75rem]">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-300">
            Get Inspired
          </p>
          <h2 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-zinc-500 dark:text-zinc-300">
            Explore real client before & after
          </h2>
        </div>
        <Box sx={{ width: "100%", marginTop: "40px" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              centered
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              <Tab
                icon={<PiArmchair size={25} />}
                iconPosition="start"
                label="Living room"
                sx={{ mx: 2 }}
                className="dark:text-white font-tertiary text-2xl sm:text-xl"
                {...a11yProps(0)}
              />
              <Tab
                icon={<IoIosBed size={25} />}
                iconPosition="start"
                label="Bedroom"
                sx={{ mx: 2 }}
                className="dark:text-white font-tertiary text-2xl sm:text-xl"
                {...a11yProps(1)}
              />
              <Tab
                icon={<MdBrunchDining size={25} />}
                iconPosition="start"
                label="Dining room"
                sx={{ mx: 2 }}
                className="dark:text-white font-tertiary text-2xl sm:text-xl"
                {...a11yProps(2)}
              />
              <Tab
                icon={<FaBath size={25} />}
                iconPosition="start"
                label="Bathroom"
                sx={{ mx: 2 }}
                className="dark:text-white font-tertiary text-2xl sm:text-xl"
                {...a11yProps(2)}
              />
            </Tabs>
          </Box>
          {/* Nested Tabs */}
          {tabsConfig.map((tabConfig, index) => (
            <CustomTabPanel key={index} value={value} index={index}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                  value={nestedValue[index] || 0}
                  onChange={handleNestedChange(index)}
                  centered
                  aria-label={`nested tabs example ${index}`}
                  className="dark:text-white font-tertiary text-2xl sm:text-xl"
                >
                  {tabConfig.nestedTabs.map((nestedTab, nestedIndex) => (
                    <Tab
                      key={nestedIndex}
                      label={nestedTab.label}
                      sx={{ mx: 1 }}
                      className="dark:text-white font-tertiary text-2xl sm:text-xl"
                    />
                  ))}
                </Tabs>
              </Box>
              {tabConfig.nestedTabs.map((nestedTab, nestedIndex) => (
                <CustomTabPanel
                  key={nestedIndex}
                  value={nestedValue[index] || 0}
                  index={nestedIndex}
                >
                  {nestedTab.content}
                </CustomTabPanel>
              ))}
            </CustomTabPanel>
          ))}
        </Box>
      </div>
    </section>
  );
};

export default InspiredSection;

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}
