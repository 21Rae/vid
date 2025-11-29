import React, { useState, useEffect } from 'react';
import { Clip, ChatMessage } from '../types';
import { repurposeContent, chatWithVideo } from '../services/geminiService';
import { Copy, Linkedin, Twitter, Check, Send, Sparkles } from 'lucide-react';

interface EditorPanelProps {
  activeClip: Clip | null;
  videoContext: string;
}

export const EditorPanel: React.FC<EditorPanelProps> = ({ activeClip, videoContext }) => {
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [platform, setPlatform] = useState<'LinkedIn' | 'Twitter'>('LinkedIn');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Chat State
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isChatting, setIsChatting] = useState(false);

  // When active clip changes, reset content
  useEffect(() => {
    setGeneratedContent('');
    setCopied(false);
  }, [activeClip]);

  const handleGenerate = async () => {
    if (!activeClip) return;
    setIsLoading(true);
    const content = await repurposeContent(activeClip, platform);
    setGeneratedContent(content);
    setIsLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleChatSend = async (e: React.FormEvent) => {
      e.preventDefault();
      if(!chatInput.trim()) return;

      const userMsg: ChatMessage = {
          id: Date.now().toString(),
          role: 'user',
          text: chatInput,
          timestamp: new Date()
      };
      setChatHistory(prev => [...prev, userMsg]);
      setChatInput('');
      setIsChatting(true);

      // Convert local history format to Gemini history format
      const historyForGemini = chatHistory.map(msg => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
      }));

      const responseText = await chatWithVideo(historyForGemini, userMsg.text, videoContext);

      const botMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'model',
          text: responseText,
          timestamp: new Date()
      };
      setChatHistory(prev => [...prev, botMsg]);
      setIsChatting(false);
  };

  if (!activeClip && chatHistory.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
        <Sparkles size={40} className="mb-4 opacity-20" />
        <p>Select a clip to generate social posts or start chatting to ask about the video.</p>
        
        {/* Quick Chat Start */}
        <div className="mt-8 w-full">
            <p className="text-sm font-medium text-slate-400 mb-2">Ask AI Assistant</p>
            <form onSubmit={handleChatSend} className="relative">
                <input 
                    type="text" 
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="e.g., What is the main takeaway?"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 pl-3 pr-10 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
                <button type="submit" className="absolute right-2 top-2 text-slate-400 hover:text-white">
                    <Send size={14} />
                </button>
            </form>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-slate-900/30">
      
      {/* Tabs / Toggle */}
      <div className="flex border-b border-slate-800">
        <button 
            className={`flex-1 py-3 text-sm font-medium ${activeClip ? 'text-indigo-400 border-b-2 border-indigo-500' : 'text-slate-500'}`}
            onClick={() => {}} // Could implement actual tab switching if needed
        >
            Social Generator
        </button>
        <button 
             className={`flex-1 py-3 text-sm font-medium ${!activeClip ? 'text-indigo-400 border-b-2 border-indigo-500' : 'text-slate-500'}`}
        >
            AI Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Content Generator Section */}
        {activeClip && (
        <div className="space-y-4">
            <h3 className="text-sm uppercase tracking-wider text-slate-500 font-bold">Clip: {activeClip.title}</h3>
            
            <div className="flex space-x-2">
                <button 
                onClick={() => setPlatform('LinkedIn')}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg border text-sm transition-all ${platform === 'LinkedIn' ? 'bg-[#0077b5]/20 border-[#0077b5] text-[#0077b5]' : 'border-slate-700 text-slate-400 hover:border-slate-600'}`}
                >
                <Linkedin size={16} />
                <span>LinkedIn</span>
                </button>
                <button 
                onClick={() => setPlatform('Twitter')}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg border text-sm transition-all ${platform === 'Twitter' ? 'bg-[#1DA1F2]/20 border-[#1DA1F2] text-[#1DA1F2]' : 'border-slate-700 text-slate-400 hover:border-slate-600'}`}
                >
                <Twitter size={16} />
                <span>Twitter</span>
                </button>
            </div>

            <button 
                onClick={handleGenerate}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white py-2.5 rounded-lg font-medium shadow-lg shadow-indigo-500/20 disabled:opacity-50 transition-all flex items-center justify-center"
            >
                {isLoading ? (
                    <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        Generating Magic...
                    </>
                ) : (
                    <>
                        <Sparkles size={16} className="mr-2" />
                        Generate Post
                    </>
                )}
            </button>

            {generatedContent && (
                <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 relative group">
                <button 
                    onClick={handleCopy}
                    className="absolute top-3 right-3 p-1.5 rounded-md bg-slate-800 text-slate-400 hover:text-white transition-colors"
                >
                    {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                </button>
                <textarea 
                    className="w-full bg-transparent text-slate-300 text-sm resize-none focus:outline-none min-h-[150px]"
                    value={generatedContent}
                    readOnly
                />
                </div>
            )}
        </div>
        )}

        {/* Chat Section */}
        <div className="border-t border-slate-800 pt-6">
            <h3 className="text-sm uppercase tracking-wider text-slate-500 font-bold mb-4">Chat History</h3>
            <div className="space-y-4 mb-4">
                {chatHistory.map(msg => (
                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                            msg.role === 'user' 
                            ? 'bg-indigo-600 text-white rounded-br-none' 
                            : 'bg-slate-800 text-slate-200 rounded-bl-none'
                        }`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {isChatting && (
                     <div className="flex justify-start">
                        <div className="bg-slate-800 px-4 py-3 rounded-2xl rounded-bl-none flex space-x-1">
                            <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}} />
                            <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}} />
                            <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}} />
                        </div>
                     </div>
                )}
            </div>
            
            <form onSubmit={handleChatSend} className="relative">
                <input 
                    type="text" 
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask about the video..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg py-3 pl-4 pr-10 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 placeholder-slate-600"
                />
                <button type="submit" disabled={!chatInput.trim() || isChatting} className="absolute right-2 top-2 p-1 text-indigo-500 hover:text-indigo-400 disabled:opacity-30">
                    <Send size={18} />
                </button>
            </form>
        </div>

      </div>
    </div>
  );
};
