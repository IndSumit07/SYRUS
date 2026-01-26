import React from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="flex flex-col w-full items-center pt-16 pb-20 px-4 md:px-10">

      {/* Hero Content - Matching Reference Image Style */}
      <div className="flex flex-col gap-6 justify-center items-center text-center max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 leading-[1.1] tracking-tight">
          SEO Intelligence & <br /> Data Analytics
        </h1>

        <p className="text-xl md:text-2xl font-medium text-gray-500 max-w-3xl">
          <span className="text-orange font-bold">SYRUS</span> turns scraped web data into actionable insights using AI & Power BI.
        </p>

        <div className="mt-6 flex flex-row gap-4">
          <Link
            to="/signup"
            className="bg-orange text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-[#e05500] transition-colors shadow-lg shadow-orange/30"
          >
            Get Started
          </Link>
          <button className="bg-white text-orange border border-orange px-8 py-3 rounded-lg font-bold text-lg hover:bg-orange/10 transition-colors">
            Learn More
          </button>
        </div>
      </div>

      {/* Visuals Section */}
      <div className="relative mt-16 w-full max-w-6xl mx-auto h-[280px] md:h-[500px] flex justify-center">
        {/* Desktop Frame */}
        <div className="rounded-xl md:rounded-2xl bg-gray-100 p-1.5 md:p-2.5 border border-gray-200 shadow-xl relative z-10 w-[80%] md:w-[90%] max-w-[800px] h-full overflow-hidden">
          <div className="relative w-full h-full bg-gray-50 rounded-lg md:rounded-xl overflow-hidden flex items-center justify-center border border-dashed border-gray-300">
            <span className="text-gray-400 font-medium">Dashboard Preview Placeholder</span>
          </div>
        </div>

        {/* Mobile Frame */}
        <div className="absolute top-10 -right-4 md:top-20 md:right-10 z-20 rounded-2xl md:rounded-3xl bg-gray-100 p-1 md:p-1.5 border border-gray-200 shadow-2xl w-[90px] h-[180px] md:w-[220px] md:h-[420px]">
          <div className="w-full h-full bg-gray-50 rounded-xl md:rounded-2xl overflow-hidden relative flex items-center justify-center border border-dashed border-gray-300">
            <span className="text-gray-400 text-xs md:text-sm font-medium text-center px-2">Mobile Stats</span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Hero;
