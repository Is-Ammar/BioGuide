import React from 'react';
import { MapPin } from 'lucide-react';
import { countries, defaultCountry } from '../data/countries';

interface CountrySelectProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  id?: string;
}

// Tailwind classes replicate style of other inputs (icon padding, focus styles, dark background)
export const CountrySelect: React.FC<CountrySelectProps> = ({ value, onChange, required = true, id = 'country' }) => {
  return (
    <div className="relative">
      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
      <select
        id={id}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:border-cosmic-400 focus:ring-2 focus:ring-cosmic-400/20 transition-colors appearance-none"
        required={required}
      >
        <option value="" disabled>{`Select Country`}</option>
        {countries.map(c => (
          <option key={c.countryCode2} value={c.name}>{c.name}</option>
        ))}
      </select>
    </div>
  );
};

export default CountrySelect;
