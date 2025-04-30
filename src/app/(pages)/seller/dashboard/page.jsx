"use client";

import React from "react";
import SellerWrapper from "../components/SellerWrapper";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { FootTypo } from "@/app/components/ui/Typography";
import {
  MdDashboard,
  MdOutlineInventory2,
  MdOutlineAnalytics,
} from "react-icons/md";
import { BorderBox } from "@/app/components/ui/BorderBox";
import { GrMoney } from "react-icons/gr";
import {
  useGetProviderDashboard,
  useGetMonthlyRevenue,
  useGeTopCustomerSpending,
} from "@/app/queries/dashboard/dashboard.provider.query";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useTheme } from "next-themes";
import { formatCurrency, GrowthIndicator } from "@/app/helpers";
import { HiOutlineUsers } from "react-icons/hi2";
import { FaRegCreditCard } from "react-icons/fa";
import { FaRegCalendarCheck } from "react-icons/fa";
import Avatar from "@/app/components/ui/Avatar/Avatar";
import { Skeleton } from "@mui/material";
import { GoPackage } from "react-icons/go";
import { CiClock1 } from "react-icons/ci";
import { RiBaseStationLine } from "react-icons/ri";
import CountUp from "@/app/components/ui/animated/CountUp";
import { LuLamp } from "react-icons/lu";
// Register ChartJS components
Chart.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  LineElement,
  PointElement,
  Title, 
  Tooltip, 
  Legend
);

