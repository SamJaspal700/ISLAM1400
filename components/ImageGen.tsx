import React, { useState } from 'react';
import { generateIslamicImage } from '../services/geminiService';
import { Palette, Sparkles, Download } from 'lucide-react';

export const ImageGen: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleGen = async () => {
        if(!prompt) return;
        setLoading(true);
        const res = await generateIslamicImage(prompt);
        setImage(res);
        setLoading(false);
    };

    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-[2.5rem] p-8 text-white shadow-xl shadow-rose-200">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                        <Palette size={24} />
                    </div>
                    <h2 className="text-2xl font-black">Islamic Art AI</h2>
                </div>
                <p className="text-white/80 text-sm font-medium max-w-xs">Generate beautiful geometric patterns, calligraphy concepts, or mosque architecture.</p>
            </div>

            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                <textarea 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe the art... e.g., 'Golden geometric pattern with teal background' or 'Ancient mosque courtyard at sunset'"
                    className="w-full p-4 bg-slate-50 rounded-xl border-none text-sm h-32 mb-4 focus:ring-2 focus:ring-rose-400"
                />
                <button 
                    onClick={handleGen}
                    disabled={loading || !prompt}
                    className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg hover:scale-[1.02] transition-transform disabled:opacity-50"
                >
                    {loading ? <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" /> : <Sparkles size={18} />}
                    <span>Generate Art</span>
                </button>
            </div>

            {image && (
                <div className="relative group">
                    <img src={image} alt="Generated Islamic Art" className="w-full rounded-[2rem] shadow-2xl border-4 border-white" />
                    <a href={image} download="islamic-art.png" className="absolute bottom-4 right-4 bg-white text-slate-900 px-4 py-2 rounded-full font-bold text-xs shadow-lg flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Download size={14} /> Download
                    </a>
                </div>
            )}
        </div>
    );
};