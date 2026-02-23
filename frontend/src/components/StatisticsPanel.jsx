/**
 * StatisticsPanel — Pie chart showing distribution of detected patterns.
 *
 * Redesigned: Premium glassmorphism card, animated legend items,
 * refined donut chart with gradient accents.
 */
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { PieChart } from 'lucide-react';

const H = { fontFamily: 'Outfit, sans-serif' };
const B = { fontFamily: 'Sora, sans-serif' };

const PATTERN_COLORS = {
    'cycle': '#ef4444',
    'fan_in': '#f59e0b',
    'fan_out': '#8b5cf6',
    'passthrough_shell': '#06b6d4',
    'temporal_clustering': '#ec4899',
    'amount_anomaly': '#f97316',
    'round_amount_structuring': '#14b8a6',
    'rapid_dormancy': '#6366f1',
    'layered_chain': '#a855f7',
    'legitimate_merchant': '#10b981',
};

const PATTERN_LABELS = {
    'cycle': 'Cycles',
    'fan_in': 'Fan-In',
    'fan_out': 'Fan-Out',
    'passthrough_shell': 'Pass-Through',
    'temporal_clustering': 'Temporal Burst',
    'amount_anomaly': 'Amount Anomaly',
    'round_amount_structuring': 'Round Amounts',
    'rapid_dormancy': 'Rapid Dormancy',
    'layered_chain': 'Layered Chain',
    'legitimate_merchant': 'Merchant',
};

function normKey(p) {
    if (p.startsWith('cycle_length_')) return 'cycle';
    return p;
}

export default function StatisticsPanel({ suspiciousAccounts }) {
    const stats = useMemo(() => {
        if (!suspiciousAccounts) return [];
        const counts = {};
        suspiciousAccounts.forEach(a => {
            (a.detected_patterns || []).forEach(p => {
                const k = normKey(p);
                counts[k] = (counts[k] || 0) + 1;
            });
        });
        return Object.entries(counts)
            .map(([key, count]) => ({
                key,
                count,
                label: PATTERN_LABELS[key] || key,
                color: PATTERN_COLORS[key] || '#94a3b8',
            }))
            .sort((a, b) => b.count - a.count);
    }, [suspiciousAccounts]);

    const total = stats.reduce((s, v) => s + v.count, 0);

    if (!stats.length) return null;

    // SVG donut chart
    const radius = 60;
    const circumference = 2 * Math.PI * radius;

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative rounded-2xl overflow-hidden"
            style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(139,92,246,0.1)',
                backdropFilter: 'blur(12px)',
            }}
        >
            {/* Top accent */}
            <div className="absolute top-0 left-0 right-0 h-[2px] opacity-40"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.5), rgba(168,85,247,0.4), transparent)' }} />

            <div className="p-6">
                <div className="flex items-center gap-2.5 mb-5">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-violet-500/15 flex items-center justify-center">
                        <PieChart size={14} className="text-violet-400" />
                    </div>
                    <h2 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-violet-200" style={H}>
                        Pattern Distribution
                    </h2>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-8">
                    {/* Donut Chart */}
                    <div className="relative flex-shrink-0">
                        <svg width="160" height="160" viewBox="0 0 160 160">
                            {stats.map((item, index) => {
                                const pct = item.count / total;
                                const dash = circumference * pct;
                                const gap = circumference - dash;
                                const currentOffset = stats.slice(0, index).reduce((sum, prevItem) => sum + (circumference * (prevItem.count / total)), 0);

                                return (
                                    <circle
                                        key={item.key}
                                        cx="80" cy="80" r={radius}
                                        fill="none"
                                        stroke={item.color}
                                        strokeWidth="20"
                                        strokeDasharray={`${dash} ${gap}`}
                                        strokeDashoffset={-currentOffset}
                                        className="transition-all duration-500"
                                        style={{ filter: `drop-shadow(0 0 6px ${item.color}44)` }}
                                    />
                                );
                            })}
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-white" style={H}>{total}</p>
                                <p className="text-[10px] text-slate-500 uppercase tracking-wider" style={B}>Patterns</p>
                            </div>
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 flex-1">
                        {stats.map((item, i) => (
                            <motion.div
                                key={item.key}
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 + i * 0.04 }}
                                className="flex items-center gap-2.5 group"
                            >
                                <div className="w-3 h-3 rounded-full flex-shrink-0 ring-2 ring-transparent group-hover:ring-white/20 transition-all"
                                    style={{ backgroundColor: item.color, boxShadow: `0 0 8px ${item.color}66` }} />
                                <span className="text-sm text-slate-400 group-hover:text-slate-200 transition-colors" style={B}>{item.label}</span>
                                <span className="text-sm font-bold text-white ml-auto" style={H}>{item.count}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
