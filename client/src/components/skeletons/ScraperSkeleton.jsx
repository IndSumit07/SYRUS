import React from "react";

const ScraperSkeleton = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-2">
        <div className="h-8 w-48 rounded-xl skeleton"></div>
        <div className="h-4 w-72 rounded-lg skeleton"></div>
      </div>

      <div className="bg-white rounded-[32px] p-8 shadow-sm border border-orange-50">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="h-4 w-32 rounded-lg skeleton"></div>
            <div className="h-12 w-full rounded-xl skeleton"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 w-28 rounded-lg skeleton"></div>
            <div className="h-12 w-full rounded-xl skeleton"></div>
          </div>
        </div>
        <div className="pt-6 flex items-center justify-end">
          <div className="h-12 w-44 rounded-xl skeleton"></div>
        </div>
      </div>
    </div>
  );
};

export default ScraperSkeleton;
