"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

interface DashboardData {
  biologicalAge?: number;
  ageDelta?: number;
  steps?: number;
  sleep?: number;
  heartRate?: number;
}

export default function DashboardSection({ userId }: { userId: string }) {
  const [data, setData] = useState<DashboardData>({});

  useEffect(() => {
    const loadDashboard = async () => {
      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const dashboardData = docSnap.data() as DashboardData;
        setData(dashboardData);
      } else {
        console.error("No such document!");
      }
    };
    loadDashboard();
  }, [userId]);

  return (
    <section
      className="bg-white dark:bg-black text-black dark:text-white py-16 px-6"
      id="dashboard"
    >
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
            Your Dashboard
          </h2>
          <p className="text-gray-700 dark:text-gray-300 text-sm">
            Your central hub for health data, insights, and daily actions.
          </p>
        </div>
        {/* Biological Age */}
        <div className="bg-gray-100 dark:bg-gray-900 p-6 rounded-xl shadow">
          <h3 className="text-xl font-semibold text-purple-600 dark:text-purple-400 mb-2">
            Biological Age
          </h3>
          <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
            {data.biologicalAge !== undefined
              ? `${data.biologicalAge} years`
              : "Loading..."}
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {data.biologicalAge !== undefined && data.ageDelta !== undefined
              ? `You are ${data.ageDelta > 0 ? `${data.ageDelta} years younger` : `${Math.abs(data.ageDelta)} years older`} than your chronological age.`
              : ""}
          </p>
        </div>
        {/* Real-Time Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-xl shadow text-center">
            <h4 className="text-sm font-medium text-purple-600 dark:text-purple-400 mb-1">
              Heart Rate
            </h4>
            <p className="text-2xl font-bold">
              {data.heartRate !== undefined ? `${data.heartRate} bpm` : "..."}
            </p>
          </div>
          <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-xl shadow text-center">
            <h4 className="text-sm font-medium text-purple-600 dark:text-purple-400 mb-1">
              Steps
            </h4>
            <p className="text-2xl font-bold">
              {data.steps !== undefined ? data.steps : "..."}
            </p>
          </div>
          <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-xl shadow text-center">
            <h4 className="text-sm font-medium text-purple-600 dark:text-purple-400 mb-1">
              Sleep
            </h4>
            <p className="text-2xl font-bold">
              {data.sleep !== undefined ? data.sleep : "..."}
            </p>
          </div>
        </div>
        {/* Quick Actions with SVG Icons */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 mt-8">
          <button className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 2a10 10 0 100 20 10 10 0 000-20z"
              />
            </svg>
          </button>
          {/* Add more SVG buttons as needed */}
        </div>
      </div>
    </section>
  );
}
