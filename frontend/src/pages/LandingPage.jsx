/**
 * LandingPage.jsx — Unique Creative Homepage
 * ════════════════════════════════════════════
 * NOT your typical centered-text-on-dark-bg landing page.
 * 
 * Design philosophy:
 *  - Asymmetric / editorial layouts
 *  - Left-aligned hero with animated right-side visual
 *  - Animated cyber-grid network effect (CSS-only)
 *  - Horizontal scrolling feature showcase
 *  - Bento-grid layout for capabilities
 *  - Split-screen sections
 *  - Mixed typography sizes / weights
 *  - Real depth with layered glassmorphism panels
 */
import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useInView,
} from 'framer-motion';
import {
  ArrowRight, ShieldCheck, Zap, Lock, Network, Eye, BarChart3,
  Terminal, Cpu, Activity, TrendingUp, Fingerprint, Star, Quote,
  Play, CheckCircle2, X,
  Radar, Github, Linkedin, Mail
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const H = { fontFamily: 'Outfit, sans-serif' };
const B = { fontFamily: 'Sora, sans-serif' };

/* ─── helpers ──────────────────────────────────────────────── */
const Reveal = ({ children, dir = 'up', delay = 0, className = '' }) => {
  const ref = useRef(null);
  const iv = useInView(ref, { once: true, margin: '-60px' });
  const d = { up: { y: 60 }, down: { y: -60 }, left: { x: 60 }, right: { x: -60 } };
  return (
    <motion.div ref={ref} initial={{ opacity: 0, ...d[dir] }}
      animate={iv ? { opacity: 1, y: 0, x: 0 } : {}}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}>{children}</motion.div>
  );
};





/* ═══════════════════════════════════════════════════════════════
   ① NAVBAR — Minimal, blurred
   ═══════════════════════════════════════════════════════════════ */
