/**
 * ProfilePage — User profile and account settings.
 * Premium dark luxury aesthetic matching landing page.
 */
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    User, Shield, Mail, Clock, ArrowLeft, LogOut, Settings,
    KeyRound, Activity, LayoutDashboard, Radar, ChevronRight,
} from 'lucide-react';

const H = { fontFamily: 'Outfit, sans-serif' };
const B = { fontFamily: 'Sora, sans-serif' };

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };

export default function ProfilePage() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login', { replace: true });
    };

    const profileItems = [
        { icon: User, label: 'Username', value: user?.username || 'N/A' },
        { icon: Shield, label: 'Role', value: user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1) || 'User' },
        { icon: KeyRound, label: 'Auth Type', value: 'JWT Token' },
        { icon: Clock, label: 'Session', value: 'Active' },
    ];

    return (
        <div className="min-h-screen text-white selection:bg-violet-500/30" style={{ background: '#07070a', ...B }}>
            {/* Background orbs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-violet-600/[0.04] blur-[180px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-fuchsia-600/[0.03] blur-[160px] rounded-full" />
            </div>

            <div className="relative z-10">
                {/* Top nav */}
                <motion.header
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="sticky top-0 z-40 border-b border-white/[0.06]"
                    style={{ backdropFilter: 'blur(20px)', background: 'rgba(7,7,10,0.8)' }}
                >
                    <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <motion.div
                                animate={{ boxShadow: ['0 0 10px rgba(139,92,246,0.25)', '0 0 20px rgba(139,92,246,0.4)', '0 0 10px rgba(139,92,246,0.25)'] }}
                                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                                className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center"
                            >
                                <User size={16} className="text-white" />
                            </motion.div>
                            <div>
                                <h1 className="text-base font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-violet-200 to-fuchsia-300" style={H}>
                                    My Profile
                                </h1>
                                <p className="text-[10px] text-slate-600 tracking-wider uppercase">Account & Settings</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate('/dashboard')}
                                className="flex items-center gap-1.5 px-3 py-2 text-xs text-slate-400 hover:text-white rounded-xl transition-all cursor-pointer"
                                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', ...B }}
                            >
                                <ArrowLeft size={13} />
                                Dashboard
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleLogout}
                                className="p-2 text-red-400 hover:bg-red-500/10 rounded-xl transition-all cursor-pointer"
                            >
                                <LogOut size={14} />
                            </motion.button>
                        </div>
                    </div>
                </motion.header>

                <main className="max-w-4xl mx-auto px-6 py-8">
                    <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-6">
                        {/* Profile Card */}
                        <motion.div variants={fadeUp} className="rounded-2xl overflow-hidden relative"
                            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(139,92,246,0.1)', backdropFilter: 'blur(12px)' }}>
                            <div className="absolute top-0 left-0 right-0 h-[2px] opacity-40"
                                style={{ background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.5), rgba(236,72,153,0.4), transparent)' }} />

                            {/* Banner */}
                            <div className="h-28 relative"
                                style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(236,72,153,0.1) 50%, rgba(6,182,212,0.08) 100%)' }}>
                                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[rgba(10,8,30,0.95)] to-transparent" />
                            </div>

                            <div className="relative px-6 pb-6 -mt-10">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                                    className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-3xl font-bold text-white mb-4"
                                    style={{ boxShadow: '0 4px 30px rgba(139,92,246,0.3)', border: '3px solid rgba(10,8,30,0.8)', ...H }}
                                >
                                    {user?.username?.[0]?.toUpperCase() || 'U'}
                                </motion.div>
                                <h2 className="text-xl font-bold text-white" style={H}>{user?.username}</h2>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium"
                                        style={user?.role === 'admin' ? {
                                            background: 'rgba(139,92,246,0.12)', color: '#c4b5fd', border: '1px solid rgba(139,92,246,0.2)',
                                        } : user?.role === 'guest' ? {
                                            background: 'rgba(245,158,11,0.12)', color: '#fcd34d', border: '1px solid rgba(245,158,11,0.2)',
                                        } : {
                                            background: 'rgba(6,182,212,0.12)', color: '#67e8f9', border: '1px solid rgba(6,182,212,0.2)',
                                        }}>
                                        {user?.role === 'admin' ? '🛡️ Admin' : user?.role === 'guest' ? '✨ Guest' : '👤 User'}
                                    </span>
                                    <span className="flex items-center gap-1 text-[11px] text-emerald-400">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" style={{ boxShadow: '0 0 6px rgba(16,185,129,0.5)' }} />
                                        Online
                                    </span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Account Details */}
                        <motion.div variants={fadeUp} className="rounded-2xl p-5 relative overflow-hidden"
                            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(139,92,246,0.1)', backdropFilter: 'blur(12px)' }}>
                            <div className="absolute top-0 left-0 right-0 h-[2px] opacity-40"
                                style={{ background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.5), transparent)' }} />
                            <div className="flex items-center gap-2 mb-4">
                                <Settings size={14} className="text-cyan-400" />
                                <h3 className="text-sm font-bold text-slate-300" style={H}>Account Details</h3>
                            </div>
                            <div className="space-y-1">
                                {profileItems.map((item, i) => (
                                    <motion.div
                                        key={item.label}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 + i * 0.05 }}
                                        className="flex items-center justify-between py-3 px-4 rounded-xl transition-all"
                                        style={{ background: 'rgba(255,255,255,0.01)' }}
                                        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(139,92,246,0.04)'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.01)'; }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500/15 to-fuchsia-500/15 border border-violet-500/10 flex items-center justify-center">
                                                <item.icon size={13} className="text-violet-400" />
                                            </div>
                                            <span className="text-sm text-slate-400" style={B}>{item.label}</span>
                                        </div>
                                        <span className="text-sm text-white font-medium" style={B}>{item.value}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Quick Actions */}
                        <motion.div variants={fadeUp} className="rounded-2xl p-5 relative overflow-hidden"
                            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(139,92,246,0.1)', backdropFilter: 'blur(12px)' }}>
                            <div className="absolute top-0 left-0 right-0 h-[2px] opacity-40"
                                style={{ background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.5), transparent)' }} />
                            <div className="flex items-center gap-2 mb-4">
                                <Activity size={14} className="text-violet-400" />
                                <h3 className="text-sm font-bold text-slate-300" style={H}>Quick Navigation</h3>
                            </div>
                            <div className="space-y-2">
                                {[
                                    { icon: LayoutDashboard, label: 'Analysis Dashboard', desc: 'Upload & analyze CSV data', path: '/dashboard', color: 'cyan' },
                                    { icon: Clock, label: 'My History', desc: 'View your upload history', path: '/history', color: 'violet' },
                                    ...(user?.role === 'admin' ? [{ icon: Shield, label: 'Admin Panel', desc: 'Manage users & settings', path: '/admin', color: 'fuchsia' }] : []),
                                ].map((item) => (
                                    <motion.button
                                        key={item.label}
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.99 }}
                                        onClick={() => navigate(item.path)}
                                        className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-left transition-all cursor-pointer"
                                        style={{
                                            background: `rgba(${item.color === 'cyan' ? '6,182,212' : item.color === 'violet' ? '139,92,246' : '236,72,153'},0.05)`,
                                            border: `1px solid rgba(${item.color === 'cyan' ? '6,182,212' : item.color === 'violet' ? '139,92,246' : '236,72,153'},0.1)`,
                                            ...B,
                                        }}
                                    >
                                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center bg-gradient-to-br ${item.color === 'cyan' ? 'from-cyan-500/20 to-blue-500/20' :
                                            item.color === 'violet' ? 'from-violet-500/20 to-purple-500/20' :
                                                'from-fuchsia-500/20 to-pink-500/20'
                                            }`}>
                                            <item.icon size={15} className={
                                                item.color === 'cyan' ? 'text-cyan-400' :
                                                    item.color === 'violet' ? 'text-violet-400' :
                                                        'text-fuchsia-400'
                                            } />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-slate-200">{item.label}</p>
                                            <p className="text-[11px] text-slate-500">{item.desc}</p>
                                        </div>
                                        <ChevronRight size={14} className="text-slate-600" />
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                </main>

                {/* Footer */}
                <footer className="border-t border-white/[0.04] mt-8">
                    <div className="max-w-4xl mx-auto px-6 py-5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <img src="/logo.png" alt="MuleX" className="h-6 w-auto object-contain" />
                        </div>
                        <span className="text-slate-700 text-[10px]" style={B}>Money Muling Detection Engine</span>
                    </div>
                </footer>
            </div>
        </div>
    );
}
