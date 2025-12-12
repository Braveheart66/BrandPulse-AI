import React, { useState } from 'react';
import { Loader2, Sparkles, Plus } from 'lucide-react';
import { analyzeFeedbackText } from '../services/geminiService';
import { FeedbackItem, Sentiment, CompanyProfile } from '../types';

interface AnalyzerProps {
  onAddFeedback: (item: FeedbackItem) => void;
  companyProfile: CompanyProfile;
}

const Analyzer: React.FC<AnalyzerProps> = ({ onAddFeedback, companyProfile }) => {
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastResult, setLastResult] = useState<FeedbackItem | null>(null);

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;

    setIsAnalyzing(true);
    setLastResult(null);

    const result = await analyzeFeedbackText(inputText, companyProfile);

    const newItem: FeedbackItem = {
      id: Date.now().toString(),
      source: 'Direct Input',
      date: new Date().toISOString().split('T')[0],
      text: inputText,
      sentiment: result.sentiment,
      emotion: result.emotion,
      intensity: result.intensity,
      topics: result.topics,
      actionableInsight: result.actionableInsight
    };

    onAddFeedback(newItem);
    setLastResult(newItem);
    setIsAnalyzing(false);
    setInputText('');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fadeIn">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-slate-800">Analyze New Feedback</h2>
        <p className="text-slate-500">Paste customer emails, reviews, or chat logs below. Gemini will extract sentiment, topics, and actionable insights in seconds.</p>
        {companyProfile.name && (
          <p className="text-xs text-indigo-600 font-medium bg-indigo-50 inline-block px-2 py-1 rounded">
            Analysis tailored for: {companyProfile.name}
          </p>
        )}
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg border border-indigo-100">
        <textarea
          className="w-full h-40 p-4 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none text-slate-700 placeholder:text-slate-400 bg-white"
          placeholder="e.g., 'I really love the product but the shipping was terrible. It arrived damaged and support didn't help.'"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          disabled={isAnalyzing}
        />
        
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !inputText.trim()}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles size={20} />
                Analyze with Gemini
              </>
            )}
          </button>
        </div>
      </div>

      {lastResult && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-slideUp">
          <div className="bg-indigo-50 p-4 border-b border-indigo-100 flex justify-between items-center">
             <h3 className="font-semibold text-indigo-900 flex items-center gap-2">
               <span className="bg-indigo-200 text-indigo-700 p-1 rounded"><Sparkles size={16}/></span>
               Analysis Result
             </h3>
             <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                lastResult.sentiment === Sentiment.Positive ? 'bg-green-100 text-green-700' :
                lastResult.sentiment === Sentiment.Negative ? 'bg-red-100 text-red-700' :
                'bg-slate-100 text-slate-700'
             }`}>
               {lastResult.sentiment}
             </span>
          </div>
          
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
               <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">Emotion & Intensity</p>
               <div className="flex items-center gap-3">
                 <span className="text-xl font-medium text-slate-800">{lastResult.emotion}</span>
                 <div className="flex-1 h-2 bg-slate-100 rounded-full max-w-[100px] overflow-hidden">
                    <div 
                      className={`h-full ${lastResult.intensity > 7 ? 'bg-red-500' : 'bg-indigo-500'}`} 
                      style={{ width: `${lastResult.intensity * 10}%` }}
                    />
                 </div>
                 <span className="text-sm text-slate-500">{lastResult.intensity}/10</span>
               </div>
             </div>

             <div>
               <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">Detected Topics</p>
               <div className="flex flex-wrap gap-2">
                 {lastResult.topics.map(t => (
                   <span key={t} className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-sm font-medium">
                     #{t}
                   </span>
                 ))}
               </div>
             </div>

             <div className="col-span-1 md:col-span-2">
               <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">AI Recommended Action</p>
               <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 text-amber-800 flex gap-3">
                 <div className="mt-0.5">💡</div>
                 <p className="text-sm font-medium">{lastResult.actionableInsight}</p>
               </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analyzer;
