"use client";

import { useState, useEffect } from "react";
import { ChevronDown, Eye, EyeOff, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUpdateTagPreference } from "@/features/tags/hooks/use-tag";
import { httpClient } from "@/lib/api/http-client";

interface WatchDropdownProps {
  tagId: string;
}

export function WatchDropdown({ tagId }: WatchDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<"watching" | "ignored" | "none">("none");
  const mutation = useUpdateTagPreference(tagId);

  // Procura o estado inicial nas preferências do utilizador logado
  useEffect(() => {
    httpClient.get("/api/tags/preferences").then(({ data }) => {
      if (data.watchedTags.includes(tagId)) setCurrentStatus("watching");
      else if (data.ignoredTags.includes(tagId)) setCurrentStatus("ignored");
      else setCurrentStatus("none");
    });
  }, [tagId]);

  const handleStatusChange = (status: "watching" | "ignored" | "none") => {
    setCurrentStatus(status);
    mutation.mutate(status);
    setIsOpen(false);
  };

  const buttonLabel = {
    watching: "Watching",
    ignored: "Ignored",
    none: "Watch tag"
  }[currentStatus];

  const buttonVariant = currentStatus === "none" ? "outline" : "default";
  const buttonColor = currentStatus === "ignored" ? "bg-red-600 hover:bg-red-700" : currentStatus === "watching" ? "bg-green-600 hover:bg-green-700" : "";

  return (
    <div className="relative inline-block text-left">
      <div className="flex rounded-md shadow-sm">
        <Button 
          variant={buttonVariant} 
          className={`${buttonColor} rounded-r-none border-r-0`}
          onClick={() => handleStatusChange(currentStatus === "watching" ? "none" : "watching")}
        >
          {currentStatus === "watching" && <Bell size={16} className="mr-2" />}
          {currentStatus === "ignored" && <EyeOff size={16} className="mr-2" />}
          {currentStatus === "none" && <Eye size={16} className="mr-2" />}
          {buttonLabel}
        </Button>
        <Button
          variant={buttonVariant}
          className={`${buttonColor} px-2 rounded-l-none border-l border-zinc-300/20`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <ChevronDown size={16} />
        </Button>
      </div>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10 border border-zinc-200">
          <div className="py-1" role="menu">
            <button
              onClick={() => handleStatusChange("watching")}
              className="flex items-center w-full px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-100"
            >
              <Bell size={14} className="mr-2 text-green-600" /> Watch (Get alerts)
            </button>
            <button
              onClick={() => handleStatusChange("ignored")}
              className="flex items-center w-full px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-100"
            >
              <EyeOff size={14} className="mr-2 text-red-600" /> Ignore (Hide posts)
            </button>
            <button
              onClick={() => handleStatusChange("none")}
              className="flex items-center w-full px-4 py-2 text-sm text-zinc-500 hover:bg-zinc-100 border-t border-zinc-100"
            >
              Unwatch / Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}