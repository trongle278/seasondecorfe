"use client";

import React, { useMemo } from "react";
import { BorderBox } from "@/app/components/ui/BorderBox";
import AdminWrapper from "../components/AdminWrapper";
import {
  useGetAdminDashboard,
  useGetAdminMonthlyRevenue,
  useGetTopProviderRating,
} from "@/app/queries/dashboard/dashboard.admin.query";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  Filler,
  ArcElement,
} from "chart.js";
import { Bar, Line, Pie } from "react-chartjs-2";
import { useTheme } from "next-themes";
import { formatCurrency } from "@/app/helpers";
import { FootTypo } from "@/app/components/ui/Typography";
import CountUp from "@/app/components/ui/animated/CountUp";

// Register Chart.js components
Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Filler,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const { data: adminDashboard, isLoading: isLoadingAdminDashboard } =
    useGetAdminDashboard();
  const { data: adminMonthlyRevenue, isLoading: isLoadingAdminMonthlyRevenue } =
    useGetAdminMonthlyRevenue();
  const { data: topProviderRating, isLoading: isLoadingTopProviderRating } =
    useGetTopProviderRating();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Get the total revenue from all months
  const totalRevenue = useMemo(() => {
    if (!adminMonthlyRevenue || !Array.isArray(adminMonthlyRevenue)) return 0;
    return adminMonthlyRevenue.reduce(
      (sum, month) => sum + (month.totalRevenue || 0),
      0
    );
  }, [adminMonthlyRevenue]);

  // Month names for the chart
  const monthNames = [
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
  ];

  // Prepare chart data from the monthly revenue
  const chartData = useMemo(() => {
    if (!adminMonthlyRevenue || !Array.isArray(adminMonthlyRevenue)) {
      return {
        labels: monthNames,
        datasets: [
          {
            label: "Monthly Revenue",
            data: Array(12).fill(0),
            backgroundColor: isDark
              ? "rgba(0, 216, 255, 0.5)"
              : "rgba(0, 216, 255, 0.8)",
            borderColor: "#00d8ff",
            borderWidth: 2,
            borderRadius: 8,
            hoverBackgroundColor: "#00d8ff",
          },
        ],
      };
    }

    // Create an array of 12 zeros (for 12 months)
    const monthlyData = Array(12).fill(0);

    // Fill in the data for months that have revenue
    adminMonthlyRevenue.forEach((item) => {
      if (item.month >= 1 && item.month <= 12) {
        monthlyData[item.month - 1] = item.totalRevenue || 0;
      }
    });

    return {
      labels: monthNames,
      datasets: [
        {
          label: "Monthly Revenue",
          data: monthlyData,
          backgroundColor: isDark
            ? "rgba(0, 216, 255, 0.5)"
            : "rgba(0, 216, 255, 0.8)",
          borderColor: "#00d8ff",
          borderWidth: 2,
          borderRadius: 8,
          hoverBackgroundColor: "#00d8ff",
        },
      ],
    };
  }, [adminMonthlyRevenue, isDark]);

  // Line chart data for trend analysis
  const lineChartData = useMemo(() => {
    if (!adminMonthlyRevenue || !Array.isArray(adminMonthlyRevenue)) {
      return {
        labels: monthNames,
        datasets: [
          {
            label: "Revenue Trend",
            data: Array(12).fill(0),
            borderColor: "#00d8ff",
            backgroundColor: "rgba(0, 216, 255, 0.1)",
            fill: true,
            tension: 0.4,
            pointBackgroundColor: "#00d8ff",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "#00d8ff",
            pointRadius: 4,
            pointHoverRadius: 6,
          },
        ],
      };
    }

    // Create an array of 12 zeros (for 12 months)
    const monthlyData = Array(12).fill(0);

    // Fill in the data for months that have revenue
    adminMonthlyRevenue.forEach((item) => {
      if (item.month >= 1 && item.month <= 12) {
        monthlyData[item.month - 1] = item.totalRevenue || 0;
      }
    });

    return {
      labels: monthNames,
      datasets: [
        {
          label: "Revenue Trend",
          data: monthlyData,
          borderColor: "#00d8ff",
          backgroundColor: "rgba(0, 216, 255, 0.1)",
          fill: true,
          tension: 0.4,
          pointBackgroundColor: "#00d8ff",
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "#00d8ff",
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    };
  }, [adminMonthlyRevenue, isDark]);

  // Pie chart data for customers vs providers
  const pieChartData = useMemo(() => {
    const totalCustomers = adminDashboard?.totalCustomers || 0;
    const totalProviders = adminDashboard?.totalProviders || 0;

    return {
      labels: ['Customers', 'Providers'],
      datasets: [
        {
          data: [totalCustomers, totalProviders],
          backgroundColor: [
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 99, 132, 0.8)',
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)',
            'rgba(255, 99, 132, 1)',
          ],
          borderWidth: 1,
          hoverOffset: 4,
        },
      ],
    };
  }, [adminDashboard]);

  // Chart options
  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          color: isDark ? "#fff" : "#666",
          font: { size: 12 },
        },
      },
      title: {
        display: true,
        text: "Monthly Revenue in 2025",
        color: isDark ? "#fff" : "#666",
        font: { size: 16, weight: "bold" },
        padding: { bottom: 20 },
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
          font: { size: 12 },
        },
        border: { display: false },
      },
      x: {
        grid: { display: false },
        ticks: {
          color: isDark ? "#9CA3AF" : "#666",
          font: { size: 12 },
        },
        border: { display: false },
      },
    },
  };

  const lineChartOptions = {
    ...barChartOptions,
    elements: {
      line: {
        tension: 0.4,
      },
    },
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          color: isDark ? "#fff" : "#666",
          font: { size: 12 },
        },
      },
      title: {
        display: true,
        text: "All Users",
        color: isDark ? "#fff" : "#666",
        font: { size: 16, weight: "bold" },
        padding: { bottom: 10 },
      },
      tooltip: {
        backgroundColor: isDark ? "#374151" : "#fff",
        titleColor: isDark ? "#fff" : "#000",
        bodyColor: isDark ? "#fff" : "#000",
        borderColor: isDark ? "#4B5563" : "#E5E7EB",
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: function(context) {
            const value = context.raw;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${context.label}: ${value} (${percentage}%)`;
          }
        }
      },
    },
  };

  // Find the highest revenue month
  const highestRevenueMonth = useMemo(() => {
    if (
      !adminMonthlyRevenue ||
      !Array.isArray(adminMonthlyRevenue) ||
      adminMonthlyRevenue.length === 0
    ) {
      return { month: 0, totalRevenue: 0 };
    }

    return adminMonthlyRevenue.reduce(
      (highest, current) => {
        return current.totalRevenue > highest.totalRevenue ? current : highest;
      },
      { month: 0, totalRevenue: 0 }
    );
  }, [adminMonthlyRevenue]);

  return (
    <AdminWrapper>
      <div className="w-full grid grid-cols-1 md:grid-cols-3 grid-rows-auto md:grid-rows-3 gap-4">
        <BorderBox className="col-span-1 md:col-span-2 row-span-2 p-4">
          <div className="flex flex-col h-full">
            <FootTypo
              footlabel="Revenue Analysis"
              className="!m-0 pb-2 text-lg font-semibold"
            />
            <div className="h-[400px] mt-2">
              {!isLoadingAdminMonthlyRevenue && (
                <Bar options={barChartOptions} data={chartData} />
              )}
            </div>
          </div>
        </BorderBox>

        <BorderBox className="col-span-1 md:col-start-3 row-span-1 p-4">
          <div className="flex flex-col h-full">
            <div className="h-[180px] mt-2">
              {!isLoadingAdminDashboard && (
                <Pie options={pieChartOptions} data={pieChartData} />
              )}
            </div>
            <div className="flex justify-between mt-2 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-[rgba(54,162,235,0.8)] mr-2"></div>
                <span>Customers: {adminDashboard?.totalCustomers || 0}</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-[rgba(255,99,132,0.8)] mr-2"></div>
                <span>Providers: {adminDashboard?.totalProviders || 0}</span>
              </div>
            </div>
          </div>
        </BorderBox>

        <BorderBox className="col-span-1 md:col-start-3 row-start-2 p-4">
          <div className="flex flex-col h-full">
            <FootTypo
              footlabel="Total Revenue"
              className="!m-0 pb-2 text-lg font-semibold"
            />
            <div className="flex flex-col items-center justify-center h-full">
              <div className="text-3xl font-bold text-primary mb-2">
                {isLoadingAdminMonthlyRevenue ? (
                  "Loading..."
                ) : (
                  <CountUp
                    to={totalRevenue}
                    formatter={(value) => formatCurrency(value)}
                    duration={1}
                  />
                )}
              </div>
              <FootTypo
                footlabel="Total Revenue for 2025"
                className="!m-0 text-gray-500"
              />
            </div>
          </div>
        </BorderBox>

        <BorderBox className="col-span-1 md:col-span-3 row-span-1 p-4">
          <div className="flex flex-col h-full">
            <FootTypo
              footlabel="Revenue Trend"
              className="!m-0 pb-2 text-lg font-semibold"
            />
            <div className="h-[200px] mt-2">
              {!isLoadingAdminMonthlyRevenue && (
                <Line options={lineChartOptions} data={lineChartData} />
              )}
            </div>
          </div>
        </BorderBox>
      </div>

      <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
        <BorderBox className="p-4">
          <FootTypo
            footlabel="Total Accounts"
            className="!m-0 pb-2 text-lg font-semibold"
          />
          <div className="text-3xl font-bold text-blue-500">
            {isLoadingAdminDashboard ? (
              "Loading..."
            ) : (
              <CountUp to={adminDashboard?.totalAccounts || 0} duration={1} />
            )}
          </div>
        </BorderBox>

        <BorderBox className="p-4">
          <FootTypo
            footlabel="Total Bookings"
            className="!m-0 pb-2 text-lg font-semibold"
          />
          <div className="text-3xl font-bold text-green-500">
            {isLoadingAdminDashboard ? (
              "Loading..."
            ) : (
              <CountUp to={adminDashboard?.totalBookings || 0} duration={1} />
            )}
          </div>
        </BorderBox>

        <BorderBox className="p-4">
          <FootTypo
            footlabel="Completed Bookings"
            className="!m-0 pb-2 text-lg font-semibold"
          />
          <div className="text-3xl font-bold text-yellow-500">
            {isLoadingAdminDashboard ? (
              "Loading..."
            ) : (
              <CountUp to={adminDashboard?.completedBookings || 0} duration={1} />
            )}
          </div>
        </BorderBox>

        <BorderBox className="p-4">
          <FootTypo
            footlabel="Cancelled Bookings"
            className="!m-0 pb-2 text-lg font-semibold"
          />
          <div className="text-3xl font-bold text-red-500">
            {isLoadingAdminDashboard ? (
              "Loading..."
            ) : (
              <CountUp to={adminDashboard?.canceledBookings || 0} duration={1} />
            )}
          </div>
        </BorderBox>
      </div>
    </AdminWrapper>
  );
};

export default AdminDashboard;
