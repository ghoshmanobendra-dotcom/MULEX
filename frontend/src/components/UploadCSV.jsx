/**
 * UploadCSV — Drag-and-drop CSV file upload component.
 * Posts the file to /upload-csv and passes the result to the parent.
 *
 * Redesigned: Premium glassmorphism card with animated gradient border,
 * animated upload icon, and landing-page-matching aesthetics.
 */
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { CloudUpload, FileWarning } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';
const H = { fontFamily: 'Outfit, sans-serif' };
const B = { fontFamily: 'Sora, sans-serif' };

/**
 * @param {Object} props
 * @param {Function} props.onResult
 * @param {Function} props.onLoading
 * @param {string} [props.token]
 */
export default function UploadCSV({ onResult, onLoading, token }) {
    const [dragOver, setDragOver] = useState(false);
    const [fileName, setFileName] = useState('');
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);

    const uploadFile = async (file) => {
        if (!file || !file.name.toLowerCase().endsWith('.csv')) {
            setError('Please upload a valid CSV file.');
            return;
        }

        setError('');
        setFileName(file.name);
        onLoading(true);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const headers = {};
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(`${API_URL}/predict`, {
                method: 'POST',
                headers,
                body: formData,
            });

            let data;
            try {
                data = await response.json();
            } catch (e) {
                throw new Error('Server returned an invalid response.');
            }

            if (!response.ok) {
                throw new Error(data.detail || 'Upload failed. Please try again.');
            }

            onResult(data);
        } catch (err) {
            console.error('Upload error:', err);
            setError(err.message || 'Cannot connect to backend. Make sure the server is running on port 8000.');
        } finally {
            onLoading(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        uploadFile(file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = () => setDragOver(false);

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) uploadFile(file);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative rounded-2xl overflow-hidden"
            style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(139,92,246,0.12)',
                backdropFilter: 'blur(16px)',
            }}
        >
            {/* Top accent gradient line */}
            <div className="absolute top-0 left-0 right-0 h-[2px]"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.5), rgba(236,72,153,0.4), transparent)' }} />

            <div className="p-6 md:p-8">
                <h2 className="text-xl font-bold text-transparent bg-clip-text bg-linear-to-r from-white via-violet-200 to-fuchsia-300 mb-5" style={H}>
                    Upload Transaction Data
                </h2>

                <motion.div
                    whileHover={{ borderColor: 'rgba(139,92,246,0.5)', boxShadow: '0 0 30px rgba(139,92,246,0.08)' }}
                    className={`relative rounded-xl p-10 text-center cursor-pointer transition-all duration-300 ${dragOver ? 'border-violet-500/50 bg-violet-500/4' : ''
                        }`}
                    style={{
                        border: `2px dashed ${dragOver ? 'rgba(139,92,246,0.5)' : 'rgba(139,92,246,0.2)'}`,
                        background: dragOver ? 'rgba(139,92,246,0.04)' : 'rgba(255,255,255,0.01)',
                    }}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".csv"
                        onChange={handleFileSelect}
                        className="hidden"
                    />

                    <motion.div
                        animate={{ y: [-3, 3, -3] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                        className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-violet-500/15 to-fuchsia-500/15 border border-violet-500/20 mb-4"
                    >
                        <CloudUpload size={28} className="text-violet-400" />
                    </motion.div>

                    <p className="text-base font-semibold text-violet-200" style={H}>
                        {fileName || 'Drop your CSV file here or click to browse'}
                    </p>
                    <p className="text-sm text-slate-500 mt-2" style={B}>
                        Supports: TX_ID, SENDER_ACCOUNT_ID, RECEIVER_ACCOUNT_ID, TX_AMOUNT, TIMESTAMP
                    </p>
                </motion.div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 p-3.5 rounded-xl flex items-center gap-2.5"
                        style={{
                            background: 'rgba(239,68,68,0.08)',
                            border: '1px solid rgba(239,68,68,0.2)',
                        }}
                    >
                        <FileWarning size={16} className="text-red-400 shrink-0" />
                        <span className="text-red-300 text-sm" style={B}>{error}</span>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}
