import React from 'react';
import { ShieldAlert, Activity, ShieldCheck, Zap } from 'lucide-react';

interface ComparisonTableProps {
  data: string;
}

export const ComparisonTable: React.FC<ComparisonTableProps> = ({ data }) => {
  // Parse markdown-style table data (pipe separated)
  const rows = data.trim().split('\n').map(row => 
    row.split('|').map(cell => cell.trim()).filter(cell => cell !== '')
  ).filter(row => row.length > 0 && !row[0].startsWith('---')); // Filter out header separators

  if (rows.length < 2) return null;

  const headers = rows[0];
  const body = rows.slice(1);

  return (
    <div className="my-16 md:my-24 p-8 md:p-14 border border-border-color rounded-[3rem] shadow-2xl relative overflow-hidden bg-white/[0.02] group/table">
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-primary/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
      
      <div className="overflow-x-auto relative z-10">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10">
              {headers.map((header, i) => (
                <th key={i} className="py-8 px-6 font-mono text-[10px] text-accent-primary uppercase tracking-[0.4em] font-black italic">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-accent-primary rounded-full animate-pulse" />
                    {header}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-text-muted text-sm">
            {body.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b border-white/5 hover:bg-white/[0.03] transition-all duration-300">
                {row.map((cell, cellIndex) => {
                  const headerText = headers[cellIndex]?.toLowerCase() || '';
                  const isImpact = headerText.includes('impact');
                  const isVulnerability = headerText.includes('vulnerability') || headerText.includes('name');
                  const isPrevention = headerText.includes('prevention') || headerText.includes('fix');
                  
                  return (
                    <td key={cellIndex} className="py-8 px-6 font-medium">
                      <div className="flex items-start gap-4">
                        {isVulnerability && <ShieldAlert size={18} className="text-accent-primary mt-0.5 shrink-0" />}
                        {isPrevention && <ShieldCheck size={18} className="text-green-500 mt-0.5 shrink-0" />}
                        <span className={`
                          ${isVulnerability ? 'font-orbitron font-black text-text-primary uppercase italic text-base tracking-tight' : ''}
                          ${isImpact ? 'text-severity-high font-bold italic' : ''}
                          ${isPrevention ? 'text-text-primary/90' : ''}
                        `}>
                          {cell}
                        </span>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Decorative footers */}
      <div className="mt-8 flex justify-between items-center opacity-20 relative z-10">
        <div className="flex gap-1">
          {[1, 2, 3].map(i => <div key={i} className="w-8 h-1 bg-accent-primary" />)}
        </div>
        <div className="font-mono text-[8px] uppercase tracking-[0.5em] font-black">
          Logical Comparison Engine v1.0.4
        </div>
      </div>
    </div>
  );
};
