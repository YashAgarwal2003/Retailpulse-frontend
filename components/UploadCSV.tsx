"use client";
import { useState } from "react";
import ForecastChart from "./ForecastChart";

export default function UploadCSV() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");
  const [forecast, setForecast] = useState<{ history: any; forecast: any } | null>(null);

  const upload = async () => {
    if (!file) {
      setStatus("No file selected");
      return;
    }
    console.log("Sending request to:", `${process.env.NEXT_PUBLIC_API_BASE}/forecast/`);
    setStatus("Uploading...");
    const form = new FormData();
    form.append("file", file);

    

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/forecast/`, {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (res.ok) {
        setForecast(data);
        setStatus(`Forecast generated ✅`);
      } else {
        setStatus(`Error: ${data.detail}`);
      }
    } catch (err) {
      setStatus("Upload failed ❌");
    }
  };

  return (
    <div className="p-6 border rounded-xl bg-white shadow-md space-y-4">
      <h2 className="text-xl font-semibold">Upload Transactions CSV</h2>
      <input
        type="file"
        accept=".csv"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="block w-full"
      />
      <button
        onClick={upload}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Upload & Forecast
      </button>
      <p className="text-gray-600">{status}</p>

      {forecast && (
        <ForecastChart history={forecast.history} forecast={forecast.forecast} />
      )}
    </div>
  );
}
