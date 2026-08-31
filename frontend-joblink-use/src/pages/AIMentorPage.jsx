import React, { useState } from 'react';
import { FiSend, FiCpu } from 'react-icons/fi';

const AIMentorPage = ({ isDarkMode }) => {
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Hello Romil! I am your JobLink AI Mentor. How can I help you optimize your solution today?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { sender: 'user', text: input }]);
    setInput('');
  };

  return (
    <div className={`h-[calc(100vh-140px)] flex flex-col rounded-3xl border overflow-hidden ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
      <div className="p-4 border-b flex items-center gap-3 border-slate-800/40">
        <FiCpu className="w-6 h-6 text-emerald-500" />
        <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>AI Mentor Assistant</span>
      </div>
      <div className="flex-1 p-6 overflow-y-auto space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-md p-4 rounded-2xl text-base font-medium ${
              m.sender === 'user' ? 'bg-emerald-600 text-white' : isDarkMode ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-800'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t flex gap-2 border-slate-800/40">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask AI Mentor a question..."
          className={`flex-1 px-4 py-3 rounded-2xl border focus:outline-none ${
            isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
          }`}
        />
        <button onClick={handleSend} className="p-4 bg-emerald-600 text-white rounded-2xl">
          <FiSend className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default AIMentorPage;