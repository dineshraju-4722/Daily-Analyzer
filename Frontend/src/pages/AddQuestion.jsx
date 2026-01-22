import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { questionsAPI, topicsAPI } from '../services/api';

const AddQuestion = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const questionId = searchParams.get('questionId');
  const preselectedTopicId = searchParams.get('topicId');

  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    topicId: preselectedTopicId || '',
    leetcodeNumber: '',
    title: '',
    link: '',
    difficulty: 'MEDIUM',
    status: 'TODO',
    isImportant: false,
    reminderDateTime: ''
  });

  useEffect(() => {
    loadTopics();
    if (questionId) {
      loadQuestion();
    }
  }, [questionId]);

  const loadTopics = async () => {
    try {
      const data = await topicsAPI.getAll();
      setTopics(data);
    } catch (error) {
      console.error('Error loading topics:', error);
    }
  };

  const loadQuestion = async () => {
    try {
      setLoading(true);
      const data = await questionsAPI.getById(questionId);
      setFormData({
        topicId: data.topic?.id || '',
        leetcodeNumber: data.leetcodeNumber || '',
        title: data.title || '',
        link: data.link || '',
        difficulty: data.difficulty || 'MEDIUM',
        status: data.status || 'TODO',
        isImportant: data.isImportant || false,
        // Keep local datetime string as-is to avoid timezone shifts
        reminderDateTime: data.reminderDateTime ? data.reminderDateTime.slice(0, 16) : ''
      });
    } catch (error) {
      console.error('Error loading question:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.topicId || !formData.leetcodeNumber || !formData.title) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      const questionData = {
        ...formData,
        leetcodeNumber: parseInt(formData.leetcodeNumber, 10),
        // Send local datetime string without converting to UTC to preserve user-selected time
        reminderDateTime: formData.reminderDateTime || null
      };

      if (questionId) {
        await questionsAPI.update(questionId, questionData);
      } else {
        await questionsAPI.create(questionData);
      }

      navigate(`/topics/${formData.topicId}`);
    } catch (error) {
      console.error('Error saving question:', error);
      alert('Error saving question. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6 sm:mb-8">
        {questionId ? '✏️ Edit Question' : '✨ Add New Question'}
      </h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-xl border border-gray-100 p-4 sm:p-8 space-y-6">
          {/* Topic Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Topic <span className="text-red-500">*</span>
            </label>
            <select
              name="topicId"
              value={formData.topicId}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">Select a topic</option>
              {topics.map(topic => (
                <option key={topic.id} value={topic.id}>
                  {topic.name}
                </option>
              ))}
            </select>
          </div>

          {/* LeetCode Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              LeetCode Number <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="leetcodeNumber"
              value={formData.leetcodeNumber}
              onChange={handleChange}
              required
              placeholder="e.g., 1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="e.g., Two Sum"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Link */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              LeetCode Link
            </label>
            <input
              type="url"
              name="link"
              value={formData.link}
              onChange={handleChange}
              placeholder="https://leetcode.com/problems/..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Difficulty
            </label>
            <select
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
            </select>
          </div>

          {/* Important */}
          <div>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="isImportant"
                checked={formData.isImportant}
                onChange={handleChange}
                className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm font-medium text-gray-700">
                Mark as Important ⭐
              </span>
            </label>
          </div>

          {/* Reminder */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reminder Date & Time
            </label>
            <input
              type="datetime-local"
              name="reminderDateTime"
              value={formData.reminderDateTime}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-6 border-t-2 border-gray-100">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm sm:text-base"
            >
              {loading ? '⏳ Saving...' : questionId ? '✅ Update Question' : '➕ Add Question'}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 sm:flex-none px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 hover:scale-105 transition-all duration-200 font-semibold text-sm sm:text-base"
            >
              ✕ Cancel
            </button>
          </div>
        </form>
    </div>
  );
};

export default AddQuestion;
