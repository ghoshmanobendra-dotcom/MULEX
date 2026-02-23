/**
 * FraudRingsTable — Table of detected fraud rings.
 * Shows ring ID, member accounts, pattern type, and risk score.
 *
 * Redesigned: Premium glassmorphism card, gradient accent, refined badges.
 */
import { motion } from 'framer-motion';
import { Link2 } from 'lucide-react';

const H = { fontFamily: 'Outfit, sans-serif' };
const B = { fontFamily: 'Sora, sans-serif' };

export default function FraudRingsTable({ rings }) {
    const getScoreStyle = (score) => {
        if (score >= 80) return { bg: 'rgba(239,68,68,0.15)', color: '#fca5a5', border: 'rgba(239,68,68,0.25)' };
        if (score >= 60) return { bg: 'rgba(245,158,11,0.15)', color: '#fcd34d', border: 'rgba(245,158,11,0.25)' };
        return { bg: 'rgba(16,185,129,0.15)', color: '#6ee7b7', border: 'rgba(16,185,129,0.25)' };
    };

    if (!rings || rings.length === 0) return null;

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
            <div className="absolute top-0 left-0 right-0 h-[2px] opacity-40"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.5), rgba(239,68,68,0.4), transparent)' }} />

            <div className="p-6">
                <div className="flex items-center gap-2.5 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/15 flex items-center justify-center">
                        <Link2 size={14} className="text-amber-400" />
                    </div>
                    <h2 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-amber-200" style={H}>
                        Fraud Rings Detected ({rings.length})
                    </h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr>
                                {['Ring ID', 'Members', 'Pattern', 'Risk Score'].map((label, i) => (
                                    <th key={i} className="px-4 py-3 text-left text-[11px] uppercase tracking-wider font-semibold text-violet-400"
                                        style={{ background: 'rgba(139,92,246,0.08)', ...B, borderBottom: '1px solid rgba(139,92,246,0.1)' }}>
                                        {label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {rings.map((ring) => {
                                const scoreStyle = getScoreStyle(ring.risk_score);
                                return (
                                    <tr key={ring.ring_id} className="group hover:bg-white/[0.02] transition-colors">
                                        <td className="px-4 py-3 font-mono font-bold text-sm text-red-400" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                            {ring.ring_id}
                                        </td>
                                        <td className="px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                            <div className="flex flex-wrap gap-1">
                                                {ring.member_accounts.map((acc) => (
                                                    <span key={acc} className="inline-block text-[11px] font-mono px-2 py-0.5 rounded-full"
                                                        style={{ background: 'rgba(239,68,68,0.1)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.15)' }}>
                                                        {acc}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                            <span className="inline-block text-[11px] capitalize px-2 py-0.5 rounded-full"
                                                style={{ background: 'rgba(168,85,247,0.12)', color: '#c4b5fd', border: '1px solid rgba(168,85,247,0.18)' }}>
                                                {ring.pattern_type}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                            <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-bold"
                                                style={{ background: scoreStyle.bg, color: scoreStyle.color, border: `1px solid ${scoreStyle.border}` }}>
                                                {ring.risk_score}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
}
