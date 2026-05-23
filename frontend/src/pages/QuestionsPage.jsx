import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { MessageSquare, PlusCircle, Search } from 'lucide-react';

const QuestionsPage = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortFilter, setSortFilter] = useState('recent');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchQuestions();
  }, [search, statusFilter, sortFilter, page]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      let query = `/questions?page=${page}&`;
      if (search) query += `company=${search}&`;
      if (statusFilter !== 'all') query += `status=${statusFilter}&`;
      if (sortFilter !== 'recent') query += `sort=${sortFilter}&`;
      
      const res = await api.get(query);
      setQuestions(res.data.questions);
      setTotalPages(res.data.pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-6 max-w-4xl mx-auto">
      <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {user?.role === 'student' ? 'Your Questions' : 'Placement Q&A'}
          </h1>
          <p className="text-gray-600 mt-1">
            {user?.role === 'student' 
              ? 'Keep track of the questions you have asked.' 
              : 'Answer doubts and help students from your college.'}
          </p>
        </div>
        {(user?.verificationStatus === 'verified' || user?.role === 'admin') && (
          <Link to="/ask-question" className="btn-primary flex items-center gap-2">
            <PlusCircle size={18} /> Ask a Question
          </Link>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Search by company..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        
        {user?.role !== 'student' && (
          <>
            <select 
              value={statusFilter} 
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="border border-gray-200 rounded-xl px-4 py-3 bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="unanswered">Unanswered</option>
              <option value="answered">Answered</option>
            </select>
            
            <select 
              value={sortFilter} 
              onChange={(e) => { setSortFilter(e.target.value); setPage(1); }}
              className="border border-gray-200 rounded-xl px-4 py-3 bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="recent">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </>
        )}
      </div>

      {loading ? (
        <div className="text-center py-10">Loading questions...</div>
      ) : (
        <div className="space-y-4">
          {questions.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
              <MessageSquare className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No questions found</h3>
            </div>
          ) : (
            questions.map((q) => (
              <Link key={q._id} to={`/question/${q._id}`} className="block bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{q.title}</h3>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-medium">{q.company}</span>
                  <span className="flex items-center gap-1"><MessageSquare size={14} /> {q.answersCount} answers</span>
                  <span>By {q.authorId?.name || 'Anonymous'}</span>
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
export default QuestionsPage;
