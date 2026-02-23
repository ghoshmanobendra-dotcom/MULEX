/**
 * GraphVisualization — Interactive Cytoscape.js directed graph.
 *
 * - Normal accounts = blue nodes
 * - Suspicious accounts = red nodes
 * - Fraud ring members = larger red nodes with glow
 * - Click node → shows account details
 * - Hover node → highlights connections
 * - Exposes cy instance via onCyReady callback
 *
 * Redesigned: Premium glassmorphism card, gradient header, glowing node detail panel.
 */
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Network, User, AlertTriangle, ZoomIn, ZoomOut, Maximize, RotateCcw } from 'lucide-react';
import cytoscape from 'cytoscape';

const H = { fontFamily: 'Outfit, sans-serif' };
const B = { fontFamily: 'Sora, sans-serif' };

export default function GraphVisualization({ graphData, suspiciousAccounts, onCyReady }) {
    const containerRef = useRef(null);
    const cyRef = useRef(null);
    const [selectedNode, setSelectedNode] = useState(null);
    const [zoomLevel, setZoomLevel] = useState(1);

    useEffect(() => {
        if (!graphData || !containerRef.current) return;

        // Destroy previous instance cleanly
        if (cyRef.current) {
            cyRef.current.destroy();
            cyRef.current = null;
        }

        let destroyed = false;
        let layout = null;

        // Build elements
        const elements = [];
        graphData.nodes.forEach((node) => {
            elements.push({
                data: {
                    id: node.id,
                    label: node.id,
                    isSuspicious: node.is_suspicious,
                    isFraudRing: node.is_fraud_ring_member,
                    score: node.suspicion_score,
                    ringIds: node.ring_ids || [],
                },
            });
        });
        graphData.edges.forEach((edge, idx) => {
            elements.push({
                data: {
                    id: `edge-${idx}`,
                    source: edge.source,
                    target: edge.target,
                    amount: edge.amount,
                    txId: edge.transaction_id,
                    timestamp: edge.timestamp,
                },
            });
        });

        const cy = cytoscape({
            container: containerRef.current,
            elements,
            style: [
                {
                    selector: 'node',
                    style: {
                        label: 'data(label)',
                        'text-valign': 'bottom',
                        'text-halign': 'center',
                        'font-size': '10px',
                        color: '#94a3b8',
                        'text-margin-y': 8,
                        'background-color': '#6366f1',
                        width: 30,
                        height: 30,
                        'border-width': 2,
                        'border-color': '#818cf8',
                        'transition-property': 'background-color, width, height, border-color, opacity',
                        'transition-duration': '0.2s',
                    },
                },
                {
                    selector: 'node[?isSuspicious]',
                    style: {
                        'background-color': '#ef4444',
                        'border-color': '#f87171',
                        width: 35,
                        height: 35,
                    },
                },
                {
                    selector: 'node[?isFraudRing]',
                    style: {
                        'background-color': '#dc2626',
                        'border-color': '#fca5a5',
                        'border-width': 3,
                        width: 45,
                        height: 45,
                        'font-size': '11px',
                        'font-weight': 'bold',
                        color: '#fca5a5',
                    },
                },
                {
                    selector: 'edge',
                    style: {
                        width: 2,
                        'line-color': 'rgba(99, 102, 241, 0.4)',
                        'target-arrow-color': 'rgba(99, 102, 241, 0.6)',
                        'target-arrow-shape': 'triangle',
                        'curve-style': 'bezier',
                        'arrow-scale': 1.2,
                        'transition-property': 'line-color, target-arrow-color, width, opacity',
                        'transition-duration': '0.2s',
                    },
                },
                {
                    selector: '.highlighted',
                    style: {
                        'background-color': '#f59e0b',
                        'border-color': '#fbbf24',
                        width: 40,
                        height: 40,
                    },
                },
                {
                    selector: '.highlighted-edge',
                    style: {
                        'line-color': '#f59e0b',
                        'target-arrow-color': '#f59e0b',
                        width: 3,
                    },
                },
                {
                    selector: '.dimmed',
                    style: { opacity: 0.2 },
                },
                {
                    selector: '.search-highlight',
                    style: {
                        'background-color': '#22d3ee',
                        'border-color': '#67e8f9',
                        'border-width': 4,
                        width: 50,
                        height: 50,
                        'z-index': 999,
                    },
                },
                {
                    selector: '.search-dimmed',
                    style: { opacity: 0.15 },
                },
            ],
            layout: { name: 'preset' },
            minZoom: 0.3,
            maxZoom: 3,
        });

        // Run layout
        layout = cy.layout({
            name: 'cose',
            animate: true,
            animationDuration: 800,
            nodeRepulsion: () => 8000,
            idealEdgeLength: () => 120,
            padding: 40,
            stop: () => { layout = null; },
        });
        if (!destroyed) layout.run();

        // Click node
        cy.on('tap', 'node', (e) => {
            if (destroyed) return;
            const node = e.target;
            const data = node.data();
            const account = suspiciousAccounts?.find((a) => a.account_id === data.id);
            setSelectedNode({
                id: data.id,
                score: data.score,
                isSuspicious: data.isSuspicious,
                isFraudRing: data.isFraudRing,
                ringIds: data.ringIds,
                patterns: account?.detected_patterns || [],
            });
        });

        // Click background
        cy.on('tap', (e) => {
            if (destroyed) return;
            if (e.target === cy) setSelectedNode(null);
        });

        // Hover
        cy.on('mouseover', 'node', (e) => {
            if (destroyed) return;
            const node = e.target;
            const neighborhood = node.neighborhood().add(node);
            cy.elements().addClass('dimmed');
            neighborhood.removeClass('dimmed');
            node.connectedEdges().addClass('highlighted-edge');
            neighborhood.nodes().not(node).addClass('highlighted');
        });
        cy.on('mouseout', 'node', () => {
            if (destroyed) return;
            cy.elements().removeClass('dimmed highlighted highlighted-edge');
        });

        cyRef.current = cy;

        // Track zoom level
        cy.on('zoom', () => {
            if (!destroyed) setZoomLevel(cy.zoom());
        });

        // Notify parent that cy is ready
        if (onCyReady) onCyReady(cy);

        return () => {
            destroyed = true;
            if (layout) layout.stop();
            cy.removeAllListeners();
            cy.destroy();
            cyRef.current = null;
            if (onCyReady) onCyReady(null);
        };
    }, [graphData, suspiciousAccounts, onCyReady]);

    // Zoom control handlers
    const handleZoomIn = () => {
        const cy = cyRef.current;
        if (!cy) return;
        cy.animate({ zoom: { level: cy.zoom() * 1.3, renderedPosition: { x: cy.width() / 2, y: cy.height() / 2 } } }, { duration: 300 });
    };
    const handleZoomOut = () => {
        const cy = cyRef.current;
        if (!cy) return;
        cy.animate({ zoom: { level: cy.zoom() / 1.3, renderedPosition: { x: cy.width() / 2, y: cy.height() / 2 } } }, { duration: 300 });
    };
    const handleFit = () => {
        const cy = cyRef.current;
        if (!cy) return;
        cy.animate({ fit: { padding: 40 } }, { duration: 400 });
    };
    const handleReset = () => {
        const cy = cyRef.current;
        if (!cy) return;
        cy.animate({ zoom: 1, center: { eles: cy.elements() } }, { duration: 400 });
    };

    if (!graphData) return null;

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
                style={{ background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.5), rgba(139,92,246,0.4), transparent)' }} />

            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/15 flex items-center justify-center">
                            <Network size={14} className="text-indigo-400" />
                        </div>
                        <h2 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-indigo-200" style={H}>
                            Transaction Graph
                        </h2>
                    </div>
                    <div className="flex items-center gap-4 text-xs" style={B}>
                        <span className="flex items-center gap-1.5">
                            <span className="w-3 h-3 rounded-full bg-indigo-500 inline-block" style={{ boxShadow: '0 0 8px rgba(99,102,241,0.4)' }} />
                            <span className="text-slate-500">Normal</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="w-3 h-3 rounded-full bg-red-500 inline-block" style={{ boxShadow: '0 0 8px rgba(239,68,68,0.4)' }} />
                            <span className="text-slate-500">Suspicious</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="w-4 h-4 rounded-full bg-red-700 border-2 border-red-300 inline-block" style={{ boxShadow: '0 0 8px rgba(220,38,38,0.4)' }} />
                            <span className="text-slate-500">Fraud Ring</span>
                        </span>
                    </div>
                </div>

                <div className="relative">
                    <div ref={containerRef} className="w-full h-[500px] rounded-xl"
                        style={{ background: 'rgba(5,2,8,0.7)', border: '1px solid rgba(99,102,241,0.08)' }} />

                    {/* ── Zoom Controls ── */}
                    <div className="absolute bottom-4 right-4 flex flex-col items-center gap-1.5 z-20">
                        {/* Zoom level badge */}
                        <div className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold text-violet-300 mb-1"
                            style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)' }}>
                            {Math.round(zoomLevel * 100)}%
                        </div>
                        {/* Buttons */}
                        {/* Buttons statically declared to avoid react-hooks/refs complaining about inline map capturing handler */}
                        <button
                            onClick={handleZoomIn}
                            title="Zoom In"
                            className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-white transition-all duration-200 cursor-pointer"
                            style={{ background: 'rgba(15,10,25,0.8)', border: '1px solid rgba(99,102,241,0.15)', backdropFilter: 'blur(8px)' }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(139,92,246,0.4)'; e.currentTarget.style.boxShadow = '0 0 12px rgba(139,92,246,0.2)'; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.15)'; e.currentTarget.style.boxShadow = 'none'; }}
                        >
                            <ZoomIn size={16} />
                        </button>
                        <button
                            onClick={handleZoomOut}
                            title="Zoom Out"
                            className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-white transition-all duration-200 cursor-pointer"
                            style={{ background: 'rgba(15,10,25,0.8)', border: '1px solid rgba(99,102,241,0.15)', backdropFilter: 'blur(8px)' }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(139,92,246,0.4)'; e.currentTarget.style.boxShadow = '0 0 12px rgba(139,92,246,0.2)'; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.15)'; e.currentTarget.style.boxShadow = 'none'; }}
                        >
                            <ZoomOut size={16} />
                        </button>
                        <button
                            onClick={handleFit}
                            title="Fit to Screen"
                            className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-white transition-all duration-200 cursor-pointer"
                            style={{ background: 'rgba(15,10,25,0.8)', border: '1px solid rgba(99,102,241,0.15)', backdropFilter: 'blur(8px)' }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(139,92,246,0.4)'; e.currentTarget.style.boxShadow = '0 0 12px rgba(139,92,246,0.2)'; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.15)'; e.currentTarget.style.boxShadow = 'none'; }}
                        >
                            <Maximize size={16} />
                        </button>
                        <button
                            onClick={handleReset}
                            title="Reset Zoom"
                            className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-white transition-all duration-200 cursor-pointer"
                            style={{ background: 'rgba(15,10,25,0.8)', border: '1px solid rgba(99,102,241,0.15)', backdropFilter: 'blur(8px)' }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(139,92,246,0.4)'; e.currentTarget.style.boxShadow = '0 0 12px rgba(139,92,246,0.2)'; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.15)'; e.currentTarget.style.boxShadow = 'none'; }}
                        >
                            <RotateCcw size={16} />
                        </button>
                    </div>

                    {/* Zoom hint (bottom-left) */}
                    <div className="absolute bottom-4 left-4 text-[10px] text-slate-600 font-mono z-20" style={B}>
                        Scroll to zoom · Drag to pan
                    </div>
                </div>

                {selectedNode && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 p-4 rounded-xl"
                        style={{
                            background: 'rgba(99,102,241,0.06)',
                            border: '1px solid rgba(99,102,241,0.15)',
                        }}
                    >
                        <h3 className="font-bold text-violet-300 mb-3 flex items-center gap-2" style={H}>
                            <User size={14} />
                            Account: {selectedNode.id}
                        </h3>
                        <div className="grid grid-cols-2 gap-2 text-sm" style={B}>
                            <div>
                                <span className="text-slate-500">Score: </span>
                                <span className={`font-bold ${selectedNode.score >= 60 ? 'text-red-400' : 'text-green-400'}`}>
                                    {selectedNode.score}
                                </span>
                            </div>
                            <div>
                                <span className="text-slate-500">Status: </span>
                                <span className={selectedNode.isSuspicious ? 'text-red-400' : 'text-green-400'}>
                                    {selectedNode.isSuspicious ? '⚠ Suspicious' : '✓ Normal'}
                                </span>
                            </div>
                            {selectedNode.isFraudRing && (
                                <div className="col-span-2">
                                    <span className="text-slate-500">Fraud Ring: </span>
                                    <span className="text-red-400 font-mono">
                                        {selectedNode.ringIds.join(', ')}
                                    </span>
                                </div>
                            )}
                            {selectedNode.patterns.length > 0 && (
                                <div className="col-span-2">
                                    <span className="text-slate-500">Patterns: </span>
                                    {selectedNode.patterns.map((p) => (
                                        <span key={p} className="inline-block text-[11px] px-2 py-0.5 rounded-full mr-1 mb-1"
                                            style={{ background: 'rgba(139,92,246,0.15)', color: '#a5b4fc', border: '1px solid rgba(139,92,246,0.2)' }}>
                                            {p}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}
