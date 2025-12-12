import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Search, 
  FileText, 
  Menu, 
  X,
  Zap
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import Analyzer from './components/Analyzer';
import Reports from './components/Reports';
import { MOCK_FEEDBACK } from './constants';
import { FeedbackItem, ViewState } from './types';

function App() {
  const [activeView, setActiveView] = useState<ViewState>('dashboard');
  const [feedbackData, setFeedbackData] = useState<FeedbackItem[]>(MOCK_FEEDBACK);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleAddFeedback = (item: FeedbackItem) => {
    setFeedbackData(prev => [item, ...prev]);
  };

  const NavItem = ({ view, label, icon: Icon }: { view: ViewState; label: string; icon: any }) => (
    <button
      onClick={() => {
        setActiveView(view);
        setMobileMenuOpen(false);
      }}
      className={`flex items-center w-full gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
        activeView === view 
          ? 'bg-indigo-50 text-indigo-600' 
          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
      }`}
    >
      <Icon size={20} />
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 fixed h-full z-10">
        <div className="p-6 flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Zap className="text-white" size={24} />
          </div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">BrandPulse AI</h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-1 mt-4">
          <NavItem view="dashboard" label="Dashboard" icon={LayoutDashboard} />
          <NavItem view="analyze" label="Analyze Feedback" icon={Search} />
          <NavItem view="reports" label="Executive Reports" icon={FileText} />
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="bg-slate-50 rounded-lg p-4">
            <p className="text-xs font-semibold text-slate-500 uppercase">Powered By</p>
            <div className="flex items-center gap-2 mt-2">
               <span className="text-sm font-bold text-slate-700">Gemini 2.5 Flash</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen">
        
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b border-slate-200 p-4 flex justify-between items-center sticky top-0 z-20">
          <div className="flex items-center gap-2">
             <div className="bg-indigo-600 p-1.5 rounded-md">
                <Zap className="text-white" size={20} />
             </div>
             <span className="font-bold text-slate-800">BrandPulse AI</span>
          </div>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-slate-600">
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </header>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 p-4 absolute top-16 left-0 w-full z-20 shadow-lg">
             <nav className="space-y-1">
               <NavItem view="dashboard" label="Dashboard" icon={LayoutDashboard} />
               <NavItem view="analyze" label="Analyze Feedback" icon={Search} />
               <NavItem view="reports" label="Executive Reports" icon={FileText} />
             </nav>
          </div>
        )}

        {/* View Content */}
        <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
          {activeView === 'dashboard' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-800">Overview</h2>
                <span className="text-sm text-slate-500">Last updated: Just now</span>
              </div>
              <Dashboard data={feedbackData} />
            </div>
          )}

          {activeView === 'analyze' && (
            <div className="space-y-6">
              <Analyzer onAddFeedback={handleAddFeedback} />
            </div>
          )}

          {activeView === 'reports' && (
             <div className="space-y-6">
               <Reports data={feedbackData} />
             </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
