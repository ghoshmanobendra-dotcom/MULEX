/**
 * SearchBar — Search for an account and highlight it on the graph.
 *
 * Redesigned: Glowing focus ring, gradient find button, premium input styling.
 */
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, X, Check } from 'lucide-react';

const B = { fontFamily: 'Sora, sans-serif' };

export default function SearchBar({ cyInstance }) {
    const [query, setQuery] = useState('');
    const [found, setFound] = useState(null);

    const handleSearch = (e) => {
        e.preventDefault();
        const q = query.trim();
        if (!q || !cyInstance) return;

        // Reset previous highlights
        cyInstance.elements().removeClass('search-highlight search-dimmed highlighted-edge');

        const node = cyInstance.getElementById(q);

        if (node && node.length > 0) {
            // Highlight found node
            cyInstance.elements().addClass('search-dimmed');
            const neighborhood = node.neighborhood().add(node);
            neighborhood.removeClass('search-dimmed');
            node.addClass('search-highlight');
            node.connectedEdges().addClass('highlighted-edge');

            // Pan to the node
            cyInstance.animate({ center: { eles: node }, zoom: 1.5 }, { duration: 500 });
            setFound(true);
        } else {
            setFound(false);
        }
    };

    const handleClear = () => {
        setQuery('');
        setFound(null);
        if (cyInstance) {
            cyInstance.elements().removeClass('search-highlight search-dimmed highlighted-edge');
            cyInstance.fit(undefined, 40);
        }
    };

    return (
        <form onSubmit={handleSearch} className="flex items-center gap-2" style={B}>
            <div className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search account ID..."
                    className="text-sm text-slate-200 rounded-xl pl-9 pr-3 py-2.5 w-56 outline-none placeholder-slate-600 transition-all duration-300"
                    style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(139,92,246,0.12)',
                        fontFamily: 'Sora, sans-serif',
                    }}
                    onFocus={(e) => { e.target.style.borderColor = 'rgba(139,92,246,0.4)'; e.target.style.boxShadow = '0 0 20px rgba(139,92,246,0.1)'; }}
                    onBlur={(e) => { e.target.style.borderColor = 'rgba(139,92,246,0.12)'; e.target.style.boxShadow = 'none'; }}
                />
                <Search size={14} className="absolute left-3 top-3 text-slate-600" />
            </div>
            <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                className="px-4 py-2.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white text-sm font-medium rounded-xl transition-all shadow-lg shadow-violet-600/20 cursor-pointer"
                style={B}
            >
                Find
            </motion.button>
            {found !== null && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    type="button"
                    onClick={handleClear}
                    className="p-2 text-slate-500 hover:text-white rounded-lg hover:bg-white/[0.05] transition-all cursor-pointer"
                >
                    <X size={14} />
                </motion.button>
            )}
            {found === false && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-xs">
                    Not found
                </motion.span>
            )}
            {found === true && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-1 text-emerald-400 text-xs">
                    <Check size={12} /> Found
                </motion.span>
            )}
        </form>
    );
}
