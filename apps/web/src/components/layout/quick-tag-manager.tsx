"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { httpClient } from "@/lib/api/http-client";

export function QuickTagManager() {
  const [preferences, setPreferences] = useState<{ watchedTags: string[]; ignoredTags: string[] }>({
    watchedTags: [],
    ignoredTags: [],
  });

  useEffect(() => {
    httpClient.get("/api/tags/preferences").then(({ data }) => setPreferences(data));
  }, []);

  return (
    <div className="border border-zinc-200 rounded-md p-4 bg-yellow-50/30 shadow-sm mb-4">
      {/* Secção Watched */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xs font-semibold text-zinc-700 uppercase tracking-wider flex items-center gap-1">
            Watched Tags
          </h3>
          <Link href="/" className="text-zinc-400 hover:text-zinc-600">
            <Settings size={14} />
          </Link>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {preferences.watchedTags.length > 0 ? (
            preferences.watchedTags.map((tag) => (
              <Link key={tag} href={`/tags/${tag}`}>
                <Badge label={tag}/>
              </Link>
            ))
          ) : (
            <span className="text-xs text-zinc-400">No watched tags.</span>
          )}
        </div>
      </div>

      {/* Secção Ignored */}
      <div>
        <h3 className="text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-2">
          Ignored Tags
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {preferences.ignoredTags.length > 0 ? (
            preferences.ignoredTags.map((tag) => (
              <Link key={tag} href={`/tags/${tag}`}>
                <Badge label={tag}/>
              </Link>
            ))
          ) : (
            <span className="text-xs text-zinc-400">No ignored tags.</span>
          )}
        </div>
      </div>
    </div>
  );
}