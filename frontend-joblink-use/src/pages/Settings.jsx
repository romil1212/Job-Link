import React from 'react';
import Button from '../components/common/Button';

const Settings = ({ isDarkMode }) => {
  return (
    <div className="space-y-8 max-w-2xl">
      <h1 className={`text-3xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Account Settings</h1>
      <div className={`p-8 rounded-3xl border space-y-6 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="flex justify-between items-center">
          <div>
            <h3 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Email Notifications</h3>
            <p className="text-slate-500 text-sm">Receive platform contest updates and reminders</p>
          </div>
          <input type="checkbox" defaultChecked className="w-5 h-5 accent-emerald-600" />
        </div>
        <div className="pt-4 border-t border-slate-800/40">
          <Button variant="danger">Delete Account</Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;