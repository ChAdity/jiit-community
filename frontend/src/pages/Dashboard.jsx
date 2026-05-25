import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { Search, Briefcase, Building2, ChevronRight, AlertCircle, CheckCircle, ExternalLink, Save } from 'lucide-react';

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { user, login } = useContext(AuthContext);
  const [linkedinUrl, setLinkedinUrl] = useState(user?.linkedinUrl || '');
  const [currentCompany, setCurrentCompany] = useState(user?.currentCompany || '');
  const [currentRole, setCurrentRole] = useState(user?.currentRole || '');
  const [savingLinkedin, setSavingLinkedin] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, [search, page]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/posts?page=${page}${search ? `&company=${search}` : ''}`);
      setPosts(res.data.posts);
      setTotalPages(res.data.pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-6">
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">JIIT Community</h1>
          <p className="text-gray-600 mt-1">Discover real interview experiences from JIIT alumni.</p>
        </div>
        
        {/* THIS IS THE NEW BUTTON LOGIC */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {user?.verificationStatus === 'verified' && user?.role !== 'student' && (
            <Link to="/create-post" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium shadow-sm transition-colors">
              + Share Experience
            </Link>
          )}
        </div>
      </div>

      {user?.verificationStatus === 'unverified' && (
        <div className="mb-8 bg-white border border-blue-100 rounded-xl p-6 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to JIIT Community! 👋</h2>
          <p className="text-gray-600 mb-6">Let's get your profile verified so you can unlock all features.</p>
          
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-50/50 rounded-lg p-4 border border-blue-50">
              <h3 className="font-bold text-gray-900 mb-1 flex items-center gap-2">🎓 For Students</h3>
              <p className="text-sm text-gray-600">Click verify to confirm your college email. You will get immediate access to read all interview experiences.</p>
            </div>
            <div className="bg-blue-50/50 rounded-lg p-4 border border-blue-50">
              <h3 className="font-bold text-gray-900 mb-1 flex items-center gap-2">💼 For Alumni</h3>
              <p className="text-sm text-gray-600">Click verify to upload your ID proof. Once approved, you can share your experiences and mentor students.</p>
            </div>
          </div>
          
          <Link to="/verify" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold shadow-sm transition-colors">
            Verify Profile Now <ChevronRight size={18} />
          </Link>
        </div>
      )}

      {user?.verificationStatus === 'verified' && user?.role !== 'student' && (!user?.linkedinUrl || !user?.currentCompany || !user?.currentRole) && (
        <div className="mb-8 bg-blue-50 border border-blue-100 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-100 p-2 rounded-full"><ExternalLink className="text-blue-700" size={24} /></div>
            <div>
              <h3 className="font-bold text-gray-900">Complete Your Alumni Profile</h3>
              <p className="text-sm text-gray-600">Help students connect with you for 1-on-1 mentorship.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <input 
              type="text" 
              placeholder="Current Company (e.g. Google)" 
              className="input-field py-2"
              value={currentCompany}
              onChange={(e) => setCurrentCompany(e.target.value)}
            />
            <input 
              type="text" 
              placeholder="Current Role (e.g. SDE-1)" 
              className="input-field py-2"
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value)}
            />
            <input 
              type="url" 
              placeholder="LinkedIn URL (https://...)" 
              className="input-field py-2"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
            />
          </div>
          <div className="flex justify-end">
            <button 
              onClick={async () => {
                setSavingLinkedin(true);
                try {
                  const res = await api.put('/auth/profile', { linkedinUrl, currentCompany, currentRole });
                  login(res.data);
                  alert('Profile saved successfully!');
                } catch(e) {
                  alert('Failed to save profile');
                }
                setSavingLinkedin(false);
              }}
              disabled={savingLinkedin || (!linkedinUrl && !currentCompany && !currentRole)}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Save Profile
            </button>
          </div>
        </div>
      )}

      <div className="relative mb-8">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-4 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-lg shadow-sm"
          placeholder="Search by company name (e.g. Amazon, Microsoft)..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-500">Loading experiences...</div>
      ) : (
        <div className="grid gap-6">
          {posts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
              <Building2 className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No experiences found</h3>
              <p className="mt-1 text-sm text-gray-500">Try adjusting your search criteria or come back later.</p>
            </div>
          ) : (
            posts.map((post) => (
              <Link key={post._id} to={`/experience/${post._id}`} className="card hover:shadow-md transition-shadow group cursor-pointer block">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors flex flex-wrap items-center gap-2">
                      <span>{post.roleTitle} at {post.company}</span>
                      {post.selectionStatus === 'Selected' && <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full font-bold">Selected</span>}
                      {post.selectionStatus === 'Rejected' && <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full font-bold">Rejected</span>}
                    </h2>
                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Briefcase size={16} className="text-gray-400" />
                        <span className="font-medium text-green-600">{post.ctc}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full font-medium">
                          {post.batchYear} Batch
                        </span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="text-gray-400 group-hover:text-blue-500" />
                </div>
                <div className="mt-4 flex items-center gap-2 pt-4 border-t border-gray-50">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-bold text-blue-700 uppercase">
                    {post.authorId?.name?.charAt(0) || 'A'}
                  </div>
                  <div className="text-sm">
                    <p className="font-medium text-gray-900">{post.authorId?.name || 'Anonymous Alumni'}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      Verified Alumni <CheckCircle size={12} className="text-blue-500" />
                    </p>
                  </div>
                </div>
              </Link>
            ))
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-white px-4 py-3 border border-gray-100 rounded-xl sm:px-6 shadow-sm mt-4">
              <div className="flex flex-1 justify-between sm:hidden">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Page <span className="font-medium">{page}</span> of <span className="font-medium">{totalPages}</span>
                  </p>
                </div>
                <div>
                  <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="relative inline-flex items-center rounded-l-md px-4 py-2 text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 font-medium"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="relative inline-flex items-center rounded-r-md px-4 py-2 text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 font-medium"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default Dashboard;
