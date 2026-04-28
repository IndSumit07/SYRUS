import React from "react";

const HistorySkeleton = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-10">
      <div className="space-y-2">
        <div className="h-8 w-56 rounded-xl skeleton"></div>
        <div className="h-4 w-80 rounded-lg skeleton"></div>
      </div>

      {Array.from({ length: 3 }).map((_, groupIdx) => (
        <div key={groupIdx} className="space-y-4">
          <div className="h-4 w-32 rounded-lg skeleton ml-2"></div>
          <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
            {Array.from({ length: 3 }).map((__, itemIdx) => (
              <div key={itemIdx} className="p-6 flex items-start gap-4">
                <div className="h-10 w-10 rounded-full skeleton"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-40 rounded-lg skeleton"></div>
                  <div className="h-3 w-64 rounded-lg skeleton"></div>
                </div>
                <div className="h-3 w-16 rounded-lg skeleton"></div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default HistorySkeleton;
