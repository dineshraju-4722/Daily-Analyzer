import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { topicsAPI, questionsAPI } from '../services/api';

const TopicDetails = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const [topic, setTopic] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState('');
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  
  // Filters
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [difficultyFilter, setDifficultyFilter] = useState('ALL');
  const [importantFilter, setImportantFilter] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadTopicDetails();
  }, [topicId]);

  useEffect(() => {
    applyFilters();
  }, [questions, statusFilter, difficultyFilter, importantFilter, searchTerm]);

  const loadTopicDetails = async () => {
    try {
      setLoading(true);
      const [topicData, questionsData] = await Promise.all([
        topicsAPI.getById(topicId),
        questionsAPI.getByTopic(topicId)
      ]);
      setTopic(topicData);
      setQuestions(questionsData);
      setNotes(topicData.notes || '');
    } catch (error) {
      console.error('Error loading topic details:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...questions];

    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(q => q.status === statusFilter);
    }

    if (difficultyFilter !== 'ALL') {
      filtered = filtered.filter(q => q.difficulty === difficultyFilter);
    }

    if (importantFilter) {
      filtered = filtered.filter(q => q.isImportant);
    }

    if (searchTerm) {
      filtered = filtered.filter(q => 
        q.leetcodeNumber.toString().includes(searchTerm) ||
        q.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredQuestions(filtered);
  };

  const handleStatusChange = async (questionId, newStatus) => {
    try {
      await questionsAPI.updateStatus(questionId, newStatus);
      loadTopicDetails();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleToggleImportant = async (questionId) => {
    try {
      await questionsAPI.toggleImportant(questionId);
      loadTopicDetails();
    } catch (error) {
      console.error('Error toggling important:', error);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (!confirm('Are you sure you want to delete this question?')) return;

    try {
      await questionsAPI.delete(questionId);
      loadTopicDetails();
    } catch (error) {
      console.error('Error deleting question:', error);
    }
  };

  const handleSaveNotes = async () => {
    try {
      await topicsAPI.updateNotes(topicId, notes);
      setIsEditingNotes(false);
      loadTopicDetails();
    } catch (error) {
      console.error('Error saving notes:', error);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'EASY': return 'bg-green-100 text-green-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'HARD': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'DONE': return 'bg-green-100 text-green-800';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800';
      case 'TODO': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Topic not found</p>
          <Link to="/topics" className="text-indigo-600 hover:text-indigo-800">
            ← Back to Topics
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-6">
        <Link to="/topics" className="text-indigo-600 hover:text-indigo-800 mb-4 inline-block text-xs sm:text-sm">
          ← Back to Topics
        </Link>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 break-words">{topic.name}</h1>
          <Link
            to={`/add-question?topicId=${topicId}`}
            className="w-full sm:w-auto text-center bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-xs sm:text-sm"
          >
            + Add Question
          </Link>
        </div>
      </div>

      {/* Concept Notes */}
      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-6 overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4">
          <h2 className="text-lg sm:text-xl font-semibold">Concept Notes</h2>
          {isEditingNotes ? (
            <div className="space-x-2 flex flex-wrap">
              <button
                onClick={handleSaveNotes}
                className="text-green-600 hover:text-green-800 font-medium text-xs sm:text-base"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setIsEditingNotes(false);
                  setNotes(topic.notes || '');
                }}
                className="text-gray-600 hover:text-gray-800 font-medium text-xs sm:text-base"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditingNotes(true)}
              className="text-indigo-600 hover:text-indigo-800 font-medium text-xs sm:text-base"
            >
              Edit
            </button>
          )}
        </div>
        {isEditingNotes ? (
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full h-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-xs sm:text-base"
            placeholder="Add your notes about this topic..."
          />
        ) : (
          <p className="text-gray-700 whitespace-pre-wrap text-xs sm:text-base">
            {notes || 'No notes yet. Click Edit to add notes.'}
          </p>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-6 overflow-x-auto">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 min-w-max sm:min-w-0">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-2 sm:px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-xs sm:text-sm"
            >
              <option value="ALL">All</option>
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
            </select>
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Difficulty</label>
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="w-full px-2 sm:px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-xs sm:text-sm"
            >
              <option value="ALL">All</option>
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
            </select>
          </div>
          <div className="col-span-1">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search"
              className="w-full px-2 sm:px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-xs sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Important</label>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={importantFilter}
                onChange={(e) => setImportantFilter(e.target.checked)}
                className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <span className="ml-2 text-xs sm:text-sm text-gray-700">⭐</span>
            </label>
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="px-4 sm:px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-base sm:text-lg md:text-xl font-semibold">
            Questions ({filteredQuestions.length})
          </h2>
        </div>
        {filteredQuestions.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {filteredQuestions.map(question => (
              <div key={question.id} className="p-3 sm:p-4 md:p-6 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col sm:flex-row items-start sm:items-start justify-between gap-3">
                  <div className="flex-1 min-w-0 w-full">
                    <div className="flex items-start gap-2 sm:gap-3 mb-2">
                      <button
                        onClick={() => handleToggleImportant(question.id)}
                        className="text-xl sm:text-2xl hover:scale-110 transition-transform flex-shrink-0 mt-1"
                      >
                        {question.isImportant ? '⭐' : '☆'}
                      </button>
                      <div className="min-w-0 flex-1">
                        <span className="text-gray-600 font-mono text-xs sm:text-sm">#{question.leetcodeNumber}</span>
                        <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 break-words">{question.title}</h3>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 ml-8 mt-2">
                      <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
                        {question.difficulty}
                      </span>
                      <select
                        value={question.status}
                        onChange={(e) => handleStatusChange(question.id, e.target.value)}
                        className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium border-0 cursor-pointer ${getStatusColor(question.status)}`}
                      >
                        <option value="TODO">TODO</option>
                        <option value="IN_PROGRESS">IN PROGRESS</option>
                        <option value="DONE">DONE</option>
                      </select>
                      {question.reminderDateTime && (
                        <span className="text-xs text-gray-500 break-words">
                          🔔 {new Date(question.reminderDateTime).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
                    <a
                      href={question.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-xs sm:text-sm text-center"
                    >
                      Open
                    </a>
                    <button
                      onClick={() => navigate(`/add-question?questionId=${question.id}`)}
                      className="w-full sm:w-auto px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-xs sm:text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteQuestion(question.id)}
                      className="w-full sm:w-auto px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-xs sm:text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 sm:p-12 text-center">
            <p className="text-gray-500 text-sm sm:text-lg mb-4">No questions found</p>
            <Link
              to={`/add-question?topicId=${topicId}`}
              className="inline-block mt-4 text-indigo-600 hover:text-indigo-800 font-medium text-sm sm:text-base"
            >
              Add your first question →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopicDetails;
