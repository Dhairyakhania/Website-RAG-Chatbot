"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function AdminAnalyticsChart({
  data,
}: {
  data: { question: string; count: number }[];
}) {
  const chartData = {
    labels: data.map((d) => d.question),
    datasets: [
      {
        label: "Times Asked",
        data: data.map((d) => d.count),
        backgroundColor: "#6366f1", // indigo-500
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
}
