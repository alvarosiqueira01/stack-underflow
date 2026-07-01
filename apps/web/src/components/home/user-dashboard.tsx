import { Settings } from "lucide-react";
import { DashboardStats } from "@/features/home/api/dashboard.service";
import { WatchedTagsCard } from "./watched-tags-card";

interface UserDashboardProps {
  stats: DashboardStats;
}

export function UserDashboard({ stats }: UserDashboardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Quadro de Reputação */}
      <div className="border rounded-md p-6 flex flex-col justify-center shadow-sm">
        <span className="text-sm text-zinc-500 font-medium uppercase tracking-wide">Reputation</span>
        <div className="flex items-end gap-2 mt-2">
          <span className="text-4xl font-bold text-zinc-800">{stats.reputation.toLocaleString()}</span>
          <span className="text-sm text-green-600 font-medium mb-1">
            +{stats.reputationThisMonth} this month
          </span>
        </div>
      </div>

      {/* Quadro de Badges */}
      <div className="border rounded-md p-6 flex flex-col justify-center shadow-sm">
        <span className="text-sm text-zinc-500 font-medium uppercase tracking-wide">Badges</span>
        <div className="flex gap-4 mt-3">
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
            <span className="font-semibold text-zinc-700">{stats.badges.gold}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-zinc-300"></span>
            <span className="font-semibold text-zinc-700">{stats.badges.silver}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-amber-600"></span>
            <span className="font-semibold text-zinc-700">{stats.badges.bronze}</span>
          </div>
        </div>
      </div>

      {/* Quadro de Tags Acompanhadas */}
      <WatchedTagsCard />
    </div>
  );
}