const Nav = () => {
  const nav = useNavigate();
  const { scrollY } = useScroll();
  const [s, setS] = useState(false);
  useEffect(() => { const u = scrollY.on('change', v => setS(v > 40)); return u; }, [scrollY]);

  return (
    <motion.nav initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className={`fixed top-0 left-0 right-0 z-100 transition-all duration-500 ${s ? 'bg-[#07070a]/80 backdrop-blur-2xl border-b border-white/4' : ''}`}>
      <div className="max-w-[1400px] mx-auto px-8 h-[80px] flex items-center justify-between">
        <div className="flex items-center gap-2.5 pl-2">
          <img src="/logo.png" alt="MuleX" className="h-14 md:h-16 w-auto object-contain shrink-0" />
        </div>
        <div className="hidden md:flex items-center gap-1">
          {['Features', 'Process', 'Showcase'].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`}
              className="px-4 py-2 text-[13px] text-slate-400 hover:text-white rounded-lg hover:bg-white/4 transition-all" style={B}>{l}</a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => nav('/login')}
            className="px-5 py-2 text-[13px] font-semibold text-white rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:shadow-[0_0_25px_rgba(139,92,246,0.35)] transition-all cursor-pointer" style={B}>
            Get Started
          </button>
        </div>
      </div>
    </motion.nav>
  );
};

/* ═══════════════════════════════════════════════════════════════
   ② HERO — LEFT-ALIGNED text + RIGHT animated network graph
   ═══════════════════════════════════════════════════════════════ */
const Hero = () => {
  const nav = useNavigate();
  const { scrollY } = useScroll();
  const opc = useTransform(scrollY, [0, 500], [1, 0]);
  const yC = useTransform(scrollY, [0, 500], [0, -80]);

  const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } } };
  const child = {
    hidden: { opacity: 0, y: 40, filter: 'blur(6px)' },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
  };

  const vidBlur = useTransform(scrollY, [0, 600], ['blur(0px)', 'blur(10px)']);
  const vidOpc = useTransform(scrollY, [0, 600], [1, 0.3]);

  return (
    <section className="relative w-full overflow-hidden bg-[#07070a]" style={{ minHeight: '100vh' }}>
      {/* ── FULL-SCREEN BACKGROUND VIDEO ── */}
      <motion.div
        className="absolute inset-0 z-0 overflow-hidden"
        style={{ filter: vidBlur, opacity: vidOpc }}
      >
        <style>{`
          @keyframes heroZoom {
            0% { transform: scale(1); }
            50% { transform: scale(1.15); }
            100% { transform: scale(1); }
          }
        `}</style>
        <video
          src="/WhatsApp Video 2026-02-20 at 3.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          style={{ animation: 'heroZoom 20s ease-in-out infinite' }}
        />
        {/* Lighter overlays — video stays clearly visible */}
        <div className="absolute inset-0 bg-black/25 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#07070a]/60 via-transparent to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07070a]/60 via-transparent to-transparent pointer-events-none" />

        {/* CRITICAL FIX: Heavy fade mask to hide hard transition seams */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-b from-transparent to-[#07070a] pointer-events-none" />
      </motion.div>

      {/* Gradient accent orbs */}
      <div className="absolute inset-0 z-[1] pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-violet-600/7 blur-[180px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-fuchsia-600/6 blur-[150px]" />
        <div className="absolute top-[30%] right-[20%] w-[300px] h-[300px] rounded-full bg-cyan-500/4 blur-[100px]" />
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 z-[1] opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      {/* Scan line effect over the whole hero */}
      <motion.div
        animate={{ top: ['-5%', '105%'] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
        className="absolute left-0 right-0 h-[2px] z-[2] pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.3), rgba(236,72,153,0.2), transparent)' }} />

      <motion.div style={{ opacity: opc, y: yC }}
        className="relative z-10 max-w-[1400px] mx-auto px-8 pt-32 pb-20 flex flex-col lg:flex-row items-center gap-12 min-h-screen">

        {/* ── LEFT: Text content ─────────────────── */}
        <motion.div variants={stagger} initial="hidden" animate="visible"
          className="w-full lg:w-[60%] text-left">
          {/* Pill */}
          <motion.div variants={child}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 backdrop-blur-sm mb-8">
            <motion.div animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
            <span className="text-[12px] text-violet-300 font-medium tracking-wider uppercase" style={B}>
              Fraud Detection Engine v2.0
            </span>
          </motion.div>

          {/* Headline */}
          <motion.div variants={child} className="mb-8">
            <h1 style={H}>
              <span className="block text-[3rem] sm:text-[4rem] md:text-[5rem] lg:text-[5.5rem] font-black text-white leading-[0.95] tracking-[-0.04em] drop-shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
                Uncover
              </span>
              <span className="block text-[3rem] sm:text-[4rem] md:text-[5rem] lg:text-[5.5rem] font-black leading-[0.95] tracking-[-0.04em]">
                <motion.span
                  animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
                  className="text-transparent bg-clip-text bg-[length:200%_auto] drop-shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
                  style={{ backgroundImage: 'linear-gradient(90deg, #818cf8, #a855f7, #ec4899, #818cf8)' }}>
                  Hidden Fraud
                </motion.span>
              </span>
              <span className="block text-[3rem] sm:text-[4rem] md:text-[5rem] lg:text-[5.5rem] font-black text-white leading-[0.95] tracking-[-0.04em] drop-shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
                Networks<motion.span
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  className="text-violet-400">.</motion.span>
              </span>
            </h1>
          </motion.div>

          {/* Sub-text */}
          <motion.p variants={child}
            className="text-[15px] md:text-[17px] text-slate-300 leading-relaxed max-w-lg mb-10 drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]" style={B}>
            Graph-powered AI that analyzes millions of transactions in real-time.
            Detect money muling rings that traditional systems miss entirely.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={child} className="flex flex-wrap items-center gap-4">
            <motion.button whileHover={{ scale: 1.04, boxShadow: '0 0 40px rgba(139,92,246,0.4)' }}
              whileTap={{ scale: 0.97 }}
              onClick={() => nav('/login')}
              className="group px-8 py-3.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold text-[14px] rounded-xl cursor-pointer shadow-[0_4px_20px_rgba(139,92,246,0.25)]"
              style={B}>
              <span className="flex items-center gap-2">
                Start Analyzing
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </motion.button>
            <button
              onClick={() => document.getElementById('demo-modal')?.showModal()}
              className="group flex items-center gap-2.5 px-6 py-3.5 text-slate-300 hover:text-white font-medium text-[14px] rounded-xl border border-white/10 hover:border-white/20 hover:bg-white/3 backdrop-blur-sm transition-all cursor-pointer" style={B}>
              <Play size={15} className="text-violet-400" />
              Watch Demo
            </button>
          </motion.div>

          {/* Mini stats row */}
          <StatsRow />
        </motion.div>

        {/* ── RIGHT: Floating info cards over the video ───────── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, x: 60 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full lg:w-[40%] relative hidden lg:block" style={{ minHeight: '400px' }}>

          {/* Floating card — Threat Alert */}
          <motion.div
            initial={{ opacity: 0, x: 30, y: -20 }}
            animate={{ opacity: 1, x: 0, y: [-8, 8, -8] }}
            transition={{ opacity: { duration: 0.6, delay: 1.2 }, y: { duration: 5, repeat: Infinity, ease: 'easeInOut' } }}
            className="absolute top-8 right-8 z-30 px-4 py-3 bg-black/60 backdrop-blur-2xl rounded-xl border border-red-500/20 shadow-[0_8px_30px_rgba(0,0,0,0.4),0_0_15px_rgba(239,68,68,0.1)]">
            <div className="flex items-center gap-2 mb-1.5">
              <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.2, repeat: Infinity }}
                className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
              <span className="text-[10px] text-white font-mono tracking-wider font-bold">THREAT DETECTED</span>
            </div>
            <div className="text-[9px] text-red-400/60 font-mono">Ring #847 · 12 linked accounts</div>
            <div className="flex items-center gap-1 mt-2">
              <div className="h-1 flex-1 rounded-full bg-red-500/20 overflow-hidden">
                <motion.div animate={{ width: ['0%', '85%'] }}
                  transition={{ duration: 2, delay: 1.5, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full" />
              </div>
              <span className="text-[9px] text-red-400/80 font-mono font-bold">85%</span>
            </div>
          </motion.div>

          {/* Floating card — Accuracy */}
          <motion.div
            initial={{ opacity: 0, x: -30, y: 20 }}
            animate={{ opacity: 1, x: 0, y: [6, -6, 6] }}
            transition={{ opacity: { duration: 0.6, delay: 1.4 }, y: { duration: 6, repeat: Infinity, ease: 'easeInOut' } }}
            className="absolute bottom-12 left-4 z-30 px-5 py-4 bg-black/60 backdrop-blur-2xl rounded-xl border border-emerald-500/20 shadow-[0_8px_30px_rgba(0,0,0,0.4),0_0_15px_rgba(52,211,153,0.1)]">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 size={14} className="text-emerald-400" />
              <span className="text-white text-sm font-bold" style={H}>94.8%</span>
            </div>
            <div className="text-[10px] text-emerald-400/50 uppercase tracking-wider mb-2" style={B}>Detection Accuracy</div>
            <svg viewBox="0 0 80 20" className="w-20 h-5">
              <motion.polyline
                points="0,18 8,14 16,16 24,10 32,12 40,6 48,8 56,3 64,5 72,2 80,4"
                fill="none" stroke="rgba(52,211,153,0.5)" strokeWidth="1.5" strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, delay: 1.6, ease: 'easeOut' }} />
              <defs>
                <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="rgba(52,211,153,0.3)" />
                  <stop offset="1" stopColor="rgba(52,211,153,0)" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>

          {/* Floating card — Transactions */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0, y: [-5, 5, -5] }}
            transition={{ opacity: { duration: 0.6, delay: 1.6 }, y: { duration: 7, repeat: Infinity, ease: 'easeInOut' } }}
            className="absolute top-1/2 right-4 -translate-y-1/2 z-30 px-4 py-3 bg-black/60 backdrop-blur-2xl rounded-xl border border-violet-500/20 shadow-[0_8px_30px_rgba(0,0,0,0.4),0_0_15px_rgba(139,92,246,0.1)]">
            <div className="flex items-center gap-2 mb-1">
              <Activity size={12} className="text-violet-400" />
              <span className="text-[10px] text-white font-mono tracking-wider">PRECISION</span>
            </div>
            <div className="text-lg font-black text-white" style={H}>83%</div>
            <div className="text-[9px] text-violet-400/50 font-mono">Precision & Recall</div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════════════
   STATS ROW — Animated count-up on scroll
   ═══════════════════════════════════════════════════════════════ */
const StatsRow = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const stats = [
    { target: 94.8, suffix: '%', label: 'Accuracy', color: 'from-emerald-400 to-emerald-500', dot: 'bg-emerald-400', glow: 'shadow-[0_0_10px_rgba(52,211,153,0.6)]' },
    { target: 60, prefix: '<', suffix: 'ms', label: 'Response', color: 'from-amber-400 to-orange-400', dot: 'bg-amber-400', glow: 'shadow-[0_0_10px_rgba(251,191,36,0.6)]' },
    { target: 83, prefix: '<', suffix: '%', label: 'Precision & Recall', color: 'from-violet-400 to-fuchsia-400', dot: 'bg-violet-400', glow: 'shadow-[0_0_10px_rgba(167,139,250,0.6)]' },
  ];
  return (
    <motion.div ref={ref} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
      className="flex flex-wrap gap-8 mt-6">
      {stats.map((s, i) => (
        <motion.div key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: i * 0.15 }}
          className="flex items-center gap-3">
          <div className={`w-2.5 h-2.5 rounded-full ${s.dot} ${s.glow}`} />
          <div>
            <div className="text-xl font-black text-white" style={H}>
              {isInView ? <CountUp target={s.target} prefix={s.prefix} suffix={s.suffix} /> : '0'}
            </div>
            <div className="text-[10px] text-slate-500 uppercase tracking-[0.15em]" style={B}>{s.label}</div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

/* Count-up number animation */
const CountUp = ({ target, prefix = '', suffix = '' }) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = target;
    const dur = 1500;
    const step = end / (dur / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setVal(end); clearInterval(timer); }
      else setVal(Math.round(start * 10) / 10);
    }, 16);
    return () => clearInterval(timer);
  }, [target]);
  const display = Number.isInteger(target) ? Math.round(val) : val.toFixed(1);
  return <>{prefix}{display}{suffix}</>;
};

/* ═══════════════════════════════════════════════════════════════
   ③ TRUSTED BY — Fintech & fraud-related companies
   ═══════════════════════════════════════════════════════════════ */
const TrustedBy = () => {
  const logos = [
    { name: 'Stripe', url: 'https://cdn.worldvectorlogo.com/logos/stripe-4.svg' },
    { name: 'Visa', url: 'https://cdn.worldvectorlogo.com/logos/visa-2.svg' },
    { name: 'Mastercard', url: 'https://upload.wikimedia.org/wikipedia/commons/a/a4/Mastercard_2019_logo.svg' },
    { name: 'PayPal', url: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg' },
    { name: 'AWS', url: 'https://cdn.worldvectorlogo.com/logos/aws-2.svg' },
    { name: 'Google Cloud', url: 'https://cdn.worldvectorlogo.com/logos/google-cloud-1.svg' },
    { name: 'Microsoft', url: 'https://cdn.worldvectorlogo.com/logos/microsoft-5.svg' },
    { name: 'Shopify', url: 'https://cdn.worldvectorlogo.com/logos/shopify.svg' },
  ];
  return (
    <section className="py-6 bg-[#07070a] overflow-hidden relative">
      <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-[#07070a] to-transparent z-20 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-[#07070a] to-transparent z-20 pointer-events-none" />
      <div className="flex items-center justify-center gap-3 mb-5">
        <div className="h-[1px] w-16 bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />
        <span className="text-[10px] text-slate-500 uppercase tracking-[0.3em]" style={B}>Trusted by industry leaders</span>
        <div className="h-[1px] w-16 bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />
      </div>
      <motion.div className="flex whitespace-nowrap items-center gap-16" animate={{ x: [0, -1000] }}
        transition={{ repeat: Infinity, ease: 'linear', duration: 25 }}>
        {[0, 1, 2].map(j => (
          <div key={j} className="flex items-center gap-16">
            {logos.map((l, i) => (
              <motion.img key={`${j}-${i}`}
                src={l.url} alt={l.name} loading="lazy"
                whileHover={{ scale: 1.15, opacity: 1 }}
                className="h-8 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity duration-500 flex-shrink-0"
              />
            ))}
          </div>
        ))}
      </motion.div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════════════
   PROBLEM / SOLUTION & INTERACTIVE GRAPH
   ═══════════════════════════════════════════════════════════════ */

const InteractiveGraphDemo = () => {
  const [activeNode, setActiveNode] = useState(null);
  const nodes = [
    { id: 1, x: 20, y: 30, color: 'emerald' },
    { id: 2, x: 50, y: 20, color: 'amber' },
    { id: 3, x: 80, y: 35, color: 'emerald' },
    { id: 4, x: 30, y: 70, color: 'cyan' },
    { id: 5, x: 60, y: 60, color: 'red', alert: true },
    { id: 6, x: 85, y: 75, color: 'amber' },
    { id: 7, x: 40, y: 45, color: 'emerald' },
  ];

  const edges = [
    { source: 1, target: 7 }, { source: 2, target: 7 }, { source: 7, target: 4 },
    { source: 7, target: 5 }, { source: 5, target: 3 }, { source: 6, target: 5 },
  ];

  const getColor = (color, opacity = 1) => {
    const map = {
      emerald: `rgba(52, 211, 153, ${opacity})`,
      amber: `rgba(245, 158, 11, ${opacity})`,
      cyan: `rgba(34, 211, 238, ${opacity})`,
      red: `rgba(239, 68, 68, ${opacity})`,
      white: `rgba(255, 255, 255, ${opacity})`,
    };
    return map[color] || map.white;
  };

  return (
    <div className="absolute inset-0 z-0 bg-[#07070a] overflow-hidden"
      onMouseLeave={() => setActiveNode(null)}>
      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.05]"
        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.2) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <svg className="absolute inset-0 w-full h-full">
        {edges.map((edge, i) => {
          const s = nodes.find(n => n.id === edge.source);
          const t = nodes.find(n => n.id === edge.target);
          const isHighlighted = activeNode === s.id || activeNode === t.id;
          const strokeColor = isHighlighted ? getColor(t.color, 0.8) : 'rgba(255,255,255,0.1)';

          return (
            <motion.line key={i}
              x1={`${s.x}%`} y1={`${s.y}%`} x2={`${t.x}%`} y2={`${t.y}%`}
              stroke={strokeColor} strokeWidth={isHighlighted ? 3 : 1}
              animate={{
                strokeDasharray: isHighlighted ? ['5,5', '10,10'] : '0,0',
                strokeDashoffset: isHighlighted ? [0, -20] : 0,
              }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
          );
        })}
      </svg>

      {nodes.map(node => {
        const isActive = activeNode === node.id;
        return (
          <div key={node.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 transition-all cursor-pointer"
            style={{ left: `${node.x}%`, top: `${node.y}%`, zIndex: isActive ? 20 : 10 }}
            onMouseEnter={() => setActiveNode(node.id)}>

            {/* Ping effect for alert nodes */}
            {node.alert && (
              <motion.div animate={{ scale: [1, 2.5], opacity: [0.6, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 rounded-full"
                style={{ backgroundColor: getColor(node.color) }} />
            )}

            {/* Node body */}
            <motion.div
              whileHover={{ scale: 1.3 }}
              animate={isActive ? { scale: 1.2 } : { scale: 1 }}
              className={`w-6 h-6 rounded-full border-2 border-[#07070a] shadow-[0_0_15px_rgba(0,0,0,0.5)]`}
              style={{ backgroundColor: getColor(node.color), boxShadow: isActive ? `0 0 20px ${getColor(node.color, 0.6)}` : undefined }}
            />

            {/* Tooltip */}
            {isActive && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="absolute top-full left-1/2 -translate-x-1/2 mt-3 p-3 bg-black/80 backdrop-blur-md rounded-xl border border-white/10 shadow-2xl w-48 pointer-events-none"
                style={{ borderTopColor: getColor(node.color, 0.5) }}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getColor(node.color) }} />
                  <span className="text-[11px] font-mono text-white/90">Node #{node.id}</span>
                </div>
                <div className="text-[10px] text-white/50 space-y-1 border-t border-white/5 pt-2">
                  <div className="flex justify-between"><span>Velocity:</span><span className="text-white">High</span></div>
                  <div className="flex justify-between"><span>Risk Score:</span><span className={node.alert ? "text-red-400" : "text-emerald-400"}>{node.alert ? '98.5' : '12.4'}</span></div>
                  <div className="flex justify-between"><span>Connections:</span><span className="text-white">{(edges.filter(e => e.source === node.id || e.target === node.id)).length}</span></div>
                </div>
              </motion.div>
            )}
          </div>
        );
      })}
    </div>
  );
};

