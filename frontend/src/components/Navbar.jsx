import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, User as UserIcon, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
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
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/dashboard" className="text-sm font-medium text-gray-700 hover:text-blue-600">Home</Link>
            <Link to="/questions" className="text-sm font-medium text-gray-700 hover:text-blue-600">Q&A</Link>
            <Link to="/bookmarks" className="text-sm font-medium text-gray-700 hover:text-blue-600">Bookmarks</Link>
            <Link to="/leaderboard" className="text-sm font-medium text-orange-600 hover:text-orange-700 font-bold flex items-center gap-1">🏆 Leaderboard</Link>
            {user.role === 'admin' && (
              <Link to="/admin" className="text-sm font-medium text-gray-700 hover:text-blue-600">Admin</Link>
            )}
            <div className="flex items-center space-x-2 text-sm text-gray-700 ml-4 pl-4 border-l border-gray-200">
              <UserIcon size={18} />
              <span className="font-medium">{user.name}</span>
            </div>
            <button onClick={handleLogout} className="text-gray-500 hover:text-red-600">
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
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-4 pt-2 pb-4 space-y-1">
            <Link to="/dashboard" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">Home</Link>
            <Link to="/questions" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">Q&A</Link>
            <Link to="/bookmarks" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">Bookmarks</Link>
            <Link to="/leaderboard" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-orange-600 hover:text-orange-700 hover:bg-orange-50 font-bold flex items-center gap-1">🏆 Leaderboard</Link>
            {user.role === 'admin' && (
              <Link to="/admin" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">Admin</Link>
            )}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2 mb-4 px-3 text-gray-800 font-medium">
                <UserIcon size={18} />
                <span>{user.name}</span>
              </div>
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
