import React, { useState } from 'react';
import { FiMail, FiMapPin, FiPhone, FiSend } from 'react-icons/fi';

const Contact = ({ isDarkMode }) => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 4000);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }
  };

  return (
    <section
      id="contact"
      className={`py-24 w-full transition-colors duration-300 ${
        isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'
      }`}
    >
      <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-3">
          <h2 className="text-sm font-bold text-emerald-500 tracking-wider uppercase">Contact Us</h2>
          <p className={`text-4xl sm:text-5xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Get in Touch With Us
          </p>
          <p className="text-slate-400 text-base sm:text-lg">
            Have questions about JobLink, platform feedback, or career partnerships? We'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Contact Details Column */}
          <div className="lg:col-span-5 space-y-8">
            <div
              className={`p-8 rounded-3xl border ${
                isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200/80'
              }`}
            >
              <h3 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Contact Details
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3.5 rounded-2xl bg-emerald-500/10 text-emerald-500">
                    <FiMail className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Us</p>
                    <p className={`text-base font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                      support@joblink.dev
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3.5 rounded-2xl bg-emerald-500/10 text-emerald-500">
                    <FiPhone className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Call Us</p>
                    <p className={`text-base font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                      +1 (800) 555-JOBLINK
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3.5 rounded-2xl bg-emerald-500/10 text-emerald-500">
                    <FiMapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Headquarters</p>
                    <p className={`text-base font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                      Tech Hub Park, Innovation Way
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-7">
            <form
              onSubmit={handleSubmit}
              className={`p-8 sm:p-10 rounded-3xl border shadow-md space-y-6 ${
                isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50/60 border-slate-200/80'
              }`}
            >
              {submitted && (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 font-bold text-center">
                  Thank you! Your message has been sent successfully.
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Romil Thummer"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full px-5 py-3.5 rounded-2xl border font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/30 ${
                      isDarkMode
                        ? 'bg-slate-900 border-slate-800 text-white placeholder-slate-500'
                        : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2">Your Email</label>
                  <input
                    type="email"
                    required
                    placeholder="romil@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full px-5 py-3.5 rounded-2xl border font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/30 ${
                      isDarkMode
                        ? 'bg-slate-900 border-slate-800 text-white placeholder-slate-500'
                        : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Subject</label>
                <input
                  type="text"
                  placeholder="Inquiry about learning paths"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className={`w-full px-5 py-3.5 rounded-2xl border font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/30 ${
                    isDarkMode
                      ? 'bg-slate-900 border-slate-800 text-white placeholder-slate-500'
                      : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Message</label>
                <textarea
                  rows="5"
                  required
                  placeholder="How can we help you?"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className={`w-full px-5 py-3.5 rounded-2xl border font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/30 resize-none ${
                    isDarkMode
                      ? 'bg-slate-900 border-slate-800 text-white placeholder-slate-500'
                      : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
                  }`}
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-lg rounded-2xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-3"
              >
                <FiSend className="w-5 h-5" /> Send Message
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Contact;