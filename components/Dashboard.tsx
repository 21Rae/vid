import React from 'react';
import { VideoProject } from '../types';
import { PlayCircle, Clock, MoreVertical, Plus } from 'lucide-react';

interface DashboardProps {
  projects: VideoProject[];
  onSelectProject: (project: VideoProject) => void;
  onNewProject: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ projects, onSelectProject, onNewProject }) => {
  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-3xl font-bold text-white mb-2">My Library</h1>
            <p className="text-slate-400">Manage and repurpose your video assets</p>
        </div>
        <button 
          onClick={onNewProject}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 font-medium transition-colors shadow-lg shadow-indigo-500/20"
        >
          <Plus size={18} />
          <span>New Upload</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div 
            key={project.id} 
            onClick={() => onSelectProject(project)}
            className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/10 transition-all cursor-pointer group"
          >
            <div className="relative aspect-video bg-slate-800">
              <img src={project.thumbnailUrl} alt={project.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                <div className="bg-white/10 backdrop-blur-sm p-3 rounded-full">
                  <PlayCircle size={32} className="text-white" fill="currentColor" />
                </div>
              </div>
              <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-0.5 rounded text-xs text-white font-medium flex items-center">
                 <Clock size={10} className="mr-1" />
                 {project.duration}
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-slate-200 line-clamp-1 group-hover:text-indigo-400 transition-colors">
                  {project.title}
                </h3>
                <button className="text-slate-500 hover:text-slate-300">
                  <MoreVertical size={16} />
                </button>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-500 mt-4">
                <span>{project.uploadDate}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  project.status === 'ready' 
                    ? 'bg-emerald-500/10 text-emerald-500' 
                    : 'bg-amber-500/10 text-amber-500'
                }`}>
                  {project.status === 'ready' ? 'Ready' : 'Processing'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
