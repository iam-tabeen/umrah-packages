'use client';

import React, { useCallback, useEffect, useState, useRef } from 'react';

interface RangeSliderProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
}

export function RangeSlider({ min, max, value, onChange }: RangeSliderProps) {
  const [minVal, setMinVal] = useState(value[0]);
  const [maxVal, setMaxVal] = useState(value[1]);
  const minValRef = useRef(value[0]);
  const maxValRef = useRef(value[1]);
  const range = useRef<HTMLDivElement>(null);

  // Keep internal state in sync with external value changes
  useEffect(() => {
    setMinVal(value[0]);
    setMaxVal(value[1]);
    minValRef.current = value[0];
    maxValRef.current = value[1];
  }, [value]);

  // Convert value to percentage
  const getPercent = useCallback(
    (value: number) => Math.round(((value - min) / (max - min)) * 100),
    [min, max]
  );

  // Adjust the style of the range selection track
  useEffect(() => {
    if (maxValRef.current !== null && range.current) {
      const minPercent = getPercent(minVal);
      const maxPercent = getPercent(maxVal);

      range.current.style.left = `${minPercent}%`;
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [minVal, maxVal, getPercent]);

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.min(Number(e.target.value), maxVal - 1);
    setMinVal(val);
    minValRef.current = val;
    onChange([val, maxVal]);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.max(Number(e.target.value), minVal + 1);
    setMaxVal(val);
    maxValRef.current = val;
    onChange([minVal, val]);
  };

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="w-full flex flex-col space-y-4">
      <div className="relative w-full h-8 flex items-center">
        {/* Underlay tracks */}
        <div className="absolute left-0 right-0 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full w-full" />
        <div
          ref={range}
          className="absolute h-1.5 bg-emerald-600 dark:bg-emerald-500 rounded-full"
        />

        {/* Dual Input range controls */}
        <input
          type="range"
          min={min}
          max={max}
          value={minVal}
          onChange={handleMinChange}
          className="thumb pointer-events-none absolute h-0 w-full outline-none z-20 cursor-pointer"
          style={{ zIndex: minVal > max - 100 ? '5' : '3' }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={maxVal}
          onChange={handleMaxChange}
          className="thumb pointer-events-none absolute h-0 w-full outline-none z-20 cursor-pointer"
        />
      </div>

      <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-wider text-slate-400">Min</span>
          <span className="font-semibold text-slate-700 dark:text-slate-200">{formatPrice(minVal)}</span>
        </div>
        <div className="flex flex-col text-right">
          <span className="text-[10px] uppercase tracking-wider text-slate-400">Max</span>
          <span className="font-semibold text-slate-700 dark:text-slate-200">{formatPrice(maxVal)}</span>
        </div>
      </div>

      {/* Styled Slider Thumbs */}
      <style jsx global>{`
        .thumb {
          -webkit-appearance: none;
          -webkit-tap-highlight-color: transparent;
        }
        .thumb::-webkit-slider-thumb {
          background-color: #059669;
          border: 2px solid #ffffff;
          border-radius: 50%;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
          cursor: pointer;
          height: 18px;
          width: 18px;
          margin-top: 0px;
          pointer-events: all;
          position: relative;
          -webkit-appearance: none;
          transition: transform 0.1s ease;
        }
        .thumb::-webkit-slider-thumb:hover {
          transform: scale(1.15);
        }
        .thumb::-webkit-slider-thumb:active {
          transform: scale(1.25);
        }
        .thumb::-moz-range-thumb {
          background-color: #059669;
          border: 2px solid #ffffff;
          border-radius: 50%;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
          cursor: pointer;
          height: 18px;
          width: 18px;
          pointer-events: all;
          border-radius: 50%;
          transition: transform 0.1s ease;
        }
        .thumb::-moz-range-thumb:hover {
          transform: scale(1.15);
        }
        .thumb::-moz-range-thumb:active {
          transform: scale(1.25);
        }
      `}</style>
    </div>
  );
}
