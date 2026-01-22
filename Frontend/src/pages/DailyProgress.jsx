import { useState, useEffect } from 'react';
import { progressAPI } from '../services/api';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart
} from 'recharts';

const DailyProgress = () => {
  const [todayProgress, setTodayProgress] = useState({
    date: new Date().toISOString().split('T')[0],
    completedQuestions: 0,
    inProgressQuestions: 0,
    todoQuestions: 0,
    totalQuestions: 0
  });
  const [weeklyData, setWeeklyData] = useState([]);
  const [comparison, setComparison] = useState({
    today: 0,
    yesterday: 0,
    weekAvg: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProgressData();
  }, []);

  const loadProgressData = async () => {
    try {
      setLoading(true);
      
      // Get today's progress
      const todayData = await progressAPI.getToday();
      setTodayProgress(todayData);

      // Get last 7 days
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 6); // Last 7 days including today
      
      const weekData = await progressAPI.getHistory(
        startDate.toISOString().split('T')[0],
        endDate.toISOString().split('T')[0]
      );
      
      // Transform data for charts
      const chartData = Array.isArray(weekData) ? weekData.map(day => ({
        date: formatDate(day.date),
        completed: day.completedQuestions || 0,
        inProgress: day.inProgressQuestions || 0,
        todo: day.todoQuestions || 0,
        total: day.totalQuestions || 0
      })) : [];
      
      setWeeklyData(chartData);

      // Calculate comparison stats
      if (chartData.length > 0) {
        const today = chartData[chartData.length - 1].completed;
        const yesterday = chartData.length > 1 ? chartData[chartData.length - 2].completed : 0;
        const weekAvg = Math.round(chartData.reduce((sum, day) => sum + day.completed, 0) / chartData.length);
        
        setComparison({
          today,
          yesterday,
          weekAvg
        });
      }

    } catch (error) {
      console.error('Error loading progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getDayName = (dateLabel) => {
    // dateLabel is already formatted like "Jan 5"; create a date to get weekday
    const date = new Date(`${dateLabel} ${new Date().getFullYear()}`);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const getMaxValue = () => {
    return weeklyData.length > 0 ? Math.max(...weeklyData.map(d => d.completed || 0)) : 0;
  };

  const recentActivity = [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-8">Daily Progress</h1>

      {/* Today's Progress */}
      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-6">Today's Summary</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-green-50 rounded-lg p-6 border-l-4 border-green-500">
            <p className="text-green-600 text-xs sm:text-sm font-medium mb-2">Completed</p>
            <p className="text-3xl sm:text-4xl font-bold text-green-700">
              {todayProgress.completedQuestions}
            </p>
            <p className="text-green-600 text-xs sm:text-sm mt-2">questions</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-500">
            <p className="text-blue-600 text-xs sm:text-sm font-medium mb-2">In Progress</p>
            <p className="text-3xl sm:text-4xl font-bold text-blue-700">
              {todayProgress.inProgressQuestions}
            </p>
            <p className="text-blue-600 text-xs sm:text-sm mt-2">questions</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-6 border-l-4 border-gray-500">
            <p className="text-gray-600 text-xs sm:text-sm font-medium mb-2">To Do</p>
            <p className="text-3xl sm:text-4xl font-bold text-gray-700">
              {todayProgress.todoQuestions}
            </p>
            <p className="text-gray-600 text-xs sm:text-sm mt-2">questions</p>
          </div>
        </div>
      </div>

      {/* Weekly Chart */}
      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-6">Last 7 Days</h2>
        {weeklyData.length > 0 ? (
          <div className="space-y-3 sm:space-y-4">
            {weeklyData.map((day, index) => (
              <div key={index} className="flex items-center gap-2 sm:gap-4">
                <div className="w-16 sm:w-20 text-xs sm:text-sm font-medium text-gray-600 flex-shrink-0">
                  {getDayName(day.date)}
                  <div className="text-xs text-gray-400">{day.date}</div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="bg-gray-200 rounded-full h-6 sm:h-8 overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full flex items-center justify-end pr-2 sm:pr-3 text-white text-xs sm:text-sm font-medium transition-all duration-500"
                      style={{
                        width: `${getMaxValue() ? (day.completed / getMaxValue()) * 100 : 0}%`,
                        minWidth: day.completed > 0 ? '40px' : '0'
                      }}
                    >
                      {day.completed > 0 && day.completed}
                    </div>
                  </div>
                </div>
                <div className="w-20 sm:w-24 text-right text-xs sm:text-sm text-gray-600 flex-shrink-0">
                  {day.completed} completed
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8 text-xs sm:text-base">No data available for the last 7 days</p>
        )}
      </div>

      {/* Weekly Total */}
      {weeklyData.length > 0 && (
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-lg p-6 mb-8 text-white">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-indigo-100 text-xs sm:text-sm font-medium mb-2">Total This Week</p>
              <p className="text-4xl sm:text-5xl font-bold">
                {weeklyData.reduce((sum, day) => sum + (day.completed || 0), 0)}
              </p>
              <p className="text-indigo-100 text-xs sm:text-sm mt-2">questions completed</p>
            </div>
            <div className="text-5xl sm:text-6xl opacity-80 flex-shrink-0">📊</div>
          </div>
        </div>
      )}

      {/* Recent Activity removed per request */}
    </div>
  );
};

export default DailyProgress;
