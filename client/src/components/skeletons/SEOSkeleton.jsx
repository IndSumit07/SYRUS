import React from "react";

const SEOSkeleton = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-2">
          <div className="h-8 w-56 rounded-xl skeleton"></div>
          <div className="h-4 w-80 rounded-lg skeleton"></div>
        </div>
        <div className="h-10 w-40 rounded-xl skeleton"></div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div
            key={idx}
            className="bg-white rounded-[24px] border border-gray-100 p-6"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="space-y-2 flex-1 pr-4">
                <div className="h-5 w-32 rounded-lg skeleton"></div>
                <div className="h-4 w-48 rounded-lg skeleton"></div>
              </div>
              <div className="h-12 w-12 rounded-full skeleton"></div>
            </div>
            <div className="h-4 w-40 rounded-lg skeleton mb-5"></div>
            <div className="space-y-2">
              <div className="h-4 w-full rounded-lg skeleton"></div>
              <div className="h-4 w-5/6 rounded-lg skeleton"></div>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-50">
              <div className="h-9 w-full rounded-xl skeleton"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SEOSkeleton;
