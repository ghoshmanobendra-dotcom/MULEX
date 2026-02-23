/**
 * SummaryDashboard — Summary statistics cards.
 * Shows total accounts, suspicious flagged, fraud rings, and processing time.
 *
 * Redesigned: Animated card entrances, gradient icon backgrounds,
 * premium glassmorphism cards with glow accents.
 */
import { motion } from 'framer-motion';
import { Users, AlertTriangle, Link2, Zap } from 'lucide-react';

const H = { fontFamily: 'Outfit, sans-serif' };
const B = { fontFamily: 'Sora, sans-serif' };

const STATS_CONFIG = [
    { key: 'total_accounts_analyzed', label: 'Total Accounts', icon: Users, gradient: 'from-indigo-500 to-violet-500', glow: 'rgba(99,102,241,0.15)' },
    { key: 'suspicious_accounts_flagged', label: 'Suspicious Flagged', icon: AlertTriangle, gradient: 'from-red-500 to-rose-500', glow: 'rgba(239,68,68,0.15)' },
    { key: 'fraud_rings_detected', label: 'Fraud Rings', icon: Link2, gradient: 'from-amber-500 to-orange-500', glow: 'rgba(245,158,11,0.15)' },
    { key: 'processing_time_seconds', label: 'Processing Time', icon: Zap, gradient: 'from-emerald-500 to-green-500', glow: 'rgba(16,185,129,0.15)', suffix: 's' },
];

export default function SummaryDashboard({ summary }) {
    if (!summary) return null;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {STATS_CONFIG.map((stat, i) => {
                const Icon = stat.icon;
                const value = summary[stat.key];

                return (
                    <motion.div
                        key={stat.key}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45, delay: i * 0.08 }}
                        whileHover={{ y: -3, boxShadow: `0 12px 40px ${stat.glow}` }}
                        className="relative group rounded-2xl overflow-hidden cursor-default"
                        style={{
                            background: 'rgba(255,255,255,0.02)',
                            border: '1px solid rgba(139,92,246,0.1)',
                            backdropFilter: 'blur(12px)',
                        }}
                    >
                        {/* Top gradient line */}
                        <div className={`absolute top-0 left-0 right-0 h-[2px] opacity-40 group-hover:opacity-70 transition-opacity bg-gradient-to-r ${stat.gradient}`} />

                        <div className="p-5 flex items-center gap-4">
                            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}
                                style={{ boxShadow: `0 4px 20px ${stat.glow}` }}>
                                <Icon size={18} className="text-white" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white" style={H}>
                                    {value}{stat.suffix || ''}
                                </p>
                                <p className="text-[11px] text-slate-500 uppercase tracking-wider" style={B}>
                                    {stat.label}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}
