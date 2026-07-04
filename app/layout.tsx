import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Compass, PhoneCall, MessageSquare, Mail, MapPin, ShieldCheck } from 'lucide-react';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Umrah Group Packages 2026 | Live Availability & Hotel Combos',
  description: 'Browse, compare, and lock in direct Umrah travel packages for 2026 with live flight seats, dynamic hotel combos in Makkah and Medina, and instant WhatsApp booking.',
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
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

            {/* Quick Contact buttons */}
            <div className="flex items-center gap-2 sm:gap-3">
              <a
                href="tel:+92511234567"
                className="p-2 sm:px-4 sm:py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-650 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors flex items-center gap-1.5"
                title="Call agency support"
              >
                <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline">Call Office</span>
              </a>
              <a
                href="https://wa.me/923000000000?text=Salam%2C%20I%20want%20to%20inquire%20about%20your%20latest%20Umrah%20packages."
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 sm:px-4 sm:py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-800/10 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5 fill-current" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {children}
        </div>

        {/* Premium footer */}
        <footer className="w-full bg-white dark:bg-slate-950 border-t border-slate-150 dark:border-slate-900 mt-16 transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10 border-b border-slate-100 dark:border-slate-900">
              
              {/* Col 1: Brand details */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-emerald-800 rounded-lg flex items-center justify-center text-white">
                    <Compass className="w-5 h-5" />
                  </div>
                  <span className="font-extrabold text-sm tracking-tight text-slate-800 dark:text-white uppercase">
                    Umrah Packages
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
                  Umrah Packages is a premium search portal specializing in showcasing live flight departures, seat availability, and accommodation combinations in Makkah and Medina.
                </p>
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Licensed Umrah Organiser · Govt of Pakistan</span>
                </div>
              </div>

              {/* Col 2: Direct Contacts */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Contact Information
                </h4>
                <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
                  <li className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-500 flex-shrink-0" />
                    <span>Office 12, Ground Floor, Beverly Centre, Blue Area, Islamabad, Pakistan</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <PhoneCall className="w-4 h-4 text-emerald-600 dark:text-emerald-500 flex-shrink-0" />
                    <a href="tel:+92511234567" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                      +92 51 123 4567
                    </a>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-emerald-600 dark:text-emerald-500 flex-shrink-0" />
                    <a href="mailto:info@fasttravels.com.pk" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                      info@fasttravels.com.pk
                    </a>
                  </li>
                </ul>
              </div>

              {/* Col 3: Disclaimer info */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Booking Disclaimer
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  This website serves as a live marketing listing page showcasing current group flight and hotel packages. Rates, schedules, and visa requirements are subject to third-party providers. No transaction takes place on this platform. Reach out to verify seats.
                </p>
              </div>

            </div>

            {/* Copyright & Meta */}
            <div className="flex flex-col sm:flex-row justify-between items-center pt-8 gap-4 text-[11px] text-slate-400 dark:text-slate-500">
              <div>
                © {new Date().getFullYear()} Umrah Packages. All Rights Reserved.
              </div>
              <div className="flex gap-4">
                <a href="#" className="hover:underline">Privacy Policy</a>
                <a href="#" className="hover:underline">Terms of Service</a>
                <a href="#" className="hover:underline">XML API Integration</a>
              </div>
            </div>
          </div>
        </footer>

      </body>
    </html>
  );
}
