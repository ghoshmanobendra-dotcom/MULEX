/**
 * UserHistoryPage — View personal upload history.
 * Premium dark luxury aesthetic matching landing page.
 */
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Clock, ArrowLeft, LogOut, FileText, AlertTriangle,
    Activity, Radar, User, Download, Search, Filter,
} from 'lucide-react';

// In Vercel, we use relative paths (/api/...) that map to the serverless functions
const API = import.meta.env.VITE_API_URL || '/api';
const H = { fontFamily: 'Outfit, sans-serif' };
const B = { fontFamily: 'Sora, sans-serif' };

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };

export default function UserHistoryPage() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterAction, setFilterAction] = useState('all');

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await fetch(`${API}/user/history`, {
                    headers: { Authorization: `Bearer ${user?.token}` },
                });
                if (res.ok) setHistory(await res.json());
            } catch (err) {
                console.error('Failed to fetch history:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [user?.token]);

    const handleLogout = () => {
        logout();
        navigate('/login', { replace: true });
    };

    const filteredHistory = history.filter((h) => {
        const matchSearch = !searchTerm ||
            (h.file_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            h.action.toLowerCase().includes(searchTerm.toLowerCase());
        const matchFilter = filterAction === 'all' || h.action === filterAction;
        return matchSearch && matchFilter;
    });

    const uniqueActions = [...new Set(history.map((h) => h.action))];

    const actionStyle = (action) => {
        switch (action) {
            case 'upload_csv': return { bg: 'rgba(16,185,129,0.12)', color: '#6ee7b7', border: 'rgba(16,185,129,0.2)', icon: FileText, emoji: '📊' };
            case 'login': return { bg: 'rgba(99,102,241,0.12)', color: '#a5b4fc', border: 'rgba(99,102,241,0.2)', icon: User, emoji: '🔑' };
            default: return { bg: 'rgba(245,158,11,0.12)', color: '#fcd34d', border: 'rgba(245,158,11,0.2)', icon: Activity, emoji: '⚡' };
        }
    };

    return (
        <div className="min-h-screen text-white selection:bg-violet-500/30" style={{ background: '#07070a', ...B }}>
            {/* Background orbs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-violet-600/[0.04] blur-[180px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-fuchsia-600/[0.03] blur-[160px] rounded-full" />
                <div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] bg-cyan-500/[0.02] blur-[140px] rounded-full" />
            </div>

            <div className="relative z-10">
                {/* Top nav */}
                <motion.header
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="sticky top-0 z-40 border-b border-white/[0.06]"
                    style={{ backdropFilter: 'blur(20px)', background: 'rgba(7,7,10,0.8)' }}
                >
                    <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <motion.div
                                animate={{ boxShadow: ['0 0 10px rgba(139,92,246,0.25)', '0 0 20px rgba(139,92,246,0.4)', '0 0 10px rgba(139,92,246,0.25)'] }}
                                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                                className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center"
                            >
                                <Clock size={16} className="text-white" />
                            </motion.div>
                            <div>
                                <h1 className="text-base font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-violet-200 to-fuchsia-300" style={H}>
                                    My History
                                </h1>
                                <p className="text-[10px] text-slate-600 tracking-wider uppercase">Upload & Activity Log</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate('/dashboard')}
                                className="flex items-center gap-1.5 px-3 py-2 text-xs text-slate-400 hover:text-white rounded-xl transition-all cursor-pointer"
                                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', ...B }}
                            >
                                <ArrowLeft size={13} />
                                Dashboard
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleLogout}
                                className="p-2 text-red-400 hover:bg-red-500/10 rounded-xl transition-all cursor-pointer"
                            >
                                <LogOut size={14} />
                            </motion.button>
                        </div>
                    </div>
                </motion.header>

                <main className="max-w-5xl mx-auto px-6 py-8">
                    <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-5">
                        {/* Header */}
                        <motion.div variants={fadeUp} className="flex items-center justify-between flex-wrap gap-3">
                            <div>
                                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-violet-200 to-fuchsia-300" style={H}>
                                    Activity History
                                </h2>
                                <p className="text-sm text-slate-500 mt-0.5" style={B}>{history.length} total actions</p>
                            </div>
                        </motion.div>

                        {/* Stats Row */}
                        <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {[
                                { label: 'Total Actions', value: history.length, gradient: 'from-indigo-500 to-violet-500', glow: 'rgba(99,102,241,0.15)' },
                                { label: 'Uploads', value: history.filter(h => h.action === 'upload_csv').length, gradient: 'from-emerald-500 to-green-500', glow: 'rgba(16,185,129,0.15)' },
                                { label: 'Logins', value: history.filter(h => h.action === 'login').length, gradient: 'from-cyan-500 to-blue-500', glow: 'rgba(6,182,212,0.15)' },
                            ].map((stat, i) => (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 + i * 0.05 }}
                                    whileHover={{ y: -2, boxShadow: `0 8px 30px ${stat.glow}` }}
                                    className="rounded-xl p-4 relative overflow-hidden cursor-default"
                                    style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(139,92,246,0.1)', backdropFilter: 'blur(12px)' }}
                                >
                                    <div className={`absolute top-0 left-0 right-0 h-[2px] opacity-40 bg-gradient-to-r ${stat.gradient}`} />
                                    <p className="text-xl font-bold text-white" style={H}>{stat.value}</p>
                                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5" style={B}>{stat.label}</p>
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Search & Filter */}
                        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3">
                            <div className="relative flex-1">
                                <Search size={14} className="absolute left-3.5 top-3 text-slate-600" />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search by file name or action..."
                                    className="w-full rounded-xl py-2.5 pl-10 pr-4 text-white text-sm focus:outline-none transition-all placeholder-slate-600"
                                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(139,92,246,0.12)', ...B }}
                                    onFocus={(e) => { e.target.style.borderColor = 'rgba(139,92,246,0.4)'; e.target.style.boxShadow = '0 0 20px rgba(139,92,246,0.08)'; }}
                                    onBlur={(e) => { e.target.style.borderColor = 'rgba(139,92,246,0.12)'; e.target.style.boxShadow = 'none'; }}
                                />
                            </div>
                            <div className="relative">
                                <Filter size={13} className="absolute left-3 top-3 text-slate-600" />
                                <select
                                    value={filterAction}
                                    onChange={(e) => setFilterAction(e.target.value)}
                                    className="rounded-xl py-2.5 pl-9 pr-8 text-white text-sm focus:outline-none transition-all appearance-none cursor-pointer"
                                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(139,92,246,0.12)', ...B }}
                                >
                                    <option value="all" style={{ background: '#0a081e' }}>All Actions</option>
                                    {uniqueActions.map(a => (
                                        <option key={a} value={a} style={{ background: '#0a081e' }}>{a.replace(/_/g, ' ')}</option>
                                    ))}
                                </select>
                            </div>
                        </motion.div>

                        {/* History Table */}
                        {loading ? (
                            <motion.div variants={fadeUp} className="text-center py-20">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                                    className="w-8 h-8 border-2 border-violet-500/20 border-t-violet-500 rounded-full mx-auto mb-3"
                                />
                                <p className="text-slate-500 text-sm" style={B}>Loading history...</p>
                            </motion.div>
                        ) : (
                            <motion.div variants={fadeUp} className="rounded-2xl overflow-hidden"
                                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(139,92,246,0.1)', backdropFilter: 'blur(12px)' }}>
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr>
                                                {['Action', 'File', 'Details', 'Timestamp'].map((h, i) => (
                                                    <th key={i} className="px-5 py-3.5 text-left text-[11px] uppercase tracking-wider font-semibold text-violet-400"
                                                        style={{ background: 'rgba(139,92,246,0.06)', ...B, borderBottom: '1px solid rgba(139,92,246,0.08)' }}>
                                                        {h}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredHistory.map((h, i) => {
                                                const style = actionStyle(h.action);
                                                return (
                                                    <motion.tr
                                                        key={h.id}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: i * 0.03 }}
                                                        className="hover:bg-white/[0.02] transition-colors"
                                                    >
                                                        <td className="px-5 py-3.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                                            <span className="px-2.5 py-1 rounded-full text-[11px] font-medium"
                                                                style={{ background: style.bg, color: style.color, border: `1px solid ${style.border}` }}>
                                                                {style.emoji} {h.action.replace(/_/g, ' ')}
                                                            </span>
                                                        </td>
                                                        <td className="px-5 py-3.5 text-slate-400 text-sm" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', ...B }}>
                                                            {h.file_name || '—'}
                                                        </td>
                                                        <td className="px-5 py-3.5 text-slate-600 text-xs max-w-xs truncate" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', ...B }}>
                                                            {h.details || '—'}
                                                        </td>
                                                        <td className="px-5 py-3.5 text-slate-600 text-xs" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', ...B }}>
                                                            {h.timestamp ? new Date(h.timestamp).toLocaleString() : 'N/A'}
                                                        </td>
                                                    </motion.tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                                {filteredHistory.length === 0 && (
                                    <div className="text-center py-16">
                                        <Clock size={36} className="mx-auto mb-3 text-slate-700" />
                                        <p className="text-slate-600 text-sm" style={B}>
                                            {history.length === 0 ? 'No activity yet — start by uploading a CSV!' : 'No results match your filter'}
                                        </p>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </motion.div>
                </main>

                {/* Footer */}
                <footer className="border-t border-white/[0.04] mt-8">
                    <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <img src="/logo.png" alt="MuleX" className="h-6 w-auto object-contain" />
                        </div>
                        <span className="text-slate-700 text-[10px]" style={B}>Money Muling Detection Engine</span>
                    </div>
                </footer>
            </div>
        </div>
    );
}
