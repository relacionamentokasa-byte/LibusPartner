import React from 'react';
import { useLanguage, Language } from '../context/LanguageContext';

export const LanguageSelector: React.FC<{ compact?: boolean; className?: string }> = ({ compact = false, className = '' }) => {
  const { language, setLanguage } = useLanguage();

  const options: Array<{ code: Language; label: string; flag: string; short: string }> = [
    { code: 'pt', label: 'Português (Brasil)', flag: '🇧🇷', short: 'PT' },
    { code: 'es', label: 'Español (América Latina)', flag: '🇪🇸', short: 'ES' }
  ];

  return (
    <div className={`inline-flex items-center p-0.5 rounded-xl bg-slate-100 border border-slate-200/90 shadow-2xs ${className}`}>
      {options.map((opt) => {
        const isSelected = language === opt.code;
        return (
          <button
            key={opt.code}
            type="button"
            onClick={() => setLanguage(opt.code)}
            title={opt.label}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
              isSelected
                ? 'bg-white text-libus-magenta shadow-xs border border-slate-200/80'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="text-sm leading-none">{opt.flag}</span>
            <span className="tracking-wider">{compact ? opt.short : opt.short}</span>
          </button>
        );
      })}
    </div>
  );
};
