import React from 'react';
import { Terminal, Shield } from 'lucide-react';

const langs = [
  { name: 'Python 3', version: '3.11.4', compiler: 'CPython', status: 'Active', limit: '2.0s / 256MB' },
  { name: 'Java', version: '21 LTS', compiler: 'OpenJDK javac', status: 'Active', limit: '4.0s / 512MB' },
  { name: 'TypeScript', version: '5.2.2', compiler: 'Node.js v20', status: 'Active', limit: '2.0s / 256MB' },
  { name: 'C++', version: 'GCC 13.2', compiler: 'g++', status: 'Maintenance', limit: '1.0s / 128MB' },
];

const ProgrammingLanguages = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">Execution Runtimes</h1>
        <p className="text-xs text-slate-400 font-medium pt-0.5">Judge engine compilers and memory quotas</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {langs.map((l) => (
          <div key={l.name} className="p-5 rounded-3xl bg-[#0B101D] border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <Terminal className="w-4 h-4" />
                </div>
                <h3 className="text-base font-black text-white">{l.name}</h3>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                l.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
              }`}>
                {l.status}
              </span>
            </div>
            <div className="text-xs text-slate-400 space-y-1 pt-1 font-medium">
              <p>Compiler: <span className="text-slate-200">{l.compiler} ({l.version})</span></p>
              <p>Quotas: <span className="text-emerald-400 font-mono">{l.limit}</span></p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgrammingLanguages;