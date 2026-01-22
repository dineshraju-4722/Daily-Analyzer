import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { remindersAPI } from '../services/api';

const Reminders = () => {
  const [reminders, setReminders] = useState([]);
  const [upcomingReminders, setUpcomingReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('UPCOMING'); // UPCOMING, ALL, TODAY

  useEffect(() => {
    loadReminders();
  }, []);

  const loadReminders = async () => {
    try {
      setLoading(true);
      const [allData, upcomingData] = await Promise.all([
        remindersAPI.getAll(),
        remindersAPI.getUpcoming()
      ]);
      setReminders(Array.isArray(allData) ? allData : []);
      setUpcomingReminders(Array.isArray(upcomingData) ? upcomingData : []);
    } catch (error) {
      console.error('Error loading reminders:', error);
      setReminders([]);
      setUpcomingReminders([]);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredReminders = () => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayEnd.getDate() + 1);

    switch (filter) {
      case 'UPCOMING':
        return Array.isArray(upcomingReminders) ? upcomingReminders : [];
      case 'TODAY':
        return Array.isArray(reminders) ? reminders.filter(r => {
          if (!r.reminderDateTime) return false;
          
          // Parse the datetime - handle both ISO string and local datetime format
          let reminderDate;
          if (r.reminderDateTime.includes('T')) {
            // Format: "2026-01-22T17:42:00"
            reminderDate = new Date(r.reminderDateTime);
          } else {
            reminderDate = new Date(r.reminderDateTime);
          }
          
          // Compare dates
          const reminderDay = new Date(reminderDate.getFullYear(), reminderDate.getMonth(), reminderDate.getDate());
          const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          
          return reminderDay.getTime() === today.getTime();
        }) : [];
      case 'ALL':
      default:
        return Array.isArray(reminders) ? reminders : [];
    }
  };

  const isPast = (dateTime) => {
    return new Date(dateTime) < new Date();
  };

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    const now = new Date();
    const diffMs = date - now;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMs < 0) {
      return `${date.toLocaleString()} (Past)`;
    } else if (diffMins < 60) {
      return `${date.toLocaleString()} (in ${diffMins} min)`;
    } else if (diffHours < 24) {
      return `${date.toLocaleString()} (in ${diffHours}h)`;
    } else if (diffDays < 7) {
      return `${date.toLocaleString()} (in ${diffDays}d)`;
    } else {
      return date.toLocaleString();
    }
  };

  const filteredReminders = getFilteredReminders();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-8">Reminders</h1>

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg shadow-lg mb-6 overflow-x-auto">
        <div className="flex border-b border-gray-200 min-w-max sm:min-w-0">
          <button
            onClick={() => setFilter('UPCOMING')}
            className={`flex-1 px-3 sm:px-6 py-3 sm:py-4 text-center font-medium transition-colors text-xs sm:text-base ${
              filter === 'UPCOMING'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Upcoming ({upcomingReminders.length})
          </button>
          <button
            onClick={() => setFilter('TODAY')}
            className={`flex-1 px-3 sm:px-6 py-3 sm:py-4 text-center font-medium transition-colors text-xs sm:text-base ${
              filter === 'TODAY'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setFilter('ALL')}
            className={`flex-1 px-3 sm:px-6 py-3 sm:py-4 text-center font-medium transition-colors text-xs sm:text-base ${
              filter === 'ALL'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            All ({reminders.length})
          </button>
        </div>
      </div>

      {/* Reminders List */}
      {filteredReminders.length > 0 ? (
        <div className="space-y-4">
          {filteredReminders.map(reminder => (
            <div
              key={reminder.id}
              className={`bg-white rounded-lg shadow-lg p-4 sm:p-6 border-l-4 ${
                isPast(reminder.reminderDateTime)
                  ? 'border-gray-400 opacity-60'
                  : 'border-indigo-500'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-start justify-between gap-3 sm:gap-4">
                <div className="flex-1 min-w-0 w-full">
                  <div className="flex items-start gap-2 sm:gap-3 mb-2">
                    <span className="text-xl sm:text-2xl flex-shrink-0">🔔</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                        <span className="text-gray-600 font-mono text-xs sm:text-sm">
                          #{reminder.question?.leetcodeNumber}
                        </span>
                        <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 break-words">
                          {reminder.question?.title}
                        </h3>
                        {reminder.question?.isImportant && <span className="text-sm">⭐</span>}
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 mt-1">
                        Topic: {reminder.question?.topic?.name}
                      </p>
                    </div>
                  </div>
                  <div className="ml-7 sm:ml-11">
                    <p className={`text-xs sm:text-sm font-medium ${
                      isPast(reminder.reminderDateTime)
                        ? 'text-gray-500'
                        : 'text-indigo-600'
                    }`}>
                      {formatDateTime(reminder.reminderDateTime)}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
                        reminder.question?.difficulty === 'EASY' ? 'bg-green-100 text-green-800' :
                        reminder.question?.difficulty === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {reminder.question?.difficulty}
                      </span>
                      <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
                        reminder.question?.status === 'DONE' ? 'bg-green-100 text-green-800' :
                        reminder.question?.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {reminder.question?.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 w-full sm:w-auto">
                  {reminder.question?.link && (
                    <a
                      href={reminder.question.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-center text-xs sm:text-sm"
                    >
                      Open Link
                    </a>
                  )}
                  {reminder.question?.topicId && (
                    <Link
                      to={`/topics/${reminder.question.topicId}`}
                      className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-center text-xs sm:text-sm"
                    >
                      View Topic
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 md:p-12 text-center">
          <p className="text-3xl sm:text-4xl md:text-5xl mb-4">🔔</p>
          <p className="text-gray-500 text-base sm:text-lg md:text-xl mb-2">No reminders found</p>
          <p className="text-gray-400 mb-6 text-xs sm:text-sm md:text-base">
            {filter === 'UPCOMING' && 'You have no upcoming reminders'}
            {filter === 'TODAY' && 'No reminders scheduled for today'}
            {filter === 'ALL' && 'Start adding reminders to your questions'}
          </p>
          <Link
            to="/add-question"
            className="inline-block bg-indigo-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-indigo-700 transition-colors text-xs sm:text-sm md:text-base"
          >
            Add Question with Reminder
          </Link>
        </div>
      )}
    </div>
  );
};

export default Reminders;
