/**
 * JsonDownload — Button to download the full analysis result as a .json file.
 * Redesigned: Premium gradient button with violet accent.
 */
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';

const B = { fontFamily: 'Sora, sans-serif' };

export default function JsonDownload({ result }) {
    if (!result) return null;

    const handleDownload = () => {
        // Build JSON in the exact specification format
        const exportData = {
            suspicious_accounts: (result.suspicious_accounts || []).map((a) => ({
                account_id: a.account_id,
                suspicion_score: a.suspicion_score,
                detected_patterns: a.detected_patterns || [],
                ring_id: a.ring_id || null,
            })),
            fraud_rings: (result.fraud_rings || []).map((r) => ({
                ring_id: r.ring_id,
                member_accounts: r.member_accounts || [],
                pattern_type: r.pattern_type || 'cycle',
                risk_score: r.risk_score,
            })),
            summary: {
                total_accounts_analyzed: result.summary?.total_accounts_analyzed || 0,
                suspicious_accounts_flagged: result.summary?.suspicious_accounts_flagged || 0,
                fraud_rings_detected: result.summary?.fraud_rings_detected || 0,
                processing_time_seconds: result.summary?.processing_time_seconds || 0,
            },
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
            type: 'application/json',
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `fraud-analysis-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <motion.button
            whileHover={{ scale: 1.03, boxShadow: '0 0 30px rgba(139,92,246,0.25)' }}
            whileTap={{ scale: 0.97 }}
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-sm font-medium rounded-xl transition-all shadow-lg shadow-violet-900/20 cursor-pointer"
            style={B}
        >
            <Download size={14} />
            <span>Download JSON</span>
        </motion.button>
    );
}
