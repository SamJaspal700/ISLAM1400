import React, { useState, useEffect } from 'react';
import { Compass, Navigation, Check } from 'lucide-react';

export const Qibla: React.FC = () => {
    const ILFORD_QIBLA = 119; 
    const [heading, setHeading] = useState(0);
    const [permissionGranted, setPermissionGranted] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!permissionGranted) return;

        const handleOrientation = (event: DeviceOrientationEvent) => {
             let compass = event.alpha;
             if(compass === null && (event as any).webkitCompassHeading) {
                 compass = (event as any).webkitCompassHeading;
             }
             if (compass !== null) setHeading(compass);
        };

        window.addEventListener('deviceorientation', handleOrientation, true);
        return () => window.removeEventListener('deviceorientation', handleOrientation, true);
    }, [permissionGranted]);

    const requestAccess = async () => {
        // Safe check for DeviceOrientationEvent existence
        if (typeof DeviceOrientationEvent !== 'undefined' && typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
            try {
                const response = await (DeviceOrientationEvent as any).requestPermission();
                if (response === 'granted') {
                    setPermissionGranted(true);
                    setError('');
                } else {
                    setError('Permission denied');
                }
            } catch (e) {
                console.error(e);
                setError('Compass not supported on this device');
            }
        } else {
            // Non-iOS devices usually allow it by default or don't support the permission API
            setPermissionGranted(true);
        }
    };

    const compassRotation = -heading; 
    const qiblaRotation = ILFORD_QIBLA; // Relative to North
    const isAligned = Math.abs(heading - ILFORD_QIBLA) < 5;

    return (
        <div className="flex flex-col items-center justify-center min-h-[75vh] text-center space-y-10">
            <div className="space-y-4">
                <div className="inline-block p-4 rounded-3xl bg-blue-50 text-blue-600 shadow-sm mb-2">
                    <Compass size={40} />
                </div>
                <h2 className="text-4xl font-black text-slate-900">Qibla Finder</h2>
                <p className="text-slate-500 font-medium text-lg">Align the arrow with the Kaaba</p>
            </div>

            {!permissionGranted ? (
                 <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-slate-100 max-w-xs w-full">
                     <p className="text-sm text-slate-500 mb-8 leading-relaxed font-medium">We need sensor access to show the compass accurately.</p>
                     <button 
                        onClick={requestAccess}
                        className="w-full bg-slate-900 text-white font-bold py-5 rounded-2xl shadow-xl hover:scale-[1.02] transition-transform text-lg"
                     >
                         Start Compass
                     </button>
                     {error && <p className="text-red-500 text-xs mt-3 font-bold">{error}</p>}
                 </div>
            ) : (
                <div className="relative">
                    {/* Outer Housing */}
                    <div className={`w-80 h-80 rounded-full border-[8px] ${isAligned ? 'border-emerald-500 shadow-[0_0_80px_rgba(16,185,129,0.4)]' : 'border-slate-100'} bg-white shadow-2xl flex items-center justify-center relative transition-all duration-500`}>
                        
                        {/* Static Center Marker (Top) */}
                        <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-30">
                            <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[20px] border-t-slate-900"></div>
                        </div>

                        {/* Moving Dial */}
                        <div 
                            className="w-64 h-64 rounded-full border border-slate-50 bg-gradient-to-b from-white to-slate-50 flex items-center justify-center transition-transform duration-200 ease-out shadow-inner"
                            style={{ transform: `rotate(${compassRotation}deg)` }}
                        >
                            {/* North Text */}
                            <div className="absolute top-6 text-red-500 font-black text-lg tracking-widest">N</div>
                            <div className="absolute bottom-6 text-slate-300 font-bold text-xs">S</div>
                            <div className="absolute left-6 text-slate-300 font-bold text-xs">W</div>
                            <div className="absolute right-6 text-slate-300 font-bold text-xs">E</div>
                            
                            {/* Degree Ticks */}
                            {[0, 90, 180, 270].map(deg => (
                                <div key={deg} className="absolute w-1.5 h-4 bg-slate-200" style={{
                                    top: '0', left: '50%', transformOrigin: '0 128px', transform: `rotate(${deg}deg)`
                                }}></div>
                            ))}

                            {/* Qibla Indicator (Fixed on the dial at 119) */}
                            <div 
                                className="absolute top-0 left-1/2 h-1/2 w-0.5 origin-bottom"
                                style={{ transform: `rotate(${qiblaRotation}deg)` }}
                            >
                                <div className="absolute top-8 left-1/2 -translate-x-1/2 -translate-y-1/2 transform -rotate-90">
                                    <div className={`flex items-center gap-2 ${isAligned ? 'text-emerald-600' : 'text-slate-400'} font-bold`}>
                                        <div className={`w-16 h-16 rounded-full border-4 ${isAligned ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 bg-white'} flex items-center justify-center transition-all duration-300`}>
                                            <Navigation size={24} fill="currentColor" />
                                        </div>
                                    </div>
                                </div>
                                <div className={`w-0.5 h-full ${isAligned ? 'bg-emerald-300' : 'bg-slate-200'} mx-auto`}></div>
                            </div>
                        </div>

                        {/* CSS 3D Kaaba (Top Down View) */}
                        <div className="absolute w-12 h-12 bg-black rounded-sm z-20 shadow-xl border border-white/20">
                            <div className="absolute top-2 left-0 w-full h-1 bg-yellow-400"></div>
                        </div>
                    </div>
                    
                    {/* Feedback */}
                    <div className={`mt-10 px-8 py-4 rounded-2xl border-2 font-bold text-lg inline-flex items-center gap-3 transition-colors duration-300 ${isAligned ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-white border-slate-100 text-slate-500'}`}>
                        {isAligned ? <Check size={24} className="text-emerald-600" /> : <Navigation size={24} />}
                        {isAligned ? "You are facing the Qibla" : `${Math.round(heading)}°`}
                    </div>
                </div>
            )}
        </div>
    );
};