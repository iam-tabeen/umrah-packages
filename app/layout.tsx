import type { Metadata } from 'next';
import { Compass } from 'lucide-react';
import './globals.css';

export const metadata: Metadata = {
  title: 'Umrah Group Packages 2026 | Live Availability & Hotel Combos',
  description: 'Browse and compare Umrah travel packages for 2026 with live flight seats and hotel combos in Makkah and Medina.',
  keywords: ['Umrah packages 2026', 'Umrah group travel', 'PIA Umrah', 'Saudi Arabian Airlines Umrah', 'Makkah hotel packages', 'Medina hotel packages'],
  authors: [{ name: 'Umrah Packages' }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        
        {/* Sticky Header Nav */}
        <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-900/60 transition-all">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
            {/* Logo / Brand */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-800 rounded-xl flex items-center justify-center text-white shadow-md shadow-emerald-800/10">
                <Compass className="w-6 h-6 sm:w-7 sm:h-7 animate-pulse" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-sm sm:text-lg tracking-tight text-slate-800 dark:text-white uppercase leading-none">
                  Umrah Packages
                </span>
                <span className="text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 font-medium mt-1">
                  Live Availability & Hotel Combos
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {children}
        </div>

        <footer className="w-full bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pb-8 border-b border-slate-200 dark:border-slate-800">
              <div className="space-y-4 max-w-sm">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-emerald-800 rounded-lg flex items-center justify-center text-white">
                    <Compass className="w-5 h-5" />
                  </div>
                  <span className="font-extrabold text-sm tracking-tight text-slate-800 dark:text-white uppercase">
                    Umrah Packages
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Umrah Packages is a premium search portal specializing in showcasing live flight departures, seat availability, and accommodation combinations in Makkah and Medina.
                </p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500">
                  © {new Date().getFullYear()} Umrah Packages. All Rights Reserved.
                </p>
              </div>

              <div className="space-y-3 md:max-w-md md:justify-self-end">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Booking Disclaimer
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  This website serves as a live marketing listing page showcasing current group flight and hotel packages. Rates, schedules, and visa requirements are subject to third-party providers. No transaction takes place on this platform. Reach out to verify seats.
                </p>
              </div>
            </div>
          </div>
        </footer>

      </body>
    </html>
  );
}
