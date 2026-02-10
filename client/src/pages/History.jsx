import React, { useState, useEffect } from "react";
import {
    History as HistoryIcon, Clock, Link as LinkIcon, AlertCircle, CheckCircle,
    Search, Calendar, ArrowRight, Loader2, UserPlus
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { format } from "date-fns";

const History = () => {
    const { api } = useAuth();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const { data } = await api.get("/history");
            setHistory(data);
        } catch (error) {
            console.error("Failed to fetch history", error);
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

    // Group history by date (Today, Yesterday, etc.)
    const groupedHistory = history.reduce((groups, item) => {
        const date = new Date(item.date);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        let dateLabel = format(date, "MMMM d, yyyy");

        if (date.toDateString() === today.toDateString()) {
            dateLabel = "Today";
        } else if (date.toDateString() === yesterday.toDateString()) {
            dateLabel = "Yesterday";
        }

        if (!groups[dateLabel]) {
            groups[dateLabel] = [];
        }
        groups[dateLabel].push(item);
        return groups;
    }, {});

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-10">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                    <HistoryIcon className="text-orange-500" size={32} />
                    Activity History
                </h1>
                <p className="text-gray-500 mt-2">Track all your project creations and analysis runs over time.</p>
            </div>

            {history.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-[32px] border border-gray-100 shadow-sm">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
                        <Clock size={40} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">No Activity Yet</h2>
                    <p className="text-gray-500 mb-8 max-w-md mx-auto">
                        Your activity history will appear here once you create projects and run SEO scans.
                    </p>
                    <Link
                        to="/projects"
                        className="inline-flex items-center gap-2 bg-[#FD6000] text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors"
                    >
                        Get Started
                    </Link>
                </div>
            ) : (
                <div className="space-y-8">
                    {Object.keys(groupedHistory).map((dateLabel) => (
                        <div key={dateLabel}>
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 pl-2">
                                {dateLabel}
                            </h3>
                            <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
                                {groupedHistory[dateLabel].map((item) => (
                                    <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors flex items-start gap-4">
                                        <div className="mt-1">
                                            {item.type === "scan_completed" && (
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.details.score >= 80 ? 'bg-green-100 text-green-600' : item.details.score >= 50 ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'}`}>
                                                    <Search size={18} />
                                                </div>
                                            )}
                                            {item.type === "project_created" && (
                                                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                                                    <LinkIcon size={18} />
                                                </div>
                                            )}
                                            {item.type === "account_created" && (
                                                <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                                                    <UserPlus size={18} />
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-bold text-gray-900">
                                                        {item.type === "scan_completed" && "SEO Scan Completed"}
                                                        {item.type === "project_created" && "New Project Created"}
                                                        {item.type === "account_created" && "Account Created"}
                                                    </p>
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        {item.type === "account_created" ? (
                                                            "You joined SYRUS!"
                                                        ) : (
                                                            <>
                                                                For <span className="font-medium text-gray-700">{item.details.projectName}</span>
                                                                <span className="mx-2">•</span>
                                                                <a href={item.details.projectUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline truncate inline-block max-w-[200px] align-bottom">
                                                                    {item.details.projectUrl?.replace(/^https?:\/\//, '')}
                                                                </a>
                                                            </>
                                                        )}
                                                    </p>
                                                </div>
                                                <span className="text-xs text-gray-400 font-medium whitespace-nowrap pt-1">
                                                    {format(new Date(item.date), "h:mm a")}
                                                </span>
                                            </div>

                                            {item.type === "scan_completed" && (
                                                <div className="mt-3 flex items-center gap-3">
                                                    <div className={`px-2 py-1 rounded text-xs font-bold ${item.details.score >= 80 ? 'bg-green-100 text-green-700' : item.details.score >= 50 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                                                        Score: {item.details.score}
                                                    </div>
                                                    <Link
                                                        to={`/projects/${item.details.projectId}`}
                                                        className="text-xs font-bold text-orange-500 hover:text-orange-600 flex items-center gap-1"
                                                    >
                                                        View Results <ArrowRight size={12} />
                                                    </Link>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default History;
