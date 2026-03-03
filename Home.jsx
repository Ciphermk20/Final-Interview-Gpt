import React from 'react';
import { motion } from 'framer-motion';
import { Command, ArrowRight, Play, Cpu, Layers, BarChart3, Shield, Globe, Mail, ChevronRight } from 'lucide-react';

const Home = () => {
  // Smooth reveals
  const reveal = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-[#1D1D1F] selection:bg-blue-500/10 font-sans tracking-tight">
      
      {/* --- LIQUID FLOATING NAV --- */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-4xl">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="backdrop-blur-2xl bg-white/60 border border-white/80 px-8 py-3 rounded-full flex items-center justify-between shadow-[0_8px_32px_0_rgba(0,0,0,0.03)]"
        >
          <div className="flex items-center gap-2 font-bold text-base tracking-tighter italic">
            <Command size={18} className="text-blue-600" />
            <span>AI INTERVIEW <span className="text-blue-600">GPT</span></span>
          </div>
          <div className="hidden md:flex gap-10 text-[10px] font-bold uppercase tracking-[0.2em] opacity-40">
            <a href="#features" className="hover:opacity-100 transition-opacity">Features</a>
            <a href="#how" className="hover:opacity-100 transition-opacity">How it works</a>
            <a href="#reviews" className="hover:opacity-100 transition-opacity">Reviews</a>
          </div>
          <button onClick={() => window.location.href='/interview'} className="bg-[#1D1D1F] text-white px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg shadow-black/5">
            Start
          </button>
        </motion.div>
      </nav>

      {/* --- HERO: PURE MINIMALISM --- */}
      <section className="relative pt-52 pb-24 px-6 flex flex-col items-center text-center overflow-hidden">
        {/* Animated Liquid Backgrounds */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <motion.div 
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-[-10%] left-[10%] w-[500px] h-[500px] bg-blue-100/50 blur-[120px] rounded-full" 
          />
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 10, repeat: Infinity, delay: 1 }}
            className="absolute bottom-0 right-[10%] w-[400px] h-[400px] bg-purple-100/40 blur-[120px] rounded-full" 
          />
        </div>

        <motion.div {...reveal} className="max-w-4xl">
          <h1 className="text-6xl md:text-[7rem] font-black tracking-[ -0.05em] leading-[0.9] mb-10 text-[#1D1D1F]">
            Master your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-blue-600 to-blue-400">Next Chapter.</span>
          </h1>
          <p className="text-xl md:text-2xl font-medium opacity-40 mb-12 max-w-xl mx-auto leading-relaxed">
            The elite GPT engine for technical interview simulation. Precision analysis. Instant feedback.
          </p>
          <div className="flex gap-4 justify-center">
            <button onClick={() => window.location.href='/interview'} className="px-10 py-5 bg-blue-600 text-white font-bold rounded-2xl shadow-xl shadow-blue-500/20 hover:scale-105 transition-all flex items-center gap-2">
              Launch Simulator <ArrowRight size={18} />
            </button>
          </div>
        </motion.div>
      </section>

      {/* --- FEATURES GRID --- */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard 
            icon={<Cpu size={20} />}
            title="Neural Logic"
            desc="Surgical analysis of your technical reasoning."
          />
          <GlassCard 
            icon={<BarChart3 size={20} />}
            title="Performance"
            desc="Visualized growth metrics and logic scores."
          />
          <GlassCard 
            icon={<Shield size={20} />}
            title="Private"
            desc="Encrypted history of every mock session."
          />
        </div>
      </section>

      {/* --- HOW IT WORKS: STEP-BY-STEP --- */}
      <section id="how" className="py-24 bg-gray-50/50 border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-12">
            {[
              { n: "01", t: "Sync", d: "Select your stack" },
              { n: "02", t: "Speak", d: "Live AI interaction" },
              { n: "03", t: "Grade", d: "Diagnostic report" }
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center text-center gap-3">
                <span className="text-xs font-black text-blue-600 opacity-30">{step.n}</span>
                <h4 className="text-xl font-bold">{step.t}</h4>
                <p className="text-sm font-medium opacity-40">{step.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FOOTER: MINIMALIST --- */}
      <footer className="pt-32 pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-20">
            <div>
              <div className="font-black text-xl tracking-tighter italic mb-4">AI INTERVIEW <span className="text-blue-600">GPT</span></div>
              <p className="text-xs font-medium opacity-40 max-w-[200px]">Advanced preparation for the world's most demanding roles.</p>
            </div>
            <div className="grid grid-cols-2 gap-16 text-[10px] font-black uppercase tracking-[0.2em] opacity-30">
              <div className="flex flex-col gap-4">
                <a href="#" className="hover:text-blue-600">Privacy</a>
                <a href="#" className="hover:text-blue-600">Terms</a>
              </div>
              <div className="flex flex-col gap-4">
                <a href="#" className="hover:text-blue-600">Contact</a>
                <a href="#" className="hover:text-blue-600">Status</a>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-100 flex justify-between items-center opacity-20 text-[9px] font-black uppercase tracking-[0.5em]">
            <span>© 2026 AI INTERVIEW GPT</span>
            <span className="italic">Built for Excellence</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

// --- GLASS CARD COMPONENT ---
const GlassCard = ({ icon, title, desc }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="p-10 rounded-[2.5rem] bg-white border border-white shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] transition-all group cursor-default"
  >
    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all">
      {icon}
    </div>
    <h3 className="text-lg font-bold mb-2">{title}</h3>
    <p className="text-sm font-medium opacity-40 leading-relaxed">{desc}</p>
  </motion.div>
);

export default Home;