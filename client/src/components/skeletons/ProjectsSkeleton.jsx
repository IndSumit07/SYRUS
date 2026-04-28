import React from "react";

const ProjectsSkeleton = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-8 w-48 rounded-xl skeleton"></div>
          <div className="h-4 w-72 rounded-lg skeleton"></div>
        </div>
        <div className="h-11 w-40 rounded-xl skeleton"></div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl border border-gray-100">
            <div className="flex justify-between items-start mb-5">
              <div className="h-12 w-12 rounded-2xl skeleton"></div>
              <div className="h-8 w-8 rounded-lg skeleton"></div>
            </div>
            <div className="h-5 w-3/4 rounded-lg skeleton mb-2"></div>
            <div className="h-4 w-full rounded-lg skeleton mb-6"></div>
            <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
              <div className="h-4 w-24 rounded-lg skeleton"></div>
              <div className="h-4 w-24 rounded-lg skeleton"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsSkeleton;
