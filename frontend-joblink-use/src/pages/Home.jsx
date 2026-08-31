import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Statistics from '../components/Statistics';
import Features from '../components/Features';
import LearningPaths from '../components/LearningPaths';
import ProblemsTable from '../components/ProblemsTable';
import Companies from '../components/Companies';
import About from '../components/About';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

const Home = ({ isDarkMode, toggleDarkMode }) => {
  return (
    <div
      className={`min-h-screen font-sans antialiased transition-colors duration-300 ${
        isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-white text-slate-900'
      }`}
    >
      <Navbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      <main>
        <Hero isDarkMode={isDarkMode} />
        <Statistics isDarkMode={isDarkMode} />
        <Features isDarkMode={isDarkMode} />
        <LearningPaths isDarkMode={isDarkMode} />
        <ProblemsTable isDarkMode={isDarkMode} />
        <Companies isDarkMode={isDarkMode} />
        <About isDarkMode={isDarkMode} />
        <Contact isDarkMode={isDarkMode} />
      </main>
      <Footer isDarkMode={isDarkMode} />
    </div>
  );
};

export default Home;