/* eslint-disable react-refresh/only-export-components */
/**
 * UploadHistory — Shows previously uploaded analyses stored in localStorage.
 * Redesigned: Premium dropdown with glassmorphism and animated entries.
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Trash2, AlertTriangle, Link2 } from 'lucide-react';

const H = { fontFamily: 'Outfit, sans-serif' };
const B = { fontFamily: 'Sora, sans-serif' };

const STORAGE_KEY = 'mule_detection_history';
const MAX_HISTORY = 10;

export function saveToHistory(result, fileName) {
    try {
        const history = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        history.unshift({
            id: Date.now(),
            fileName,
            timestamp: new Date().toISOString(),
            summary: result.summary,
            suspiciousCount: result.suspicious_accounts?.length || 0,
            ringsCount: result.fraud_rings?.length || 0,
            fullResult: result,
        });
        // Keep last MAX_HISTORY
        if (history.length > MAX_HISTORY) history.length = MAX_HISTORY;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (e) {
        console.warn('Failed to save history:', e);
    }
}

export default function UploadHistory({ onLoadResult }) {
    const [history, setHistory] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        } catch {
            return [];
        }
    });
    const [isOpen, setIsOpen] = useState(false);

    const loadEntry = (entry) => {
        if (entry.fullResult) {
            onLoadResult(entry.fullResult);
            setIsOpen(false);
        }
    };

    const clearHistory = () => {
        localStorage.removeItem(STORAGE_KEY);
        setHistory([]);
    };

    const formatDate = (iso) => {
        const d = new Date(iso);
        return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    if (history.length === 0 && !isOpen) return null;

    return (
        <div className="relative">
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1.5 px-3 py-2 text-xs rounded-xl transition-all cursor-pointer"
                style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(139,92,246,0.1)',
                    color: isOpen ? '#a5b4fc' : '#94a3b8',
                    ...B,
                }}
            >
                <Clock size={13} />
                <span>History ({history.length})</span>
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 top-12 z-50 w-80 rounded-2xl p-4 shadow-2xl"
                        style={{
                            background: 'rgba(10,8,30,0.95)',
                            border: '1px solid rgba(139,92,246,0.15)',
                            backdropFilter: 'blur(20px)',
                        }}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-bold text-slate-300" style={H}>Upload History</h3>
                            {history.length > 0 && (
                                <button onClick={clearHistory} className="flex items-center gap-1 text-[10px] text-red-400 hover:text-red-300 cursor-pointer">
                                    <Trash2 size={10} />
                                    Clear
                                </button>
                            )}
                        </div>
                        {history.length === 0 ? (
                            <p className="text-xs text-slate-600" style={B}>No previous uploads</p>
                        ) : (
                            <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                                {history.map((entry, i) => (
                                    <motion.button
                                        key={entry.id}
                                        initial={{ opacity: 0, x: -8 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.03 }}
                                        onClick={() => loadEntry(entry)}
                                        className="w-full text-left p-3 rounded-xl transition-all cursor-pointer group"
                                        style={{
                                            background: 'rgba(255,255,255,0.02)',
                                            border: '1px solid rgba(255,255,255,0.04)',
                                        }}
                                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(139,92,246,0.2)'; e.currentTarget.style.background = 'rgba(139,92,246,0.05)'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.04)'; e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
                                    >
                                        <p className="text-sm font-medium text-violet-300 truncate" style={H}>{entry.fileName}</p>
                                        <div className="flex gap-3 mt-1 text-[10px] text-slate-500" style={B}>
                                            <span className="flex items-center gap-1">
                                                <AlertTriangle size={9} /> {entry.suspiciousCount}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Link2 size={9} /> {entry.ringsCount}
                                            </span>
                                            <span>{formatDate(entry.timestamp)}</span>
                                        </div>
                                    </motion.button>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
