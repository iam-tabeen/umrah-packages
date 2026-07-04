import React from 'react';
import { fetchUmrahPackages } from '../lib/umrahApi';
import { PackagesExplorer } from '../components/PackagesExplorer';

// Enable Incremental Static Regeneration (ISR) with a 15-minute revalidation interval
export const revalidate = 900;

export default async function Home() {
  // Fetch live packages data on the server
  const { groups, isFallback } = await fetchUmrahPackages();

  return (
    <div className="w-full space-y-6">
      {/* Intro hero banner */}
      <div className="relative overflow-hidden bg-emerald-900 text-white rounded-3xl p-6 sm:p-10 shadow-lg shadow-emerald-900/10">
        {/* Background glow effects */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-700/30 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />
        
        <div className="relative max-w-3xl space-y-3 sm:space-y-4">
          <span className="inline-block px-3 py-1 bg-emerald-800 text-amber-400 text-xs font-bold uppercase tracking-wider rounded-full border border-emerald-700/50">
            Premium Travel Listings
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Compare Live Umrah Packages for 2026
          </h1>
          <p className="text-sm sm:text-base text-emerald-150 max-w-xl font-medium leading-relaxed">
            Browse and filter live group flight packages, compare hotel accommodation plans, and secure seat availability instantly. Tap <strong className="text-white">Book Now</strong> to get connected with a travel agent.
          </p>
        </div>
      </div>

      {/* Explorer listings layout */}
      <PackagesExplorer initialData={groups} isFallback={isFallback} />
    </div>
  );
}
