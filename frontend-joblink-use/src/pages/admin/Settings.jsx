import React from 'react';
import { Shield, Key, Bell, Database } from 'lucide-react';

const Settings = () => {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-black text-white">Platform Settings</h1>
        <p className="text-xs text-slate-400 font-medium pt-0.5">Configure platform defaults, API keys, and maintenance</p>
      </div>

      <div className="p-6 rounded-3xl bg-[#0B101D] border border-slate-800 space-y-4 text-xs">
        <div>
          <label className="block font-bold text-slate-300 mb-1">Platform Name</label>
          <input
            type="text"
            defaultValue="JobLink Intelligent Developer Platform"
            className="w-full bg-[#050914] border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="block font-bold text-slate-300 mb-1">Judge Engine Timeout (Seconds)</label>
          <input
            type="number"
            defaultValue={5}
            className="w-full bg-[#050914] border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="pt-2">
          <button className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold transition">
            Save Platform Configurations
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;