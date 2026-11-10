'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, RefreshCw, X, ChevronRight, SlidersHorizontal, AlertCircle } from 'lucide-react';
import { FlightGroup } from '../lib/types';
import { FlightGroupCard } from './FlightGroupCard';
import { RangeSlider } from './RangeSlider';

interface PackagesExplorerProps {
  initialData: FlightGroup[];
  isFallback: boolean;
}

export function PackagesExplorer({ initialData, isFallback }: PackagesExplorerProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // --- Filter State ---
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([]);
  const [selectedNights, setSelectedNights] = useState<number[]>([]);
  const [selectedMakkahHotels, setSelectedMakkahHotels] = useState<string[]>([]);
  const [selectedMedinahHotels, setSelectedMedinahHotels] = useState<string[]>([]);
  const [makkahHotelSearch, setMakkahHotelSearch] = useState('');
  const [medinahHotelSearch, setMedinahHotelSearch] = useState('');
  const [departureMonth, setDepartureMonth] = useState<'all' | 'week' | 'month' | 'next_month'>('all');
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [sortOption, setSortOption] = useState<'price_asc' | 'price_desc' | 'date_asc' | 'nights_desc' | 'nights_asc'>('date_asc');

  // --- Price Slider Bounds & State ---
  const { absoluteMinPrice, absoluteMaxPrice } = useMemo(() => {
    const allPrices = initialData.flatMap(g => g.packages.map(p => p.sharing)).filter(p => p > 0);
    return {
      absoluteMinPrice: allPrices.length > 0 ? Math.min(...allPrices) : 100000,
      absoluteMaxPrice: allPrices.length > 0 ? Math.max(...allPrices) : 800000,
    };
  }, [initialData]);

  const [priceRange, setPriceRange] = useState<[number, number]>([absoluteMinPrice, absoluteMaxPrice]);

  // Reset slider range when initialData changes (or on mount)
  useEffect(() => {
    setPriceRange([absoluteMinPrice, absoluteMaxPrice]);
  }, [absoluteMinPrice, absoluteMaxPrice]);

  // --- Mobile Filter Drawer State ---
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // --- Derived Unique Lists for Filters ---
  const uniqueSectors = useMemo(() => {
    const sectors = new Set<string>();
    initialData.forEach(g => {
      if (g.sectorFrom && g.sectorTo) {
        sectors.add(`${g.sectorFrom}-${g.sectorTo}`);
      }
    });
    return Array.from(sectors);
  }, [initialData]);

  const uniqueAirlines = useMemo(() => {
    const airlinesMap = new Map<string, string>();
    initialData.forEach(g => {
      if (g.airlineId && g.airline) {
        airlinesMap.set(g.airlineId, g.airline);
      }
    });
    return Array.from(airlinesMap.entries()).map(([id, name]) => ({ id, name }));
  }, [initialData]);

  const uniqueNights = useMemo(() => {
    const nights = new Set<number>();
    initialData.forEach(g => {
      if (g.nights) nights.add(g.nights);
    });
    return Array.from(nights).sort((a, b) => a - b);
  }, [initialData]);

  const uniqueMakkahHotels = useMemo(() => {
    const hotels = new Set<string>();
    initialData.forEach(g => {
      g.packages.forEach(p => {
        if (p.makkahHotel) hotels.add(p.makkahHotel.trim());
      });
    });
    return Array.from(hotels).sort();
  }, [initialData]);

  const uniqueMedinahHotels = useMemo(() => {
    const hotels = new Set<string>();
    initialData.forEach(g => {
      g.packages.forEach(p => {
        if (p.medinahHotel) hotels.add(p.medinahHotel.trim());
      });
    });
    return Array.from(hotels).sort();
  }, [initialData]);

  // --- Searchable Hotel lists ---
  const filteredUniqueMakkahHotels = useMemo(() => {
    return uniqueMakkahHotels.filter(h =>
      h.toLowerCase().includes(makkahHotelSearch.toLowerCase())
    );
  }, [uniqueMakkahHotels, makkahHotelSearch]);

  const filteredUniqueMedinahHotels = useMemo(() => {
    return uniqueMedinahHotels.filter(h =>
      h.toLowerCase().includes(medinahHotelSearch.toLowerCase())
    );
  }, [uniqueMedinahHotels, medinahHotelSearch]);

  // --- Filtering Pipeline ---
  const filteredData = useMemo(() => {
    const today = new Date();
    // Start of today (midnight) for clean comparisons
    today.setHours(0, 0, 0, 0);

    const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const endOfCurrentMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59);
    
    // Start of next month
    const startOfNextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    // End of next month
    const endOfNextMonth = new Date(today.getFullYear(), today.getMonth() + 2, 0, 23, 59, 59);

    return initialData
      .map(group => {
        // Filter the package configurations inside the flight group
        const matchedPackages = group.packages.filter(pkg => {
          // 1. Text Search Filter (group title, makkah hotel, medinah hotel, package code)
          if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const matchQuery =
              group.groupTitle.toLowerCase().includes(query) ||
              pkg.makkahHotel.toLowerCase().includes(query) ||
              pkg.medinahHotel.toLowerCase().includes(query) ||
              pkg.packageCode.toLowerCase().includes(query);
            if (!matchQuery) return false;
          }

          // 2. Makkah Hotel Checkboxes
          if (selectedMakkahHotels.length > 0) {
            if (!selectedMakkahHotels.includes(pkg.makkahHotel.trim())) return false;
          }

          // 3. Medinah Hotel Checkboxes
          if (selectedMedinahHotels.length > 0) {
            if (!selectedMedinahHotels.includes(pkg.medinahHotel.trim())) return false;
          }

          // 4. Price range (Sharing room price)
          if (pkg.sharing < priceRange[0] || pkg.sharing > priceRange[1]) {
            return false;
          }

          return true;
        });

        if (matchedPackages.length === 0) return null;

        // Clone the group and attach matched packages
        const clonedGroup = { ...group, packages: matchedPackages };

        // Re-evaluate lowestSharingPrice based on the filtered packages
        clonedGroup.lowestSharingPrice = Math.min(...matchedPackages.map(p => p.sharing).filter(p => p > 0));

        // --- Apply Group-Level Filters ---

        // 5. Sector Chip Multi-select
        if (selectedSectors.length > 0) {
          const groupSector = `${clonedGroup.sectorFrom}-${clonedGroup.sectorTo}`;
          if (!selectedSectors.includes(groupSector)) return null;
        }

        // 6. Airline Checkboxes
        if (selectedAirlines.length > 0) {
          if (!selectedAirlines.includes(clonedGroup.airlineId)) return null;
        }

        // 7. Nights Checkboxes
        if (selectedNights.length > 0) {
          if (!selectedNights.includes(clonedGroup.nights)) return null;
        }

        // 8. Availability Toggle (seats > 0)
        if (onlyAvailable && clonedGroup.availableSeats <= 0) return null;

        // 9. Departure Month Window
        if (departureMonth !== 'all') {
          const depDate = new Date(clonedGroup.departureDate);
          if (isNaN(depDate.getTime())) return null;

          if (departureMonth === 'week') {
            if (depDate < today || depDate > weekFromNow) return null;
          } else if (departureMonth === 'month') {
            if (depDate < today || depDate > endOfCurrentMonth) return null;
          } else if (departureMonth === 'next_month') {
            if (depDate < startOfNextMonth || depDate > endOfNextMonth) return null;
          }
        }

        return clonedGroup;
      })
      .filter((g): g is FlightGroup => g !== null);
  }, [
    initialData,
    searchQuery,
    selectedSectors,
    selectedAirlines,
    selectedNights,
    selectedMakkahHotels,
    selectedMedinahHotels,
    priceRange,
    departureMonth,
    onlyAvailable,
  ]);

  // --- Sorting ---
  const sortedData = useMemo(() => {
    const copy = [...filteredData];
    copy.sort((a, b) => {
      if (sortOption === 'price_asc') {
        return a.lowestSharingPrice - b.lowestSharingPrice;
      }
      if (sortOption === 'price_desc') {
        return b.lowestSharingPrice - a.lowestSharingPrice;
      }
      if (sortOption === 'date_asc') {
        return new Date(a.departureDate).getTime() - new Date(b.departureDate).getTime();
      }
      if (sortOption === 'nights_desc') {
        return b.nights - a.nights;
      }
      if (sortOption === 'nights_asc') {
        return a.nights - b.nights;
      }
      return 0;
    });
    return copy;
  }, [filteredData, sortOption]);

  // --- Reset All Filters ---
  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedSectors([]);
    setSelectedAirlines([]);
    setSelectedNights([]);
    setSelectedMakkahHotels([]);
    setSelectedMedinahHotels([]);
    setMakkahHotelSearch('');
    setMedinahHotelSearch('');
    setDepartureMonth('all');
    setOnlyAvailable(false);
    setPriceRange([absoluteMinPrice, absoluteMaxPrice]);
    setSortOption('date_asc');
  };

  const handleSectorToggle = (sector: string) => {
    setSelectedSectors(prev =>
      prev.includes(sector) ? prev.filter(s => s !== sector) : [...prev, sector]
    );
  };

  const handleAirlineToggle = (id: string) => {
    setSelectedAirlines(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const handleNightsToggle = (count: number) => {
    setSelectedNights(prev =>
      prev.includes(count) ? prev.filter(n => n !== count) : [...prev, count]
    );
  };

  const handleMakkahHotelToggle = (hotel: string) => {
    setSelectedMakkahHotels(prev =>
      prev.includes(hotel) ? prev.filter(h => h !== hotel) : [...prev, hotel]
    );
  };

  const handleMedinahHotelToggle = (hotel: string) => {
    setSelectedMedinahHotels(prev =>
      prev.includes(hotel) ? prev.filter(h => h !== hotel) : [...prev, hotel]
    );
  };

  // Render Sidebar Filters Content (reusable for desktop & mobile bottom sheet)
  const renderSidebarFilters = () => (
    <div className="space-y-6">
      {/* Availability Toggle */}
      <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
        <label htmlFor="available-toggle" className="text-xs font-semibold text-slate-700 dark:text-slate-200 select-none">
          Only Available Seats
        </label>
        <button
          id="available-toggle"
          onClick={() => setOnlyAvailable(!onlyAvailable)}
          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
            onlyAvailable ? 'bg-emerald-600' : 'bg-slate-200 dark:bg-slate-800'
          }`}
          role="switch"
          aria-checked={onlyAvailable}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
              onlyAvailable ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* Departure Month chip row */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2.5">
          Departure Window
        </h4>
        <div className="grid grid-cols-2 gap-1.5">
          {[
            { id: 'all', label: 'Anytime' },
            { id: 'week', label: 'This Week' },
            { id: 'month', label: 'This Month' },
            { id: 'next_month', label: 'Next Month' },
          ].map(opt => (
            <button
              key={opt.id}
              onClick={() => setDepartureMonth(opt.id as any)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border text-center transition-all cursor-pointer ${
                departureMonth === opt.id
                  ? 'bg-emerald-800 text-white border-emerald-800 shadow-sm'
                  : 'bg-transparent text-slate-600 border-slate-200 hover:border-slate-300 dark:text-slate-300 dark:border-slate-800'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Price range dual-slider */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
          Price Range (Sharing)
        </h4>
        <div className="px-1.5">
          <RangeSlider
            min={absoluteMinPrice}
            max={absoluteMaxPrice}
            value={priceRange}
            onChange={(val) => setPriceRange(val)}
          />
        </div>
      </div>

      {/* Airlines Checklist */}
      {uniqueAirlines.length > 0 && (
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2.5">
            Airlines
          </h4>
          <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
            {uniqueAirlines.map(airline => (
              <label
                key={airline.id}
                className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-300 cursor-pointer hover:text-slate-900 dark:hover:text-white select-none py-0.5"
              >
                <input
                  type="checkbox"
                  checked={selectedAirlines.includes(airline.id)}
                  onChange={() => handleAirlineToggle(airline.id)}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                />
                <span>{airline.name}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Nights Duration checklist */}
      {uniqueNights.length > 0 && (
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2.5">
            Duration (Nights)
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {uniqueNights.map(nights => (
              <button
                key={nights}
                onClick={() => handleNightsToggle(nights)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  selectedNights.includes(nights)
                    ? 'bg-emerald-800 text-white border-emerald-800 shadow-sm'
                    : 'bg-transparent text-slate-600 border-slate-200 hover:border-slate-300 dark:text-slate-300 dark:border-slate-800'
                }`}
              >
                {nights} Nights
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Searchable Makkah Hotels */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2.5">
          Makkah Hotels
        </h4>
        <div className="relative mb-2">
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search Makkah hotels..."
            value={makkahHotelSearch}
            onChange={(e) => setMakkahHotelSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
          />
        </div>
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          {filteredUniqueMakkahHotels.map(hotel => (
            <label
              key={hotel}
              className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-300 cursor-pointer hover:text-slate-900 dark:hover:text-white select-none py-0.5"
            >
              <input
                type="checkbox"
                checked={selectedMakkahHotels.includes(hotel)}
                onChange={() => handleMakkahHotelToggle(hotel)}
                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
              />
              <span className="line-clamp-1">{hotel}</span>
            </label>
          ))}
          {filteredUniqueMakkahHotels.length === 0 && (
            <div className="text-[10px] text-slate-400 py-1">No hotels match filter.</div>
          )}
        </div>
      </div>

      {/* Searchable Medinah Hotels */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2.5">
          Medina Hotels
        </h4>
        <div className="relative mb-2">
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search Medina hotels..."
            value={medinahHotelSearch}
            onChange={(e) => setMedinahHotelSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
          />
        </div>
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          {filteredUniqueMedinahHotels.map(hotel => (
            <label
              key={hotel}
              className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-300 cursor-pointer hover:text-slate-900 dark:hover:text-white select-none py-0.5"
            >
              <input
                type="checkbox"
                checked={selectedMedinahHotels.includes(hotel)}
                onChange={() => handleMedinahHotelToggle(hotel)}
                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
              />
              <span className="line-clamp-1">{hotel}</span>
            </label>
          ))}
          {filteredUniqueMedinahHotels.length === 0 && (
            <div className="text-[10px] text-slate-400 py-1">No hotels match filter.</div>
          )}
        </div>
      </div>
    </div>
  );

  if (!isMounted) {
    return (
      <div className="w-full space-y-6 animate-pulse">
        {/* Skeleton Top Search Bar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <div className="h-10 bg-slate-100 rounded-xl w-full" />
          <div className="flex gap-2 overflow-hidden pt-2">
            <div className="h-7 bg-slate-100 rounded-full w-20 flex-shrink-0" />
            <div className="h-7 bg-slate-100 rounded-full w-28 flex-shrink-0" />
            <div className="h-7 bg-slate-100 rounded-full w-24 flex-shrink-0" />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-[290px] flex-shrink-0 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hidden lg:block space-y-6">
            <div className="h-4 bg-slate-100 rounded-md w-1/2 mb-4" />
            <div className="space-y-3">
              <div className="h-8 bg-slate-100 rounded-xl w-full" />
              <div className="h-12 bg-slate-100 rounded-xl w-full" />
              <div className="h-20 bg-slate-100 rounded-xl w-full" />
            </div>
          </aside>

          <div className="flex-1 space-y-4">
            <div className="h-4 bg-slate-100 rounded-md w-48" />
            {[1, 2].map((i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
              >
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <div className="w-10 h-10 rounded-full bg-slate-100" />
                  <div className="space-y-2">
                    <div className="h-3.5 bg-slate-100 rounded w-28" />
                    <div className="h-5 bg-slate-150 rounded w-44" />
                  </div>
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                  <div className="space-y-2">
                    <div className="h-3 bg-slate-100 rounded w-16" />
                    <div className="h-6 bg-slate-100 rounded w-24" />
                  </div>
                  <div className="w-10 h-10 bg-slate-100 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 relative items-start">
      
      {/* Desktop Sidebar (Left Column) - Hidden on Mobile */}
      <aside className="w-[290px] flex-shrink-0 bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-100 dark:border-slate-900 shadow-sm sticky top-[108px] hidden lg:block max-h-[80vh] overflow-y-auto scrollbar-thin">
        <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800/80 mb-5">
          <h3 className="font-bold text-slate-800 dark:text-white text-sm">Filters</h3>
          <button
            onClick={handleClearFilters}
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-500 transition-colors"
          >
            Clear All
          </button>
        </div>
        {renderSidebarFilters()}
      </aside>

      {/* Main Listing Panel (Right Column) */}
      <main className="flex-1 min-w-0 w-full space-y-6">
        
        {/* API Fallback banner if necessary */}
        {isFallback && (
          <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/60 rounded-2xl flex items-start gap-3 text-amber-800 dark:text-amber-400 text-xs">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-amber-600 dark:text-amber-500" />
            <div className="space-y-1">
              <strong className="font-bold">Offline / Fallback Mode:</strong>
              <p>Unable to retrieve real-time data from the Live XML API. Currently displaying cached/mock packages for presentation. We are retrying connectivity automatically.</p>
            </div>
          </div>
        )}

        {/* Top Search & Layout Toolbar */}
        <div className="bg-white dark:bg-slate-950 p-4 lg:p-5 rounded-2xl border border-slate-100 dark:border-slate-900 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            {/* Direct Query Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search destination, hotels, flights, or package codes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Sort & Quick Filter Actions */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 bg-transparent text-xs w-full md:w-auto">
                <span className="text-slate-400 whitespace-nowrap font-medium">Sort By:</span>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value as any)}
                  className="bg-transparent font-bold text-slate-800 dark:text-slate-100 outline-none cursor-pointer w-full md:w-auto"
                >
                  <option value="date_asc">Departure Date (Soonest)</option>
                  <option value="price_asc">Price (Low to High)</option>
                  <option value="price_desc">Price (High to Low)</option>
                  <option value="nights_desc">Duration (Most Nights)</option>
                  <option value="nights_asc">Duration (Fewest Nights)</option>
                </select>
              </div>

              {/* Mobile Filter Button (lg:hidden) */}
              <button
                onClick={() => setIsMobileDrawerOpen(true)}
                className="flex lg:hidden items-center justify-center gap-1.5 px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <SlidersHorizontal className="w-4 h-4 text-emerald-600 dark:text-emerald-500" />
                <span>Filters</span>
              </button>
            </div>
          </div>

          {/* Sector Selection Horizontal Chips Row */}
          {uniqueSectors.length > 0 && (
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider hidden md:inline">Sectors:</span>
                
                {/* Default "All" Sector Chip */}
                <button
                  onClick={() => setSelectedSectors([])}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    selectedSectors.length === 0
                      ? 'bg-emerald-800 text-white shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  All Sectors
                </button>

                {uniqueSectors.map(sector => {
                  const isSelected = selectedSectors.includes(sector);
                  return (
                    <button
                      key={sector}
                      onClick={() => handleSectorToggle(sector)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-800 text-white shadow-sm'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {sector.replace('-', ' → ')}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Live Counters */}
        <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400">
          <div>
            Showing <strong className="text-slate-800 dark:text-slate-200">{sortedData.length}</strong> of{' '}
            <strong className="text-slate-850 dark:text-slate-100">{initialData.length}</strong> flight groups
          </div>
          {(selectedSectors.length > 0 ||
            selectedAirlines.length > 0 ||
            selectedNights.length > 0 ||
            selectedMakkahHotels.length > 0 ||
            selectedMedinahHotels.length > 0 ||
            searchQuery !== '' ||
            departureMonth !== 'all' ||
            onlyAvailable ||
            priceRange[0] !== absoluteMinPrice ||
            priceRange[1] !== absoluteMaxPrice) && (
            <button
              onClick={handleClearFilters}
              className="text-emerald-600 hover:text-emerald-500 font-semibold cursor-pointer"
            >
              Clear active filters
            </button>
          )}
        </div>

        {/* Results Listings */}
        <div className="space-y-4">
          {sortedData.map(group => (
            <FlightGroupCard
              key={group.groupOid}
              group={group}
            />
          ))}

          {/* Empty state fallback screen */}
          {sortedData.length === 0 && (
            <div className="text-center py-16 px-6 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-3xl space-y-5 shadow-sm max-w-lg mx-auto">
              <div className="w-16 h-16 bg-slate-50 dark:bg-slate-900 text-slate-400 rounded-full flex items-center justify-center mx-auto border border-slate-100 dark:border-slate-800/80">
                <Filter className="w-7 h-7" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">No Packages Match Your Criteria</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  Try broadening your search or resetting the active filters, airline selections, and price boundaries.
                </p>
              </div>
              <button
                onClick={handleClearFilters}
                className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-md hover:shadow-lg cursor-pointer"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </main>

      {/* --- Mobile slide-up bottom sheet filters (< 1024px) --- */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center lg:hidden bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300">
          
          {/* Overlay Click closer */}
          <div className="absolute inset-0" onClick={() => setIsMobileDrawerOpen(false)} />
          
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-950 rounded-t-3xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col transform translate-y-0 transition-transform duration-300 animate-slideUp">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 bg-emerald-800 text-white flex-shrink-0">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                <h3 className="font-semibold text-base">Filter & Sort</h3>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={handleClearFilters}
                  className="text-xs font-bold text-emerald-100 hover:text-white transition-colors"
                >
                  Reset
                </button>
                <button
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="p-1 rounded-full hover:bg-emerald-700/50 transition-colors"
                  aria-label="Close filters"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Filter Content */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              {renderSidebarFilters()}
            </div>

            {/* Bottom Actions sticky bar */}
            <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-900 bg-slate-50 dark:bg-slate-950 flex gap-3 flex-shrink-0">
              <button
                onClick={handleClearFilters}
                className="flex-1 py-3 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-semibold rounded-xl text-sm hover:bg-slate-100 transition-all cursor-pointer"
              >
                Clear Filters
              </button>
              <button
                onClick={() => setIsMobileDrawerOpen(false)}
                className="flex-1 py-3 bg-emerald-800 text-white font-semibold rounded-xl text-sm hover:bg-emerald-700 shadow-lg shadow-emerald-800/10 transition-all cursor-pointer"
              >
                Apply ({sortedData.length} Results)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Local slideUp animation styles */}
      <style jsx global>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slideUp {
          animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        /* Custom scrollbar to avoid system bar UI */
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
