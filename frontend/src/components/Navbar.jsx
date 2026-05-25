import { useState, useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, User as UserIcon, Menu, X, RefreshCcw } from 'lucide-react';
import api from '../utils/api';

const Navbar = () => {
  const { user, logout, login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleRoleSwitch = async () => {
    if (!window.confirm(`Are you sure you want to switch your role to ${user.role === 'student' ? 'Alumni' : 'Student'}? Your verification status will be reset.`)) {
      return;
    }
    try {
      const res = await api.put('/auth/switch-role');
      login(res.data);
      alert(`Role successfully switched to ${res.data.role}! Please verify your new role.`);
      navigate('/verify');
    } catch (error) {
      alert('Failed to switch role');
    }
  };

  return (
    <nav className="bg-white shadow-sm fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex-shrink-0 flex items-center">
              <span className="font-bold text-xl text-blue-700">JIIT</span>
              <span className="font-bold text-xl text-gray-900 ml-1">Community</span>
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <NavLink to="/dashboard" className={({isActive}) => isActive ? "text-sm font-bold text-blue-700 border-b-2 border-blue-700 py-5" : "text-sm font-medium text-gray-700 hover:text-blue-600 py-5"}>Home</NavLink>
            <NavLink to="/questions" className={({isActive}) => isActive ? "text-sm font-bold text-blue-700 border-b-2 border-blue-700 py-5" : "text-sm font-medium text-gray-700 hover:text-blue-600 py-5"}>Q&A</NavLink>
            <NavLink to="/bookmarks" className={({isActive}) => isActive ? "text-sm font-bold text-blue-700 border-b-2 border-blue-700 py-5" : "text-sm font-medium text-gray-700 hover:text-blue-600 py-5"}>Bookmarks</NavLink>
            <NavLink to="/leaderboard" className={({isActive}) => isActive ? "text-sm font-bold text-orange-700 border-b-2 border-orange-700 py-5 flex items-center gap-1" : "text-sm font-bold text-orange-600 hover:text-orange-700 py-5 flex items-center gap-1"}>🏆 Leaderboard</NavLink>
            {user.role === 'admin' && (
              <NavLink to="/admin" className={({isActive}) => isActive ? "text-sm font-bold text-blue-700 border-b-2 border-blue-700 py-5" : "text-sm font-medium text-gray-700 hover:text-blue-600 py-5"}>Admin</NavLink>
            )}
            <div className="flex items-center space-x-2 text-sm text-gray-700 ml-4 pl-4 border-l border-gray-200">
              <UserIcon size={18} />
              <span className="font-medium">{user.name}</span>
            </div>
            <button 
              onClick={handleRoleSwitch} 
              className="text-gray-500 hover:text-blue-600 flex items-center gap-1 text-sm font-medium ml-4"
              title={`Switch to ${user.role === 'student' ? 'Alumni' : 'Student'}`}
            >
              <RefreshCcw size={16} /> Switch Role
            </button>
            <button onClick={handleLogout} className="text-gray-500 hover:text-red-600 ml-4">
              <LogOut size={20} />
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-500 hover:text-gray-900 focus:outline-none">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg absolute w-full">
          <div className="px-4 pt-2 pb-4 space-y-1">
            <NavLink to="/dashboard" onClick={() => setIsOpen(false)} className={({isActive}) => isActive ? "block px-3 py-2 rounded-md text-base font-bold text-blue-700 bg-blue-50" : "block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"}>Home</NavLink>
            <NavLink to="/questions" onClick={() => setIsOpen(false)} className={({isActive}) => isActive ? "block px-3 py-2 rounded-md text-base font-bold text-blue-700 bg-blue-50" : "block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"}>Q&A</NavLink>
            <NavLink to="/bookmarks" onClick={() => setIsOpen(false)} className={({isActive}) => isActive ? "block px-3 py-2 rounded-md text-base font-bold text-blue-700 bg-blue-50" : "block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"}>Bookmarks</NavLink>
            <NavLink to="/leaderboard" onClick={() => setIsOpen(false)} className={({isActive}) => isActive ? "block px-3 py-2 rounded-md text-base font-bold text-orange-700 bg-orange-50 flex items-center gap-1" : "block px-3 py-2 rounded-md text-base font-bold text-orange-600 hover:text-orange-700 hover:bg-orange-50 flex items-center gap-1"}>🏆 Leaderboard</NavLink>
            {user.role === 'admin' && (
              <NavLink to="/admin" onClick={() => setIsOpen(false)} className={({isActive}) => isActive ? "block px-3 py-2 rounded-md text-base font-bold text-blue-700 bg-blue-50" : "block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"}>Admin</NavLink>
            )}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2 mb-4 px-3 text-gray-800 font-medium">
                <UserIcon size={18} />
                <span>{user.name}</span>
              </div>
              <button 
                onClick={handleRoleSwitch} 
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium w-full text-left px-3 mb-4"
              >
                <RefreshCcw size={20} />
                Switch to {user.role === 'student' ? 'Alumni' : 'Student'}
              </button>
              <button onClick={handleLogout} className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium w-full text-left px-3">
                <LogOut size={20} />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
export default Navbar;
