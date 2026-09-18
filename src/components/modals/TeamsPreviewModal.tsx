import React, { useState } from 'react';
import { X, Copy, Check, ExternalLink, Share2 } from 'lucide-react';

interface TeamsPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  dashboardTitle?: string;
}

export const TeamsPreviewModal: React.FC<TeamsPreviewModalProps> = ({
  isOpen,
  onClose,
  dashboardTitle = 'Video Game Sales Dashboard',
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const teamsFormattedText = `**Executive Briefing: ${dashboardTitle}**
*Generated from Akashic Superset BI • ${new Date().toLocaleDateString()}*

**Key Takeaways:**
• **Total Revenue**: $8,920.4M across 16,598 catalog titles (+14.2% YoY).
• **Market Concentration**: Nintendo holds 72% of top 25 bestselling releases (18 of 25 titles).
• **Top Segments**: Action ($1,751.2M) and Sports ($1,330.9M) drive 34.7% of all genre sales ($3.08B combined).
• **Regional Breakdown**: North America leads with 49.2% ($4,392.9M), followed by Europe at 27.3% ($2,434.1M).

⚠️ **Risk Watch-Out**:
• 49.2% single-market exposure to North America creates geographic vulnerability.
• Top 3 publishers generate 76.5% of sales; long-tail titles show revenue fragmentation.

🔗 [Open Live Dashboard](http://localhost:5173/)`;

  const handleCopy = () => {
    navigator.clipboard.writeText(teamsFormattedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className="fixed inset-0 bg-zinc-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 select-none animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-zinc-200 w-full max-w-lg overflow-hidden text-xs">
        
        {/* Teams Branded Header */}
        <div className="px-5 py-3.5 bg-[#464eb8] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded bg-white text-[#464eb8] font-black flex items-center justify-center text-xs shadow-xs">
              T
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Microsoft Teams · Channel Post Preview</h3>
              <p className="text-[11px] text-white/80">Executive card formatted for Teams channels & 1:1 chats</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-white/80 hover:text-white rounded-md transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body: Realistic Teams Mockup */}
        <div className="p-5 space-y-4 bg-[#f5f5f5]">
          <div className="bg-white rounded-xl border border-zinc-200 shadow-xs p-4 space-y-3">
            {/* Poster Info */}
            <div className="flex items-center justify-between border-b border-zinc-100 pb-2.5">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-purple-700 text-white flex items-center justify-center font-bold text-[11px]">
                  VC
                </div>
                <div>
                  <div className="font-bold text-zinc-900 text-xs flex items-center gap-1.5">
                    <span>Veman C</span>
                    <span className="text-[10px] font-normal text-zinc-400">• Lead Analyst</span>
                  </div>
                  <span className="text-[10px] text-zinc-400">Today at 10:15 AM</span>
                </div>
              </div>
              <span className="text-[10px] font-semibold text-[#464eb8] bg-[#464eb8]/10 px-2 py-0.5 rounded">
                Executive Update
              </span>
            </div>

            {/* Teams Card Content */}
            <div className="space-y-2.5 text-zinc-800 leading-relaxed">
              <div className="font-bold text-sm text-zinc-900 flex items-center gap-1.5">
                <span>📊</span>
                <span>Executive Briefing: {dashboardTitle}</span>
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex items-start gap-1.5">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span><strong>Total Revenue</strong>: $8,920.4M across 16,598 catalog titles (+14.2% YoY).</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span><strong>Market Leaders</strong>: Nintendo controls 72% of top 25 bestselling games.</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span><strong>Top Segments</strong>: Action & Sports drive 34.7% of volume ($3.08B).</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span><strong>Regional Share</strong>: North America 49.2% ($4.39B), Europe 27.3% ($2.43B).</span>
                </div>
              </div>

              {/* Warning box */}
              <div className="p-2.5 rounded-lg bg-amber-50/80 border border-amber-200 text-amber-900 text-[11px] flex items-start gap-1.5">
                <span className="font-bold">⚠️</span>
                <div>
                  <span className="font-semibold">Watch-out</span>: 49.2% single-market exposure to North America creates geographic vulnerability. Top 3 publishers drive 76.5% of sales.
                </div>
              </div>

              {/* Action Link */}
              <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-[11px]">
                <span className="text-zinc-500 font-mono text-[10px]">9 charts verified • Akashic Superset</span>
                <span className="text-[#464eb8] font-semibold flex items-center gap-1 hover:underline cursor-pointer">
                  <span>Open Live Dashboard</span>
                  <ExternalLink className="w-3 h-3" />
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3 border-t border-zinc-200 bg-white flex items-center justify-between">
          <span className="text-[11px] text-zinc-500">
            Formatted with markdown bolding and bullet lists
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-50 font-medium transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleCopy}
              className="px-4 py-1.5 rounded-lg bg-[#464eb8] hover:bg-[#3b429f] text-white font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-white" />
                  <span>Copy for Teams</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
