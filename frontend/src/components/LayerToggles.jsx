/**
 * LayerToggles — Toggle detection pattern layers on/off on the graph.
 *
 * Redesigned: Glassmorphism card with animated toggle buttons,
 * glow effect on active state, premium styling.
 */
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Layers } from 'lucide-react';

const H = { fontFamily: 'Outfit, sans-serif' };
const B = { fontFamily: 'Sora, sans-serif' };

const LAYERS = [
    { key: 'cycles', label: 'Cycle Rings', color: '#ef4444', icon: '🔗' },
    { key: 'fan_in', label: 'Fan-In', color: '#f59e0b', icon: '📥' },
    { key: 'fan_out', label: 'Fan-Out', color: '#8b5cf6', icon: '📤' },
    { key: 'passthrough', label: 'Pass-Through', color: '#06b6d4', icon: '💨' },
    { key: 'round_amount', label: 'Round Amount', color: '#ec4899', icon: '💰' },
    { key: 'anomaly', label: 'Anomaly', color: '#f97316', icon: '📊' },
    { key: 'merchant', label: 'Merchants', color: '#10b981', icon: '🏪' },
];

function patternMatchesLayer(pattern, layerKey) {
    if (layerKey === 'cycles') return pattern.startsWith('cycle_length_');
    if (layerKey === 'fan_in') return pattern === 'fan_in';
    if (layerKey === 'fan_out') return pattern === 'fan_out';
    if (layerKey === 'passthrough') return pattern === 'passthrough_shell';
    if (layerKey === 'round_amount') return pattern === 'round_amount_structuring';
    if (layerKey === 'anomaly') return pattern === 'amount_anomaly';
    if (layerKey === 'merchant') return pattern === 'legitimate_merchant';
    return false;
}

export default function LayerToggles({ cyInstance, suspiciousAccounts }) {
    const [active, setActive] = useState(() => {
        const init = {};
        LAYERS.forEach(l => { init[l.key] = true; });
        return init;
    });

    const applyFilters = (filters) => {
        if (!cyInstance) return;

        // Build a map: accountId → patterns
        const patternMap = {};
        (suspiciousAccounts || []).forEach(a => {
            patternMap[a.account_id] = a.detected_patterns || [];
        });

        cyInstance.nodes().forEach(node => {
            const id = node.data('id');
            const patterns = patternMap[id];

            if (!patterns || patterns.length === 0) {
                // Normal account — always visible
                node.style('display', 'element');
                return;
            }

            // Check if any of this account's patterns match an active layer
            const hasActiveMatch = patterns.some(p => {
                for (const layer of LAYERS) {
                    if (filters[layer.key] && patternMatchesLayer(p, layer.key)) {
                        return true;
                    }
                }
                return false;
            });

            node.style('display', hasActiveMatch ? 'element' : 'none');
        });

        // Hide edges connected to hidden nodes
        cyInstance.edges().forEach(edge => {
            const srcVisible = edge.source().style('display') !== 'none';
            const tgtVisible = edge.target().style('display') !== 'none';
            edge.style('display', srcVisible && tgtVisible ? 'element' : 'none');
        });
    };

    const toggle = (key) => {
        setActive(prev => {
            const next = { ...prev, [key]: !prev[key] };
            applyFilters(next);
            return next;
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="relative rounded-2xl overflow-hidden"
            style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(139,92,246,0.1)',
                backdropFilter: 'blur(12px)',
            }}
        >
            <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                    <Layers size={13} className="text-violet-400" />
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider" style={B}>Detection Layers</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                    {LAYERS.map(layer => (
                        <motion.button
                            key={layer.key}
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.96 }}
                            onClick={() => toggle(layer.key)}
                            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer"
                            style={active[layer.key] ? {
                                backgroundColor: layer.color + '22',
                                borderColor: layer.color + '55',
                                border: `1px solid ${layer.color}55`,
                                color: layer.color,
                                boxShadow: `0 0 12px ${layer.color}22`,
                                ...B,
                            } : {
                                border: '1px solid rgba(255,255,255,0.06)',
                                color: '#64748b',
                                background: 'transparent',
                                ...B,
                            }}
                        >
                            <span>{layer.icon}</span>
                            <span>{layer.label}</span>
                        </motion.button>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