const SellerDashboard = () => {
  const { data: providerDashboard, isLoading: isProviderDashboardLoading } =
    useGetProviderDashboard();
  const { data: monthlyRevenue, isLoading: isMonthlyRevenueLoading } =
    useGetMonthlyRevenue();
  const { data: topCustomerSpending, isLoading: isTopCustomerSpendingLoading } =
    useGeTopCustomerSpending();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Function to calculate percentage growth
  const calculateGrowth = (currentValue, previousValue) => {
    if (!previousValue || previousValue === 0) {
      return currentValue > 0 ? 100 : 0; // If previous was 0, and current has value, it's 100% growth
    }

    const difference = currentValue - previousValue;
    const percentageChange = (difference / previousValue) * 100;

    return Math.round(percentageChange);
  };

  // Growth indicators for different metrics

  const revenueGrowth = calculateGrowth(
    providerDashboard?.thisWeekTotalRevenue || 0,
    providerDashboard?.lastWeekTotalRevenue || 0
  );

  const orderGrowth = calculateGrowth(
    providerDashboard?.thisWeekOrders || 0,
    providerDashboard?.lastWeekOrders || 0
  );

  const bookingGrowth = calculateGrowth(
    providerDashboard?.thisWeekBookings || 0,
    providerDashboard?.lastWeekBookings || 0
  );

  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Monthly Revenue in 2025",
        color: isDark ? "#fff" : "#666",
        font: {
          size: 16,
          weight: "bold",
        },
      },
      tooltip: {
        backgroundColor: isDark ? "#374151" : "#fff",
        titleColor: isDark ? "#fff" : "#000",
        bodyColor: isDark ? "#fff" : "#000",
        borderColor: isDark ? "#4B5563" : "#E5E7EB",
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          label: function (context) {
            return formatCurrency(context.raw);
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: isDark ? "#374151" : "#f0f0f0",
          drawBorder: false,
        },
        ticks: {
          color: isDark ? "#9CA3AF" : "#666",
          callback: function (value) {
            return formatCurrency(value);
          },
          font: {
            size: 12,
          },
        },
        border: {
          display: false,
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: isDark ? "#9CA3AF" : "#666",
          font: {
            size: 12,
          },
        },
        border: {
          display: false,
        },
      },
    },
  };

  // Prepare chart data
  const chartData = {
    labels: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    datasets: [
      {
        data: Array(12)
          .fill(0)
          .map((_, index) => {
            const monthData = monthlyRevenue?.find(
              (item) => item.month === index + 1
            );
            return monthData?.totalRevenue || 0;
          }),
        backgroundColor: isDark
          ? "rgba(0, 216, 255, 0.5)"
          : "rgba(0, 216, 255, 0.8)",
        hoverBackgroundColor: "#00d8ff",
        borderWidth: 2,
        borderRadius: 8,
        hoverBackgroundColor: "#00d8ff",
      },
    ],
  };

  return (
    <SellerWrapper>
      <div className="w-full px-2 py-4 sm:px-0">
        <TabGroup>
          <TabList className="flex space-x-1 rounded-xl bg-gray-100 dark:bg-gray-700 p-1">
            <Tab
              className={({ selected }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-all duration-200 ease-in-out
              ${
                selected
                  ? "bg-white dark:bg-gray-900 text-primary shadow"
                  : "hover:bg-white/[0.12] hover:text-primary"
              }`
              }
            >
              <div className="flex items-center justify-center gap-2">
                <MdDashboard size={20} />
                <FootTypo footlabel="Overview" className="!m-0" />
              </div>
            </Tab>
            <Tab
              className={({ selected }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-all duration-200 ease-in-out
              ${
                selected
                  ? "bg-white dark:bg-gray-900 text-primary shadow"
                  : "hover:bg-white/[0.12] hover:text-primary"
              }`
              }
            >
              <div className="flex items-center justify-center gap-2">
                <MdOutlineInventory2 size={20} />
                <FootTypo footlabel="Analytics" className="!m-0" />
              </div>
            </Tab>
            <Tab
              className={({ selected }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-all duration-200 ease-in-out
              ${
                selected
                  ? "bg-white dark:bg-gray-900 text-primary shadow"
                  : "hover:bg-white/[0.12] hover:text-primary"
              }`
              }
            >
              <div className="flex items-center justify-center gap-2">
                <MdOutlineAnalytics size={20} />
                <FootTypo footlabel="Reports" className="!m-0" />
              </div>
            </Tab>
          </TabList>
          <TabPanels className="mt-5 font-semibold relative">
            <TabPanel className="bg-transparent space-y-5 animate-tab-fade-in">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <BorderBox className="p-4">
                  <div className="flex items-center justify-between">
                    <FootTypo
                      footlabel="Total Revenue"
                      className="!m-0 text-sm tracking-tight"
                    />
                    <GrMoney size={16} />
                  </div>
                  <div className="flex items-center justify-between">
                    {isProviderDashboardLoading ? (
                      <Skeleton variant="text" width={100} height={20} />
                    ) : (
                      <FootTypo
                        footlabel={`+ ${formatCurrency(
                          providerDashboard?.totalRevenue
                        )}`}
                        className="!m-0 text-sm tracking-tight"
                      />
                    )}
                    <GrowthIndicator value={revenueGrowth} />
                  </div>
                  <div className="text-xs">
                    <span className="font-medium">+</span>{" "}
                    {formatCurrency(providerDashboard?.thisWeekTotalRevenue) || 0} since last
                    week
                  </div>
                </BorderBox>
                <BorderBox className="p-4">
                  <div className="flex items-center justify-between ">
                    <FootTypo
                      footlabel="Subscriptions"
                      className="!m-0 text-sm tracking-tight"
                    />
                    <HiOutlineUsers size={16} />
                  </div>
                  {isProviderDashboardLoading ? (
                    <Skeleton variant="text" width={100} height={20} />
                  ) : (
                    <div className="flex items-center justify-between">
                      <CountUp
                        to={providerDashboard?.totalFollowers}
                        className="!m-0 text-sm tracking-tight"
                        direction="up"
                        duration={0.5}
                      />
                    </div>
                  )}
                </BorderBox>
                <BorderBox className="p-4">
                  <div className="flex items-center justify-between">
                    <FootTypo
                      footlabel="Booking"
                      className="!m-0 text-sm tracking-tight"
                    />
                    <FaRegCalendarCheck size={16} />
                  </div>
                  <div className="flex items-center justify-between">
                    {isProviderDashboardLoading ? (
                      <Skeleton variant="text" width={100} height={20} />
                    ) : (
                      <CountUp
                        to={providerDashboard?.totalBookings}
                        className="!m-0 text-sm tracking-tight"
                        direction="up"
                        duration={0.5}
                      />
                    )}
                    <GrowthIndicator value={bookingGrowth} />
                  </div>
                  <div className="text-xs">
                    <span className="font-medium">+</span>{" "}
                    {providerDashboard?.thisWeekBookings || 0} since last week
                  </div>
                </BorderBox>
                <BorderBox className="p-4">
                  <div className="flex items-center justify-between">
                    <FootTypo
                      footlabel="Orders"
                      className="!m-0 text-sm tracking-tight"
                    />
                    <FaRegCreditCard size={16} />
                  </div>
                  <div className="flex items-center justify-between">
                    {isProviderDashboardLoading ? (
                      <Skeleton variant="text" width={100} height={20} />
                    ) : (
                      <CountUp
                        to={providerDashboard?.totalOrders}
                        className="!m-0 text-sm tracking-tight"
                        direction="up"
                        duration={0.5}
                      />
                    )}
                    <GrowthIndicator value={orderGrowth} />
                  </div>
                  <div className="text-xs">
                    <span className="font-medium">+</span>{" "}
                    {providerDashboard?.thisWeekOrders || 0} since last week
                  </div>
                </BorderBox>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <BorderBox className="col-span-4 p-4">
                  <div className="h-[400px] dark:bg-transparent rounded-lg p-4">
                    {!isMonthlyRevenueLoading && (
                      <Bar options={options} data={chartData} />
                    )}
                  </div>
                </BorderBox>
                <BorderBox className="col-span-3">
                  <FootTypo
                    footlabel="Top Contribution Users"
                    className="!m-0 text-lg tracking-tight"
                  />
                  <div className="flex flex-col gap-2">
                    {topCustomerSpending?.map((item, index) => (
                      <div key={item.customerId}>
                        <div className="flex items-center gap-2 justify-between pl-16 relative">
                          <div className="number w-[50px] absolute left-0 top-0 text-center text-[2.2em] italic bg-gradient-to-r from-yellow to-white text-transparent bg-clip-text ">
                            {index + 1}
                          </div>
                          <div className="flex items-center gap-3">
                            <Avatar userImg={item.avatar} w={36} h={36} />
                            <span className="flex flex-col">
                              <FootTypo
                                footlabel={item.fullName}
                                className="!m-0 text-lg tracking-tight"
                              />
                              <FootTypo
                                footlabel={item.email}
                                className="!m-0 text-xs tracking-tight"
                              />
                            </span>
                          </div>
                          <FootTypo
                            footlabel={`+ ${formatCurrency(
                              item.totalSpending
                            )}`}
                            className="!m-0 text-lg tracking-tight"
                          />
                        </div>
                      </div>
                    ))}
                    {isTopCustomerSpendingLoading && (
                      <>
                        {[1, 2, 3, 4, 5].map((num) => (
                          <div
                            key={`skeleton-${num}`}
                            className="flex items-center gap-2 justify-between pl-16 relative"
                          >
                            <div className="number absolute left-0 top-0 text-center text-[2.2em] italic bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
                              {num}
                            </div>
                            <div className="flex items-center gap-3">
                              <Skeleton
                                variant="circular"
                                width={36}
                                height={36}
                              />
                              <span className="flex flex-col">
                                <Skeleton
                                  variant="text"
                                  width={120}
                                  height={24}
                                />
                                <Skeleton
                                  variant="text"
                                  width={80}
                                  height={16}
                                />
                              </span>
                            </div>
                            <Skeleton variant="text" width={80} height={24} />
                          </div>
                        ))}
                      </>
                    )}
                    {!isTopCustomerSpendingLoading &&
                      topCustomerSpending?.length === 0 && (
                        <div className="text-center py-4 text-gray-500">
                          No customer spending data available
                        </div>
                      )}
                  </div>
                </BorderBox>
              </div>
            </TabPanel>
            <TabPanel className="bg-transparent space-y-5 animate-tab-fade-in">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-8">
                <BorderBox className="col-span-2 p-4">
                  <div className="flex flex-col gap-4">
                    <FootTypo
                      footlabel="Detail Analytics"
                      className="!m-0 text-lg"
                    />
                    <div className="flex flex-col gap-3">
                      <div className="flex flex-row items-center justify-between border-b pb-3">
                        <div className="flex items-center gap-2">
                          <GoPackage size={20} className="text-primary" />
                          <FootTypo
                            footlabel="Total Services"
                            className="!m-0 text-sm tracking-tight"
                          />
                        </div>
                        <CountUp
                          to={providerDashboard?.totalServices || 0}
                          className="!m-0 text-lg tracking-tight font-bold"
                          direction="up"
                          duration={0.5}
                        />
                      </div>
                      <div className="flex flex-row items-center justify-between border-b pb-3">
                        <div className="flex items-center gap-2">
                          <CiClock1 size={20} className="text-yellow" />
                          <FootTypo
                            footlabel="On Going Services"
                            className="!m-0 text-sm tracking-tight"
                          />
                        </div>
                        <CountUp
                          to={providerDashboard?.processingBookings || 0}
                          className="!m-0 text-lg tracking-tight font-bold"
                          direction="up"
                          duration={0.5}
                        />
                      </div>
                      <div className="flex flex-row items-center justify-between border-b pb-3">
                        <div className="flex items-center gap-2">
                          <RiBaseStationLine
                            size={20}
                            className="text-success"
                          />
                          <FootTypo
                            footlabel="Services Available"
                            className="!m-0 text-sm tracking-tight"
                          />
                        </div>
                        <CountUp
                          to={providerDashboard?.completedBookings || 0}
                          className="!m-0 text-lg tracking-tight font-bold"
                          direction="up"
                          duration={0.5}
                        />
                      </div>
                      <div className="flex flex-row items-center justify-between">
                        <div className="flex items-center gap-2">
                          <LuLamp size={20} />
                          <FootTypo
                            footlabel="Total Products"
                            className="!m-0 text-sm tracking-tight"
                          />
                        </div>
                        <CountUp
                          to={providerDashboard?.totalProducts || 0}
                          className="!m-0 text-lg tracking-tight font-bold"
                          direction="up"
                          duration={0.5}
                        />
                      </div>
                    </div>
                  </div>
                </BorderBox>

                <BorderBox className="col-span-3 p-4">
                  <div className="flex flex-col h-full">
                    <FootTypo
                      footlabel="Top Services"
                      className="!m-0 pb-4 text-lg"
                    />
                    <div className="flex flex-col gap-3">
                      {providerDashboard?.topServices?.map((item, index) => (
                        <div key={item.serviceId} className=" pb-3">
                          <div className="flex items-center gap-2 justify-between pl-16 relative">
                            <div className="number w-[50px] absolute left-0 top-[-10px] text-center text-[2.2em] italic bg-gradient-to-r from-yellow to-white text-transparent bg-clip-text">
                              {index + 1}
                            </div>
                            <div className="flex items-center gap-3">
                              <FootTypo
                                footlabel={item.style}
                                className="!m-0 text-md tracking-tight"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                      {!providerDashboard?.topServices?.length && (
                        <div className="flex items-center justify-center h-full text-gray-500">
                          No top services data available
                        </div>
                      )}
                    </div>
                  </div>
                </BorderBox>
                <BorderBox className="col-span-3 p-4">
                  <div className="flex flex-col h-full">
                    <FootTypo
                      footlabel="Best Selling Products"
                      className="!m-0 pb-4 text-lg"
                    />
                    <div className="flex flex-col gap-3">
                      {providerDashboard?.topProducts?.map((item, index) => (
                        <div key={item.productId} className=" pb-3">
                          <div className="flex items-center gap-2 justify-between pl-16 relative">
                            <div className="number w-[50px] absolute left-0 top-[-10px] text-center text-[2.2em] italic bg-gradient-to-r from-yellow to-white text-transparent bg-clip-text">
                              {index + 1}
                            </div>
                            <div className="flex items-center gap-3">
                              <FootTypo
                                footlabel={item.productName}
                                className="!m-0 text-md tracking-tight"
                              />
                            </div>
                            <FootTypo
                              footlabel={`${item.soldQuantity} sold`}
                              className="!m-0 text-md tracking-tight"
                            />
                          </div>
                        </div>
                      ))}
                      {!providerDashboard?.topProducts?.length && (
                        <div className="flex items-center justify-center h-full text-gray-500">
                          No top products data available
                        </div>
                      )}
                    </div>
                  </div>
                </BorderBox>

                <BorderBox className="col-span-3 p-4">
                  <div className="flex flex-col gap-4">
                    <FootTypo
                      footlabel="Booking Analytics"
                      className="!m-0 text-lg"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-center">
                        <FootTypo
                          footlabel="Completed"
                          className="!m-0 text-sm tracking-tight mb-2"
                        />
                        <div className="text-2xl font-bold text-success">
                          <CountUp
                            to={providerDashboard?.completedBookings || 0}
                            direction="up"
                            duration={0.5}
                          />
                        </div>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-center">
                        <FootTypo
                          footlabel="Pending"
                          className="!m-0 text-sm tracking-tight mb-2"
                        />
                        <div className="text-2xl font-bold text-yellow">
                          <CountUp
                            to={providerDashboard?.pendingBookings || 0}
                            direction="up"
                            duration={0.5}
                          />
                        </div>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-center">
                        <FootTypo
                          footlabel="Cancelled"
                          className="!m-0 text-sm tracking-tight mb-2"
                        />
                        <div className="text-2xl font-bold text-error">
                          <CountUp
                            to={providerDashboard?.cancelledBookings || 0}
                            direction="up"
                            duration={0.5}
                          />
                        </div>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-center">
                        <FootTypo
                          footlabel="Total"
                          className="!m-0 text-sm tracking-tight mb-2"
                        />
                        <div className="text-2xl font-bold text-primary">
                          <CountUp
                            to={providerDashboard?.totalBookings || 0}
                            direction="up"
                            duration={0.5}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </BorderBox>

                <BorderBox className="col-span-5 p-4">
                  <div className="flex flex-col h-full">
                    <FootTypo
                      footlabel="Revenue Breakdown"
                      className="!m-0 mb-4"
                    />
                    <div className="flex flex-col gap-4 h-full">
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <FootTypo
                            footlabel="This Week"
                            className="!m-0 text-sm tracking-tight"
                          />
                          <div className="text-lg font-bold">
                            {formatCurrency(
                              providerDashboard?.thisWeekTotalRevenue || 0
                            )}
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-primary to-secondary h-full rounded-full"
                            style={{
                              width: `${Math.min(
                                100,
                                (providerDashboard?.thisWeekTotalRevenue /
                                  providerDashboard?.totalRevenue) *
                                  100 || 0
                              )}%`,
                            }}
                          ></div>
                        </div>
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <FootTypo
                            footlabel="Last Week"
                            className="!m-0 text-sm tracking-tight"
                          />
                          <div className="text-lg font-bold">
                            {formatCurrency(
                              providerDashboard?.lastWeekTotalRevenue || 0
                            )}
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-yellow to-orange h-full rounded-full"
                            style={{
                              width: `${Math.min(
                                100,
                                (providerDashboard?.lastWeekTotalRevenue /
                                  providerDashboard?.totalRevenue) *
                                  100 || 0
                              )}%`,
                            }}
                          ></div>
                        </div>
                      </div>

                      <div className="mt-auto flex items-center justify-between">
                        <FootTypo
                          footlabel="Growth Rate"
                          className="!m-0 text-md tracking-tight"
                        />
                        <div
                          className={`text-lg font-bold ${
                            providerDashboard?.thisWeekTotalRevenue >
                            providerDashboard?.lastWeekTotalRevenue
                              ? "text-success"
                              : "text-error"
                          }`}
                        >
                          {providerDashboard?.thisWeekTotalRevenue >
                          providerDashboard?.lastWeekTotalRevenue
                            ? "+"
                            : ""}
                          {(
                            (((providerDashboard?.thisWeekTotalRevenue || 0) -
                              (providerDashboard?.lastWeekTotalRevenue || 0)) /
                              (providerDashboard?.lastWeekTotalRevenue || 1)) *
                            100
                          ).toFixed(1)}
                          %
                        </div>
                      </div>
                    </div>
                  </div>
                </BorderBox>

                <BorderBox className="col-span-8 p-4 mt-4">
                  <FootTypo
                    footlabel="Growth Rate Analysis"
                    className="!m-0 text-lg mb-4"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Revenue Growth Chart */}
                    <div className="h-[300px]">
                      <Line
                        data={{
                          labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Current"],
                          datasets: [
                            {
                              label: "Revenue Growth",
                              data: [
                                providerDashboard?.lastMonthTotalRevenue * 0.2 || 0,
                                providerDashboard?.lastMonthTotalRevenue * 0.4 || 0,
                                providerDashboard?.lastMonthTotalRevenue * 0.7 || 0,
                                providerDashboard?.lastWeekTotalRevenue || 0,
                                providerDashboard?.thisWeekTotalRevenue || 0,
                              ],
                              borderColor: 'rgb(0, 216, 255)',
                              backgroundColor: 'rgba(0, 216, 255, 0.1)',
                              borderWidth: 2,
                              fill: true,
                              tension: 0.4,
                              pointBackgroundColor: 'rgb(0, 216, 255)',
                              pointBorderColor: '#fff',
                              pointBorderWidth: 2,
                              pointRadius: 4,
                              pointHoverRadius: 6,
                            }
                          ]
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: 'top',
                              labels: {
                                color: isDark ? '#fff' : '#666',
                                font: {
                                  size: 12,
                                }
                              }
                            },
                            title: {
                              display: true,
                              text: 'Weekly Revenue Trend',
                              color: isDark ? '#fff' : '#666',
                              font: {
                                size: 14,
                                weight: 'bold',
                              }
                            },
                            tooltip: {
                              backgroundColor: isDark ? "#374151" : "#fff",
                              titleColor: isDark ? "#fff" : "#000",
                              bodyColor: isDark ? "#fff" : "#000",
                              borderColor: isDark ? "#4B5563" : "#E5E7EB",
                              borderWidth: 1,
                              displayColors: false,
                              callbacks: {
                                label: function (context) {
                                  return formatCurrency(context.raw);
                                },
                              },
                            },
                          },
                          scales: {
                            y: {
                              beginAtZero: true,
                              grid: {
                                color: isDark ? "#374151" : "#f0f0f0",
                                drawBorder: false,
                              },
                              ticks: {
                                color: isDark ? "#9CA3AF" : "#666",
                                callback: function (value) {
                                  return formatCurrency(value);
                                },
                                font: {
                                  size: 11,
                                },
                              },
                              border: {
                                display: false,
                              },
                            },
                            x: {
                              grid: {
                                display: false,
                              },
                              ticks: {
                                color: isDark ? "#9CA3AF" : "#666",
                                font: {
                                  size: 11,
                                },
                              },
                              border: {
                                display: false,
                              },
                            },
                          },
                        }}
                      />
                    </div>

                    {/* Booking Growth Chart */}
                    <div className="h-[300px]">
                      <Line
                        data={{
                          labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Current"],
                          datasets: [
                            {
                              label: "Booking Growth",
                              data: [
                                Math.max(1, providerDashboard?.lastWeekBookings * 0.3) || 1,
                                Math.max(2, providerDashboard?.lastWeekBookings * 0.5) || 2,
                                Math.max(3, providerDashboard?.lastWeekBookings * 0.8) || 3,
                                providerDashboard?.lastWeekBookings || 4,
                                providerDashboard?.thisWeekBookings || 5,
                              ],
                              borderColor: 'rgb(75, 192, 192)',
                              backgroundColor: 'rgba(75, 192, 192, 0.1)',
                              borderWidth: 2,
                              fill: true,
                              tension: 0.4,
                              pointBackgroundColor: 'rgb(75, 192, 192)',
                              pointBorderColor: '#fff',
                              pointBorderWidth: 2,
                              pointRadius: 4,
                              pointHoverRadius: 6,
                            }
                          ]
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: 'top',
                              labels: {
                                color: isDark ? '#fff' : '#666',
                                font: {
                                  size: 12,
                                }
                              }
                            },
                            title: {
                              display: true,
                              text: 'Weekly Booking Trend',
                              color: isDark ? '#fff' : '#666',
                              font: {
                                size: 14,
                                weight: 'bold',
                              }
                            },
                            tooltip: {
                              backgroundColor: isDark ? "#374151" : "#fff",
                              titleColor: isDark ? "#fff" : "#000",
                              bodyColor: isDark ? "#fff" : "#000",
                              borderColor: isDark ? "#4B5563" : "#E5E7EB",
                              borderWidth: 1,
                              displayColors: false,
                            },
                          },
                          scales: {
                            y: {
                              beginAtZero: true,
                              grid: {
                                color: isDark ? "#374151" : "#f0f0f0",
                                drawBorder: false,
                              },
                              ticks: {
                                color: isDark ? "#9CA3AF" : "#666",
                                font: {
                                  size: 11,
                                },
                              },
                              border: {
                                display: false,
                              },
                            },
                            x: {
                              grid: {
                                display: false,
                              },
                              ticks: {
                                color: isDark ? "#9CA3AF" : "#666",
                                font: {
                                  size: 11,
                                },
                              },
                              border: {
                                display: false,
                              },
                            },
                          },
                        }}
                      />
                    </div>
                  </div>
                </BorderBox>
              </div>
            </TabPanel>
            <TabPanel className="bg-transparent space-y-5 animate-tab-fade-in">
              <div className="p-4">
                <FootTypo
                  footlabel="Analytics Content"
                  className="!m-0 text-lg font-semibold"
                />
                <p className="mt-2 text-gray-500 dark:text-gray-400">
                  View your business analytics and reports here.
                </p>
              </div>
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </div>
    </SellerWrapper>
  );
};

export default SellerDashboard;
