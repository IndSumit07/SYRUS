import React from "react";
import Hero from "../components/Hero";
import { useAuth } from "../contexts/AuthContext";
import { ArrowRight, Compass, Briefcase, Plus } from "lucide-react";

const Home = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <main>
        <Hero />
      </main>
    );
  }

  // Dashboard Home View
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Welcome Section */}
      {/* Welcome Section */}
      <div className="bg-white rounded-[32px] p-8 lg:p-12 shadow-sm border border-orange-50 relative overflow-hidden group">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-orange-50/50 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-100 rounded-full px-4 py-1.5 mb-8">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FD6000]"></span>
            </span>
            <span className="text-xs font-bold text-[#FD6000] tracking-wide uppercase">Welcome back</span>
          </div>

          <h1 className="text-4xl lg:text-6xl font-extrabold text-gray-900 mb-2 tracking-tight">
            Hello, <span className="text-gray-900">{user.user_metadata?.full_name?.split(' ')[0] || "User"}!</span>
          </h1>
          <h2 className="text-4xl lg:text-6xl font-extrabold text-[#FD6000] mb-6 tracking-tight">
            Ready to scale up?
          </h2>

          <p className="text-gray-500 text-lg lg:text-xl mb-10 leading-relaxed max-w-lg font-medium">
            SYRUS empowers you to scrape data effortlessly and gain market insights to grow your business exponentially.
          </p>

          <div className="flex flex-wrap gap-4">
            <button className="bg-[#FD6000] hover:bg-orange-600 text-white px-8 py-4 rounded-2xl font-bold text-base shadow-xl shadow-orange-200 transition-all hover:-translate-y-1 flex items-center gap-2">
              Go to Workspace <ArrowRight size={20} />
            </button>
            <button className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-8 py-4 rounded-2xl font-bold text-base transition-all hover:-translate-y-1 flex items-center gap-2 hover:border-gray-300 hover:shadow-sm">
              Explore Tools <Compass size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="bg-white p-8 rounded-[32px] border border-gray-100 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 group cursor-pointer relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-[100px] -mr-4 -mt-4 transition-transform group-hover:scale-110 duration-500"></div>
          <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-6 relative z-10 group-hover:scale-110 transition-transform duration-300">
            <Plus size={28} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3 relative z-10">New Scraper</h3>
          <p className="text-gray-500 text-sm leading-relaxed mb-6 relative z-10">
            Start a new data extraction project from any URL or supported platform instantly.
          </p>
          <span className="text-blue-500 font-bold text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
            Create <ArrowRight size={16} />
          </span>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-8 rounded-[32px] border border-gray-100 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 group cursor-pointer relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-bl-[100px] -mr-4 -mt-4 transition-transform group-hover:scale-110 duration-500"></div>
          <div className="w-14 h-14 bg-purple-50 text-purple-500 rounded-2xl flex items-center justify-center mb-6 relative z-10 group-hover:scale-110 transition-transform duration-300">
            <Compass size={28} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3 relative z-10">Market Intelligence</h3>
          <p className="text-gray-500 text-sm leading-relaxed mb-6 relative z-10">
            Analyze market trends and competitor data with our AI-driven insights engine.
          </p>
          <span className="text-purple-500 font-bold text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
            Browse <ArrowRight size={16} />
          </span>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-8 rounded-[32px] border border-gray-100 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 group cursor-pointer relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-bl-[100px] -mr-4 -mt-4 transition-transform group-hover:scale-110 duration-500"></div>
          <div className="w-14 h-14 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center mb-6 relative z-10 group-hover:scale-110 transition-transform duration-300">
            <Briefcase size={28} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3 relative z-10">My Projects</h3>
          <p className="text-gray-500 text-sm leading-relaxed mb-6 relative z-10">
            Access your saved scrapes, reports, and exported datasets in one place.
          </p>
          <span className="text-green-500 font-bold text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
            View Projects <ArrowRight size={16} />
          </span>
        </div>
      </div>
    </div>
  );
};

export default Home;
