import React from 'react';

export default function Loading() {
  return (
    <div className="w-full space-y-6 animate-pulse">
      {/* Skeleton Top Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
        <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl w-full" />
        <div className="flex gap-2 overflow-hidden pt-2">
          <div className="h-7 bg-slate-200 dark:bg-slate-800 rounded-full w-20 flex-shrink-0" />
          <div className="h-7 bg-slate-200 dark:bg-slate-800 rounded-full w-28 flex-shrink-0" />
          <div className="h-7 bg-slate-200 dark:bg-slate-800 rounded-full w-24 flex-shrink-0" />
          <div className="h-7 bg-slate-200 dark:bg-slate-800 rounded-full w-32 flex-shrink-0" />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Skeleton Sidebar (Left Column) - Hidden on Mobile */}
        <aside className="w-[290px] flex-shrink-0 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hidden lg:block space-y-6">
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-1/2 mb-4" />
          <div className="space-y-3">
            <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-xl w-full" />
            <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded-xl w-full" />
            <div className="h-20 bg-slate-200 dark:bg-slate-800 rounded-xl w-full" />
            <div className="h-16 bg-slate-200 dark:bg-slate-800 rounded-xl w-full" />
          </div>
        </aside>

        {/* Skeleton Result Cards (Right Column) */}
        <div className="flex-1 space-y-4">
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-48" />
          
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
            >
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800" />
                <div className="space-y-2">
                  <div className="h-3.5 bg-slate-200 dark:bg-slate-800 rounded w-28" />
                  <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-44" />
                </div>
              </div>

              <div className="flex gap-6 w-full md:w-auto">
                <div className="space-y-2">
                  <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-16" />
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-24" />
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-12" />
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-20" />
                </div>
              </div>

              <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                <div className="space-y-2">
                  <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-16" />
                  <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-24" />
                </div>
                <div className="w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
