import React from 'react';

export const SkeletonCard = () => {
  return (
    <div className="bg-parchment border border-rule overflow-hidden flex flex-col h-[450px] p-6 shadow-paper relative">
      {/* Top gold rule */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gold" />
      
      {/* Cover skeleton */}
      <div className="w-full h-48 bg-rule/30 mb-6" />
      
      {/* Content lines skeleton with print-sweep animation */}
      <div className="flex flex-col flex-1 gap-4 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-ink/5 to-transparent animate-print-sweep pointer-events-none" />
        
        {/* Genre */}
        <div className="h-3 w-16 bg-rule/50" />
        
        {/* Title */}
        <div className="space-y-2 mt-2">
          <div className="h-5 w-full bg-rule/50" />
          <div className="h-5 w-2/3 bg-rule/50" />
        </div>
        
        {/* Author */}
        <div className="h-4 w-1/2 bg-rule/50" />
        
        <div className="mt-auto flex items-center justify-between border-t border-rule pt-4">
          <div className="h-4 w-24 bg-rule/50" />
          <div className="h-4 w-12 bg-rule/50" />
        </div>
      </div>
    </div>
  );
};
