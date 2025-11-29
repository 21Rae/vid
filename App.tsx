import React, { useState } from 'react';
import { VideoProject, Clip, ProcessingState } from './types';
import { INITIAL_PROJECTS, DEMO_VIDEO_URL } from './constants';
import { analyzeVideoForClips } from './services/geminiService';
import { Dashboard } from './components/Dashboard';
import { VideoPlayer } from './components/VideoPlayer';
import { ClipList } from './components/ClipList';
import { EditorPanel } from './components/EditorPanel';
import { Layout, LayoutDashboard, ChevronLeft, Scissors } from 'lucide-react';

const App: React.FC = () => {
  const [projects, setProjects] = useState<VideoProject[]>(INITIAL_PROJECTS);
  const [activeProject, setActiveProject] = useState<VideoProject | null>(null);
  const [activeClip, setActiveClip] = useState<Clip | null>(null);
  const [processingState, setProcessingState] = useState<ProcessingState>(ProcessingState.IDLE);
  
  // For the video player state
  const [playerCurrentTime, setPlayerCurrentTime] = useState(0);
  const [playerDuration, setPlayerDuration] = useState(0);

  const handleSelectProject = (project: VideoProject) => {
    setActiveProject(project);
    // Reset state for new project view
    setActiveClip(null);
    setProcessingState(ProcessingState.IDLE);
    
    // If clips already exist (mock data or previous run), great.
    // If not, we wait for user to trigger analysis.
  };

  const handleAnalyze = async () => {
    if (!activeProject) return;
    
    setProcessingState(ProcessingState.ANALYZING);
    
    // Simulate API delay for realism + actual Gemini call
    // Note: In a real app, we'd pass the full transcript.
    // Here we pass the context summary from the mock project.
    
    try {
        const generatedClips = await analyzeVideoForClips(
            activeProject.transcriptContext || activeProject.title, 
            300 // Assuming 5 min duration for the demo video for simplicity in calculations, though the real video is longer.
        );
        
        // Update project with new clips
        const updatedProject = { ...activeProject, clips: generatedClips };
        setProjects(prev => prev.map(p => p.id === activeProject.id ? updatedProject : p));
        setActiveProject(updatedProject);
        setProcessingState(ProcessingState.COMPLETE);
    } catch (e) {
        setProcessingState(ProcessingState.ERROR);
    }
  };

  const handleBackToDashboard = () => {
    setActiveProject(null);
    setActiveClip(null);
  };

  // Create a new mock project
  const handleNewProject = () => {
    const newProject: VideoProject = {
      id: Date.now().toString(),
      title: 'New Uploaded Webinar (Demo)',
      uploadDate: new Date().toISOString().split('T')[0],
      duration: '00:00', // Unknown initially
      thumbnailUrl: 'https://picsum.photos/seed/new/300/200',
      status: 'processing',
      transcriptContext: 'A generic business meeting discussing quarterly goals, hiring plans, and budget allocation.'
    };
    setProjects([newProject, ...projects]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans flex flex-col">
      {/* Top Navigation */}
      <header className="h-16 border-b border-slate-800 flex items-center px-6 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center space-x-2 text-indigo-500 mr-8">
          <Scissors size={24} />
          <span className="text-xl font-bold text-white tracking-tight">ClipStream<span className="text-indigo-500">AI</span></span>
        </div>
        
        {activeProject && (
          <div className="flex items-center text-sm text-slate-400 border-l border-slate-800 pl-6 animate-fade-in">
             <button onClick={handleBackToDashboard} className="hover:text-white flex items-center mr-2 transition-colors">
                <ChevronLeft size={16} />
                <span className="mr-2">Library</span>
             </button>
             <span className="text-slate-600">/</span>
             <span className="ml-2 text-white font-medium">{activeProject.title}</span>
          </div>
        )}

        <div className="ml-auto flex items-center space-x-4">
           <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-indigo-500/20">
             JD
           </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex overflow-hidden">
        
        {!activeProject ? (
          <Dashboard 
            projects={projects} 
            onSelectProject={handleSelectProject} 
            onNewProject={handleNewProject}
          />
        ) : (
          <div className="flex w-full h-full animate-fade-in">
            {/* Left Sidebar: Clips */}
            <div className="w-80 bg-slate-950 border-r border-slate-800 flex flex-col z-10 shadow-xl">
               <div className="p-4 border-b border-slate-800">
                  <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Project Status</h2>
                  {processingState === ProcessingState.IDLE && !activeProject.clips?.length && (
                    <button 
                      onClick={handleAnalyze}
                      className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium text-sm transition-all shadow-lg shadow-indigo-900/20 flex items-center justify-center"
                    >
                       <Layout className="w-4 h-4 mr-2" />
                       Analyze Video
                    </button>
                  )}
                  {(processingState === ProcessingState.COMPLETE || (activeProject.clips && activeProject.clips.length > 0)) && (
                      <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-2 rounded-lg text-sm flex items-center">
                          <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></span>
                          Analysis Complete
                      </div>
                  )}
               </div>
               
               <ClipList 
                 clips={activeProject.clips || []}
                 currentClipId={activeClip?.id}
                 onClipSelect={setActiveClip}
                 onRepurpose={setActiveClip}
                 isAnalyzing={processingState === ProcessingState.ANALYZING}
               />
            </div>

            {/* Center: Video Player */}
            <div className="flex-1 bg-slate-900 flex flex-col p-6 overflow-y-auto">
               <div className="max-w-4xl mx-auto w-full">
                  <div className="mb-6">
                     <VideoPlayer 
                       src={DEMO_VIDEO_URL}
                       startTime={activeClip?.startTime}
                       endTime={activeClip?.endTime}
                       onTimeUpdate={setPlayerCurrentTime}
                       onDurationChange={setPlayerDuration}
                       autoPlayClip={!!activeClip}
                     />
                  </div>
                  
                  {/* Waveform Visualization (Mock) */}
                  <div className="h-24 bg-slate-800/50 rounded-lg p-4 mb-6 relative overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center space-x-1 opacity-30">
                          {Array.from({ length: 80 }).map((_, i) => (
                              <div 
                                key={i} 
                                className="w-1 bg-indigo-400 rounded-full transition-all duration-300"
                                style={{ 
                                    height: `${Math.max(20, Math.random() * 80)}%`,
                                    opacity: i / 80 > playerCurrentTime / (playerDuration || 1) ? 0.3 : 1
                                }} 
                              />
                          ))}
                      </div>
                      <div className="relative z-10 text-xs text-slate-500 font-mono">
                          Timeline Visualization
                      </div>
                  </div>
               </div>
            </div>

            {/* Right Panel: Editor/Chat */}
            <div className="w-96 bg-slate-950 border-l border-slate-800 flex flex-col z-10 shadow-xl">
               <EditorPanel 
                  activeClip={activeClip}
                  videoContext={activeProject.transcriptContext || ""}
               />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
