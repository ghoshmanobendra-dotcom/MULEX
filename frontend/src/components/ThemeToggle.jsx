/**
 * ThemeToggle — Dark/Light mode toggle.
 * Redesigned: Glowing toggle button matching header style.
 */
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle() {
    const [isDark, setIsDark] = useState(() => {
        return localStorage.getItem('mule_theme') !== 'light';
    });

    useEffect(() => {
        if (localStorage.getItem('mule_theme') === 'light') {
            document.documentElement.classList.add('light-mode');
        }
    }, []);

    const toggle = () => {
        const next = !isDark;
        setIsDark(next);
        if (next) {
            document.documentElement.classList.remove('light-mode');
            localStorage.setItem('mule_theme', 'dark');
        } else {
            document.documentElement.classList.add('light-mode');
            localStorage.setItem('mule_theme', 'light');
        }
    };

    return (
        <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={toggle}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer"
            style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(139,92,246,0.1)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(139,92,246,0.35)'; e.currentTarget.style.boxShadow = '0 0 12px rgba(139,92,246,0.1)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(139,92,246,0.1)'; e.currentTarget.style.boxShadow = 'none'; }}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
            {isDark ? <Moon size={14} className="text-violet-400" /> : <Sun size={14} className="text-amber-400" />}
        </motion.button>
    );
}
