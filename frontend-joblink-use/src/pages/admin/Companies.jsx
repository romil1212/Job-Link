import React from 'react';
import { Building2, ExternalLink } from 'lucide-react';

const companiesList = [
  { name: 'Google', problems: 142, stack: 'Golang, C++, Python', status: 'Active' },
  { name: 'Meta', problems: 98, stack: 'PHP/Hack, React, C++', status: 'Active' },
  { name: 'Stripe', problems: 64, stack: 'Ruby, Java, TypeScript', status: 'Active' },
  { name: 'Amazon', problems: 210, stack: 'Java, AWS, Rust', status: 'Active' },
];

const Companies = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">Companies Registry</h1>
        <p className="text-xs text-slate-400 font-medium pt-0.5">Manage hiring partners and company problem tags</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {companiesList.map((c) => (
          <div key={c.name} className="p-5 rounded-3xl bg-[#0B101D] border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {c.status}
              </span>
            </div>
            <div>
              <h3 className="text-base font-black text-white">{c.name}</h3>
              <p className="text-xs text-slate-400 font-medium">{c.problems} Interview Problems</p>
            </div>
            <p className="text-[11px] text-slate-500 font-mono pt-1 border-t border-slate-800/80">{c.stack}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Companies;