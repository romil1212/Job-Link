import React, { useState } from 'react';
import { FiX, FiSend, FiPaperclip, FiZap, FiCpu, FiCode } from 'react-icons/fi';

const AIAssistantDrawer = ({ isOpen, onClose, codeContext }) => {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Hello! I am your JobLink AI Mentor. I have attached your current code solution context. How can I assist your algorithm design or runtime optimization?',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const prompts = [
    'Explain my code',
    'Debug my solution',
    'Optimize runtime',
    'Generate hints',
    'Find mistakes',
    'Interview prep',
  ];

  const handleSend = (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg = { sender: 'user', text: query };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let aiReply = `Analyzing code context for "${codeContext?.problemName || 'General Query'}"...\n\n`;
      if (query.includes('Debug') || query.includes('mistakes')) {
        aiReply += `I noticed potential nested loops in your ${codeContext?.language || 'code'}. Consider using a Hash Map to reduce time complexity from O(N²) to O(N).`;
      } else if (query.includes('Optimize')) {
        aiReply += `Your solution operates at O(N log N). You can achieve O(N) linear time by leveraging a two-pointer approach after initial partitioning.`;
      } else {
        aiReply += `Here is a structural breakdown of your code logic: The approach correctly handles boundary constraints, but watch out for potential integer overflow on large input sets.`;
      }

      setMessages((prev) => [...prev, { sender: 'ai', text: aiReply }]);
      setIsTyping(false);
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-[#0B101D] border-l border-slate-800 shadow-2xl flex flex-col justify-between animate-slide-left text-slate-100">
      {/* Drawer Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-[#030712]/60 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <FiCpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black flex items-center gap-1.5">
              JobLink AI Mentor <FiZap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            </h3>
            <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
              Context Active
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
        >
          <FiX className="w-5 h-5" />
        </button>
      </div>

      {/* Code Context Banner */}
      <div className="mx-4 mt-4 p-3 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <FiCode className="w-4 h-4 text-emerald-400 shrink-0" />
          <div className="truncate">
            <p className="text-xs font-bold text-slate-200 truncate">
              {codeContext?.problemName || 'Two Sum'}
            </p>
            <p className="text-[10px] text-slate-400 font-semibold">
              Lang: <span className="text-emerald-400">{codeContext?.language || 'Java'}</span>
            </p>
          </div>
        </div>
        <div className="px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-black text-emerald-400 flex items-center gap-1 shrink-0">
          <FiPaperclip className="w-3 h-3" />
          <span>Attached</span>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] p-3.5 rounded-2xl font-medium leading-relaxed whitespace-pre-line ${
                msg.sender === 'user'
                  ? 'bg-emerald-600 text-white rounded-br-none shadow-md shadow-emerald-600/20'
                  : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-slate-900 border border-slate-800 text-slate-400 px-4 py-3 rounded-2xl rounded-bl-none flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
      </div>

      {/* Suggested Prompts */}
      <div className="px-4 py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar border-t border-slate-800/60 bg-slate-950/40">
        {prompts.map((p, i) => (
          <button
            key={i}
            onClick={() => handleSend(p)}
            className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[10px] font-bold text-slate-300 hover:text-emerald-400 whitespace-nowrap transition cursor-pointer"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-4 border-t border-slate-800 bg-[#030712]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AI Mentor about code..."
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-medium"
          />
          <button
            type="submit"
            className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-md shadow-emerald-600/20 cursor-pointer"
          >
            <FiSend className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIAssistantDrawer;