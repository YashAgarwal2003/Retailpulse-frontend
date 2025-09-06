import UploadCSV from "../components/UploadCSV";


export default function Home() {
  return (
    <main className="max-w-3xl mx-auto p-8 space-y-6">
      <h1 className="text-3xl font-bold text-blue-600">RetailPulse Dashboard 🚀</h1>
      <UploadCSV />
    </main>
  );
}
