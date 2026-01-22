import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { progressAPI, questionsAPI, topicsAPI } from '../services/api';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalQuestions: 0,
    completedQuestions: 0,
    inProgressQuestions: 0,
    todoQuestions: 0,
    totalTopics: 0
  });
  const [recentQuestions, setRecentQuestions] = useState([]);
  const [showAllRecent, setShowAllRecent] = useState(false);
  const [learningData, setLearningData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, questionsData, topicsData, recentDone] = await Promise.all([
        progressAPI.getStats(),
        questionsAPI.getAll(),
        topicsAPI.getAll(),
        questionsAPI.getRecentCompleted(20)
      ]);
      
      setStats({
        totalQuestions: questionsData.length,
        completedQuestions: questionsData.filter(q => q.status === 'DONE').length,
        inProgressQuestions: questionsData.filter(q => q.status === 'IN_PROGRESS').length,
        todoQuestions: questionsData.filter(q => q.status === 'TODO').length,
        totalTopics: topicsData.length
      });
      
      setRecentQuestions(recentDone);

      // Load last 7 days for learning activity chart
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 6);
      const daily = await progressAPI.getDailyCompletions(
        startDate.toISOString().split('T')[0],
        endDate.toISOString().split('T')[0]
      );
      const weekly = Array.isArray(daily) ? daily.map(d => ({
        day: new Date((d.date || '').concat('T00:00:00')).toLocaleDateString('en-US', { weekday: 'short' }),
        completed: d.completed || 0
      })) : [];
      setLearningData(weekly);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, color, icon }) => (
    <div className={`${color} rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 p-4 sm:p-6 text-white backdrop-blur-sm bg-opacity-90`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs sm:text-sm opacity-80 font-medium tracking-wide">{title}</p>
          <p className="text-2xl sm:text-4xl font-bold mt-2 drop-shadow-lg">{value}</p>
        </div>
        <div className="text-4xl sm:text-5xl opacity-60 transform hover:scale-110 transition-transform">{icon}</div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-6 sm:mb-8">Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
        <StatCard 
          title="Total Questions" 
          value={stats.totalQuestions} 
          color="bg-gradient-to-br from-blue-500 to-blue-600"
          icon="📚"
        />
        <StatCard 
          title="Completed" 
          value={stats.completedQuestions} 
          color="bg-gradient-to-br from-green-500 to-green-600"
          icon="✅"
        />
        <StatCard 
          title="In Progress" 
          value={stats.inProgressQuestions} 
          color="bg-gradient-to-br from-yellow-500 to-yellow-600"
          icon="⏳"
        />
        <StatCard 
          title="Topics" 
          value={stats.totalTopics} 
          color="bg-gradient-to-br from-purple-500 to-purple-600"
          icon="📁"
        />
      </div>

      {/* Learning Activity (last 7 days) */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-8 border border-gray-100 overflow-x-auto">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span>📈</span> Learning Activity
        </h2>
        <div className="h-48 sm:h-56 md:h-72 w-full min-w-full sm:min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            {(() => {
              const yMax = Math.max(8, learningData.reduce((m, d) => Math.max(m, d.completed || 0), 0));
              const todayLabel = new Date().toLocaleDateString('en-US', { weekday: 'short' });

              const CustomTooltip = ({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-xl border border-gray-200 bg-white/95 px-4 py-3 shadow-md">
                      <div className="text-sm font-semibold text-gray-800">{label}</div>
                      <div className="text-sm text-gray-600"><span className="font-medium">questions</span> : {payload[0].value}</div>
                    </div>
                  );
                }
                return null;
              };

              return (
                <AreaChart data={learningData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="day" tick={{ fill: '#6B7280' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, yMax]} allowDecimals={false} tick={{ fill: '#6B7280' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#3b82f6', strokeWidth: 1 }} />
                  <ReferenceLine x={todayLabel} stroke="#D1D5DB" strokeDasharray="3 3" />
                  <Area type="monotone" dataKey="completed" stroke="#3b82f6" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 5 }} fill="url(#colorCompleted)" />
                </AreaChart>
              );
            })()}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-8">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">Overall Progress</h2>
        <div className="w-full bg-gray-200 rounded-full h-6">
          <div 
            className="bg-green-500 h-6 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-medium"
            style={{ width: `${stats.totalQuestions ? (stats.completedQuestions / stats.totalQuestions * 100) : 0}%` }}
          >
            {stats.totalQuestions ? Math.round(stats.completedQuestions / stats.totalQuestions * 100) : 0}%
          </div>
        </div>
      </div>

      {/* Recent Questions */}
      <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow p-4 sm:p-6 border border-gray-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-6">
          <h2 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Recently Completed</h2>
          <button
            onClick={() => setShowAllRecent(!showAllRecent)}
            className="text-indigo-600 hover:text-indigo-800 font-semibold text-xs sm:text-base hover:underline transition-colors"
          >
            {showAllRecent ? 'Show less' : 'See all'}
          </button>
        </div>
        {recentQuestions.length > 0 ? (
          <div className="space-y-3">
            {(showAllRecent ? recentQuestions : recentQuestions.slice(0, 5)).map(question => (
              <a key={question.id} href={question.link || '#'} target="_blank" rel="noopener noreferrer"
                 className="block border-l-4 border-gradient-to-b from-indigo-500 to-purple-500 pl-3 sm:pl-4 py-3 hover:bg-gray-50 rounded-r-lg transition-colors">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <span className="text-gray-500 text-xs font-semibold">#{question.leetcodeNumber}</span>
                    <h3 className="font-semibold text-gray-800 text-xs sm:text-sm md:text-base truncate hover:text-indigo-600 transition-colors">{question.title}</h3>
                  </div>
                  <span className="flex-shrink-0 px-3 py-1 rounded-full text-xs font-bold shadow-sm bg-green-100 text-green-700 whitespace-nowrap">DONE</span>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8 text-xs sm:text-base">No completed questions yet.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
