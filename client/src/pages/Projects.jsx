import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Folder, Trash, Globe, Calendar, Search } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-hot-toast";

const Projects = () => {
    const { api } = useAuth();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ name: "", url: "" });
    const [creating, setCreating] = useState(false);

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

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleCreateProject = async (e) => {
        e.preventDefault();
        setCreating(true);
        try {
            const { data } = await api.post("/projects", formData);
            setProjects([...projects, data]);
            setShowModal(false);
            setFormData({ name: "", url: "" });
            toast.success("Project created successfully!");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to create project");
        } finally {
            setCreating(false);
        }
    };

    const handleDeleteProject = async (id) => {
        if (!window.confirm("Are you sure? This will delete all reports associated with this project.")) return;
        try {
            await api.delete(`/projects/${id}`);
            setProjects(projects.filter(p => p._id !== id));
            toast.success("Project deleted");
        } catch (error) {
            toast.error("Failed to delete project");
        }
    }

    if (loading) return <div className="p-10 text-center text-gray-400">Loading projects...</div>;

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">My Projects</h1>
                    <p className="text-gray-500 mt-1">Manage your scraping projects and reports</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 bg-[#FD6000] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-orange-600 transition-colors shadow-lg shadow-orange-200"
                >
                    <Plus size={20} />
                    New Project
                </button>
            </div>

            {projects.length === 0 ? (
                <div className="bg-white rounded-[32px] p-12 text-center border border-dashed border-gray-200">
                    <div className="w-16 h-16 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Folder size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No projects yet</h3>
                    <p className="text-gray-500 mb-6">Create your first project to start analyzing websites.</p>
                    <button
                        onClick={() => setShowModal(true)}
                        className="text-orange-500 font-bold hover:underline"
                    >
                        Create Project
                    </button>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <div key={project._id} className="bg-white p-6 rounded-3xl border border-gray-100 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 group relative">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center">
                                    <Globe size={24} />
                                </div>
                                <button
                                    onClick={() => handleDeleteProject(project._id)}
                                    className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <Trash size={18} />
                                </button>
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 mb-1 truncate" title={project.name}>{project.name}</h3>
                            <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-500 hover:text-orange-500 truncate block mb-4">
                                {project.url}
                            </a>

                            <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                                <div className="flex items-center gap-1 text-xs text-gray-400 font-medium uppercase tracking-wide">
                                    <Calendar size={14} />
                                    <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                                </div>
                                <Link
                                    to={`/projects/${project._id}`}
                                    className="text-orange-500 text-sm font-bold hover:text-orange-600 flex items-center gap-1 transition-colors"
                                >
                                    View & Analyze <Search size={14} />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl relative">
                        <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600">
                            <span className="sr-only">Close</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Project</h2>
                        <form onSubmit={handleCreateProject} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Project Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium"
                                    placeholder="My Awesome Site"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Website URL</label>
                                <input
                                    type="url"
                                    value={formData.url}
                                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium"
                                    placeholder="https://example.com"
                                    required
                                />
                            </div>
                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 py-3 px-4 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={creating}
                                    className="flex-1 py-3 px-4 rounded-xl bg-[#FD6000] text-white font-bold hover:bg-orange-600 transition-colors shadow-lg shadow-orange-200 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {creating ? "Creating..." : "Create Project"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Projects;
