import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Topics from './pages/Topics';
import TopicDetails from './pages/TopicDetails';
import AddQuestion from './pages/AddQuestion';
import Reminders from './pages/Reminders';
import DailyProgress from './pages/DailyProgress';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="ml-0 md:ml-64 transition-all duration-300 pt-16 md:pt-0">
          <Routes>
            <Route path="/" element={<Dashboard />} />    
            <Route path="/topics" element={<Topics />} />
            <Route path="/topics/:topicId" element={<TopicDetails />} /> 
            <Route path="/add-question" element={<AddQuestion />} />
            <Route path="/reminders" element={<Reminders />} />
            <Route path="/daily-progress" element={<DailyProgress />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
