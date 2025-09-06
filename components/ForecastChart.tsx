"use client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface Props {
  history: Record<string, number>;
  forecast: Record<string, number>;
}

export default function ForecastChart({ history, forecast }: Props) {
  const historyData = Object.entries(history).map(([date, value]) => ({
    date,
    sales: value,
    type: "History",
  }));

  const forecastData = Object.entries(forecast).map(([date, value]) => ({
    date,
    sales: value,
    type: "Forecast",
  }));

  const data = [...historyData, ...forecastData];

  return (
    <div className="p-6 border rounded-xl bg-white shadow-md">
      <h2 className="text-xl font-bold mb-4">Sales Forecast</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="sales" stroke="#2563eb" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
