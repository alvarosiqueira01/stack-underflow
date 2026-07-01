"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import { RightPanel } from "@/components/layout/right-panel";
import { UserDashboard } from "@/components/home/user-dashboard";
import { SuggestedPostsList } from "@/components/home/suggested-posts-list";
import { dashboardService, DashboardStats } from "@/features/home/api/dashboard.service";

export default function Home() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Busca os dados assim que o componente for montado
    dashboardService.getStats()
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 px-8 py-6">
          <div className="flex justify-between mb-8">
            <h1 className="text-3xl font-semibold">Home Dashboard</h1>
          </div>

          {loading ? (
            <div className="animate-pulse h-32 bg-zinc-200 rounded mb-8"></div>
          ) : stats ? (
            <UserDashboard stats={stats} />
          ) : null}

          <div className="mt-8">
            <h2 className="text-xl mb-4">Top Questions for you</h2>
            <SuggestedPostsList />
          </div>
        </main>

        <RightPanel />
      </div>
    </div>
  );
}