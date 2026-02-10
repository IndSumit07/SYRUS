import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import {
  TrendingUp, Globe, Clock, AlertTriangle, ArrowRight, Loader2, Search
} from "lucide-react";

const SEO = () => {
  const { api } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data } = await api.get("/projects");
      setProjects(data);
    } catch (error) {
      console.error("Failed to fetch projects", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[400px]">
        <Loader2 className="animate-spin text-orange-500" size={40} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">SEO Dashboard</h1>
          <p className="text-gray-500 mt-1">Track and optimize your projects' search performance</p>
        </div>
        <Link
          to="/projects"
          className="bg-[#FD6000] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-200 flex items-center gap-2"
        >
          <Search size={18} /> New Analysis
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[32px] border border-gray-100 shadow-sm">
          <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6 text-orange-400">
            <TrendingUp size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Projects Found</h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            Get started by creating a project and running your first SEO analysis to see insights here.
          </p>
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 bg-[#FD6000] text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors"
          >
            Create Project
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project._id}
              className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col h-full"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1 min-w-0 pr-4">
                  <h3 className="text-lg font-bold text-gray-900 truncate" title={project.name}>
                    {project.name}
                  </h3>
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-gray-400 hover:text-orange-500 text-sm mt-1 transition-colors truncate"
                  >
                    <Globe size={14} />
                    <span className="truncate">{project.url.replace(/^https?:\/\//, '')}</span>
                  </a>
                </div>

                {project.latestReport ? (
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm border-4 flex-shrink-0 ${project.latestReport.score >= 80 ? 'border-green-50 text-green-600 bg-white' :
                      project.latestReport.score >= 50 ? 'border-yellow-50 text-yellow-600 bg-white' :
                        'border-red-50 text-red-600 bg-white'
                    }`}>
                    {project.latestReport.score}
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-50 text-gray-400 flex items-center justify-center text-xs font-bold border-4 border-gray-100 flex-shrink-0">
                    N/A
                  </div>
                )}
              </div>

              {/* Status / Last Scan */}
              <div className="mb-6">
                {project.latestReport ? (
                  <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg w-fit">
                    <Clock size={14} />
                    <span>Scanned {new Date(project.latestReport.createdAt).toLocaleDateString()}</span>
                  </div>
                ) : (
                  <span className="text-sm text-gray-400 italic">No analysis data yet</span>
                )}
              </div>

              {/* Issues Summary */}
              <div className="flex-1">
                {project.latestReport && project.latestReport.improvements?.length > 0 ? (
                  <div className="space-y-3">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Top Issues</p>
                    {project.latestReport.improvements.slice(0, 2).map((issue, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                        <AlertTriangle size={14} className="text-orange-400 mt-0.5 flex-shrink-0" />
                        <span className="line-clamp-2">{issue}</span>
                      </div>
                    ))}
                    {project.latestReport.improvements.length > 2 && (
                      <p className="text-xs text-gray-400 font-medium pl-6">
                        +{project.latestReport.improvements.length - 2} more issues
                      </p>
                    )}
                  </div>
                ) : project.latestReport ? (
                  <div className="text-sm text-green-600 font-medium flex items-center gap-2 bg-green-50 p-3 rounded-lg">
                    <span>Result Looking Good!</span>
                  </div>
                ) : (
                  <div className="text-sm text-gray-400">
                    Run an analysis to see SEO insights and improvement recommendations.
                  </div>
                )}
              </div>

              {/* Action */}
              <div className="mt-6 pt-6 border-t border-gray-50">
                <Link
                  to={`/projects/${project._id}`}
                  className="w-full flex items-center justify-center gap-2 text-[#FD6000] font-bold bg-orange-50 hover:bg-orange-100 py-3 rounded-xl transition-colors"
                >
                  {project.latestReport ? 'View Full Report' : 'Start Analysis'} <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SEO;
