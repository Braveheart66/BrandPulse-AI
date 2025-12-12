import React from 'react';
import { FeedbackItem, Sentiment } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import StatCard from './StatCard';
import { MessageSquare, TrendingUp, AlertTriangle, Smile, ExternalLink } from 'lucide-react';

interface DashboardProps {
  data: FeedbackItem[];
}

const COLORS = {
  [Sentiment.Positive]: '#22c55e', // green-500
  [Sentiment.Neutral]: '#94a3b8',  // slate-400
  [Sentiment.Negative]: '#ef4444', // red-500
};

const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  // Compute Stats
  const total = data.length;
  const positive = data.filter(d => d.sentiment === Sentiment.Positive).length;
  const negative = data.filter(d => d.sentiment === Sentiment.Negative).length;
  const sentimentScore = total === 0 ? 0 : Math.round(((positive - negative) / total) * 100);

  // Data for Pie Chart
  const pieData = [
    { name: 'Positive', value: positive },
    { name: 'Neutral', value: data.filter(d => d.sentiment === Sentiment.Neutral).length },
    { name: 'Negative', value: negative },
  ];

  // Data for Topics Bar Chart
  const topicCounts: Record<string, number> = {};
  data.forEach(item => {
    item.topics.forEach(topic => {
      topicCounts[topic] = (topicCounts[topic] || 0) + 1;
    });
  });
  
  const barData = Object.entries(topicCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5); // Top 5 topics

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Feedback" 
          value={total} 
          icon={MessageSquare} 
          color="blue" 
          subtext="Across all channels"
        />
        <StatCard 
          title="Net Sentiment Score" 
          value={`${sentimentScore > 0 ? '+' : ''}${sentimentScore}`} 
          icon={TrendingUp} 
          color={sentimentScore >= 0 ? 'green' : 'red'}
          subtext="-100 to +100 Scale"
        />
        <StatCard 
          title="Critical Issues" 
          value={data.filter(i => i.sentiment === Sentiment.Negative && i.intensity > 7).length} 
          icon={AlertTriangle} 
          color="red"
          subtext="High intensity negative items"
        />
        <StatCard 
          title="Positive Mentions" 
          value={positive} 
          icon={Smile} 
          color="purple"
          subtext={`${Math.round((positive / total) * 100)}% of total volume`}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sentiment Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col h-80">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Sentiment Distribution</h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.name as Sentiment]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
             {Object.entries(COLORS).map(([name, color]) => (
               <div key={name} className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></div>
                 <span className="text-sm text-slate-600">{name}</span>
               </div>
             ))}
          </div>
        </div>

        {/* Top Topics */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col h-80">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Trending Topics</h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} layout="vertical" margin={{ left: 0, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" width={120} tick={{fontSize: 12}} interval={0} />
                <Tooltip cursor={{fill: '#f1f5f9'}} />
                <Bar dataKey="value" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Feedback Feed */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-slate-800">Recent Activity</h3>
        </div>
        <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto">
          {data.slice().reverse().map((item) => (
            <div 
              key={item.id} 
              className="p-4 hover:bg-slate-50 transition-colors cursor-pointer group"
              onClick={() => alert(`Opening source: ${item.source} - ${item.id}`)}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                    item.sentiment === Sentiment.Positive ? 'bg-green-100 text-green-700' :
                    item.sentiment === Sentiment.Negative ? 'bg-red-100 text-red-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {item.sentiment}
                  </span>
                  <span className="text-xs text-slate-400">• {item.source} • {item.date}</span>
                </div>
                <div className="flex items-center gap-2">
                   <span className="text-xs font-medium text-slate-500">Intensity: {item.intensity}/10</span>
                   <ExternalLink size={14} className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
              <p className="text-slate-700 my-2 text-sm">{item.text}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {item.topics.map(t => (
                  <span key={t} className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full">
                    #{t}
                  </span>
                ))}
                {item.actionableInsight && (
                  <span className="text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded border border-amber-100 flex items-center gap-1">
                    💡 {item.actionableInsight}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
            <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center justify-center gap-1 mx-auto">
                View All Activity <ExternalLink size={14} />
            </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;