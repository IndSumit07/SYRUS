import React from "react";

const ProjectDetailsSkeleton = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg skeleton"></div>
          <div className="space-y-2">
            <div className="h-6 w-64 rounded-lg skeleton"></div>
            <div className="h-4 w-40 rounded-lg skeleton"></div>
          </div>
        </div>
        <div className="h-12 w-40 rounded-xl skeleton"></div>
      </div>

      <div className="border-b border-gray-200">
        <div className="flex gap-8">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="h-10 w-24 rounded-lg skeleton mb-3"></div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-5">
          <div className="h-5 w-48 rounded-lg skeleton"></div>
          <div className="h-16 w-24 rounded-2xl skeleton"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-20 rounded-xl skeleton"></div>
            <div className="h-20 rounded-xl skeleton"></div>
          </div>
          <div className="h-10 w-full rounded-xl skeleton"></div>
        </div>
        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
          <div className="h-5 w-56 rounded-lg skeleton mb-6"></div>
          <div className="h-64 rounded-2xl skeleton"></div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsSkeleton;