const ProblemSolution = () => {
  return (
    <section className="py-24 bg-[#07070a] relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Problem */}
          <Reveal dir="right">
            <div className="p-8 md:p-10 rounded-3xl border border-red-500/10 bg-gradient-to-br from-red-500/5 to-transparent relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 blur-[50px] rounded-full" />
              <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                  <span className="text-red-400 font-bold" style={H}>×</span>
                </div>
                <h3 className="text-xl font-bold text-slate-300" style={H}>The Old Way</h3>
              </div>
              <h4 className="text-3xl font-black text-white mb-4 leading-tight relative z-10" style={H}>
                Fraud detection is slow, <span className="text-red-400">rule-based</span>, and reactive.
              </h4>
              <p className="text-slate-400 leading-relaxed mb-6 relative z-10" style={B}>
                Legacy systems rely on static if-then rules that catch fraud only after it happens. They generate constant false positives, require massive manual review teams, and completely miss complex, multi-account money mule networks.
              </p>
              <div className="flex flex-col gap-3 relative z-10">
                {['Single transaction focus', 'High false positive rates', 'Reactive to known threats'].map(item => (
                  <div key={item} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500/50" />
                    <span className="text-sm text-slate-500" style={B}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Solution */}
          <Reveal dir="left" delay={0.2}>
            <div className="p-8 md:p-10 rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-transparent relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 blur-[50px] rounded-full" />
              <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <CheckCircle2 size={20} className="text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-emerald-400" style={H}>The MuleX Way</h3>
              </div>
              <h4 className="text-3xl font-black text-white mb-4 leading-tight relative z-10" style={H}>
                Detect fraud networks in real-time using <span className="text-emerald-400">graph intelligence</span>.
              </h4>
              <p className="text-slate-300 leading-relaxed mb-6 relative z-10" style={B}>
                We build context. By mapping every entity, connection, and flow into a live graph, our AI instantly identifies circular patterns, clustered groups, and money mule behavior before the money leaves.
              </p>
              <div className="flex flex-col gap-3 relative z-10">
                {['Analyzes deep entity relationships', '<50ms proactive intervention', 'Uncovers hidden rings & associations'].map(item => (
                  <div key={item} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                    <span className="text-sm text-emerald-100/70 font-medium" style={B}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════════════
   ④ FEATURES — Premium Bento Grid with Glow Effects
   ═══════════════════════════════════════════════════════════════ */
const FeatureCard = ({ children, color, delay = 0, className = '' }) => {
  const glowMap = {
    violet: 'rgba(139,92,246,0.15)',
    amber: 'rgba(245,158,11,0.15)',
    emerald: 'rgba(52,211,153,0.15)',
    cyan: 'rgba(34,211,238,0.15)',
  };
  const borderMap = {
    violet: 'rgba(139,92,246,0.25)',
    amber: 'rgba(245,158,11,0.25)',
    emerald: 'rgba(52,211,153,0.25)',
    cyan: 'rgba(34,211,238,0.25)',
  };
  return (
    <Reveal delay={delay} className={className}>
      <motion.div
        whileHover={{ y: -4, boxShadow: `0 20px 60px ${glowMap[color]}, 0 0 30px ${glowMap[color]}` }}
        transition={{ duration: 0.3 }}
        className="group relative h-full rounded-2xl overflow-hidden"
        style={{
          border: `1px solid rgba(255,255,255,0.06)`,
          background: 'rgba(255,255,255,0.015)',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = borderMap[color]; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}
      >
        {children}
        {/* Bottom glow line */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: `linear-gradient(90deg, transparent, ${borderMap[color]}, transparent)` }} />
        {/* Corner accent */}
        <div className="absolute top-0 right-0 w-20 h-20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
          style={{ background: `radial-gradient(circle at top right, ${glowMap[color]}, transparent 70%)` }} />
      </motion.div>
    </Reveal>
  );
};

const BentoFeatures = () => {
  return (
    <section id="features" className="py-16 px-8 bg-[#07070a] relative overflow-hidden">
      {/* Background glow orbs */}
      <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.03, 0.06, 0.03] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] bg-violet-600 blur-[200px] rounded-full pointer-events-none" />
      <motion.div animate={{ scale: [1.1, 0.9, 1.1], opacity: [0.02, 0.05, 0.02] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] bg-fuchsia-600 blur-[180px] rounded-full pointer-events-none" />

      <div className="max-w-[1400px] mx-auto relative z-10">
        <Reveal>
          <div className="text-center mb-16">
            <motion.span
              animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="inline-block px-4 py-1.5 rounded-full text-[11px] uppercase tracking-[0.25em] font-semibold text-transparent bg-clip-text bg-[length:200%_auto] border border-violet-500/20"
              style={{ ...B, backgroundImage: 'linear-gradient(90deg, #818cf8, #a855f7, #ec4899, #818cf8)' }}>
              Capabilities
            </motion.span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mt-4 tracking-[-0.03em]" style={H}>
              What makes us{' '}
              <motion.span
                animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
                className="text-transparent bg-clip-text bg-[length:200%_auto]"
                style={{ backgroundImage: 'linear-gradient(90deg, #818cf8, #c084fc, #e879f9, #818cf8)' }}>
                different
              </motion.span>
            </h2>
            <p className="text-sm text-slate-400 max-w-md mx-auto mt-4 leading-relaxed" style={B}>
              Built from the ground up with graph theory and machine learning — not retrofitted rule engines.
            </p>
          </div>
        </Reveal>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* ── Large card — Graph Analysis ── */}
          <FeatureCard color="violet" delay={0} className="lg:col-span-2 lg:row-span-2">
            <div className="absolute inset-0">
              <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop"
                alt="" loading="lazy" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07070a]/90 via-[#07070a]/50 to-transparent" />
            </div>
            <div className="relative z-10 p-8 md:p-10 flex flex-col justify-end h-full min-h-[420px]">
              {/* Floating stats in top-right */}
              <div className="absolute top-6 right-6 flex flex-col gap-2">
                <motion.div animate={{ y: [-3, 3, -3] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="px-3 py-2 bg-black/50 backdrop-blur-xl rounded-lg border border-violet-500/20">
                  <div className="text-[10px] text-violet-400/60 font-mono" style={B}>NODES ANALYZED</div>
                  <div className="text-lg font-black text-white" style={H}>2.8M</div>
                </motion.div>
                <motion.div animate={{ y: [3, -3, 3] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                  className="px-3 py-2 bg-black/50 backdrop-blur-xl rounded-lg border border-fuchsia-500/20">
                  <div className="text-[10px] text-fuchsia-400/60 font-mono" style={B}>RINGS FOUND</div>
                  <div className="text-lg font-black text-white" style={H}>847</div>
                </motion.div>
              </div>

              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-white mb-6 shadow-lg shadow-violet-500/25 group-hover:scale-110 group-hover:shadow-[0_0_40px_rgba(139,92,246,0.35)] transition-all duration-300">
                <Network size={26} />
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-white mb-3 tracking-tight" style={H}>Graph-Powered Analysis</h3>
              <p className="text-slate-400 text-[15px] leading-relaxed max-w-lg" style={B}>
                Our engine builds real-time transaction graphs, revealing circular flow patterns, mule networks,
                and anomalous velocity patterns that rule-based systems can never detect.
              </p>
              <div className="flex flex-wrap gap-2 mt-6">
                {['Circular Flows', 'Mule Detection', 'Velocity Analysis', 'Ring Clustering'].map(t => (
                  <span key={t} className="px-3 py-1.5 text-[11px] text-violet-300 bg-violet-500/10 rounded-full border border-violet-500/15 group-hover:bg-violet-500/15 group-hover:border-violet-500/25 transition-all" style={B}>{t}</span>
                ))}
              </div>
            </div>
          </FeatureCard>

          {/* ── Small card — Real-time Scoring ── */}
          <FeatureCard color="amber" delay={0.1}>
            <div className="absolute inset-0">
              <img src="https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=600&auto=format&fit=crop"
                alt="" loading="lazy" className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07070a]/90 to-transparent" />
            </div>
            <div className="relative z-10 p-7">
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/20 group-hover:shadow-[0_0_30px_rgba(245,158,11,0.3)] transition-all">
                  <Zap size={22} />
                </div>
                <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity }}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span className="text-[9px] text-amber-400 font-mono font-bold">LIVE</span>
                </motion.div>
              </div>
              <h3 className="text-xl font-bold text-white mb-2" style={H}>Real-time Scoring</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6" style={B}>
                Sub-50ms ML-powered risk assessment for every single transaction.
              </p>
              <div className="flex items-end gap-3">
                <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400" style={H}>&lt;50ms</div>
                <span className="text-[10px] text-amber-400/40 pb-1 uppercase tracking-wider" style={B}>avg latency</span>
              </div>
              {/* Mini performance bars */}
              <div className="flex items-end gap-1 mt-4 h-6">
                {[30, 45, 25, 60, 35, 50, 40, 55, 30, 65, 45, 35, 50, 40, 55].map((h, i) => (
                  <motion.div key={i}
                    initial={{ height: 0 }}
                    whileInView={{ height: `${h}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.04 }}
                    className="flex-1 rounded-sm bg-gradient-to-t from-amber-500/40 to-amber-500/10" />
                ))}
              </div>
            </div>
          </FeatureCard>

          {/* ── Small card — Security ── */}
          <FeatureCard color="emerald" delay={0.15}>
            <div className="absolute inset-0">
              <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=600&auto=format&fit=crop"
                alt="" loading="lazy" className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07070a]/90 to-transparent" />
            </div>
            <div className="relative z-10 p-7">
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 group-hover:shadow-[0_0_30px_rgba(52,211,153,0.3)] transition-all">
                  <Lock size={22} />
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  <ShieldCheck size={10} className="text-emerald-400" />
                  <span className="text-[9px] text-emerald-400 font-mono font-bold">SOC2</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-2" style={H}>Zero-Trust Security</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6" style={B}>
                Enterprise-grade encryption. Your data never leaves your infrastructure.
              </p>
              {/* Security checklist */}
              <div className="space-y-2.5">
                {[
                  { label: 'End-to-end encryption', done: true },
                  { label: 'On-premise deployment', done: true },
                  { label: 'GDPR compliant', done: true },
                ].map((item, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                      <CheckCircle2 size={10} className="text-emerald-400" />
                    </div>
                    <span className="text-[12px] text-slate-400" style={B}>{item.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </FeatureCard>
        </div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════════════
   ⑤ PROCESS — Premium timeline steps
   ═══════════════════════════════════════════════════════════════ */
const Process = () => {
  const steps = [
    { icon: Terminal, title: 'Upload Data', desc: 'Drop CSV files into the secure portal or connect via API.', img: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=600&auto=format&fit=crop', color: 'from-violet-500 to-indigo-600', glow: 'rgba(139,92,246,0.2)' },
    { icon: Cpu, title: 'Build Graph', desc: 'Engine builds transaction relationship graphs in real-time.', img: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600&auto=format&fit=crop', color: 'from-fuchsia-500 to-pink-600', glow: 'rgba(217,70,239,0.2)' },
    { icon: Eye, title: 'Detect Anomalies', desc: 'ML scans for mule patterns, fraud rings & velocity anomalies.', img: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?q=80&w=600&auto=format&fit=crop', color: 'from-cyan-500 to-blue-600', glow: 'rgba(34,211,238,0.2)' },
    { icon: BarChart3, title: 'Get Reports', desc: 'Interactive dashboards with exportable compliance reports.', img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop', color: 'from-emerald-500 to-teal-600', glow: 'rgba(52,211,153,0.2)' },
  ];

  return (
    <section id="process" className="py-20 bg-[#07070a] relative overflow-hidden">
      {/* Background effects */}
      <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.02, 0.05, 0.02] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[20%] left-[40%] w-[500px] h-[500px] bg-fuchsia-600 blur-[200px] rounded-full pointer-events-none" />
      <div className="max-w-[1400px] mx-auto px-8 relative z-10">
        <Reveal>
          <div className="text-center mb-16">
            <motion.span
              animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="inline-block px-4 py-1.5 rounded-full text-[11px] uppercase tracking-[0.25em] font-semibold text-transparent bg-clip-text bg-[length:200%_auto] border border-fuchsia-500/20"
              style={{ ...B, backgroundImage: 'linear-gradient(90deg, #e879f9, #a855f7, #818cf8, #e879f9)' }}>
              Process
            </motion.span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mt-4 tracking-[-0.03em]" style={H}>
              Four steps to{' '}
              <motion.span
                animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
                className="text-transparent bg-clip-text bg-[length:200%_auto]"
                style={{ backgroundImage: 'linear-gradient(90deg, #e879f9, #c084fc, #818cf8, #e879f9)' }}>
                fraud-free
              </motion.span>
            </h2>
            <p className="text-sm text-slate-400 max-w-md mx-auto mt-4 leading-relaxed" style={B}>
              From data upload to actionable insights — in under 60 seconds.
            </p>
          </div>
        </Reveal>


        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 relative z-10">
          {steps.map((s, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -8, boxShadow: `0 30px 60px ${s.glow}` }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="group relative rounded-[28px] transition-all duration-500 h-full flex flex-col"
                style={{ border: '1px solid rgba(255,255,255,0.06)', background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.005) 100%)' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = s.glow.replace('0.2', '0.4'); }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}>

                {/* Premium Inner Image Container */}
                <div className="p-3 flex-shrink-0">
                  <div className="h-44 rounded-[20px] overflow-hidden relative shadow-lg bg-[#0b0b12]">
                    <img src={s.img} alt="" loading="lazy"
                      className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-transform duration-[1.2s] ease-[0.22,1,0.36,1]" />
                    {/* Inner glass overlay for refined lighting */}
                    <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-[20px] pointer-events-none" />

                    {/* Glassmorphic Step Number */}
                    <div className="absolute top-4 left-4 w-10 h-10 rounded-[14px] bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-xl group-hover:bg-black/60 transition-colors">
                      <span className="text-[14px] font-black text-white" style={H}>{i + 1}</span>
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="px-7 pb-8 pt-4 flex flex-col flex-grow">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-12 h-12 rounded-[16px] bg-gradient-to-br ${s.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:shadow-[0_0_25px_${s.glow}] transition-all duration-500`}
                      style={{ boxShadow: `0 4px 15px ${s.glow}` }}>
                      <s.icon size={22} />
                    </div>
                    <h3 className="text-[19px] font-bold text-white tracking-tight" style={H}>{s.title}</h3>
                  </div>
                  <p className="text-slate-400 text-[14.5px] leading-relaxed" style={B}>{s.desc}</p>
                </div>

                {/* Bottom interactive glow bar */}
                <div className="absolute bottom-0 left-0 right-0 h-[3px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-b-[28px]"
                  style={{ background: `linear-gradient(90deg, transparent, ${s.glow.replace('0.2', '0.6')}, transparent)` }} />
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════════════
   ⑥ SHOWCASE — Full-width image with overlay panels
   ═══════════════════════════════════════════════════════════════ */
const Showcase = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section id="showcase" ref={ref} className="py-20 bg-[#07070a] relative overflow-hidden">
      {/* Background glow orbs */}
      <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.02, 0.06, 0.02] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[10%] right-[20%] w-[500px] h-[500px] bg-cyan-600 blur-[200px] rounded-full pointer-events-none" />
      <motion.div animate={{ scale: [1.1, 0.9, 1.1], opacity: [0.02, 0.04, 0.02] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        className="absolute bottom-[10%] left-[10%] w-[400px] h-[400px] bg-violet-600 blur-[180px] rounded-full pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-8 relative z-10">
        <Reveal>
          <div className="text-center mb-14">
            <motion.span
              animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="inline-block px-4 py-1.5 rounded-full text-[11px] uppercase tracking-[0.25em] font-semibold text-transparent bg-clip-text bg-[length:200%_auto] border border-cyan-500/20"
              style={{ ...B, backgroundImage: 'linear-gradient(90deg, #22d3ee, #818cf8, #e879f9, #22d3ee)' }}>
              Visualization
            </motion.span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mt-4 tracking-[-0.03em]" style={H}>
              See what others{' '}
              <motion.span
                animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="text-transparent bg-clip-text bg-[length:200%_auto]"
                style={{ backgroundImage: 'linear-gradient(90deg, #22d3ee, #818cf8, #ec4899, #22d3ee)' }}>
                can't see
              </motion.span>
            </h2>
            <p className="text-sm text-slate-400 max-w-md mx-auto mt-4 leading-relaxed" style={B}>
              Our interactive graph visualization reveals hidden fraud patterns in your transaction data.
            </p>
          </div>
        </Reveal>

        {/* Large showcase image */}
        <Reveal>
          <motion.div
            whileHover={{ boxShadow: '0 30px 80px rgba(34,211,238,0.12), 0 0 40px rgba(139,92,246,0.08)' }}
            className="relative rounded-2xl overflow-hidden group shadow-2xl shadow-cyan-500/5 transition-all duration-700"
            style={{ y: imgY, border: '1px solid rgba(34,211,238,0.1)' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(34,211,238,0.25)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(34,211,238,0.1)'; }}>
            <div className="aspect-[21/9] relative overflow-hidden">
              <div className="w-full h-full absolute inset-0 bg-[#0b0c10] opacity-90 group-hover:opacity-100 transition-all duration-[1.2s]">
                <InteractiveGraphDemo />
              </div>


              {/* Left overlay panel */}
              <div className="absolute left-6 bottom-6 top-auto md:top-6 max-w-[240px]">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="p-5 bg-black/70 backdrop-blur-2xl rounded-2xl border border-white/8 hover:border-cyan-500/20 transition-colors duration-500">
                  <div className="flex items-center gap-2.5 mb-4">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_12px_rgba(239,68,68,0.7)]" />
                    <span className="text-white text-[10px] font-mono tracking-[0.15em] uppercase">Live Threat Monitor</span>
                  </div>
                  <div className="space-y-3">
                    {[
                      { label: 'Suspicious Accounts', value: '23', color: 'text-red-400', bg: 'bg-red-500/10' },
                      { label: 'Active Fraud Rings', value: '3', color: 'text-amber-400', bg: 'bg-amber-500/10' },
                      { label: 'Blocked Transactions', value: '847', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-[11px] text-slate-400" style={B}>{item.label}</span>
                        <span className={`text-[13px] font-bold font-mono ${item.color} ${item.bg} px-2 py-0.5 rounded`}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Right floating chips */}
              <div className="absolute right-6 top-6 flex flex-col gap-3">
                <motion.div animate={{ y: [-4, 4, -4] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="px-4 py-2.5 bg-black/70 backdrop-blur-xl rounded-xl border border-violet-500/20 shadow-xl hover:border-violet-500/40 transition-colors">
                  <div className="flex items-center gap-2">
                    <Radar size={13} className="text-violet-400" />
                    <span className="text-white text-[11px] font-mono">NODES: 2,847</span>
                  </div>
                </motion.div>
                <motion.div animate={{ y: [4, -4, 4] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                  className="px-4 py-2.5 bg-black/70 backdrop-blur-xl rounded-xl border border-cyan-500/20 shadow-xl hover:border-cyan-500/40 transition-colors">
                  <div className="flex items-center gap-2">
                    <Activity size={13} className="text-cyan-400" />
                    <span className="text-white text-[11px] font-mono">EDGES: 14.2K</span>
                  </div>
                </motion.div>
              </div>
            </div>
            {/* Bottom glow line */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(34,211,238,0.4), rgba(139,92,246,0.4), transparent)' }} />
          </motion.div>
        </Reveal>

        {/* Feature pills below */}
        <div className="flex flex-wrap justify-center gap-3 mt-10">
          {[
            { icon: Activity, text: 'Live Node Updates', color: 'text-cyan-400', border: 'hover:border-cyan-500/30' },
            { icon: Fingerprint, text: 'Ring Clustering', color: 'text-violet-400', border: 'hover:border-violet-500/30' },
            { icon: TrendingUp, text: 'Flow Tracing', color: 'text-fuchsia-400', border: 'hover:border-fuchsia-500/30' },
            { icon: Eye, text: 'Anomaly Alerts', color: 'text-emerald-400', border: 'hover:border-emerald-500/30' },
          ].map((f, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <motion.div whileHover={{ y: -2, scale: 1.05 }} transition={{ duration: 0.2 }}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/3 border border-white/6 ${f.border} transition-all cursor-default`}>
                <f.icon size={14} className={f.color} />
                <span className="text-[12px] text-slate-300 font-medium" style={B}>{f.text}</span>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════════════
   ⑦ TESTIMONIALS — Premium review cards
   ═══════════════════════════════════════════════════════════════ */
const Testimonials = () => {
  const glowMap = {
    'from-violet-500 to-fuchsia-600': 'rgba(139,92,246,0.15)',
    'from-amber-500 to-orange-600': 'rgba(245,158,11,0.15)',
    'from-emerald-500 to-teal-600': 'rgba(52,211,153,0.15)',
  };
  const borderMap = {
    'from-violet-500 to-fuchsia-600': 'rgba(139,92,246,0.3)',
    'from-amber-500 to-orange-600': 'rgba(245,158,11,0.3)',
    'from-emerald-500 to-teal-600': 'rgba(52,211,153,0.3)',
  };
  const reviews = [
    { name: 'Sarah Chen', role: 'Head of Risk, FinBank', text: 'Detected a fraud ring our legacy system missed for 8 months. The graph visualization made it immediately obvious.', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150', companyLogo: 'https://cdn.worldvectorlogo.com/logos/visa-2.svg', metric: 'Reduced fraud losses by 73%', grad: 'from-violet-500 to-fuchsia-600' },
    { name: 'Marcus W.', role: 'VP Fraud Strategy, PaySecure', text: 'False positive rate dropped significantly. Sub-50ms response time is incredible for our massive daily transaction volume.', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150', companyLogo: 'https://cdn.worldvectorlogo.com/logos/stripe-4.svg', metric: '60% drop in false positives', grad: 'from-amber-500 to-orange-600' },
    { name: 'Dr. Priya S.', role: 'Director of AML, GlobalBank', text: 'Trace mule accounts in minutes not days. An absolute game-changer for our compliance teams worldwide.', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150', companyLogo: 'https://cdn.worldvectorlogo.com/logos/mastercard-2.svg', metric: '10x faster investigation', grad: 'from-emerald-500 to-teal-600' },
  ];

  return (
    <section className="py-20 bg-[#07070a] relative overflow-hidden">
      {/* Background glow */}
      <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.02, 0.05, 0.02] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[30%] left-[50%] -translate-x-1/2 w-[600px] h-[400px] bg-amber-600 blur-[200px] rounded-full pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-8 relative z-10">
        <Reveal>
          <div className="text-center mb-14">
            <motion.span
              animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="inline-block px-4 py-1.5 rounded-full text-[11px] uppercase tracking-[0.25em] font-semibold text-transparent bg-clip-text bg-[length:200%_auto] border border-amber-500/20"
              style={{ ...B, backgroundImage: 'linear-gradient(90deg, #f59e0b, #f97316, #ef4444, #f59e0b)' }}>
              Social Proof
            </motion.span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mt-4 tracking-[-0.03em]" style={H}>
              What our users{' '}
              <motion.span
                animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
                className="text-transparent bg-clip-text bg-[length:200%_auto]"
                style={{ backgroundImage: 'linear-gradient(90deg, #f59e0b, #f97316, #fbbf24, #f59e0b)' }}>
                say
              </motion.span>
            </h2>
            <div className="flex items-center justify-center gap-1.5 mt-5">
              {[1, 2, 3, 4, 5].map(i => (
                <motion.div key={i} initial={{ opacity: 0, scale: 0 }} whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }} transition={{ delay: 0.1 * i, type: 'spring', stiffness: 300 }}>
                  <Star size={18} className="text-amber-400 fill-amber-400 drop-shadow-[0_0_4px_rgba(245,158,11,0.5)]" />
                </motion.div>
              ))}
              <span className="text-sm text-slate-400 ml-3 font-medium" style={B}>4.9/5 average</span>
            </div>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {reviews.map((r, i) => (
            <Reveal key={i} delay={i * 0.12}>
              <motion.div
                whileHover={{ y: -6, boxShadow: `0 20px 50px ${glowMap[r.grad]}` }}
                transition={{ duration: 0.3 }}
                className="group p-7 rounded-2xl h-full flex flex-col relative overflow-hidden transition-all duration-500"
                style={{ border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = borderMap[r.grad]; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}>
                {/* Top gradient line */}
                <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${r.grad} opacity-0 group-hover:opacity-70 transition-opacity duration-500`} />
                {/* Corner glow */}
                <div className="absolute top-0 right-0 w-24 h-24 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                  style={{ background: `radial-gradient(circle at top right, ${glowMap[r.grad]}, transparent 70%)` }} />

                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${r.grad} flex items-center justify-center mb-5 opacity-20 group-hover:opacity-40 transition-opacity`}>
                  <Quote size={18} className="text-white" />
                </div>
                <p className="text-slate-300 text-[15px] leading-relaxed mb-8 flex-1" style={B}>"{r.text}"</p>
                <div className="flex items-center justify-between pt-5 border-t border-white/5 relative z-10">
                  <div className="flex items-center gap-3">
                    <img src={r.image} alt={r.name} className="w-10 h-10 rounded-full border-2 border-white/10 object-cover" />
                    <div>
                      <p className="text-white text-[14px] font-semibold" style={H}>{r.name}</p>
                      <p className="text-slate-500 text-[11px]" style={B}>{r.role}</p>
                    </div>
                  </div>
                  <img src={r.companyLogo} alt="Company Logo" className="h-4 w-auto object-contain opacity-50 grayscale hover:grayscale-0 transition-all cursor-pointer" />
                </div>
                {/* Metric Badge */}
                <div className={`absolute top-0 right-0 px-3 py-1 bg-gradient-to-r ${r.grad} opacity-90 rounded-bl-xl text-[10px] font-bold text-white shadow-lg pointer-events-none`}>
                  {r.metric}
                </div>
                {/* Bottom glow line */}
                <div className="absolute bottom-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `linear-gradient(90deg, transparent, ${borderMap[r.grad]}, transparent)` }} />
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════════════
   ⑧ CTA — Premium card with glow effects
   ═══════════════════════════════════════════════════════════════ */
const CTA = () => {
  const nav = useNavigate();
  return (
    <section className="py-24 relative overflow-hidden bg-[#07070a]">
      {/* Background glow orbs */}
      <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.03, 0.08, 0.03] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[20%] left-[30%] w-[500px] h-[500px] bg-violet-600 blur-[200px] rounded-full pointer-events-none" />
      <motion.div animate={{ scale: [1.1, 0.8, 1.1], opacity: [0.02, 0.06, 0.02] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute bottom-[10%] right-[20%] w-[400px] h-[400px] bg-fuchsia-600 blur-[180px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto px-8 relative z-10">
        <Reveal>
          <motion.div
            whileHover={{ boxShadow: '0 30px 80px rgba(139,92,246,0.15), 0 0 40px rgba(236,72,153,0.08)' }}
            className="relative rounded-3xl overflow-hidden transition-all duration-700"
            style={{ border: '1px solid rgba(139,92,246,0.15)', background: 'rgba(255,255,255,0.02)' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(139,92,246,0.3)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(139,92,246,0.15)'; }}>

            {/* Inner glow background */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-violet-900/15 via-transparent to-transparent pointer-events-none" />

            {/* Floating accent dots */}
            <motion.div animate={{ y: [-8, 8, -8], x: [-4, 4, -4] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-8 left-10 w-2 h-2 rounded-full bg-violet-500/40 blur-[1px]" />
            <motion.div animate={{ y: [6, -6, 6], x: [3, -3, 3] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute top-12 right-16 w-1.5 h-1.5 rounded-full bg-fuchsia-500/40 blur-[1px]" />
            <motion.div animate={{ y: [-5, 5, -5] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
              className="absolute bottom-14 left-20 w-1.5 h-1.5 rounded-full bg-cyan-500/30 blur-[1px]" />

            {/* Card content */}
            <div className="relative z-10 px-8 py-16 md:px-16 md:py-20 text-center">
              {/* Badge */}
              <motion.div
                animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] uppercase tracking-[0.25em] font-semibold text-transparent bg-clip-text bg-[length:200%_auto] border border-violet-500/20 mb-6"
                style={{ ...B, backgroundImage: 'linear-gradient(90deg, #818cf8, #a855f7, #ec4899, #818cf8)' }}>
                <Zap size={12} className="text-violet-400" />
                <span>Get Started</span>
              </motion.div>

              <motion.h2
                animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                transition={{ duration: 6, repeat: Infinity }}
                className="text-3xl md:text-5xl lg:text-6xl font-black mb-5 tracking-[-0.03em] text-transparent bg-clip-text bg-[length:200%_auto]"
                style={{ ...H, backgroundImage: 'linear-gradient(90deg, #fff, #a78bfa, #f472b6, #fff)' }}>
                Ready to stop fraud?
              </motion.h2>
              <p className="text-base text-slate-400 mb-10 max-w-lg mx-auto leading-relaxed" style={B}>
                Start analyzing your transaction data in minutes. No credit card required. Free tier available.
              </p>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <motion.button whileHover={{ scale: 1.04, boxShadow: '0 0 60px rgba(139,92,246,0.4)' }} whileTap={{ scale: 0.97 }}
                  onClick={() => nav('/login')}
                  className="group px-10 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold text-[15px] rounded-xl cursor-pointer shadow-[0_4px_30px_rgba(139,92,246,0.3)]"
                  style={B}>
                  <span className="flex items-center gap-2">
                    Try Demo <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
                  </span>
                </motion.button>
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={() => document.getElementById('demo-modal')?.showModal()}
                  className="group px-8 py-4 bg-white/4 border border-white/8 hover:border-violet-500/30 text-white font-bold text-[15px] rounded-xl cursor-pointer transition-all"
                  style={B}>
                  <span className="flex items-center gap-2">
                    <Play size={16} className="text-violet-400" /> Watch Demo
                  </span>
                </motion.button>
              </div>

              {/* Trust signals */}
              <div className="flex flex-wrap items-center justify-center gap-6 mt-10">
                {[
                  { icon: ShieldCheck, text: 'SOC2 Certified' },
                  { icon: Lock, text: 'Bank-grade encryption' },
                  { icon: Zap, text: 'Setup in 5 min' },
                ].map((item, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="flex items-center gap-2 text-slate-500">
                    <item.icon size={14} className="text-violet-400/60" />
                    <span className="text-[12px] font-medium" style={B}>{item.text}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Top gradient line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] opacity-50"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.5), rgba(236,72,153,0.5), transparent)' }} />
            {/* Bottom gradient line */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.4), transparent)' }} />
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════════════
   ⑨ FOOTER
   ═══════════════════════════════════════════════════════════════ */
const Footer = () => (
  <footer className="bg-[#07070a] pt-20 pb-10 border-t border-white/4 relative transition-colors duration-300">
    {/* Absolute Top Glow */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />

    <div className="max-w-[1400px] mx-auto px-8">

      {/* Main Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 mb-16">

        {/* Brand Information */}
        <div className="lg:col-span-2 flex flex-col gap-6 pr-8">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="MuleX" className="h-10 w-auto object-contain drop-shadow-[0_0_15px_rgba(139,92,246,0.3)]" />
            <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400 tracking-tight" style={H}>MuleX</span>
          </div>
          <p className="text-slate-400 text-[14px] leading-relaxed max-w-sm" style={B}>
            Next-generation graph-powered money muling detection engine. Uncover hidden transaction networks and fraud rings securely in real-time before they impact your business.
          </p>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            <div className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 flex items-center gap-2">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span className="text-[11px] text-slate-300 font-medium tracking-wide">SOC2 Secure</span>
            </div>
            <div className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 flex items-center gap-2">
              <Lock size={14} className="text-amber-400" />
              <span className="text-[11px] text-slate-300 font-medium tracking-wide">Encrypted Graph Data</span>
            </div>
          </div>
        </div>

        {/* Links Column 1: Platform */}
        <div className="flex flex-col gap-5">
          <h4 className="text-white font-bold tracking-wider text-[12px] uppercase opacity-90" style={H}>Platform</h4>
          <div className="flex flex-col gap-3">
            {['Features', 'Process', 'Showcase'].map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} className="text-slate-400 hover:text-violet-400 text-[14px] font-medium transition-colors w-fit" style={B}>{l}</a>
            ))}
          </div>
        </div>

        {/* Links Column 2: Dashboard/Auth */}
        <div className="flex flex-col gap-5">
          <h4 className="text-white font-bold tracking-wider text-[12px] uppercase opacity-90" style={H}>Application</h4>
          <div className="flex flex-col gap-3">
            <a href="/login" className="text-slate-400 hover:text-violet-400 text-[14px] font-medium transition-colors w-fit" style={B}>Sign In Engine</a>
            <a href="/dashboard" className="text-slate-400 hover:text-violet-400 text-[14px] font-medium transition-colors w-fit" style={B}>Analysis Dashboard</a>
            <a href="/admin" className="text-slate-400 hover:text-cyan-400 text-[14px] font-medium transition-colors w-fit" style={B}>Admin Portal</a>
          </div>
        </div>

      </div>

      {/* Divider */}
      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent mb-10" />

      {/* Footer Bottom Setup */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-2">

        {/* Creator Identity */}
        <div className="flex items-center gap-4 px-5 py-3 rounded-2xl bg-white/5 border border-white/10 shadow-lg hover:border-violet-500/30 transition-all duration-300 group">
          <div className="relative flex-shrink-0">
            <div className="absolute inset-0 bg-violet-500 rounded-xl blur opacity-30 group-hover:opacity-60 transition-opacity" />
            <img src="/profile-photo.png" alt="MANOBENDRA GHOSH" className="relative w-12 h-12 rounded-xl object-cover border border-white/20 shadow-md"
              onError={(e) => { e.target.src = 'https://ui-avatars.com/api/?name=GHOSH+MANOBENDRA&background=8b5cf6&color=fff'; }} />
          </div>

          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-1.5 mb-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              <span className="text-[9px] text-emerald-400 font-mono tracking-widest uppercase font-semibold">Engine Designed By</span>
            </div>
            <h4 className="text-white text-[13px] font-bold tracking-wide leading-none" style={H}>MANOBENDRA GHOSH</h4>
            <div className="flex items-center gap-3 mt-2.5">
              <a href="https://github.com/ghoshmanobendra-dotcom" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white hover:scale-110 transition-all" title="GitHub">
                <Github size={14} />
              </a>
              <a href="https://www.linkedin.com/in/manobendra-ghosh-84b925375/" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white hover:scale-110 transition-all" title="LinkedIn">
                <Linkedin size={14} />
              </a>
              <a href="mailto:ghoshmanobendra@gmail.com" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white hover:scale-110 transition-all" title="Email">
                <Mail size={14} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright Statement */}
        <div className="flex flex-col md:items-end text-center md:text-right">
          <p className="text-slate-400 text-[13px] font-medium" style={B}>
            © {new Date().getFullYear()} MuleX Engine. All rights reserved.
          </p>
          <p className="text-slate-600 text-[11px] mt-2 max-w-[300px]" style={B}>
            Securing financial infrastructure through advanced graph modeling and machine learning.
          </p>
        </div>

      </div>

    </div>
  </footer>
);

/* ═══════════════════════════════════════════════════════════════
   VIDEO MODAL
   ═══════════════════════════════════════════════════════════════ */
const VideoModal = () => {
  return (
    <dialog id="demo-modal" className="m-auto w-[90vw] max-w-5xl bg-transparent backdrop:bg-black/80 backdrop:backdrop-blur-sm p-0 overflow-visible open:outline-none">
      <div className="relative rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(139,92,246,0.5)] border border-violet-500/30 bg-[#07070a]">

        {/* Close Button */}
        <form method="dialog">
          <button className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-black/50 hover:bg-red-500/80 backdrop-blur-md flex items-center justify-center text-white transition-all border border-white/10 cursor-pointer">
            <X size={20} />
          </button>
        </form>

        {/* Video Player */}
        <div className="aspect-video w-full bg-black relative">
          <video
            id="demo-video-player"
            className="w-full h-full object-contain"
            controls
            playsInline
            controlsList="nodownload"
            poster="https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=1200&auto=format&fit=crop"
          >
            {/* TO CHANGE THE VIDEO: Place your MP4 file in frontend/public/ and update the 'src' value below to '/your-filename.mp4' */}
            <source src="https://res.cloudinary.com/dzifrxyno/video/upload/v1771816417/DEMO_VIDEO_uafxbg.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>

      {/* Script to auto-pause video when dialog closes */}
      <script dangerouslySetInnerHTML={{
        __html: `
        document.getElementById('demo-modal').addEventListener('close', function() {
          const video = document.getElementById('demo-video-player');
          if (video) video.pause();
        });
      `}} />
    </dialog>
  );
};

/* ═══════════════════════════════════════════════════════════════
   MAIN EXPORT
   ═══════════════════════════════════════════════════════════════ */
export default function LandingPage() {
  return (
    <div className="bg-[#07070a] min-h-screen text-white selection:bg-violet-500/30" style={B}>
      <Nav />
      <Hero />
      <ProblemSolution />
      <BentoFeatures />
      <Process />
      <Showcase />
      <Testimonials />
      <CTA />
      <Footer />
      <VideoModal />
    </div>
  );
}
