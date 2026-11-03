import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Play, 
  Trash2, 
  Pause, 
  Folder, 
  HardDrive, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  RefreshCw,
  FolderOpen
} from 'lucide-react';
import { DownloadItem, MediaItem } from '../types/media';

interface DownloadsManagerModalProps {
  downloads: DownloadItem[];
  onClose: () => void;
  onPlayOffline: (download: DownloadItem) => void;
  onDeleteDownload: (id: string) => void;
  onTogglePauseDownload: (id: string) => void;
  onClearCompleted: () => void;
}

export const DownloadsManagerModal: React.FC<DownloadsManagerModalProps> = ({
  downloads,
  onClose,
  onPlayOffline,
  onDeleteDownload,
  onTogglePauseDownload,
  onClearCompleted
}) => {
  const [filterTab, setFilterTab] = useState<'all' | 'downloading' | 'completed'>('all');
  const [diskNotice, setDiskNotice] = useState<string | null>(null);

  const completedCount = downloads.filter((d) => d.status === 'completed').length;
  const activeCount = downloads.filter((d) => d.status === 'downloading').length;

  const filteredDownloads = downloads.filter((d) => {
    if (filterTab === 'downloading') return d.status === 'downloading' || d.status === 'paused';
    if (filterTab === 'completed') return d.status === 'completed';
    return true;
  });

  const handleOpenFolder = (title: string) => {
    setDiskNotice(`Simulated local folder: C:\\Users\\Media\\Videos\\CineScope\\${title}`);
    setTimeout(() => setDiskNotice(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xl select-none">
      <div 
        className="relative w-full max-w-3xl bg-[#0E111A] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#121522]">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <span>PC Download Manager</span>
                <span className="text-[10px] bg-cyan-950/80 text-cyan-300 font-mono px-2 py-0.5 rounded-full border border-cyan-800">
                  OFFLINE VAULT
                </span>
              </h3>
              <p className="text-xs text-zinc-400">
                Downloaded movies and episodes ready for zero-latency offline playback.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Local SSD Storage Bar */}
        <div className="px-5 py-3 bg-white/[0.02] border-b border-white/5 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2 text-zinc-400">
            <HardDrive className="w-4 h-4 text-cyan-400" />
            <span>NVMe SSD Storage:</span>
            <strong className="text-white font-mono">34.8 GB used / 512 GB</strong>
          </div>
          {completedCount > 0 && (
            <button
              onClick={onClearCompleted}
              className="text-zinc-500 hover:text-red-400 text-xs flex items-center space-x-1 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Completed</span>
            </button>
          )}
        </div>

        {/* Subtabs Filter */}
        <div className="px-5 pt-3 pb-2 flex items-center space-x-2">
          <button
            onClick={() => setFilterTab('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              filterTab === 'all' ? 'bg-cyan-500 text-black font-bold' : 'bg-white/5 text-zinc-400 hover:text-white'
            }`}
          >
            All Items ({downloads.length})
          </button>
          <button
            onClick={() => setFilterTab('downloading')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors flex items-center space-x-1.5 ${
              filterTab === 'downloading' ? 'bg-cyan-500 text-black font-bold' : 'bg-white/5 text-zinc-400 hover:text-white'
            }`}
          >
            <span>In Progress</span>
            {activeCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            )}
          </button>
          <button
            onClick={() => setFilterTab('completed')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              filterTab === 'completed' ? 'bg-cyan-500 text-black font-bold' : 'bg-white/5 text-zinc-400 hover:text-white'
            }`}
          >
            Completed ({completedCount})
          </button>
        </div>

        {/* Disk Notice Banner */}
        {diskNotice && (
          <div className="mx-5 my-2 p-2.5 rounded-xl bg-cyan-950/70 border border-cyan-500/30 text-cyan-200 text-xs font-mono flex items-center space-x-2">
            <FolderOpen className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="truncate">{diskNotice}</span>
          </div>
        )}

        {/* Download Items List */}
        <div className="p-5 overflow-y-auto space-y-3 flex-1 no-scrollbar">
          {filteredDownloads.length === 0 ? (
            <div className="py-12 text-center text-zinc-500">
              <Download className="w-10 h-10 mx-auto mb-2 opacity-30 text-cyan-400" />
              <p className="text-sm font-medium text-zinc-400">No downloads in this view.</p>
              <p className="text-xs text-zinc-600 mt-1">Open any movie or series and click "Download to PC" to store for offline viewing.</p>
            </div>
          ) : (
            filteredDownloads.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-cyan-500/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                {/* Thumbnail & Title */}
                <div className="flex items-center space-x-3.5">
                  <div className="w-14 h-18 rounded-xl overflow-hidden bg-zinc-800 shrink-0 border border-white/10">
                    <img src={item.poster} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white line-clamp-1">{item.title}</h4>
                    <div className="flex items-center space-x-2 text-[11px] text-zinc-400 mt-0.5">
                      <span className="px-1.5 py-0.2 rounded bg-cyan-950/80 text-cyan-300 font-mono text-[10px] border border-cyan-800">
                        {item.quality}
                      </span>
                      <span>{item.fileSize}</span>
                      <span>•</span>
                      <span>{item.downloadedAt}</span>
                    </div>

                    {/* Progress Bar for Active Download */}
                    {item.status !== 'completed' && (
                      <div className="mt-2 w-48 sm:w-64">
                        <div className="flex justify-between text-[10px] text-zinc-400 mb-1 font-mono">
                          <span>{item.progress}%</span>
                          <span className="text-cyan-400">{item.status === 'paused' ? 'Paused' : item.speed}</span>
                        </div>
                        <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 ${
                              item.status === 'paused' ? 'bg-amber-400' : 'bg-cyan-400'
                            }`}
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-2 self-end sm:self-center">
                  {item.status === 'completed' ? (
                    <>
                      <button
                        onClick={() => onPlayOffline(item)}
                        className="px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-cyan-500/20"
                      >
                        <Play className="w-3.5 h-3.5 fill-black" />
                        <span>Play Offline</span>
                      </button>

                      <button
                        onClick={() => handleOpenFolder(item.title)}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 transition-colors"
                        title="Open File Location on PC"
                      >
                        <Folder className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => onTogglePauseDownload(item.id)}
                      className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center space-x-1"
                    >
                      {item.status === 'paused' ? <Play className="w-3.5 h-3.5 fill-white" /> : <Pause className="w-3.5 h-3.5" />}
                      <span>{item.status === 'paused' ? 'Resume' : 'Pause'}</span>
                    </button>
                  )}

                  <button
                    onClick={() => onDeleteDownload(item.id)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 transition-colors"
                    title="Delete File from Disk"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
