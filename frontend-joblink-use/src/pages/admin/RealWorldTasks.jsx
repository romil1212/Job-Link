import React from 'react';
import { Cpu, Layers } from 'lucide-react';

const RealWorldTasks = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">Real-World Engineering Tasks</h1>
        <p className="text-xs text-slate-400 font-medium pt-0.5">Microservice scenarios, Docker, and system design challenges</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-6 rounded-3xl bg-[#0B101D] border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400">
            <Cpu className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">DevOps & Cloud</span>
          </div>
          <h3 className="text-base font-black text-white">Design a Distributed Rate Limiter</h3>
          <p className="text-xs text-slate-400 leading-relaxed font-medium">
            Microservices are experiencing cascading failures during traffic spikes. Implement a sliding window counter using Redis.
          </p>
          <div className="pt-2 flex items-center justify-between text-xs font-bold text-amber-400">
            <span>Reward: 500 XP</span>
            <span className="text-slate-400 font-medium">Est. 45 mins</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealWorldTasks;