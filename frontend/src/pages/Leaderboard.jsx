import { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { Trophy, Medal, Award, Info } from 'lucide-react';

const LinkedInIcon = ({ size = 18, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const Leaderboard = () => {
  const { user } = useContext(AuthContext);
  const [topUsers, setTopUsers] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [userKarma, setUserKarma] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await api.get('/auth/leaderboard');
        setTopUsers(res.data.topUsers);
        setUserRank(res.data.userRank);
        setUserKarma(res.data.userKarma);
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  const getRankIcon = (index) => {
    if (index === 0) return <Trophy className="text-yellow-500" size={24} />;
    if (index === 1) return <Medal className="text-gray-400" size={24} />;
    if (index === 2) return <Award className="text-amber-600" size={24} />;
    return <span className="font-bold text-gray-500 text-lg w-6 text-center">{index + 1}</span>;
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 flex justify-center items-center gap-3">
          <Trophy className="text-yellow-500" size={36} /> 
          Top Contributors
        </h1>
        <p className="text-lg text-gray-600">The most helpful alumni in the JIIT Community.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="md:col-span-2 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg flex flex-col justify-center">
          <h2 className="text-2xl font-bold mb-2">Your Standing</h2>
          <div className="flex items-center gap-8 mt-2">
            <div>
              <p className="text-blue-100 text-sm font-medium">Rank</p>
              <p className="text-4xl font-extrabold">#{userRank || '-'}</p>
            </div>
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Karma</p>
              <p className="text-4xl font-extrabold flex items-center gap-2">
                🔥 {userKarma}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Info className="text-blue-500" size={20} />
            Karma Rules
          </h3>
          <ul className="space-y-3 text-sm text-gray-600">
            <li className="flex justify-between items-center pb-2 border-b border-gray-50">
              <span>Post an Experience</span>
              <span className="font-bold text-green-600">+10 🔥</span>
            </li>
            <li className="flex justify-between items-center pb-2 border-b border-gray-50">
              <span>Answer a Question</span>
              <span className="font-bold text-green-600">+5 🔥</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-900">Leaderboard (Top 10)</h3>
        </div>
        
        {loading ? (
          <div className="text-center py-10 text-gray-500">Loading ranks...</div>
        ) : topUsers.length === 0 ? (
          <div className="text-center py-10 text-gray-500">No karma earned yet. Be the first!</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {topUsers.map((u, idx) => (
              <div key={u._id} className={`flex items-center justify-between p-6 hover:bg-gray-50 transition-colors ${user?._id === u._id ? 'bg-blue-50/50' : ''}`}>
                <div className="flex items-center gap-4">
                  <div className="w-10 flex justify-center">
                    {getRankIcon(idx)}
                  </div>
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold uppercase">
                    {u.name?.charAt(0) || 'A'}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg flex items-center gap-2 flex-wrap">
                      <span>{u.name}</span>
                      {user?._id === u._id && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">You</span>}
                      {u.linkedinUrl && (
                        <a href={u.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 transition-colors ml-1">
                          <LinkedInIcon size={18} />
                        </a>
                      )}
                    </h4>
                    {u.currentCompany && u.currentRole && (
                      <p className="text-sm text-gray-500 font-medium">{u.currentRole} at {u.currentCompany}</p>
                    )}
                  </div>
                </div>
                <div className="font-extrabold text-orange-600 text-xl bg-orange-50 px-4 py-1.5 rounded-full border border-orange-100 shadow-sm">
                  {u.karma} 🔥
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
