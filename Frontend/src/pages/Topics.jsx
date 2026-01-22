import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { topicsAPI } from '../services/api';

const Topics = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTopicName, setNewTopicName] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    loadTopics();
  }, []);

  const loadTopics = async () => {
    try {
      setLoading(true);
      const data = await topicsAPI.getAll();
      setTopics(data);
    } catch (error) {
      console.error('Error loading topics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTopic = async (e) => {
    e.preventDefault();
    if (!newTopicName.trim()) return;

    try {
      await topicsAPI.create({ name: newTopicName, notes: '' });
      setNewTopicName('');
      setShowAddForm(false);
      loadTopics();
    } catch (error) {
      console.error('Error adding topic:', error);
    }
  };

  const handleDeleteTopic = async (id) => {
    if (!confirm('Are you sure you want to delete this topic?')) return;

    try {
      await topicsAPI.delete(id);
      loadTopics();
    } catch (error) {
      console.error('Error deleting topic:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6 sm:mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Topics</h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200 font-semibold text-sm sm:text-base"
        >
          {showAddForm ? '✕ Cancel' : '+ Add Topic'}
        </button>
      </div>

      {/* Add Topic Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow p-4 sm:p-6 border border-gray-100">
          <form onSubmit={handleAddTopic}>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <input
                type="text"
                value={newTopicName}
                onChange={(e) => setNewTopicName(e.target.value)}
                placeholder="Enter topic name (e.g., Arrays, Linked Lists)"
                className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm sm:text-base transition-all"
                autoFocus
              />
              <button
                type="submit"
                className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-green-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200 font-semibold text-sm sm:text-base"
              >
                Add
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Topics Grid */}
      {topics.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {topics.map(topic => (
            <div key={topic.id} className="bg-white rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-gray-100">
              <div className="p-4 sm:p-6">
                <div className="flex justify-between items-start gap-2 mb-4">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-800 flex-1 break-words">{topic.name}</h2>
                  <button
                    onClick={() => handleDeleteTopic(topic.id)}
                    className="text-red-500 hover:text-red-700 hover:scale-125 transition-transform text-xl flex-shrink-0"
                    title="Delete topic"
                  >
                    🗑️
                  </button>
                </div>
                
                <div className="mb-5">
                  <p className="text-gray-600 text-xs sm:text-sm font-medium">
                    {topic.questionCount || 0} questions
                  </p>
                </div>

                <Link
                  to={`/topics/${topic.id}`}
                  className="block w-full text-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200 font-semibold text-sm sm:text-base"
                >
                  View Questions
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg p-8 sm:p-12 text-center border border-gray-100">
          <p className="text-gray-500 text-lg mb-4">No topics yet</p>
          <p className="text-gray-400 mb-6">Start by creating your first topic!</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Create First Topic
          </button>
        </div>
      )}
    </div>
  );
};

export default Topics;
