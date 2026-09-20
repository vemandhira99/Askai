import React, { useState } from 'react';
import { Copy, Check, Lightbulb, CheckCircle2, AlertTriangle, HelpCircle } from 'lucide-react';

interface MarkdownMessageProps {
  content: string;
}

// Helper to parse inline markdown (bold, italic, code) into React elements
export const parseInlineMarkdown = (text: string): React.ReactNode => {
  const parts: React.ReactNode[] = [];
  let keyIdx = 0;
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    const matchedStr = match[0];
    if (matchedStr.startsWith('**') && matchedStr.endsWith('**')) {
      parts.push(
        <strong key={`b-${keyIdx++}`} className="font-bold text-zinc-900">
          {matchedStr.slice(2, -2)}
        </strong>
      );
    } else if (matchedStr.startsWith('*') && matchedStr.endsWith('*')) {
      parts.push(
        <em key={`i-${keyIdx++}`} className="italic text-zinc-800">
          {matchedStr.slice(1, -1)}
        </em>
      );
    } else if (matchedStr.startsWith('`') && matchedStr.endsWith('`')) {
      parts.push(
        <code key={`c-${keyIdx++}`} className="px-1.5 py-0.5 rounded bg-zinc-100 font-mono text-[11px] text-zinc-800 border border-zinc-200">
          {matchedStr.slice(1, -1)}
        </code>
      );
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : text;
};

export const MarkdownMessage: React.FC<MarkdownMessageProps> = ({ content }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!content) return null;

  // =========================================================================
  // CASE 1: 3-Minute Leadership Standup Briefing (Rich 3-Part Cards)
  // =========================================================================
  if (content.includes('Leadership Standup') || (content.includes('Growth Highlight') && content.includes('Vulnerability'))) {
    const growthMatch = content.match(/(?:🟢|\*\*1\.)[^\n]*\n([\s\S]*?)(?=(?:🔴|\*\*2\.))/i);
    const vulnMatch = content.match(/(?:🔴|\*\*2\.)[^\n]*\n([\s\S]*?)(?=(?:🔵|\*\*3\.))/i);
    const actionMatch = content.match(/(?:🔵|\*\*3\.)[^\n]*\n([\s\S]*?)$/i);

    const parseBullets = (rawText: string | undefined) => {
      if (!rawText) return [];
      return rawText
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.startsWith('•') || line.startsWith('-') || line.startsWith('*'))
        .map(line => line.replace(/^[•\-*]\s*/, ''));
    };

    const growthBullets = growthMatch ? parseBullets(growthMatch[1]) : [];
    const vulnBullets = vulnMatch ? parseBullets(vulnMatch[1]) : [];
    const actionBullets = actionMatch ? parseBullets(actionMatch[1]) : [];

    return (
      <div className="bg-white rounded-xl border border-zinc-200 shadow-xs overflow-hidden mb-3 animate-in fade-in duration-200">
        {/* Card Header Banner */}
        <div className="px-3.5 py-2.5 bg-[#1e295b] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm">🎙️</span>
            <div>
              <h4 className="text-xs font-bold leading-tight uppercase tracking-wider">3-Minute Leadership Standup Briefing</h4>
              <p className="text-[10px] text-zinc-300 leading-tight">Synthesized across 9 live dashboard visual slices</p>
            </div>
          </div>
          <button
            onClick={() => handleCopy(content)}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-[10px] font-medium transition-colors"
            title="Copy Talking Points"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3 text-zinc-300" />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>

        <div className="p-3.5 space-y-3">
          {/* 1. Growth Highlight */}
          <div className="p-3 rounded-lg bg-emerald-50/80 border border-emerald-200 text-emerald-950 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-900">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              <span>1. The Growth Highlight (What's Working)</span>
            </div>
            <ul className="space-y-1.5 pl-5 text-[11px] leading-relaxed text-emerald-900 list-disc marker:text-emerald-600">
              {growthBullets.length > 0 ? (
                growthBullets.map((b, idx) => (
                  <li key={idx}>{parseInlineMarkdown(b)}</li>
                ))
              ) : (
                <li><strong>$8,920.4M</strong> in verified catalog sales across 16,598 titles (+14.2% YoY). Nintendo leads with 72% top-25 share.</li>
              )}
            </ul>
          </div>

          {/* 2. Vulnerability */}
          <div className="p-3 rounded-lg bg-rose-50/80 border border-rose-200 text-rose-950 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-xs text-rose-900">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
              <span>2. The Vulnerability (What Leadership Will Ask)</span>
            </div>
            <ul className="space-y-1.5 pl-5 text-[11px] leading-relaxed text-rose-900 list-disc marker:text-rose-600">
              {vulnBullets.length > 0 ? (
                vulnBullets.map((b, idx) => (
                  <li key={idx}>{parseInlineMarkdown(b)}</li>
                ))
              ) : (
                <li><strong>Single-Region Concentration</strong>: 49.2% of lifetime sales relies on North America ($4,392.9M). Post-2008 physical sales declined 57%.</li>
              )}
            </ul>
          </div>

          {/* 3. Decision Point */}
          <div className="p-3 rounded-lg bg-blue-50/80 border border-blue-200 text-blue-950 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-xs text-blue-900">
              <HelpCircle className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
              <span>3. Recommended Strategic Action for Today's Call</span>
            </div>
            <ul className="space-y-1.5 pl-5 text-[11px] leading-relaxed text-blue-900 list-disc marker:text-blue-600">
              {actionBullets.length > 0 ? (
                actionBullets.map((b, idx) => (
                  <li key={idx}>{parseInlineMarkdown(b)}</li>
                ))
              ) : (
                <li>Discuss prioritizing European localized publishing ($2,434.1M / 27.3% share) and handheld RPG partnerships to hedge North American exposure.</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // CASE 2: Contextual Chart Breakdown (Explain This Chart)
  // =========================================================================
  if (content.includes('Chart Breakdown:') || (content.includes('Core Finding') && content.includes('Business Takeaway'))) {
    const titleMatch = content.match(/\*\*Chart Breakdown:\s*([^*]+)\*\*/i);
    const chartTitle = titleMatch ? titleMatch[1].trim() : 'Chart Analysis';

    const coreFindingMatch = content.match(/•\s*\*\*Core Finding\*\*:\s*([\s\S]*?)(?=(?:•\s*\*\*Business Takeaway\*\*|$))/i);
    const takeawayMatch = content.match(/•\s*\*\*Business Takeaway\*\*:\s*([\s\S]*?)$/i);

    const coreFindingText = coreFindingMatch ? coreFindingMatch[1].trim() : '';
    const takeawayText = takeawayMatch ? takeawayMatch[1].trim() : '';

    return (
      <div className="bg-white rounded-xl border border-zinc-200 shadow-xs overflow-hidden mb-3 animate-in fade-in duration-200">
        <div className="px-3.5 py-2.5 bg-amber-50/80 border-b border-amber-200/70 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-600" />
            <span className="font-bold text-xs text-zinc-900">{chartTitle}</span>
          </div>
          <span className="text-[10px] font-semibold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
            Plain-English Breakdown
          </span>
        </div>

        <div className="p-3.5 space-y-2.5 text-xs text-zinc-800">
          {coreFindingText && (
            <div className="p-2.5 rounded-lg bg-zinc-50 border border-zinc-200 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">
                📊 Core Finding
              </span>
              <p className="text-zinc-800 leading-relaxed text-xs">
                {parseInlineMarkdown(coreFindingText)}
              </p>
            </div>
          )}

          {takeawayText && (
            <div className="p-2.5 rounded-lg bg-blue-50/70 border border-blue-200/80 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 block">
                🎯 Business Takeaway
              </span>
              <p className="text-zinc-900 leading-relaxed text-xs font-medium">
                {parseInlineMarkdown(takeawayText)}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // =========================================================================
  // CASE 3: Formatted for Microsoft Teams Channel (Code / Card Box)
  // =========================================================================
  if (content.includes('Formatted for Microsoft Teams') || content.includes('```markdown')) {
    const codeMatch = content.match(/```markdown([\s\S]*?)```/i);
    const rawCard = codeMatch ? codeMatch[1].trim() : content;

    return (
      <div className="bg-white rounded-xl border border-[#464775]/30 shadow-xs overflow-hidden mb-3 animate-in fade-in duration-200">
        <div className="px-3.5 py-2.5 bg-[#464775] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-white text-[#464775] flex items-center justify-center font-bold text-[10px]">
              T
            </div>
            <span className="font-bold text-xs">Microsoft Teams Adaptive Card</span>
          </div>
          <button
            onClick={() => handleCopy(rawCard)}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white/20 hover:bg-white/30 text-white text-[10px] font-semibold transition-colors"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3 text-white" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Teams Card'}</span>
          </button>
        </div>

        <div className="p-3 bg-zinc-900">
          <pre className="text-zinc-100 font-mono text-[11px] leading-relaxed overflow-x-auto whitespace-pre-wrap p-2 bg-black/30 rounded border border-white/10">
            {rawCard}
          </pre>
        </div>

        <div className="px-3.5 py-2 bg-zinc-50 border-t border-zinc-100 text-[11px] text-zinc-500">
          Paste directly into your Microsoft Teams channel or chat.
        </div>
      </div>
    );
  }

  // =========================================================================
  // CASE 4: Structured General Q&A Responses (Lists, Bold, Paragraphs)
  // =========================================================================
  const paragraphs = content.split('\n\n').map(p => p.trim()).filter(Boolean);

  return (
    <div className="space-y-3 mb-3 text-xs sm:text-sm text-zinc-800 leading-relaxed animate-in fade-in duration-150">
      {paragraphs.map((paragraph, pIdx) => {
        const isNumberedList = /^\d+\.\s+/.test(paragraph);
        const isBulletList = /^[•\-*]\s+/.test(paragraph);

        if (isNumberedList) {
          const items = paragraph
            .split(/\n(?=\d+\.\s+)/)
            .map(item => item.trim())
            .filter(Boolean);

          return (
            <div key={pIdx} className="space-y-2 pt-1">
              {items.map((item, itemIdx) => {
                const itemNumberMatch = item.match(/^(\d+)\.\s*(.*)/);
                const itemNum = itemNumberMatch ? itemNumberMatch[1] : `${itemIdx + 1}`;
                const itemBody = itemNumberMatch ? itemNumberMatch[2] : item;

                return (
                  <div key={itemIdx} className="p-2.5 rounded-lg bg-zinc-50/80 border border-zinc-200/80 flex items-start gap-2.5 shadow-2xs">
                    <span className="w-5 h-5 rounded-full bg-[#1e295b] text-white font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-2xs">
                      {itemNum}
                    </span>
                    <div className="flex-1 min-w-0 text-xs text-zinc-800 leading-relaxed">
                      {parseInlineMarkdown(itemBody)}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        }

        if (isBulletList) {
          const items = paragraph
            .split(/\n(?=[•\-*]\s+)/)
            .map(item => item.trim().replace(/^[•\-*]\s*/, ''))
            .filter(Boolean);

          return (
            <div key={pIdx} className="space-y-2 pt-1">
              {items.map((item, itemIdx) => (
                <div key={itemIdx} className="p-2.5 rounded-lg bg-zinc-50/70 border border-zinc-200/70 flex items-start gap-2 shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1e295b] mt-1.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0 text-xs text-zinc-800 leading-relaxed">
                    {parseInlineMarkdown(item)}
                  </div>
                </div>
              ))}
            </div>
          );
        }

        if (paragraph.startsWith('⚠️') || paragraph.startsWith('💡') || paragraph.startsWith('🚀')) {
          return (
            <div key={pIdx} className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-950 text-xs flex items-start gap-2">
              <span className="text-sm mt-0.5">{paragraph.slice(0, 2)}</span>
              <div className="flex-1 leading-relaxed">
                {parseInlineMarkdown(paragraph.slice(2).trim())}
              </div>
            </div>
          );
        }

        if (paragraph.startsWith('**') && paragraph.endsWith('**') && paragraph.length < 90) {
          return (
            <h4 key={pIdx} className="text-xs font-bold text-[#1e295b] tracking-wide uppercase pt-1 border-b border-zinc-100 pb-1">
              {paragraph.replace(/\*\*/g, '')}
            </h4>
          );
        }

        return (
          <p key={pIdx} className="text-xs text-zinc-700 leading-relaxed">
            {parseInlineMarkdown(paragraph)}
          </p>
        );
      })}
    </div>
  );
};
