import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { Building2, Briefcase, Calendar, ChevronLeft, CheckCircle, Bookmark, ExternalLink } from 'lucide-react';

const LinkedInIcon = ({ size = 18, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const ExperienceDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarking, setBookmarking] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await api.get(`/posts/${id}`);
        setPost(res.data);

        try {
          const bRes = await api.get('/posts/bookmarks/all');
          const bookmarked = bRes.data.some(b => b.postId && b.postId._id === id);
          setIsBookmarked(bookmarked);
        } catch (e) {
          console.error('Failed to fetch bookmarks');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) return <div className="py-20 text-center">Loading...</div>;
  if (!post) return <div className="py-20 text-center">Post not found</div>;

  const handleBookmark = async () => {
    setBookmarking(true);
    try {
      const res = await api.post(`/posts/${id}/bookmark`);
      setIsBookmarked(res.data.bookmarked);
    } catch (err) {
      alert('Failed to bookmark');
    } finally {
      setBookmarking(false);
    }
  };

  return (
    <div className="py-6 max-w-4xl mx-auto">
      <Link to="/dashboard" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 font-medium">
        <ChevronLeft size={20} /> Back to Dashboard
      </Link>
      
      <div className="card mb-8">
        <div className="border-b border-gray-100 pb-6 mb-6">
          <div className="flex justify-between items-start gap-4">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-4">{post.roleTitle} at {post.company}</h1>
            <button 
              onClick={handleBookmark} 
              disabled={bookmarking}
              className={`p-2 rounded-full flex items-center justify-center transition-colors ${isBookmarked ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
              title={isBookmarked ? "Remove Bookmark" : "Save Bookmark"}
            >
              <Bookmark size={24} className={isBookmarked ? "fill-current" : ""} />
            </button>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full"><Briefcase size={16} /> CTC: {post.ctc}</div>
            <div className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full"><Calendar size={16} /> Batch: {post.batchYear}</div>
            <div className="flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full"><Building2 size={16} /> Difficulty: {post.difficulty}</div>
          </div>
        </div>

        <div className="prose max-w-none text-gray-800">
          <h3 className="text-xl font-bold mb-3 text-gray-900">Interview Rounds</h3>
          <p className="whitespace-pre-wrap mb-6 bg-gray-50 p-4 rounded-lg border border-gray-100">{post.rounds}</p>

          <h3 className="text-xl font-bold mb-3 text-gray-900">Questions Asked</h3>
          <p className="whitespace-pre-wrap mb-6 bg-gray-50 p-4 rounded-lg border border-gray-100">{post.questions || 'Not provided'}</p>

          <h3 className="text-xl font-bold mb-3 text-gray-900">Preparation Tips</h3>
          <p className="whitespace-pre-wrap bg-gray-50 p-4 rounded-lg border border-gray-100">{post.tips || 'Not provided'}</p>
        </div>
        
        <div className="mt-10 pt-6 border-t border-gray-100 flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700 uppercase">
            {post.authorId?.name?.charAt(0) || 'A'}
          </div>
          <div>
            <p className="font-bold text-gray-900 flex flex-wrap items-center gap-2">
              <span>{post.authorId?.name || 'Anonymous Alumni'}</span>
              {post.authorId?.currentRole && post.authorId?.currentCompany && (
                <span className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full font-medium">
                  {post.authorId.currentRole} at {post.authorId.currentCompany}
                </span>
              )}
              {post.authorId?.karma !== undefined && (
                <span className="bg-orange-100 text-orange-700 text-xs px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                  🔥 {post.authorId.karma} Karma
                </span>
              )}
              {post.authorId?.linkedinUrl && (
                <a href={post.authorId.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 transition-colors">
                  <LinkedInIcon size={18} />
                </a>
              )}
            </p>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              Verified Alumni <CheckCircle size={14} className="text-blue-500" />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ExperienceDetail;
