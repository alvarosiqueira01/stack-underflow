import { useState, useEffect } from "react";
import { Settings, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { dashboardService } from "@/features/home/api/dashboard.service";

export function WatchedTagsCard() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [watchedTags, setWatchedTags] = useState<string[]>([]);

  useEffect(() => {
    dashboardService.getTagPreferences().then(data => setWatchedTags(data.watchedTags));
  }, []);

  return (
    <>
      <div className="border rounded-md p-6 flex flex-col relative shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-zinc-500 font-medium uppercase tracking-wide">Watched Tags</span>
          <button onClick={() => setModalOpen(true)} className="text-zinc-400 hover:text-zinc-700">
            <Settings size={18} />
          </button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {watchedTags.length > 0 ? (
            watchedTags.map(tag => (
              <Badge key={tag} label={tag}/>
            ))
          ) : (
            <span className="text-sm text-zinc-400">You are not watching any tags yet.</span>
          )}
        </div>
      </div>

      {isModalOpen && (
        <TagsSettingsModal 
          watchedTags={watchedTags} 
          onClose={() => setModalOpen(false)} 
        />
      )}
    </>
  );
}

// Subcomponente do Modal (Idealmente em arquivo separado)
function TagsSettingsModal({ watchedTags, onClose }: { watchedTags: string[], onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<'watched' | 'ignored'>('watched');

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-800">
          <X size={20} />
        </button>
        
        <h2 className="text-xl font-semibold mb-4">Tag Preferences</h2>
        
        <div className="flex border-b mb-4">
          <button 
            className={`pb-2 px-4 ${activeTab === 'watched' ? 'border-b-2 border-orange-500 font-medium' : 'text-zinc-500'}`}
            onClick={() => setActiveTab('watched')}
          >
            Watched Tags
          </button>
          <button 
            className={`pb-2 px-4 ${activeTab === 'ignored' ? 'border-b-2 border-orange-500 font-medium' : 'text-zinc-500'}`}
            onClick={() => setActiveTab('ignored')}
          >
            Ignored Tags
          </button>
        </div>

        <div>
          <input 
            type="text" 
            placeholder={`Search tags to ${activeTab === 'watched' ? 'watch' : 'ignore'}...`} 
            className="w-full border rounded p-2 text-sm focus:outline-blue-500 mb-4"
          />
          {/* Lógica de renderização de lista seria inserida aqui */}
          <p className="text-sm text-zinc-500">
            {activeTab === 'watched' ? 'Watching tags helps personalize your feed.' : 'Ignored tags are hidden from your view.'}
          </p>
        </div>
      </div>
    </div>
  );
}