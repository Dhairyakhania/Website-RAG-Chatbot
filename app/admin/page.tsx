"use client";

import { useState } from "react";
import AdminAnalyticsChart from "@/components/adminAnalyticsCharts";

export default function AdminPage() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");
  const [analytics, setAnalytics] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function uploadFile() {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setStatus(data.message);
  }

  async function loadAnalytics() {
    setLoading(true);
    const res = await fetch("/api/admin/analytics");
    const data = await res.json();
    setAnalytics(data);
    setLoading(false);
  }

  return (
    <div className="min-h-screen px-6 py-10 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-gray-900 dark:to-black">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* Header */}
        <header>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Admin Dashboard
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Manage chatbot knowledge and monitor usage analytics
          </p>
        </header>

        {/* Stats Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur rounded-xl p-5 shadow">
            <p className="text-sm text-gray-500">Knowledge Source</p>
            <h3 className="text-xl font-semibold mt-1">
              Excel + Website
            </h3>
          </div>

          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur rounded-xl p-5 shadow">
            <p className="text-sm text-gray-500">Analytics</p>
            <h3 className="text-xl font-semibold mt-1">
              {analytics.length} Tracked Queries
            </h3>
          </div>

          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur rounded-xl p-5 shadow">
            <p className="text-sm text-gray-500">Chatbot Mode</p>
            <h3 className="text-xl font-semibold mt-1">
              RAG + Session Memory
            </h3>
          </div>
        </section>

        {/* Main Content Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Upload Knowledge */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-2">
              Upload Knowledge File
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Upload a new Excel file to update the chatbot knowledge base.
            </p>

            <input
              type="file"
              accept=".xlsx"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="block w-full mb-4 text-sm"
            />

            <button
              onClick={uploadFile}
              className="bg-indigo-600 hover:bg-indigo-700 transition text-white px-4 py-2 rounded-lg"
            >
              Upload Knowledge
            </button>

            {status && (
              <p className="mt-3 text-sm text-green-600">
                {status}
              </p>
            )}
          </div>

          {/* Analytics */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold">
                  Most Asked Questions
                </h2>
                <p className="text-sm text-gray-500">
                  Based on live chat usage
                </p>
              </div>

              <button
                onClick={loadAnalytics}
                className="text-sm bg-gray-900 text-white px-3 py-1.5 rounded-lg"
              >
                Refresh
              </button>
            </div>

            {loading && (
              <p className="text-sm text-gray-500">
                Loading analytics…
              </p>
            )}

            {!loading && analytics.length === 0 && (
              <p className="text-sm text-gray-500">
                No analytics data available yet.
              </p>
            )}

            {analytics.length > 0 && (
              <AdminAnalyticsChart data={analytics} />
            )}
          </div>
        </section>

      </div>
    </div>
  );
}
