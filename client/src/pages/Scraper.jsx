import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Play, Globe, AlertCircle, FileText, CheckCircle, Loader2 } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-hot-toast";

const Scraper = () => {
    const { api } = useAuth();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [projects, setProjects] = useState([]);
    const [selectedProjectId, setSelectedProjectId] = useState(searchParams.get("projectId") || "");
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(true);
    const [crawling, setCrawling] = useState(false);
    const [crawlResult, setCrawlResult] = useState(null);

    useEffect(() => {
        fetchProjects();
    }, []);

    useEffect(() => {
        if (selectedProjectId && projects.length > 0) {
            const project = projects.find(p => p._id === selectedProjectId);
            if (project) {
                setUrl(project.url);
            }
        }
    }, [selectedProjectId, projects]);

    const fetchProjects = async () => {
        try {
            const { data } = await api.get("/projects");
            setProjects(data);
            if (!selectedProjectId && data.length > 0) {
                // Optional: auto-select first project? Or leave empty
            }
        } catch (error) {
            console.error("Failed to fetch projects", error);
            toast.error("Failed to load projects");
        } finally {
            setLoading(false);
        }
    };

    const handleStartCrawl = async (e) => {
        e.preventDefault();
        if (!selectedProjectId) {
            toast.error("Please select a project first");
            return;
        }
        if (!url) {
            toast.error("Please enter a URL to scrape");
            return;
        }

        setCrawling(true);
        setCrawlResult(null);

        try {
            // Note: This endpoint might take a while. 
            // In a real production app, this should be handled asynchronously (background job)
            // returning a jobId to poll. For now, we await it (might timeout if < 30s limit on Vercel, but okay for local)
            const { data } = await api.post("/scrapper/crawl", {
                projectId: selectedProjectId,
                url: url,
            });

            setCrawlResult(data);
            toast.success("Crawl completed successfully!");
        } catch (error) {
            console.error("Crawl failed", error);
            const msg = error.response?.data?.message || "Crawl failed. Please check the URL and try again.";
            toast.error(msg);
        } finally {
            setCrawling(false);
        }
    };

    if (loading) return <div className="p-10 text-center text-gray-400">Loading workspace...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Data Scraper</h1>
                <p className="text-gray-500 mt-1">Extract data and analyze SEO for your projects.</p>
            </div>

            <div className="bg-white rounded-[32px] p-8 shadow-sm border border-orange-50">
                <form onSubmit={handleStartCrawl} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Project Selection */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 block">Select Project</label>
                            <select
                                value={selectedProjectId}
                                onChange={(e) => setSelectedProjectId(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium appearance-none"
                                required
                            >
                                <option value="" disabled>-- Choose a Project --</option>
                                {projects.map(p => (
                                    <option key={p._id} value={p._id}>{p.name}</option>
                                ))}
                            </select>
                            {projects.length === 0 && (
                                <p className="text-xs text-orange-500 mt-1">
                                    No projects found. <button type="button" onClick={() => navigate("/projects")} className="underline font-bold">Create one</button>
                                </p>
                            )}
                        </div>

                        {/* Starting URL */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 block">Target URL</label>
                            <div className="relative">
                                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="url"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    placeholder="https://example.com"
                                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex items-center justify-end">
                        <button
                            type="submit"
                            disabled={crawling || projects.length === 0}
                            className="flex items-center gap-2 bg-[#FD6000] text-white px-8 py-4 rounded-xl font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-200 disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-1"
                        >
                            {crawling ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    Crawling...
                                </>
                            ) : (
                                <>
                                    <Play size={20} />
                                    Start Extraction
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* Results Area */}
            {crawlResult && (
                <div className="bg-white rounded-[32px] p-8 shadow-sm border border-green-100 relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-bl-[100px] -mr-4 -mt-4"></div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                                <CheckCircle size={20} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Crawl Completed!</h3>
                                <p className="text-sm text-gray-500">Successfully scanned {crawlResult.pagesScanned || 0} pages.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            <div className="bg-gray-50 p-4 rounded-2xl">
                                <p className="text-xs text-gray-500 font-bold uppercase">Pages</p>
                                <p className="text-2xl font-bold text-gray-900">{crawlResult.pagesScanned || 0}</p>
                            </div>
                            {/* Add more stats if available in response */}
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <button className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors">
                                <FileText size={18} />
                                View Full Report
                            </button>
                            <button
                                onClick={() => setCrawlResult(null)}
                                className="px-6 py-3 rounded-xl border border-gray-200 font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Scraper;
