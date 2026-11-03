import React, { useState } from 'react';
import { 
  X, 
  Settings, 
  Key, 
  Globe, 
  Volume2, 
  Tv, 
  Check, 
  Trash2, 
  Sparkles, 
  Monitor, 
  Cpu,
  Subtitles,
  ExternalLink
} from 'lucide-react';
import { UserPreferences } from '../types/media';

interface SettingsModalProps {
  prefs: UserPreferences;
  onSavePrefs: (newPrefs: UserPreferences) => void;
  onClearHistory: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  prefs,
  onSavePrefs,
  onClearHistory,
  onClose
}) => {
  const [apiKey, setApiKey] = useState(prefs.tmdbApiKey);
  const [region, setRegion] = useState(prefs.region);
  const [language, setLanguage] = useState(prefs.language);
  const [preferredQuality, setPreferredQuality] = useState(prefs.preferredQuality);
  const [audioMode, setAudioMode] = useState(prefs.audioMode);
  const [hardwareAcceleration, setHardwareAcceleration] = useState(prefs.hardwareAcceleration);
  const [subtitleColor, setSubtitleColor] = useState(prefs.subtitleColor);
  const [testStatus, setTestStatus] = useState<string | null>(null);

  const handleTestKey = async () => {
    if (!apiKey.trim()) {
      setTestStatus('Using built-in high speed curated library.');
      return;
    }
    setTestStatus('Validating key with TMDB API...');
    try {
      const url = `https://api.themoviedb.org/3/configuration?api_key=${apiKey.trim()}`;
      const res = await fetch(url);
      if (res.ok) {
        setTestStatus('✓ TMDB API connection verified successfully!');
      } else {
        setTestStatus('✕ API Key was rejected by TMDB (Check your token).');
      }
    } catch {
      setTestStatus('✓ Key saved locally (Offline/Proxy mode ready).');
    }
  };

  const handleSave = () => {
    onSavePrefs({
      ...prefs,
      tmdbApiKey: apiKey.trim(),
      region,
      language,
      preferredQuality,
      audioMode,
      hardwareAcceleration,
      subtitleColor
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xl select-none">
      <div 
        className="relative w-full max-w-xl bg-[#0E111A] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#121522]">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">CineScope PC Preferences</h3>
              <p className="text-xs text-zinc-400">Customize streaming engine, API keys, audio and region</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1 text-xs no-scrollbar">
          {/* TMDB API Key Section */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-white flex items-center space-x-2">
                <Key className="w-3.5 h-3.5 text-cyan-400" />
                <span>TMDB API Key or Read Access Token</span>
              </label>
              <a
                href="https://www.themoviedb.org/settings/api"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-cyan-400 hover:underline flex items-center space-x-1"
              >
                <span>Get Free Key</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Paste key here (Optional - Curated library active by default)"
                className="flex-1 bg-[#141724] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-400 font-mono text-xs"
              />
              <button
                type="button"
                onClick={handleTestKey}
                className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold"
              >
                Test
              </button>
            </div>
            {testStatus && (
              <p className={`text-[11px] font-mono ${testStatus.startsWith('✓') ? 'text-emerald-400' : 'text-zinc-400'}`}>
                {testStatus}
              </p>
            )}
            <p className="text-[11px] text-zinc-500">
              Note: If left empty, CineScope PC seamlessly runs with our full built-in 4K catalog & streams.
            </p>
          </div>

          {/* Region & Language */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-zinc-300 font-semibold flex items-center space-x-1.5">
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                <span>Streaming Region</span>
              </label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full bg-[#141724] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-400"
              >
                <option value="IN">India (IN) - Hotstar, Jio, Zee5, Prime</option>
                <option value="US">United States (US) - Netflix, Max, Hulu</option>
                <option value="GB">United Kingdom (GB) - BBC iPlayer, Sky</option>
                <option value="CA">Canada (CA)</option>
                <option value="AU">Australia (AU)</option>
                <option value="JP">Japan (JP) - Anime Hub</option>
                <option value="DE">Germany (DE)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-300 font-semibold flex items-center space-x-1.5">
                <Subtitles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Content Language</span>
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-[#141724] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-400"
              >
                <option value="en-US">English (en-US)</option>
                <option value="hi-IN">Hindi - हिन्दी (hi-IN)</option>
                <option value="ja-JP">Japanese - 日本語 (ja-JP)</option>
                <option value="es-ES">Spanish (es-ES)</option>
                <option value="fr-FR">French (fr-FR)</option>
              </select>
            </div>
          </div>

          {/* Quality & Audio Engine */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-zinc-300 font-semibold flex items-center space-x-1.5">
                <Tv className="w-3.5 h-3.5 text-cyan-400" />
                <span>Preferred Resolution</span>
              </label>
              <select
                value={preferredQuality}
                onChange={(e) => setPreferredQuality(e.target.value as any)}
                className="w-full bg-[#141724] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-400"
              >
                <option value="Auto">Auto (Smart Dynamic Bitrate)</option>
                <option value="4K UHD">4K Ultra HD (HEVC / HDR10)</option>
                <option value="1080p">1080p Full HD</option>
                <option value="720p">720p High Definition</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-300 font-semibold flex items-center space-x-1.5">
                <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Audio Engine</span>
              </label>
              <select
                value={audioMode}
                onChange={(e) => setAudioMode(e.target.value as any)}
                className="w-full bg-[#141724] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-400"
              >
                <option value="Dolby Atmos Emulation">Dolby Atmos Spatializer</option>
                <option value="5.1 Surround">5.1 Cinema Surround</option>
                <option value="Stereo">Direct High-Res Stereo</option>
              </select>
            </div>
          </div>

          {/* Hardware Acceleration & Subtitles */}
          <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <div>
                <span className="text-zinc-200 font-semibold">Hardware GPU Acceleration</span>
                <p className="text-[11px] text-zinc-500">Accelerate 4K 60FPS video decode via dedicated GPU</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setHardwareAcceleration(!hardwareAcceleration)}
              className={`w-11 h-6 rounded-full transition-colors relative ${hardwareAcceleration ? 'bg-cyan-500' : 'bg-white/10'}`}
            >
              <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${hardwareAcceleration ? 'left-6' : 'left-1'}`} />
            </button>
          </div>

          {/* Subtitle Color */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.02] border border-white/5">
            <div className="flex items-center space-x-3">
              <Subtitles className="w-4 h-4 text-amber-400" />
              <div>
                <span className="text-zinc-200 font-semibold">Subtitle Color Accent</span>
                <p className="text-[11px] text-zinc-500">Enhanced contrast for cinematic view</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setSubtitleColor('yellow')}
                className={`px-3 py-1 rounded-lg font-bold ${subtitleColor === 'yellow' ? 'bg-yellow-400 text-black' : 'bg-white/10 text-yellow-300'}`}
              >
                Cinema Yellow
              </button>
              <button
                type="button"
                onClick={() => setSubtitleColor('white')}
                className={`px-3 py-1 rounded-lg font-bold ${subtitleColor === 'white' ? 'bg-white text-black' : 'bg-white/10 text-white'}`}
              >
                White
              </button>
            </div>
          </div>

          {/* Storage & History Reset */}
          <div className="flex items-center justify-between pt-2 border-t border-white/5">
            <button
              type="button"
              onClick={() => {
                onClearHistory();
                alert('Watch history cleared.');
              }}
              className="text-red-400 hover:text-red-300 flex items-center space-x-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Watch History</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-[#121522] flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-zinc-400 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold flex items-center space-x-1.5 shadow-lg shadow-cyan-500/20"
          >
            <Check className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </div>
    </div>
  );
};
