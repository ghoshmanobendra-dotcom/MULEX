/**
 * DashboardPage — Main analytics dashboard for authenticated users.
 * Assembles: Upload, Summary, Graph, Tables, Reports, and Tools.
 *
 * Design: Matches the landing page's dark luxury aesthetic —
 * violet/fuchsia gradients, glassmorphism, Outfit/Sora fonts, framer-motion.
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ArrowLeft, Shield, LogOut, Settings, Radar,
    Loader2, BarChart3, ChevronRight, Clock, User,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import UploadCSV from '../components/UploadCSV';
import SummaryDashboard from '../components/SummaryDashboard';
import GraphVisualization from '../components/GraphVisualization';
import SuspiciousTable from '../components/SuspiciousTable';
import FraudRingsTable from '../components/FraudRingsTable';
import JsonDownload from '../components/JsonDownload';
import ReportGenerator from '../components/ReportGenerator';
import FilterDropdown from '../components/FilterDropdown';
import SearchBar from '../components/SearchBar';
import LayerToggles from '../components/LayerToggles';
import UploadHistory, { saveToHistory } from '../components/UploadHistory';
import StatisticsPanel from '../components/StatisticsPanel';
import ExportCSV from '../components/ExportCSV';
import LayoutSwitcher from '../components/LayoutSwitcher';
import ThemeToggle from '../components/ThemeToggle';

const H = { fontFamily: 'Outfit, sans-serif' };
const B = { fontFamily: 'Sora, sans-serif' };

/* Stagger children animation */
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

