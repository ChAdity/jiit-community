import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import VerificationPage from './pages/VerificationPage';
import AdminDashboard from './pages/AdminDashboard';
import ExperienceDetail from './pages/ExperienceDetail';
import CreatePost from './pages/CreatePost'; // We import it here
import BookmarksPage from './pages/BookmarksPage';
import QuestionsPage from './pages/QuestionsPage';
import CreateQuestion from './pages/CreateQuestion';
import QuestionDetail from './pages/QuestionDetail';
import Leaderboard from './pages/Leaderboard';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
};

function App() {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {user && <Navbar />}
      <div className={user ? "pt-24 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" : ""}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={user ? <Navigate to="/dashboard" /> : <LandingPage />} />
          <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />
          <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <RegisterPage />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/verify" element={<ProtectedRoute><VerificationPage /></ProtectedRoute>} />
          <Route path="/experience/:id" element={<ProtectedRoute><ExperienceDetail /></ProtectedRoute>} />
          
          {/* This is the route that was missing/misplaced! */}
          <Route path="/create-post" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
          
          <Route path="/bookmarks" element={<ProtectedRoute><BookmarksPage /></ProtectedRoute>} />
          <Route path="/questions" element={<ProtectedRoute><QuestionsPage /></ProtectedRoute>} />
          <Route path="/ask-question" element={<ProtectedRoute><CreateQuestion /></ProtectedRoute>} />
          <Route path="/question/:id" element={<ProtectedRoute><QuestionDetail /></ProtectedRoute>} />
          <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
          
          <Route path="/admin" element={
            <ProtectedRoute>
              {user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/dashboard" />}
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </div>
  );
}

export default App;
