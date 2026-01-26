import React from "react";

const DashboardSkeleton = () => {
    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
            {/* Sidebar Skeleton */}
            <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-100 h-full">
                {/* Logo Area */}
                <div className="h-20 flex items-center px-8 border-b border-gray-50">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gray-200 animate-pulse"></div>
                        <div className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                </div>

                {/* Nav Links */}
                <div className="flex-1 px-4 py-6 space-y-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="flex items-center gap-3 px-4 py-3">
                            <div className="w-5 h-5 rounded bg-gray-200 animate-pulse"></div>
                            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                    ))}
                </div>

                {/* User Profile */}
                <div className="p-4 border-t border-gray-50">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
                        <div className="flex-1 space-y-2">
                            <div className="h-3 w-20 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-2 w-28 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Skeleton */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header */}
                <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-6 lg:px-10">
                    {/* Mobile Menu Button Placeholder */}
                    <div className="lg:hidden w-8 h-8 bg-gray-200 rounded animate-pulse"></div>

                    {/* Search Bar Placeholder (Desktop) */}
                    <div className="hidden md:block w-96 h-10 bg-gray-100 rounded-xl animate-pulse"></div>

                    <div className="flex items-center gap-6">
                        <div className="w-8 h-8 bg-gray-100 rounded-full animate-pulse"></div>
                        <div className="w-32 h-10 bg-gray-100 rounded-xl animate-pulse"></div>
                    </div>
                </header>

                {/* Content Area */}
                <main className="flex-1 overflow-y-auto p-6 lg:p-10 space-y-8">
                    {/* Welcome Text */}
                    <div className="space-y-3">
                        <div className="h-8 w-64 bg-gray-200 rounded-lg animate-pulse"></div>
                        <div className="h-5 w-96 bg-gray-100 rounded-lg animate-pulse"></div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                                <div className="h-10 w-10 bg-gray-100 rounded-lg animate-pulse"></div>
                                <div className="space-y-2">
                                    <div className="h-4 w-24 bg-gray-100 rounded animate-pulse"></div>
                                    <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Content Block */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-64 w-full">
                        <div className="h-full w-full bg-gray-50 rounded-xl animate-pulse"></div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardSkeleton;
