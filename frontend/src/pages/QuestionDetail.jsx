import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { ChevronLeft, MessageSquare, CheckCircle, ExternalLink } from 'lucide-react';

const LinkedInIcon = ({ size = 18, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const QuestionDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [data, setData] = useState({ question: null, answers: [] });
  const [loading, setLoading] = useState(true);
  const [answerBody, setAnswerBody] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const res = await api.get(`/questions/${id}`);
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post(`/questions/${id}/answers`, { body: answerBody });
      setData({ ...data, answers: [...data.answers, res.data] });
      setAnswerBody('');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to post answer');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!data.question) return <div className="text-center py-20">Question not found</div>;

  const canAnswer = user?.verificationStatus === 'verified' && (user?.role === 'alumni' || user?.role === 'admin');

  return (
    <div className="py-6 max-w-4xl mx-auto">
      <Link to="/questions" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 font-medium">
        <ChevronLeft size={20} /> Back to Q&A
      </Link>
      
      <div className="card mb-8">
        <div className="flex gap-2 mb-3">
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded font-bold">{data.question.company || 'General'}</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">{data.question.title}</h1>
        <p className="text-gray-700 whitespace-pre-wrap">{data.question.body}</p>
        
        <div className="mt-6 flex items-center gap-2 text-sm text-gray-500">
          <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center font-bold text-xs">{data.question.authorId?.name?.charAt(0)}</div>
          <span>Asked by {data.question.authorId?.name || 'Anonymous'}</span>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900">
          <MessageSquare size={20} /> Answers ({data.answers.length})
        </h2>
      </div>

      <div className="space-y-4 mb-8">
        {data.answers.length === 0 ? (
          <div className="text-gray-500 italic bg-gray-50 p-6 rounded-lg border border-gray-100">No answers yet.</div>
        ) : (
          data.answers.map((ans) => (
            <div key={ans._id} className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm">
              <p className="text-gray-800 whitespace-pre-wrap mb-4">{ans.body}</p>
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <div className="h-6 w-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                  {ans.authorId?.name?.charAt(0) || 'A'}
                </div>
                <span className="font-medium text-gray-900">{ans.authorId?.name || 'Alumni'}</span>
                
                {ans.authorId?.currentRole && ans.authorId?.currentCompany && (
                  <span className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full font-medium">
                    {ans.authorId.currentRole} at {ans.authorId.currentCompany}
                  </span>
                )}
                {ans.authorId?.karma !== undefined && (
                  <span className="bg-orange-100 text-orange-700 text-xs px-2 py-0.5 rounded-full font-bold">
                    🔥 {ans.authorId.karma} Karma
                  </span>
                )}

                {ans.authorId?.role === 'alumni' && <CheckCircle size={14} className="text-blue-500" title="Verified Alumni" />}
                {ans.authorId?.linkedinUrl && (
                  <a href={ans.authorId.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 ml-1 transition-colors">
                    <LinkedInIcon size={16} />
                  </a>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {canAnswer ? (
        <form onSubmit={handleAnswerSubmit} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-3">Write an Answer</h3>
          <textarea required rows="4" className="input-field mb-3" value={answerBody} onChange={(e) => setAnswerBody(e.target.value)} placeholder="Share your knowledge..."></textarea>
          <div className="flex justify-end">
            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting ? 'Posting...' : 'Post Answer'}
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-yellow-50 text-yellow-800 p-4 rounded-lg text-sm text-center">
          Only verified Alumni can post answers to queries.
        </div>
      )}
    </div>
  );
};
export default QuestionDetail;
