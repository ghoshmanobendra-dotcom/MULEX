/**
 * FilterDropdown — Filter suspicious accounts by risk level.
 *
 * Redesigned: Premium styled select with violet accent, matching glassmorphism.
 */
import { useState, useMemo } from 'react';
import { Filter } from 'lucide-react';

const B = { fontFamily: 'Sora, sans-serif' };

export default function FilterDropdown({ accounts, onFilter }) {
    const [level, setLevel] = useState('all');



    const handleChange = (e) => {
        setLevel(e.target.value);
        onFilter(e.target.value);
    };

    const counts = useMemo(() => {
        if (!accounts) return { high: 0, medium: 0, low: 0 };
        return {
            high: accounts.filter(a => a.suspicion_score >= 80).length,
            medium: accounts.filter(a => a.suspicion_score >= 60 && a.suspicion_score < 80).length,
            low: accounts.filter(a => a.suspicion_score < 60 && a.suspicion_score > 0).length,
        };
    }, [accounts]);

    return (
        <div className="flex items-center gap-2.5" style={B}>
            <div className="flex items-center gap-1.5 text-slate-500">
                <Filter size={13} />
                <span className="text-xs font-medium">Risk Level:</span>
            </div>
            <select
                value={level}
                onChange={handleChange}
                className="text-sm text-slate-200 rounded-xl px-3 py-2 outline-none cursor-pointer transition-all appearance-none"
                style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(139,92,246,0.12)',
                    fontFamily: 'Sora, sans-serif',
                }}
                onFocus={(e) => { e.target.style.borderColor = 'rgba(139,92,246,0.4)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'rgba(139,92,246,0.12)'; }}
            >
                <option value="all" style={{ background: '#0d0b1a' }}>All Accounts</option>
                <option value="high" style={{ background: '#0d0b1a' }}>🔴 High (80+) — {counts.high}</option>
                <option value="medium" style={{ background: '#0d0b1a' }}>🟡 Medium (60-79) — {counts.medium}</option>
                <option value="low" style={{ background: '#0d0b1a' }}>🟢 Low (&lt;60) — {counts.low}</option>
            </select>
        </div>
    );
}
