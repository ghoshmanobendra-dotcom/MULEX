/**
 * SuspiciousTable — Sortable table of suspicious accounts.
 * Shows account ID, suspicion score, detected patterns, and ring ID.
 *
 * Redesigned: Premium glassmorphism card with gradient header accent,
 * animated hover rows, refined badges.
 */
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

const H = { fontFamily: 'Outfit, sans-serif' };
const B = { fontFamily: 'Sora, sans-serif' };

export default function SuspiciousTable({ accounts }) {
    const [sortField, setSortField] = useState('suspicion_score');
    const [sortDir, setSortDir] = useState('desc');

    const sorted = useMemo(() => {
        if (!accounts) return [];
        return [...accounts].sort((a, b) => {
            const aVal = a[sortField];
            const bVal = b[sortField];
            if (typeof aVal === 'number') return sortDir === 'desc' ? bVal - aVal : aVal - bVal;
            return sortDir === 'desc'
                ? String(bVal).localeCompare(String(aVal))
                : String(aVal).localeCompare(String(bVal));
        });
    }, [accounts, sortField, sortDir]);

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDir((d) => (d === 'desc' ? 'asc' : 'desc'));
        } else {
            setSortField(field);
            setSortDir('desc');
        }
    };

    const getScoreStyle = (score) => {
        if (score >= 80) return { bg: 'rgba(239,68,68,0.15)', color: '#fca5a5', border: 'rgba(239,68,68,0.25)' };
        if (score >= 60) return { bg: 'rgba(245,158,11,0.15)', color: '#fcd34d', border: 'rgba(245,158,11,0.25)' };
        return { bg: 'rgba(16,185,129,0.15)', color: '#6ee7b7', border: 'rgba(16,185,129,0.25)' };
    };

    if (!accounts || accounts.length === 0) return null;

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
                style={{ background: 'linear-gradient(90deg, transparent, rgba(239,68,68,0.5), rgba(245,158,11,0.4), transparent)' }} />

            <div className="p-6">
                <div className="flex items-center gap-2.5 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500/20 to-rose-500/20 border border-red-500/15 flex items-center justify-center">
                        <AlertTriangle size={14} className="text-red-400" />
                    </div>
                    <h2 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-red-200" style={H}>
                        Suspicious Accounts ({accounts.length})
                    </h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr>
                                {[
                                    { field: 'account_id', label: 'Account ID' },
                                    { field: 'suspicion_score', label: 'Score' },
                                    { field: null, label: 'Detected Patterns' },
                                    { field: null, label: 'Ring ID' },
                                ].map((col, i) => (
                                    <th
                                        key={i}
                                        onClick={col.field ? () => handleSort(col.field) : undefined}
                                        className={`px-4 py-3 text-left text-[11px] uppercase tracking-wider font-semibold text-violet-400 ${col.field ? 'cursor-pointer select-none hover:text-violet-300' : ''}`}
                                        style={{ background: 'rgba(139,92,246,0.08)', ...B, borderBottom: '1px solid rgba(139,92,246,0.1)' }}
                                    >
                                        {col.label}
                                        {col.field && sortField === col.field && (
                                            <span className="ml-1">{sortDir === 'desc' ? '↓' : '↑'}</span>
                                        )}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {sorted.map((acc) => {
                                const scoreStyle = getScoreStyle(acc.suspicion_score);
                                return (
                                    <tr key={acc.account_id} className="group hover:bg-white/[0.02] transition-colors">
                                        <td className="px-4 py-3 font-mono font-medium text-sm text-violet-300" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                            {acc.account_id}
                                        </td>
                                        <td className="px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                            <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-bold"
                                                style={{ background: scoreStyle.bg, color: scoreStyle.color, border: `1px solid ${scoreStyle.border}` }}>
                                                {acc.suspicion_score}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                            {acc.detected_patterns.map((p) => (
                                                <span key={p} className="inline-block text-[11px] px-2 py-0.5 rounded-full mr-1 mb-0.5"
                                                    style={{ background: 'rgba(139,92,246,0.12)', color: '#a5b4fc', border: '1px solid rgba(139,92,246,0.15)' }}>
                                                    {p}
                                                </span>
                                            ))}
                                        </td>
                                        <td className="px-4 py-3 font-mono text-sm text-red-400" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                            {acc.ring_id || '—'}
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