export default function DashboardPage() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [riskFilter, setRiskFilter] = useState('all');
    const [cyInstance, setCyInstance] = useState(null);

    const handleResult = (data) => setResult(data);

    const handleUploadResult = (data, fileName) => {
        setResult(data);
        if (user?.role !== 'guest') {
            saveToHistory(data, fileName || 'uploaded.csv');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/', { replace: true });
    };

    // Filter suspicious accounts by risk level
    const filteredAccounts = (() => {
        if (!result?.suspicious_accounts) return [];
        const accts = result.suspicious_accounts;
        switch (riskFilter) {
            case 'high': return accts.filter(a => a.suspicion_score >= 80);
            case 'medium': return accts.filter(a => a.suspicion_score >= 60 && a.suspicion_score < 80);
            case 'low': return accts.filter(a => a.suspicion_score < 60);
            default: return accts;
        }
    })();

    return (
        <div className="min-h-screen selection:bg-violet-500/30 transition-colors duration-300" style={{ ...B, background: 'var(--color-bg)', color: 'var(--color-text)' }}>
            {/* ── Background glow orbs ──────────────────────────── */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-violet-600/[0.04] blur-[180px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-fuchsia-600/[0.03] blur-[160px] rounded-full" />
                <div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] bg-cyan-500/[0.02] blur-[140px] rounded-full" />
            </div>

            {/* ── Top Navigation Bar ─────────────────────────────── */}
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="sticky top-0 z-50 transition-colors duration-300"
                style={{ backdropFilter: 'blur(20px)', background: 'rgba(var(--color-surface-rgb, 7,7,10), 0.8)', borderBottom: '1px solid rgba(var(--color-border-rgb, 255,255,255), 0.06)' }}
            >
                <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-3 flex items-center justify-between">
                    {/* Left: Back + Brand */}
                    <div className="flex items-center gap-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/')}
                            className="flex items-center gap-1.5 px-3 py-2 text-xs text-slate-400 hover:text-white bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] hover:border-violet-500/30 rounded-xl transition-all cursor-pointer"
                            style={B}
                        >
                            <ArrowLeft size={14} />
                            <span>Home</span>
                        </motion.button>

                        <div className="flex items-center gap-3 pl-2">
                            <img src="/logo.png" alt="MuleX" className="h-14 md:h-16 w-auto object-contain shrink-0" />
                        </div>
                    </div>

                    {/* Right: User actions */}
                    <div className="flex items-center gap-2">
                        {/* User badge → links to profile */}
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => navigate('/profile')}
                            className="flex items-center gap-2 px-3 py-2 bg-white/[0.03] rounded-xl border border-white/[0.06] hover:border-violet-500/30 transition-all cursor-pointer"
                        >
                            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500/30 to-fuchsia-500/30 border border-violet-500/20 flex items-center justify-center text-violet-300 text-xs font-bold">
                                {user?.username?.[0]?.toUpperCase() || 'U'}
                            </div>
                            <span className="text-sm text-slate-300 hidden sm:inline" style={B}>{user?.username}</span>
                        </motion.button>

                        {/* History page link */}
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => navigate('/history')}
                            className="flex items-center gap-1.5 px-3 py-2 text-xs text-cyan-300 bg-cyan-500/10 rounded-xl border border-cyan-500/15 hover:bg-cyan-500/20 hover:border-cyan-500/30 transition-all cursor-pointer"
                            title="My History"
                            style={B}
                        >
                            <Clock size={12} />
                            <span className="hidden sm:inline">History</span>
                        </motion.button>

                        {user?.role === 'admin' && (
                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => navigate('/admin')}
                                className="flex items-center gap-1.5 px-3 py-2 text-xs bg-violet-600/15 text-violet-300 rounded-xl border border-violet-500/20 hover:bg-violet-600/25 hover:border-violet-500/40 transition-all cursor-pointer"
                                style={B}
                            >
                                <Shield size={12} />
                                <span className="hidden sm:inline">Admin</span>
                            </motion.button>
                        )}

                        <UploadHistory onLoadResult={handleResult} />
                        <ThemeToggle />

                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={handleLogout}
                            className="flex items-center gap-1.5 px-3 py-2 text-xs text-red-400 bg-red-500/10 rounded-xl border border-red-500/15 hover:bg-red-500/20 hover:border-red-500/30 transition-all cursor-pointer"
                            title="Logout"
                            style={B}
                        >
                            <LogOut size={12} />
                            <span className="hidden sm:inline">Logout</span>
                        </motion.button>
                    </div>
                </div>
            </motion.header>

            {/* ── Main Content ──────────────────────────────────── */}
            <main className="relative z-10 max-w-[1600px] mx-auto px-4 md:px-8 py-8">

                {/* ── Upload Section ───────────────────────────── */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                    className="max-w-2xl mx-auto mb-10"
                >
                    <UploadCSV
                        onResult={(data) => handleUploadResult(data)}
                        onLoading={setLoading}
                        token={user?.token}
                    />
                </motion.section>

                {/* ── Loading State ────────────────────────────── */}
                {loading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 border border-violet-500/20 mb-5"
                        >
                            <Loader2 size={28} className="text-violet-400" />
                        </motion.div>
                        <p className="text-violet-300 font-semibold text-lg" style={H}>Analyzing transaction graph…</p>
                        <p className="text-slate-500 text-sm mt-1" style={B}>Running fraud detection algorithms</p>
                    </motion.div>
                )}

                {/* ── Results ──────────────────────────────────── */}
                {result && !loading && (
                    <motion.div
                        variants={stagger}
                        initial="hidden"
                        animate="visible"
                        className="space-y-6"
                    >
                        {/* Results header */}
                        <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-violet-500/15 flex items-center justify-center">
                                    <BarChart3 size={16} className="text-violet-400" />
                                </div>
                                <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-violet-200" style={H}>
                                    Analysis Results
                                </h2>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                <ReportGenerator result={result} />
                                <JsonDownload result={result} />
                                <ExportCSV accounts={result.suspicious_accounts} />
                            </div>
                        </motion.div>

                        <motion.div variants={fadeUp}>
                            <SummaryDashboard summary={result.summary} />
                        </motion.div>

                        <motion.div variants={fadeUp}>
                            <StatisticsPanel
                                suspiciousAccounts={result.suspicious_accounts}
                                summary={result.summary}
                            />
                        </motion.div>

                        <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-3">
                            <SearchBar cyInstance={cyInstance} />
                            <LayoutSwitcher cyInstance={cyInstance} />
                        </motion.div>

                        <motion.div variants={fadeUp}>
                            <LayerToggles
                                cyInstance={cyInstance}
                                suspiciousAccounts={result.suspicious_accounts}
                            />
                        </motion.div>

                        <motion.div variants={fadeUp}>
                            <GraphVisualization
                                graphData={result.graph_data}
                                suspiciousAccounts={result.suspicious_accounts}
                                onCyReady={setCyInstance}
                            />
                        </motion.div>

                        <motion.div variants={fadeUp} className="flex items-center justify-between flex-wrap gap-3">
                            <div className="flex items-center gap-2">
                                <ChevronRight size={16} className="text-violet-400" />
                                <h3 className="text-lg font-bold text-white" style={H}>Detailed Tables</h3>
                            </div>
                            <FilterDropdown
                                accounts={result.suspicious_accounts}
                                onFilter={setRiskFilter}
                            />
                        </motion.div>

                        <motion.div variants={fadeUp} className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                            <SuspiciousTable accounts={filteredAccounts} />
                            <FraudRingsTable rings={result.fraud_rings} />
                        </motion.div>
                    </motion.div>
                )}
            </main>

            {/* ── Footer ──────────────────────────────────────── */}
            <footer className="relative z-10 border-t border-white/[0.04] mt-16">
                <div className="max-w-[1600px] mx-auto px-8 py-6 flex items-center justify-between">
                    <div className="flex items-center gap-2 pl-2">
                        <img src="/logo.png" alt="MuleX" className="h-8 md:h-10 w-auto object-contain shrink-0" />
                    </div>
                    <span className="text-slate-700 text-[10px]" style={B}>Graph-Based Financial Crime Detection</span>
                </div>
            </footer>
        </div>
    );
}
