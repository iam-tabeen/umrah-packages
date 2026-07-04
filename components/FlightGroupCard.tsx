'use client';

import React, { useState } from 'react';
import { Plane, Calendar, Moon, Users, ChevronDown, ChevronUp, Hotel, ShieldCheck } from 'lucide-react';
import { FlightGroup, PackageOption } from '../lib/types';

interface FlightGroupCardProps {
  group: FlightGroup;
  onBookClick: (pkg: PackageOption, roomType: string, price: number) => void;
}

export function FlightGroupCard({ group, onBookClick }: FlightGroupCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Formatting helpers
  const formatPrice = (val: number) => {
    if (!val || val === 0) return 'N/A';
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  // Seat availability badge config
  const getSeatBadgeColor = (seats: number) => {
    if (seats > 20) {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200/60 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800/40';
    }
    if (seats >= 5) {
      return 'bg-amber-50 text-amber-700 border-amber-200/60 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800/40';
    }
    return 'bg-rose-50 text-rose-700 border-rose-200/60 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-800/40';
  };

  // Styled Airline logo avatar generator
  const renderAirlineLogo = (code: string) => {
    const cleanCode = code.toUpperCase().trim();
    
    // Check if custom PNG logos exist for PK or SV
    if (cleanCode === 'PK' || cleanCode === 'SV') {
      return (
        <img
          src={`/${cleanCode}.png`}
          alt={`${cleanCode} Logo`}
          className="w-10 h-10 rounded-full object-contain p-0.5 bg-white shadow-sm border border-slate-200/80 flex-shrink-0"
        />
      );
    }

    const codeColors: Record<string, { bg: string, text: string }> = {
      'EK': { bg: 'bg-red-650', text: 'text-white' },
      'WY': { bg: 'bg-sky-700', text: 'text-white' },
      'QR': { bg: 'bg-rose-900', text: 'text-white' },
      'EY': { bg: 'bg-zinc-800', text: 'text-white' },
    };

    const color = codeColors[cleanCode] || { bg: 'bg-teal-900', text: 'text-white' };

    return (
      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm tracking-wider ${color.bg} ${color.text} shadow-sm border border-white/10 flex-shrink-0`}>
        {cleanCode.substring(0, 2)}
      </div>
    );
  };

  // Get common pricing for child/infant (from first package)
  const firstPackage = group.packages[0];
  const childPrice = firstPackage?.childWithoutBed || 0;
  const infantPrice = firstPackage?.infant || 0;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/60 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      
      {/* Clickable Header Area - xl: flex layout to prevent desktop cropping */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-5 lg:p-6 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-5 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors select-none"
      >
        {/* Left: Sector & Airline info */}
        <div className="flex items-center gap-4 w-full xl:w-auto">
          {renderAirlineLogo(group.airlineId)}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-widest text-slate-400 font-bold dark:text-slate-500">
                {group.airline}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-medium">
                {group.departureFlightNo && `Outbound: ${group.departureFlightNo}`}
              </span>
            </div>
            <div className="flex items-center gap-2 text-slate-800 dark:text-white font-bold text-lg lg:text-xl">
              <span>{group.sectorFrom}</span>
              <Plane className="w-4 h-4 text-emerald-600 dark:text-emerald-500 transform rotate-90" />
              <span>{group.sectorTo}</span>
            </div>
          </div>
        </div>

        {/* Center: Departure Dates & Nights info */}
        <div className="flex flex-wrap xl:flex-nowrap items-center gap-4 xl:gap-8 w-full xl:w-auto">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 block dark:text-slate-500">Departure Date</span>
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-semibold text-sm lg:text-base">
              <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-500" />
              <span>{formatDate(group.departureDate)}</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-xs text-slate-400 block dark:text-slate-500">Duration</span>
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-semibold text-sm lg:text-base">
              <Moon className="w-4 h-4 text-emerald-600 dark:text-emerald-500" />
              <span className="bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400 px-2 py-0.5 rounded-lg text-xs font-bold border border-emerald-100 dark:border-emerald-900/50">
                {group.nights} Nights
              </span>
            </div>
          </div>

          {/* Quick flight return text */}
          {group.arrivalFlightNo && (
            <div className="text-[11px] text-slate-400 dark:text-slate-500 max-w-[120px] hidden xl:block">
              Return on {group.arrivalDateString} via Flight {group.arrivalFlightNo}
            </div>
          )}
        </div>

        {/* Right: Pricing, Availability & Toggle */}
        <div className="flex items-center justify-between xl:justify-end gap-6 w-full xl:w-auto pt-4 xl:pt-0 border-t border-slate-100 xl:border-t-0 dark:border-slate-800">
          <div className="text-left xl:text-right space-y-1">
            <span className="text-xs text-slate-400 block dark:text-slate-500">Starting from</span>
            <span className="text-lg lg:text-xl font-black text-amber-600 dark:text-amber-500">
              {formatPrice(group.lowestSharingPrice)}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Seats status */}
            <div className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 ${getSeatBadgeColor(group.availableSeats)}`}>
              <Users className="w-3.5 h-3.5" />
              <span>{group.availableSeats} Seats</span>
            </div>

            {/* Toggle icon */}
            <button className="p-2 bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-300 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Package Table / Mobile Cards */}
      {isExpanded && (
        <div className="px-5 pb-6 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/20">
          
          {/* Flight detailed specs bar */}
          <div className="flex flex-wrap gap-4 py-3 text-xs text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800/60 mb-5">
            <div><strong>Group Code:</strong> {group.groupCode}</div>
            <div><strong>Outbound Flight:</strong> {group.sectorFrom} → {group.sectorTo} (Flight {group.departureFlightNo})</div>
            <div><strong>Return Flight:</strong> {group.sectorTo} → {group.sectorFrom} (Flight {group.arrivalFlightNo})</div>
            {group.bookingEndDate && (
              <div className="text-amber-700 dark:text-amber-500 font-medium">
                <strong>Booking Deadline:</strong> {formatDate(group.bookingEndDate)}
              </div>
            )}
          </div>

          {/* Desktop Table View (>= 1024px) */}
          <div className="hidden lg:block overflow-x-auto rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200/80 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase">
                  <th className="px-4 py-3.5">Code</th>
                  <th className="px-4 py-3.5">Makkah Hotel</th>
                  <th className="px-4 py-3.5">Medinah Hotel</th>
                  <th className="px-3 py-3.5 text-center">Sharing</th>
                  <th className="px-3 py-3.5 text-center">Quad</th>
                  <th className="px-3 py-3.5 text-center">Triple</th>
                  <th className="px-3 py-3.5 text-center">Double</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {group.packages.map((pkg) => (
                  <tr key={pkg.packageOid} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/20 text-slate-700 dark:text-slate-200 transition-colors">
                    <td className="px-4 py-4 font-mono text-xs font-semibold text-slate-400">
                      {pkg.packageCode}
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">
                        {pkg.makkahHotel}
                      </div>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">
                        {group.makkahNights} Nights
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">
                        {pkg.medinahHotel}
                      </div>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">
                        {group.medinahNights} Nights
                      </span>
                    </td>

                    {/* Pricing cells with hover triggers */}
                    {['sharing', 'quad', 'triple', 'double'].map((roomType) => {
                      const priceVal = pkg[roomType as keyof PackageOption] as number;
                      const hasPrice = priceVal > 0;
                      return (
                        <td key={roomType} className="px-2 py-3 text-center">
                          {hasPrice ? (
                            <button
                              onClick={() => onBookClick(pkg, roomType, priceVal)}
                              className="group w-full block p-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-all border border-transparent hover:border-emerald-200 dark:hover:border-emerald-900/60 cursor-pointer"
                            >
                              <span className="block font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 text-xs">
                                {formatPrice(priceVal)}
                              </span>
                              <span className="inline-block text-[9px] uppercase tracking-wider font-semibold text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-500 transition-colors mt-0.5">
                                Book Room
                              </span>
                            </button>
                          ) : (
                            <span className="text-slate-300 dark:text-slate-700 text-xs">-</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile/Tablet Stacked Layout (< 1024px) */}
          <div className="lg:hidden flex flex-col gap-4">
            {group.packages.map((pkg) => (
              <div
                key={pkg.packageOid}
                className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 flex flex-col gap-4 shadow-sm"
              >
                {/* Hotel Names & Code */}
                <div className="flex justify-between items-start">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded">
                    {pkg.packageCode}
                  </span>
                  <span className="text-[10px] text-slate-500 font-semibold dark:text-slate-400">
                    Total: {group.nights} Nights ({group.makkahNights} Makkah / {group.medinahNights} Medina)
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  {/* Makkah hotel card */}
                  <div className="flex items-start gap-2.5 p-3 bg-slate-50 dark:bg-slate-900/40 rounded-xl">
                    <Hotel className="w-4 h-4 text-emerald-600 dark:text-emerald-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">Makkah Hotel</div>
                      <div className="font-bold text-slate-800 dark:text-slate-200 line-clamp-1">{pkg.makkahHotel}</div>
                    </div>
                  </div>
                  {/* Medina hotel card */}
                  <div className="flex items-start gap-2.5 p-3 bg-slate-50 dark:bg-slate-900/40 rounded-xl">
                    <Hotel className="w-4 h-4 text-emerald-600 dark:text-emerald-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">Medinah Hotel</div>
                      <div className="font-bold text-slate-800 dark:text-slate-200 line-clamp-1">{pkg.medinahHotel}</div>
                    </div>
                  </div>
                </div>

                {/* 2x2 Room Price Grid */}
                <div className="grid grid-cols-2 gap-2 text-center pt-2">
                  {[
                    { label: 'Sharing', key: 'sharing' },
                    { label: 'Quad', key: 'quad' },
                    { label: 'Triple', key: 'triple' },
                    { label: 'Double', key: 'double' },
                  ].map((room) => {
                    const priceVal = pkg[room.key as keyof PackageOption] as number;
                    const hasPrice = priceVal > 0;
                    return (
                      <div
                        key={room.key}
                        onClick={() => hasPrice && onBookClick(pkg, room.label, priceVal)}
                        className={`p-2.5 rounded-xl border ${
                          hasPrice
                            ? 'bg-slate-50/50 hover:bg-emerald-50 border-slate-100 hover:border-emerald-200 dark:bg-slate-800/30 dark:hover:bg-emerald-950/20 dark:border-slate-800/40 dark:hover:border-emerald-900/60 cursor-pointer active:scale-98 transition-all'
                            : 'border-slate-100 dark:border-slate-800 opacity-40'
                        }`}
                      >
                        <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">{room.label}</div>
                        <div className="font-extrabold text-xs text-slate-800 dark:text-slate-200 mt-0.5">
                          {hasPrice ? formatPrice(priceVal) : 'Not Available'}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Mobile Single Main Book Button */}
                <button
                  onClick={() => onBookClick(pkg, 'Sharing', pkg.sharing || pkg.quad || pkg.triple || pkg.double || 0)}
                  className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-700 active:bg-emerald-950 text-white font-semibold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Request Booking Callback
                </button>
              </div>
            ))}
          </div>

          {/* Child & Infant shared meta pricing footer */}
          <div className="mt-4 px-4 py-3 rounded-xl bg-slate-100/50 dark:bg-slate-900/40 border border-slate-200/40 dark:border-slate-800/40 text-[11px] text-slate-500 dark:text-slate-400 flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-4">
              {childPrice > 0 && (
                <div>
                  <strong>Child without bed:</strong> {formatPrice(childPrice)}
                </div>
              )}
              {infantPrice > 0 && (
                <div>
                  <strong>Infant rate:</strong> {formatPrice(infantPrice)}
                </div>
              )}
            </div>
            <div className="text-[10px] text-slate-400">
              * Rates are indicative. Final rates subject to airline availability and PKR conversion rate fluctuations.
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
