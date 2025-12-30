import React, { useState, useEffect } from 'react';
import { Calculator, Coins, Banknote, Building2, RefreshCw } from 'lucide-react';

export const ZakatCalculator: React.FC = () => {
    // Default prices per gram (approximate, static for demo, ideally fetched live)
    const [prices, setPrices] = useState({ gold: 65.50, silver: 0.85 });
    const [assets, setAssets] = useState({
        gold_g: 0,
        silver_g: 0,
        cash: 0,
        investments: 0,
        liabilities: 0
    });

    const NISAB_GOLD_G = 87.48;
    const NISAB_SILVER_G = 612.36;

    const totalAssets = (assets.gold_g * prices.gold) + (assets.silver_g * prices.silver) + assets.cash + assets.investments;
    const netAssets = Math.max(0, totalAssets - assets.liabilities);
    
    // Using Silver Nisab is safer/more common for inclusivity, but showing both logic visually
    const nisabThreshold = NISAB_SILVER_G * prices.silver; 
    const isEligible = netAssets >= nisabThreshold;
    const zakatPayable = isEligible ? netAssets * 0.025 : 0;

    return (
        <div className="space-y-6 animate-in slide-in-from-bottom-4">
            {/* Header */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                            <Calculator size={24} className="text-emerald-400" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black">Zakat Calc</h2>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Financial Purification</p>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-6">
                        <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                            <p className="text-slate-400 text-[10px] uppercase font-bold mb-1">Gold Price /g</p>
                            <div className="flex items-center gap-2">
                                <span className="text-yellow-400 font-bold">£</span>
                                <input 
                                    type="number" 
                                    value={prices.gold} 
                                    onChange={e => setPrices({...prices, gold: Number(e.target.value)})}
                                    className="bg-transparent w-full text-lg font-mono font-bold focus:outline-none text-white"
                                />
                            </div>
                        </div>
                        <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                            <p className="text-slate-400 text-[10px] uppercase font-bold mb-1">Silver Price /g</p>
                            <div className="flex items-center gap-2">
                                <span className="text-slate-300 font-bold">£</span>
                                <input 
                                    type="number" 
                                    value={prices.silver} 
                                    onChange={e => setPrices({...prices, silver: Number(e.target.value)})}
                                    className="bg-transparent w-full text-lg font-mono font-bold focus:outline-none text-white"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Inputs */}
            <div className="grid gap-4">
                <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-yellow-50 text-yellow-600 flex items-center justify-center">
                            <Coins size={20} />
                        </div>
                        <div>
                            <p className="font-bold text-slate-800">Gold (grams)</p>
                            <p className="text-xs text-slate-400">Jewellery & Bars</p>
                        </div>
                    </div>
                    <input 
                        type="number" 
                        placeholder="0"
                        className="w-24 text-right text-xl font-black text-slate-800 bg-transparent focus:outline-none placeholder:text-slate-200"
                        onChange={e => setAssets({...assets, gold_g: Number(e.target.value)})}
                    />
                </div>

                <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center">
                            <Coins size={20} />
                        </div>
                        <div>
                            <p className="font-bold text-slate-800">Silver (grams)</p>
                            <p className="text-xs text-slate-400">Jewellery & Bars</p>
                        </div>
                    </div>
                    <input 
                        type="number" 
                        placeholder="0"
                        className="w-24 text-right text-xl font-black text-slate-800 bg-transparent focus:outline-none placeholder:text-slate-200"
                        onChange={e => setAssets({...assets, silver_g: Number(e.target.value)})}
                    />
                </div>

                <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                            <Banknote size={20} />
                        </div>
                        <div>
                            <p className="font-bold text-slate-800">Cash Savings</p>
                            <p className="text-xs text-slate-400">Bank & Cash in hand</p>
                        </div>
                    </div>
                    <input 
                        type="number" 
                        placeholder="0"
                        className="w-32 text-right text-xl font-black text-slate-800 bg-transparent focus:outline-none placeholder:text-slate-200"
                        onChange={e => setAssets({...assets, cash: Number(e.target.value)})}
                    />
                </div>

                <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                            <Building2 size={20} />
                        </div>
                        <div>
                            <p className="font-bold text-slate-800">Investments</p>
                            <p className="text-xs text-slate-400">Stocks, Crypto, Resale</p>
                        </div>
                    </div>
                    <input 
                        type="number" 
                        placeholder="0"
                        className="w-32 text-right text-xl font-black text-slate-800 bg-transparent focus:outline-none placeholder:text-slate-200"
                        onChange={e => setAssets({...assets, investments: Number(e.target.value)})}
                    />
                </div>
                
                 <div className="bg-white p-5 rounded-[2rem] border border-red-100 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                            <Building2 size={20} />
                        </div>
                        <div>
                            <p className="font-bold text-slate-800">Liabilities</p>
                            <p className="text-xs text-slate-400">Immediate Debts</p>
                        </div>
                    </div>
                    <input 
                        type="number" 
                        placeholder="0"
                        className="w-32 text-right text-xl font-black text-red-600 bg-transparent focus:outline-none placeholder:text-red-200"
                        onChange={e => setAssets({...assets, liabilities: Number(e.target.value)})}
                    />
                </div>
            </div>

            {/* Total Section */}
            <div className={`p-8 rounded-[2.5rem] text-center transition-all ${isEligible ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-200' : 'bg-slate-200 text-slate-500'}`}>
                <p className="text-sm font-bold uppercase tracking-widest mb-2 opacity-80">Total Zakat Payable (2.5%)</p>
                <div className="text-5xl font-black mb-2">
                    £{zakatPayable.toLocaleString('en-GB', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                </div>
                <div className="flex justify-center gap-2 text-xs font-bold opacity-70">
                    <span>Net Wealth: £{netAssets.toLocaleString()}</span>
                    <span>•</span>
                    <span>Nisab: £{nisabThreshold.toLocaleString('en-GB', {maximumFractionDigits: 0})}</span>
                </div>
                {!isEligible && (
                    <p className="mt-4 text-sm font-bold bg-black/10 inline-block px-4 py-2 rounded-xl">Wealth below Nisab threshold</p>
                )}
            </div>
        </div>
    );
};