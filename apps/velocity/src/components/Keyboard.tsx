import { ReactNode } from "react";

interface FingerMapType {
    [key: string]: {
        hand: 'left' | 'right' | 'both';
        finger: string;
        color: string;
    };
}

const Keyboard = ({ isShiftOn, isCapsOn, nextKey }: { isShiftOn: boolean, isCapsOn: boolean, nextKey: string }) => {

    // Finger mapping with TypeScript interface
    const fingerMap: FingerMapType = {
        // Left Hand
        '1': { hand: 'left', finger: 'pinky', color: 'bg-red-400' },
        '2': { hand: 'left', finger: 'ring', color: 'bg-orange-400' },
        '3': { hand: 'left', finger: 'middle', color: 'bg-yellow-400' },
        '4': { hand: 'left', finger: 'index', color: 'bg-green-400' },
        '5': { hand: 'left', finger: 'index', color: 'bg-green-400' },
        'q': { hand: 'left', finger: 'pinky', color: 'bg-red-400' },
        'w': { hand: 'left', finger: 'ring', color: 'bg-orange-400' },
        'e': { hand: 'left', finger: 'middle', color: 'bg-yellow-400' },
        'r': { hand: 'left', finger: 'index', color: 'bg-green-400' },
        't': { hand: 'left', finger: 'index', color: 'bg-green-400' },
        'a': { hand: 'left', finger: 'pinky', color: 'bg-red-400' },
        's': { hand: 'left', finger: 'ring', color: 'bg-orange-400' },
        'd': { hand: 'left', finger: 'middle', color: 'bg-yellow-400' },
        'f': { hand: 'left', finger: 'index', color: 'bg-green-400' },
        'g': { hand: 'left', finger: 'index', color: 'bg-green-400' },
        'z': { hand: 'left', finger: 'pinky', color: 'bg-red-400' },
        'x': { hand: 'left', finger: 'ring', color: 'bg-orange-400' },
        'c': { hand: 'left', finger: 'middle', color: 'bg-yellow-400' },
        'v': { hand: 'left', finger: 'index', color: 'bg-green-400' },
        'b': { hand: 'left', finger: 'index', color: 'bg-green-400' },

        // Right Hand
        '6': { hand: 'right', finger: 'index', color: 'bg-blue-400' },
        '7': { hand: 'right', finger: 'index', color: 'bg-blue-400' },
        '8': { hand: 'right', finger: 'middle', color: 'bg-purple-400' },
        '9': { hand: 'right', finger: 'ring', color: 'bg-pink-400' },
        '0': { hand: 'right', finger: 'pinky', color: 'bg-indigo-400' },
        'y': { hand: 'right', finger: 'index', color: 'bg-blue-400' },
        'u': { hand: 'right', finger: 'index', color: 'bg-blue-400' },
        'i': { hand: 'right', finger: 'middle', color: 'bg-purple-400' },
        'o': { hand: 'right', finger: 'ring', color: 'bg-pink-400' },
        'p': { hand: 'right', finger: 'pinky', color: 'bg-indigo-400' },
        'h': { hand: 'right', finger: 'index', color: 'bg-blue-400' },
        'j': { hand: 'right', finger: 'index', color: 'bg-blue-400' },
        'k': { hand: 'right', finger: 'middle', color: 'bg-purple-400' },
        'l': { hand: 'right', finger: 'ring', color: 'bg-pink-400' },
        'n': { hand: 'right', finger: 'index', color: 'bg-blue-400' },
        'm': { hand: 'right', finger: 'middle', color: 'bg-purple-400' },
        ',': { hand: 'right', finger: 'middle', color: 'bg-purple-400' },
        '.': { hand: 'right', finger: 'ring', color: 'bg-pink-400' },
        '?': { hand: 'right', finger: 'pinky', color: 'bg-indigo-400' },
        ' ': { hand: 'both', finger: 'thumb', color: 'bg-teal-400' },
        'backspace': { hand: 'right', finger: 'pinky', color: 'bg-indigo-400' },
        'shift': { hand: 'left', finger: 'pinky', color: 'bg-red-400' }
    };

    // Keyboard layouts
    const normalLayout: string[][] = [
        ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'backspace'],
        ['tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
        ['caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '\'', 'enter'],
        ['shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '?', 'shift'],
        ['space']
    ];

    const shiftLayout: string[][] = [
        ['~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', 'backspace'],
        ['tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '{', '}', '|'],
        ['caps', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ':', '"', 'enter'],
        ['shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '<', '>', '/', 'shift'],
        ['space']
    ];

    // Helper function to get key size classes
    const getKeySize = (key: string): string => {
        if (key === 'space') return 'flex-grow max-w-xl';
        if (key === 'backspace') return 'min-w-[50px] md:min-w-[70px]';
        if (key === 'shift') return 'min-w-[40px] md:min-w-[70px]';
        if (key === 'tab') return 'min-w-[40px] md:min-w-[70px]';
        if (key === 'enter') return 'min-w-[40px] md:min-w-[80px]';
        return 'min-w-[20px] md:min-w-[40px]';
    };

    // Helper function to get key display
    const getKeyDisplay = (key: string): string | ReactNode => {
        switch (key) {
            case 'backspace':
                return (
                    <div className="flex items-center justify-center">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z" />
                        </svg>
                    </div>
                );
            case 'shift':
                return (
                    <div className="flex items-center justify-center">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                        </svg>
                    </div>
                );
            case 'space':
                return 'Space';
            default:
                return key;
        }
    };

    const currentLayout: string[][] = isShiftOn || isCapsOn ? shiftLayout : normalLayout;

    return (
        <div className="bg-slate-900/90 p-2 rounded-xl shadow-2xl border border-slate-700/50">
            {currentLayout.map((row: string[], rowIndex: number) => (
                <div key={rowIndex} className="flex justify-center mb-2 last:mb-0">
                    {row.map((key: string) => {
                        const isSpecialKey: boolean = ['backspace', 'shift', 'space', 'tab', 'enter', 'caps'].includes(key);
                        // const isActive: boolean = key === 'shift' && (isShiftOn || isCapsOn);
                        const isNextKey: boolean = key.toLowerCase() === (nextKey === ' ' ? 'space' : nextKey);
                        const fingerInfo = fingerMap[key.toLowerCase()] || fingerMap[' '];

                        return (
                            <button
                                key={key}
                                className={`
                                    ${getKeySize(key)}
                                    h-6 md:h-8 mx-1 px-2 md:px-3 py-1 rounded-xl font-semibold transition-all duration-200 transform
                                    ${isSpecialKey
                                        ? 'bg-gradient-to-br from-slate-600 to-slate-700 text-slate-100 hover:from-slate-500 hover:to-slate-600 border border-slate-500/50'
                                        : 'bg-gradient-to-br from-slate-700 to-slate-800 text-slate-200 hover:from-slate-600 hover:to-slate-700 border border-slate-600/50'
                                    }
                                    ${isNextKey ? `${fingerInfo.color} text-white border-2 border-white/50 shadow-xl scale-105 -translate-y-0.5` : ''}
                                    shadow-lg group relative overflow-hidden
                                `}
                            >
                                {/* Ripple effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

                                {/* Key content */}
                                <span className="relative z-10 flex items-center justify-center">
                                    {getKeyDisplay(key)}
                                </span>

                                {/* Finger indicator dot */}
                                {isNextKey && (
                                    <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full animate-pulse" />
                                )}
                            </button>
                        );
                    })}
                </div>
            ))}
        </div>
    )
}

export default Keyboard;