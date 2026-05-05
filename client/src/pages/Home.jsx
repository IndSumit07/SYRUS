import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Hero from "../components/Hero";
import { useAuth } from "../contexts/AuthContext";
import {
  ArrowRight,
  Compass,
  Briefcase,
  Plus,
  Search,
  Bot,
  BarChart3,
  ShieldCheck,
  FileText,
  Database,
  Zap,
  Globe,
  CheckCircle2,
  ArrowUpRight,
} from "lucide-react";

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const displayName =
    user?.user_metadata?.full_name || user?.name || user?.email || "User";

  if (!user) {
    return (
      <main className="syrus-bg">
        <Hero />

        
        <section className="py-10 md:py-14">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: "Minutes to first audit",
                  copy: "Connect a URL and generate an SEO snapshot without setup overhead.",
                  icon: Zap,
                },
                {
                  title: "Deep crawl coverage",
                  copy: "Surface structure, headings, links, and missing metadata in one pass.",
                  icon: Globe,
                },
                {
                  title: "Action-ready reports",
                  copy: "Export insights to share with clients or your internal growth team.",
                  icon: FileText,
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="bg-white/80 backdrop-blur rounded-3xl border border-white/60 p-6 shadow-sm hover:shadow-lg transition-shadow"
                >
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center mb-4">
                    <item.icon size={22} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                    {item.copy}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        
        <section id="capabilities" className="py-14 md:py-20">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
              <div>
                <p className="text-sm font-bold tracking-[0.2em] text-orange-500 uppercase">
                  Signal stack
                </p>
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-3">
                  Built for real-time SEO intelligence
                </h2>
                <p className="text-gray-600 mt-3 max-w-2xl">
                  SYRUS unifies crawling, scoring, and reporting so you can move
                  from raw pages to clear priorities fast.
                </p>
              </div>
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 text-orange-600 font-bold hover:text-orange-700"
              >
                Start free <ArrowUpRight size={16} />
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Crawler orchestration",
                  copy: "Launch scans per project or schedule recurring checks.",
                  icon: Search,
                },
                {
                  title: "AI-assisted insights",
                  copy: "Summarize opportunities and highlight impact-heavy fixes.",
                  icon: Bot,
                },
                {
                  title: "Live SEO scoring",
                  copy: "Track score changes across scans with clear benchmarks.",
                  icon: BarChart3,
                },
                {
                  title: "Metadata guardrails",
                  copy: "Detect missing titles, descriptions, and canonicals.",
                  icon: ShieldCheck,
                },
                {
                  title: "Content structure",
                  copy: "Validate heading hierarchy and content depth at a glance.",
                  icon: Database,
                },
                {
                  title: "Client-ready exports",
                  copy: "Deliver polished reports that are ready to present.",
                  icon: FileText,
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="bg-white rounded-[28px] border border-gray-100 p-6 hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-xl"
                >
                  <div className="w-12 h-12 rounded-2xl bg-gray-50 text-gray-700 flex items-center justify-center mb-4">
                    <item.icon size={22} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                    {item.copy}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        
        <section className="py-14 md:py-20">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              <div>
                <p className="text-sm font-bold tracking-[0.2em] text-gray-500 uppercase">
                  How it works
                </p>
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-3">
                  Go from URL to action plan in three moves
                </h2>
                <p className="text-gray-600 mt-4">
                  Each scan gives you an audit score, prioritized fixes, and
                  technical context so your next step is always clear.
                </p>
                <div className="mt-6 space-y-4">
                  {[
                    "Connect a project URL and define your scan scope",
                    "Run the crawler and review the live SEO report",
                    "Share the report or export insights for your team",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-3 text-gray-700"
                    >
                      <CheckCircle2
                        className="text-orange-500 mt-0.5"
                        size={18}
                      />
                      <span className="font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-4">
                {[1, 2, 3].map((step) => (
                  <div
                    key={step}
                    className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-4xl font-extrabold text-orange-500">
                        0{step}
                      </span>
                      <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-300">
                        Step
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mt-4">
                      {step === 1 && "Create a project"}
                      {step === 2 && "Launch a crawl"}
                      {step === 3 && "Prioritize fixes"}
                    </h3>
                    <p className="text-sm text-gray-600 mt-2">
                      {step === 1 &&
                        "Set the target URL, define your scope, and save the workspace."}
                      {step === 2 &&
                        "Run the scan to capture metadata, headings, and link quality."}
                      {step === 3 &&
                        "Review impactful recommendations and share the results."}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        
        <section className="py-14 md:py-20">
          <div className="max-w-6xl mx-auto px-6">
            <div className="bg-white rounded-[36px] border border-gray-100 shadow-sm overflow-hidden">
              <div className="grid lg:grid-cols-[1.2fr_1fr] gap-0">
                <div className="p-8 md:p-12">
                  <p className="text-sm font-bold tracking-[0.2em] text-gray-500 uppercase">
                    Live insight
                  </p>
                  <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-3">
                    Everything your team needs in one report
                  </h2>
                  <p className="text-gray-600 mt-4">
                    SYRUS centralizes technical diagnostics, content quality,
                    and opportunity scoring so decisions happen faster.
                  </p>
                  <div className="mt-6 grid sm:grid-cols-2 gap-4">
                    {[
                      "Score trends over time",
                      "Headings and content depth",
                      "Image and link integrity",
                      "Actionable priorities",
                    ].map((item) => (
                      <div
                        key={item}
                        className="flex items-center gap-2 text-sm font-medium text-gray-700"
                      >
                        <span className="h-2 w-2 rounded-full bg-orange-500"></span>
                        {item}
                      </div>
                    ))}
                  </div>
                  <Link
                    to="/signup"
                    className="inline-flex items-center gap-2 mt-8 bg-[#FD6000] text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-orange-200 hover:bg-orange-600 transition-colors"
                  >
                    Start a free audit <ArrowRight size={18} />
                  </Link>
                </div>

                <div className="bg-gray-50 p-8 md:p-10 border-l border-gray-100">
                  <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-400 uppercase font-bold">
                          Latest scan
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                          syrusapp.com
                        </p>
                      </div>
                      <div className="w-14 h-14 rounded-full border-4 border-orange-500 text-orange-600 flex items-center justify-center font-bold">
                        84
                      </div>
                    </div>

                    <div className="mt-6 space-y-4">
                      {[
                        "Missing meta description",
                        "Heading order needs cleanup",
                        "Images without alt text",
                      ].map((item) => (
                        <div
                          key={item}
                          className="flex items-center justify-between bg-gray-50 rounded-2xl px-4 py-3"
                        >
                          <span className="text-sm font-medium text-gray-700">
                            {item}
                          </span>
                          <span className="text-xs font-bold text-orange-500">
                            Fix
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 bg-orange-50 rounded-2xl p-4 border border-orange-100">
                      <p className="text-xs font-bold text-orange-500 uppercase">
                        Opportunity
                      </p>
                      <p className="text-sm font-medium text-gray-700 mt-1">
                        Improve title length for higher click-through rate.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        
        <section className="py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-6">
            <div className="relative overflow-hidden rounded-[36px] bg-[#FD6000] text-white p-10 md:p-14 shadow-2xl">
              <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-white/10"></div>
              <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-white/10"></div>
              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                <div>
                  <h2 className="text-3xl md:text-4xl font-extrabold">
                    Launch your next SEO audit today
                  </h2>
                  <p className="text-white/80 mt-3 max-w-2xl">
                    Build faster decisions with a dashboard designed for
                    real-time insights, clear priorities, and client-ready
                    exports.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link
                    to="/signup"
                    className="bg-white text-[#FD6000] px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-orange-50 transition-colors"
                  >
                    Create free account
                  </Link>
                  <Link
                    to="/signin"
                    className="px-6 py-3 rounded-xl font-bold border border-white/40 hover:bg-white/10 transition-colors"
                  >
                    Sign in
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      
      
      <div className="bg-white rounded-[32px] p-8 lg:p-12 shadow-sm border border-orange-50 relative overflow-hidden group">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-orange-50/50 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-100 rounded-full px-4 py-1.5 mb-8">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FD6000]"></span>
            </span>
            <span className="text-xs font-bold text-[#FD6000] tracking-wide uppercase">
              Welcome back
            </span>
          </div>

          <h1 className="text-4xl lg:text-6xl font-extrabold text-gray-900 mb-2 tracking-tight">
            Hello,{" "}
            <span className="text-gray-900">{displayName.split(" ")[0]}!</span>
          </h1>
          <h2 className="text-4xl lg:text-6xl font-extrabold text-[#FD6000] mb-6 tracking-tight">
            Ready to scale up?
          </h2>

          <p className="text-gray-500 text-lg lg:text-xl mb-10 leading-relaxed max-w-lg font-medium">
            SYRUS empowers you to scrape data effortlessly and gain market
            insights to grow your business exponentially.
          </p>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => navigate("/projects")}
              className="bg-[#FD6000] hover:bg-orange-600 text-white px-8 py-4 rounded-2xl font-bold text-base shadow-xl shadow-orange-200 transition-all hover:-translate-y-1 flex items-center gap-2"
            >
              Go to Workspace <ArrowRight size={20} />
            </button>
            <button
              onClick={() => navigate("/seo")}
              className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-8 py-4 rounded-2xl font-bold text-base transition-all hover:-translate-y-1 flex items-center gap-2 hover:border-gray-300 hover:shadow-sm"
            >
              Explore Tools <Compass size={20} />
            </button>
          </div>
        </div>
      </div>

      
      
      <div className="grid md:grid-cols-3 gap-6">
        
        <Link
          to="/projects"
          className="bg-white p-8 rounded-[32px] border border-gray-100 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 group cursor-pointer relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-[100px] -mr-4 -mt-4 transition-transform group-hover:scale-110 duration-500"></div>
          <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-6 relative z-10 group-hover:scale-110 transition-transform duration-300">
            <Plus size={28} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3 relative z-10">
            New Project
          </h3>
          <p className="text-gray-500 text-sm leading-relaxed mb-6 relative z-10">
            Start a new data extraction project from any URL or supported
            platform instantly.
          </p>
          <span className="text-blue-500 font-bold text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
            Create <ArrowRight size={16} />
          </span>
        </Link>

        
        <Link
          to="/seo"
          className="bg-white p-8 rounded-[32px] border border-gray-100 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 group cursor-pointer relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-bl-[100px] -mr-4 -mt-4 transition-transform group-hover:scale-110 duration-500"></div>
          <div className="w-14 h-14 bg-purple-50 text-purple-500 rounded-2xl flex items-center justify-center mb-6 relative z-10 group-hover:scale-110 transition-transform duration-300">
            <Compass size={28} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3 relative z-10">
            Market Intelligence
          </h3>
          <p className="text-gray-500 text-sm leading-relaxed mb-6 relative z-10">
            Analyze market trends and competitor data with our AI-driven
            insights engine.
          </p>
          <span className="text-purple-500 font-bold text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
            Browse <ArrowRight size={16} />
          </span>
        </Link>

        
        <Link
          to="/projects"
          className="bg-white p-8 rounded-[32px] border border-gray-100 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 group cursor-pointer relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-bl-[100px] -mr-4 -mt-4 transition-transform group-hover:scale-110 duration-500"></div>
          <div className="w-14 h-14 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center mb-6 relative z-10 group-hover:scale-110 transition-transform duration-300">
            <Briefcase size={28} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3 relative z-10">
            My Projects
          </h3>
          <p className="text-gray-500 text-sm leading-relaxed mb-6 relative z-10">
            Access your saved scrapes, reports, and exported datasets in one
            place.
          </p>
          <span className="text-green-500 font-bold text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
            View Projects <ArrowRight size={16} />
          </span>
        </Link>
      </div>
    </div>
  );
};

export default Home;
