import React, { useState } from 'react';
import { FileText, Loader2, Download, RefreshCw } from 'lucide-react';
import { FeedbackItem, ExecutiveSummary, CompanyProfile } from '../types';
import { generateExecutiveSummary } from '../services/geminiService';

interface ReportsProps {
  data: FeedbackItem[];
  companyProfile: CompanyProfile;
}

const Reports: React.FC<ReportsProps> = ({ data, companyProfile }) => {
  const [summary, setSummary] = useState<ExecutiveSummary | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    const result = await generateExecutiveSummary(data, companyProfile);
    setSummary(result);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      <div className="flex justify-between items-end">
        <div>
           <h2 className="text-2xl font-bold text-slate-800">Executive Reports</h2>
           <p className="text-slate-500">Generate strategic summaries based on {data.length} feedback items.</p>
        </div>
        <button
          onClick={handleGenerate}
          disabled={loading || data.length === 0}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : <RefreshCw size={18} />}
          {summary ? 'Regenerate Report' : 'Generate Report'}
        </button>
      </div>

      {!summary && !loading && (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-xl p-12 text-center">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
            <FileText size={32} />
          </div>
          <h3 className="text-lg font-medium text-slate-700">No report generated yet</h3>
          <p className="text-slate-400 mt-2 max-w-md mx-auto">
            Click the button above to let Gemini analyze all collected feedback and produce a high-level executive summary{companyProfile.name ? ` for ${companyProfile.name}` : ''}.
          </p>
        </div>
      )}

      {loading && (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-slate-100">
          <Loader2 className="animate-spin mx-auto text-indigo-600 mb-4" size={40} />
          <h3 className="text-lg font-medium text-slate-800">Synthesizing Intelligence...</h3>
          <p className="text-slate-500 mt-2">Gemini is reading feedback, identifying patterns, and formulating strategies.</p>
        </div>
      )}

      {summary && !loading && (
        <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-slate-200 animate-slideUp">
           <div className="bg-indigo-900 text-white p-8">
             <div className="flex justify-between items-start">
               <div>
                 <p className="text-indigo-300 text-sm uppercase tracking-wider font-semibold">Gemini Intelligence Report</p>
                 <h1 className="text-3xl font-bold mt-2">Brand Sentiment Overview</h1>
                 {companyProfile.name && <p className="text-indigo-100 font-medium mt-1">Prepared for {companyProfile.name}</p>}
                 <p className="text-indigo-200 mt-2 text-sm">Generated on {new Date(summary.generatedAt).toLocaleDateString()}</p>
               </div>
               <button className="bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-colors text-white">
                 <Download size={20} />
               </button>
             </div>
           </div>

           <div className="p-8 space-y-8">
             <section>
               <h3 className="text-lg font-bold text-slate-800 mb-3 border-b border-slate-100 pb-2">Executive Summary</h3>
               <p className="text-slate-600 leading-relaxed text-lg">{summary.overview}</p>
             </section>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <section className="bg-red-50 p-6 rounded-xl border border-red-100">
                 <h3 className="text-red-800 font-bold mb-4 flex items-center gap-2">
                   <span className="w-2 h-2 rounded-full bg-red-500"></span>
                   Critical Issues
                 </h3>
                 <ul className="space-y-3">
                   {summary.topIssues.map((issue, idx) => (
                     <li key={idx} className="flex gap-3 text-red-700">
                       <span className="font-bold text-red-400">{idx + 1}.</span>
                       {issue}
                     </li>
                   ))}
                 </ul>
               </section>

               <section className="bg-green-50 p-6 rounded-xl border border-green-100">
                 <h3 className="text-green-800 font-bold mb-4 flex items-center gap-2">
                   <span className="w-2 h-2 rounded-full bg-green-500"></span>
                   Recommended Actions
                 </h3>
                 <ul className="space-y-3">
                   {summary.recommendations.map((rec, idx) => (
                     <li key={idx} className="flex gap-3 text-green-700">
                       <span className="font-bold text-green-400">✓</span>
                       {rec}
                     </li>
                   ))}
                 </ul>
               </section>
             </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
