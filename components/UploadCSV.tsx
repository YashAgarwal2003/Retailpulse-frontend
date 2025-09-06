"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface ForecastData {
  date: string;
  sales: number;
  type: "history" | "forecast";
}

const UploadCSV: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData[]>([]);
  const [status, setStatus] = useState<string>("");

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      setStatus("Please select a CSV file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setStatus("Uploading...");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/forecast/`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result: ForecastData[] = await response.json();
      setForecastData(result);
      setStatus("Forecast generated ✅");
    } catch (error: unknown) {
      console.error("Upload failed:", error);
      setStatus("Upload failed ❌");
    }
  };

  return (
    <Card className="p-4">
      <CardHeader>
        <CardTitle>Upload Sales CSV</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="block w-full"
          />
          <Button type="submit">Upload & Forecast</Button>
        </form>
        {status && <p className="mt-2 text-sm">{status}</p>}

        {forecastData.length > 0 && (
          <div className="h-96 mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={forecastData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                {/* History line */}
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#2563eb"
                  name="History"
                  dot={false}
                  strokeWidth={2}
                  connectNulls
                  isAnimationActive={false}
                  data={forecastData.filter((d) => d.type === "history")}
                />
                {/* Forecast line */}
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#f97316"
                  name="Forecast"
                  dot={false}
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  connectNulls
                  isAnimationActive={false}
                  data={forecastData.filter((d) => d.type === "forecast")}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UploadCSV;
