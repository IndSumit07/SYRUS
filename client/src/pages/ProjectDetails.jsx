import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    ArrowLeft, Globe, Search, BarChart2, AlertCircle,
    CheckCircle, Clock, ChevronDown, ChevronUp, Loader2
} from "lucide-react";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-hot-toast";

const ProjectDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { api } = useAuth();

    const [project, setProject] = useState(null);
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("overview");
    const [crawling, setCrawling] = useState(false);

    const fetchProjectData = async () => {
        try {
            const { data } = await api.get(`/projects/${id}`);
            setProject(data);
            if (data.reports) {
                setReports(data.reports);
            }
        } catch (error) {
            console.error("Failed to load project", error);
            toast.error("Failed to load project details");
            navigate("/projects");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjectData();
    }, [id]);

    const handleCrawl = async () => {
        setCrawling(true);
        try {
            const { data } = await api.post("/scrapper/crawl", {
                projectId: id,
                url: project.url
            });
            toast.success("Crawl completed!");
            // Refresh data to show new report
            await fetchProjectData();
            setActiveTab("seo"); // Switch to SEO tab to show results
        } catch (error) {
            toast.error(error.response?.data?.message || "Crawl failed");
        } finally {
            setCrawling(false);
        }
    };

    if (loading) return <div className="p-10 text-center text-gray-400">Loading project details...</div>;
    if (!project) return null;

    const latestReport = reports.length > 0 ? reports[0] : null;

    // Prepare chart data (reverse to show oldest to newest)
    const chartData = [...reports].reverse().map(r => ({
        date: new Date(r.createdAt).toLocaleDateString(),
        score: r.score
    }));

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 -ml-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                            {project.name}
                            <span className="text-sm font-medium px-3 py-1 bg-gray-100 text-gray-500 rounded-full border border-gray-200">
                                {project.url}
                            </span>
                        </h1>
                        <p className="text-gray-500 mt-1">Managed by you</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleCrawl}
                        disabled={crawling}
                        className="flex items-center gap-2 bg-[#FD6000] text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-200 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {crawling ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
                        {crawling ? "Analyzing..." : "Run Analysis"}
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <nav className="flex gap-8">
                    <button
                        onClick={() => setActiveTab("overview")}
                        className={`pb-4 text-sm font-bold border-b-2 transition-colors ${activeTab === "overview"
                            ? "border-[#FD6000] text-[#FD6000]"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab("seo")}
                        className={`pb-4 text-sm font-bold border-b-2 transition-colors ${activeTab === "seo"
                            ? "border-[#FD6000] text-[#FD6000]"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        SEO Audit {reports.length > 0 && `(${reports.length})`}
                    </button>
                    <button
                        onClick={() => setActiveTab("settings")}
                        className={`pb-4 text-sm font-bold border-b-2 transition-colors ${activeTab === "settings"
                            ? "border-[#FD6000] text-[#FD6000]"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        Settings
                    </button>
                </nav>
            </div>

            {/* Content */}
            <div className="min-h-[400px]">
                {activeTab === "overview" && (
                    <div className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
                                <h3 className="text-xl font-bold text-gray-900 mb-6">Latest Scan Summary</h3>
                                {latestReport ? (
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold border-4 ${latestReport.score >= 80 ? 'border-green-500 text-green-600 bg-green-50' : latestReport.score >= 50 ? 'border-yellow-500 text-yellow-600 bg-yellow-50' : 'border-red-500 text-red-600 bg-red-50'}`}>
                                                {latestReport.score}
                                            </div>
                                            <div>
                                                <p className="text-gray-900 font-bold text-lg">SEO Score</p>
                                                <p className="text-gray-500 text-sm">
                                                    Scanned on {new Date(latestReport.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-gray-50 p-4 rounded-xl">
                                                <p className="text-xs text-gray-500 font-bold uppercase mb-1">Issues Found</p>
                                                <p className="text-2xl font-bold text-gray-900">{latestReport.improvements?.length || 0}</p>
                                            </div>
                                            <div className="bg-gray-50 p-4 rounded-xl">
                                                <p className="text-xs text-gray-500 font-bold uppercase mb-1">Pages Crawled</p>
                                                <p className="text-2xl font-bold text-gray-900">{latestReport.technicalDetails?.crawlData_summary?.total_pages || 1}</p>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => setActiveTab("seo")}
                                            className="w-full py-3 rounded-xl border border-gray-200 font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                                        >
                                            View Full Report
                                        </button>
                                    </div>
                                ) : (
                                    <div className="text-center py-10">
                                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                                            <Search size={32} />
                                        </div>
                                        <p className="text-gray-500 mb-6">No scans performed yet.</p>
                                        <button
                                            onClick={handleCrawl}
                                            className="mx-auto flex items-center gap-2 text-[#FD6000] font-bold hover:underline"
                                        >
                                            Run your first scan
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* SEO History Graph */}
                            <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm flex flex-col">
                                <h3 className="text-xl font-bold text-gray-900 mb-6">SEO Performance History</h3>
                                {chartData.length > 0 ? (
                                    <div className="flex-1 h-[300px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={chartData}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                                <XAxis
                                                    dataKey="date"
                                                    axisLine={false}
                                                    tickLine={false}
                                                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                                                    dy={10}
                                                />
                                                <YAxis
                                                    hide={false}
                                                    axisLine={false}
                                                    tickLine={false}
                                                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                                                    domain={[0, 100]}
                                                />
                                                <Tooltip
                                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                                />
                                                <Line
                                                    type="monotone"
                                                    dataKey="score"
                                                    stroke="#FD6000"
                                                    strokeWidth={3}
                                                    dot={{ r: 4, fill: '#FD6000', strokeWidth: 2, stroke: '#fff' }}
                                                    activeDot={{ r: 6 }}
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                ) : (
                                    <div className="flex-1 flex items-center justify-center text-gray-400">
                                        No history available
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "seo" && (
                    <div className="space-y-6">
                        {reports.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-[32px] border border-gray-100">
                                <p className="text-gray-500">No SEO data available yet. Run a scan to generate a report.</p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-6">
                                {/* Main Report Card */}
                                <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
                                    <div className="flex items-center justify-between mb-8">
                                        <h3 className="text-2xl font-bold text-gray-900">Latest Audit Result</h3>
                                        <span className="text-sm text-gray-500 flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full">
                                            <Clock size={14} />
                                            {new Date(latestReport.createdAt).toLocaleString()}
                                        </span>
                                    </div>

                                    <div className="flex flex-col lg:flex-row gap-10">
                                        {/* Score Circle */}
                                        <div className="flex flex-col items-center justify-center lg:w-1/4 space-y-4">
                                            <div className={`relative w-40 h-40 flex items-center justify-center rounded-full border-[8px] ${latestReport.score >= 80 ? 'border-green-500 text-green-600' : latestReport.score >= 50 ? 'border-yellow-500 text-yellow-600' : 'border-red-500 text-red-600'}`}>
                                                <div className="text-center">
                                                    <span className="text-5xl font-extrabold">{latestReport.score}</span>
                                                    <span className="block text-sm font-medium text-gray-500 uppercase mt-1">Score</span>
                                                </div>
                                            </div>
                                            <p className={`font-bold ${latestReport.score >= 80 ? 'text-green-600' : latestReport.score >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                                                {latestReport.score >= 80 ? 'Excellent' : latestReport.score >= 50 ? 'Needs Improvement' : 'Critical Issues'}
                                            </p>
                                        </div>

                                        {/* Improvements List */}
                                        <div className="flex-1 space-y-6">
                                            <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                                <AlertCircle className="text-orange-500" size={20} />
                                                Recommended Improvements
                                            </h4>

                                            {latestReport.improvements && latestReport.improvements.length > 0 ? (
                                                <div className="grid gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                                    {latestReport.improvements.map((imp, idx) => (
                                                        <div key={idx} className="flex items-start gap-3 p-4 rounded-xl bg-orange-50 border border-orange-100">
                                                            <div className="mt-1 min-w-[20px]">
                                                                <div className="w-5 h-5 rounded-full bg-orange-200 text-orange-700 flex items-center justify-center text-xs font-bold">
                                                                    {idx + 1}
                                                                </div>
                                                            </div>
                                                            <p className="text-gray-800 font-medium">{imp}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="p-6 bg-green-50 rounded-xl border border-green-100 flex items-center gap-3 text-green-700">
                                                    <CheckCircle size={24} />
                                                    <p className="font-bold">Great job! No major SEO issues found.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Technical Details / Scrolled Data */}
                                <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
                                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                        <BarChart2 size={24} className="text-gray-400" />
                                        Detailed Technical Analysis
                                    </h3>

                                    <div className="space-y-6">
                                        {latestReport.technicalDetails && (
                                            <>
                                                {/* Meta Info */}
                                                <div className="border border-gray-100 rounded-2xl overflow-hidden">
                                                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 font-bold text-gray-700">
                                                        Meta Information
                                                    </div>
                                                    <div className="p-6 grid gap-6">
                                                        <div>
                                                            <p className="text-xs font-bold text-gray-400 uppercase mb-1">Page Title</p>
                                                            <p className="text-gray-900 font-medium">{latestReport.technicalDetails.seo?.title || <span className="text-red-400 italic">Missing</span>}</p>
                                                            <p className="text-xs text-gray-400 mt-1">{latestReport.technicalDetails.seo?.title?.length || 0} characters</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs font-bold text-gray-400 uppercase mb-1">Meta Description</p>
                                                            <p className="text-gray-900 font-medium">{latestReport.technicalDetails.seo?.meta_description || <span className="text-red-400 italic">Missing</span>}</p>
                                                            <p className="text-xs text-gray-400 mt-1">{latestReport.technicalDetails.seo?.meta_description?.length || 0} characters</p>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div>
                                                                <p className="text-xs font-bold text-gray-400 uppercase mb-1">Canonical URL</p>
                                                                <p className="text-gray-900 text-sm truncate">{latestReport.technicalDetails.seo?.canonical || "-"}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs font-bold text-gray-400 uppercase mb-1">Language</p>
                                                                <p className="text-gray-900 text-sm">{latestReport.technicalDetails.seo?.lang || "-"}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Content Stats */}
                                                <div className="grid md:grid-cols-2 gap-6">
                                                    <div className="border border-gray-100 rounded-2xl overflow-hidden">
                                                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 font-bold text-gray-700">
                                                            Content Statistics
                                                        </div>
                                                        <div className="p-6">
                                                            <div className="flex justify-between items-center mb-3">
                                                                <span className="text-gray-500">Word Count</span>
                                                                <span className="font-bold text-gray-900">{latestReport.technicalDetails.content?.word_count || 0}</span>
                                                            </div>
                                                            <div className="flex justify-between items-center mb-3">
                                                                <span className="text-gray-500">Headings (H1/H2/H3)</span>
                                                                <span className="font-bold text-gray-900">
                                                                    {latestReport.technicalDetails.structure?.h1?.length || 0} / {latestReport.technicalDetails.structure?.h2?.length || 0} / {latestReport.technicalDetails.structure?.h3?.length || 0}
                                                                </span>
                                                            </div>
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-gray-500">H1 Tag Count</span>
                                                                <span className={`font-bold ${latestReport.technicalDetails.structure?.h1?.length === 1 ? 'text-green-600' : 'text-red-500'}`}>
                                                                    {latestReport.technicalDetails.structure?.h1?.length || 0}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="border border-gray-100 rounded-2xl overflow-hidden">
                                                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 font-bold text-gray-700">
                                                            Media & Links
                                                        </div>
                                                        <div className="p-6">
                                                            <div className="flex justify-between items-center mb-3">
                                                                <span className="text-gray-500">Total Images</span>
                                                                <span className="font-bold text-gray-900">{latestReport.technicalDetails.media?.total_images || 0}</span>
                                                            </div>
                                                            <div className="flex justify-between items-center mb-3">
                                                                <span className="text-gray-500">Images without Alt Text</span>
                                                                <span className={`font-bold ${latestReport.technicalDetails.media?.images_without_alt === 0 ? 'text-green-600' : 'text-red-500'}`}>
                                                                    {latestReport.technicalDetails.media?.images_without_alt || 0}
                                                                </span>
                                                            </div>
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-gray-500">Internal / External Links</span>
                                                                <span className="font-bold text-gray-900">
                                                                    {latestReport.technicalDetails.links?.internal_links || 0} / {latestReport.technicalDetails.links?.external_links || 0}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Headings List */}
                                                <div className="border border-gray-100 rounded-2xl overflow-hidden">
                                                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 font-bold text-gray-700">
                                                        Headings Structure
                                                    </div>
                                                    <div className="p-6 max-h-60 overflow-y-auto custom-scrollbar">
                                                        {latestReport.technicalDetails.structure?.h1?.map((h, i) => (
                                                            <p key={`h1-${i}`} className="text-lg font-bold text-gray-900 mb-2">H1: {h}</p>
                                                        ))}
                                                        {latestReport.technicalDetails.structure?.h2?.map((h, i) => (
                                                            <p key={`h2-${i}`} className="text-base font-medium text-gray-700 ml-4 mb-1 display-list-item">H2: {h}</p>
                                                        ))}
                                                        {latestReport.technicalDetails.structure?.h3?.length > 0 && <p className="text-sm text-gray-400 ml-8 mt-2 italic">...and {latestReport.technicalDetails.structure?.h3?.length} H3 tags</p>}
                                                    </div>
                                                </div>

                                                {/* Images Analysis */}
                                                <div className="border border-gray-100 rounded-2xl overflow-hidden">
                                                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 font-bold text-gray-700 flex justify-between items-center">
                                                        <span>Images Analysis</span>
                                                        <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">{latestReport.technicalDetails.media?.all_images?.length || 0} Found</span>
                                                    </div>
                                                    <div className="p-0 max-h-60 overflow-y-auto custom-scrollbar divide-y divide-gray-50">
                                                        {latestReport.technicalDetails.media?.all_images?.length > 0 ? (
                                                            latestReport.technicalDetails.media.all_images.map((img, i) => (
                                                                <div key={`img-${i}`} className="p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors">
                                                                    <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${img.alt ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <p className="text-sm font-medium text-gray-900 truncate" title={img.src}>{img.src}</p>
                                                                        <p className={`text-xs mt-0.5 ${img.alt ? 'text-gray-500' : 'text-red-500 font-bold'}`}>
                                                                            {img.alt ? `Alt: "${img.alt}"` : 'Missing Alt Text'}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div className="p-6 text-center text-gray-400 text-sm">No images found data available.</div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Links Analysis */}
                                                <div className="border border-gray-100 rounded-2xl overflow-hidden">
                                                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 font-bold text-gray-700 flex justify-between items-center">
                                                        <span>Links Found</span>
                                                        <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">{latestReport.technicalDetails.links?.all_links?.length || 0} Found</span>
                                                    </div>
                                                    <div className="p-0 max-h-60 overflow-y-auto custom-scrollbar divide-y divide-gray-50">
                                                        {latestReport.technicalDetails.links?.all_links?.length > 0 ? (
                                                            latestReport.technicalDetails.links.all_links.map((link, i) => (
                                                                <div key={`link-${i}`} className="p-3 text-sm text-blue-600 hover:underline truncate hover:bg-gray-50 px-6">
                                                                    <a href={link} target="_blank" rel="noopener noreferrer">{link}</a>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div className="p-6 text-center text-gray-400 text-sm">No links found data available.</div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Raw Data Toggle */}
                                                <details className="group border border-gray-100 rounded-2xl overflow-hidden">
                                                    <summary className="bg-gray-50 px-6 py-4 font-bold text-gray-700 cursor-pointer list-none flex items-center justify-between hover:bg-gray-100 transition-colors">
                                                        View Raw JSON Data
                                                        <ChevronDown className="group-open:rotate-180 transition-transform" size={20} />
                                                    </summary>
                                                    <div className="p-0 bg-gray-900">
                                                        <pre className="text-xs text-gray-100 p-6 overflow-x-auto">
                                                            {JSON.stringify(latestReport.technicalDetails, null, 2)}
                                                        </pre>
                                                    </div>
                                                </details>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === "settings" && (
                    <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm max-w-2xl">
                        <h3 className="text-xl font-bold text-gray-900 mb-6">Project Settings</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Project Name</label>
                                <input
                                    type="text"
                                    value={project.name}
                                    disabled
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Target URL</label>
                                <input
                                    type="url"
                                    value={project.url}
                                    disabled
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-500"
                                />
                            </div>
                            <div className="pt-4">
                                <button className="text-red-500 font-bold hover:text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors">
                                    Delete Project
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectDetails;
