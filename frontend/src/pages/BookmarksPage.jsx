import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { Briefcase, ChevronRight, Bookmark as BookmarkIcon } from 'lucide-react';

const BookmarksPage = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    try {
      const res = await api.get('/posts/bookmarks/all');
      setBookmarks(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-20 text-gray-500">Loading bookmarks...</div>;

  return (
    <div className="py-6 max-w-4xl mx-auto">
      <div className="mb-8 flex items-center gap-3">
        <BookmarkIcon className="text-blue-600" size={32} />
        <h1 className="text-3xl font-bold text-gray-900">Saved Experiences</h1>
      </div>

      <div className="grid gap-6">
        {bookmarks.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
            <BookmarkIcon className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No bookmarks yet</h3>
            <p className="mt-1 text-sm text-gray-500">Experiences you bookmark will appear here.</p>
          </div>
        ) : (
          bookmarks.map((bookmark) => (
            bookmark.postId && (
              <Link key={bookmark._id} to={`/experience/${bookmark.postId._id}`} className="card hover:shadow-md transition-shadow group cursor-pointer block relative">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {bookmark.postId.roleTitle} at {bookmark.postId.company}
                    </h2>
                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Briefcase size={16} className="text-gray-400" />
                        <span className="font-medium text-gray-800">{bookmark.postId.authorId?.name || 'Anonymous'}</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="text-gray-400 group-hover:text-blue-500" />
                </div>
              </Link>
            )
          ))
        )}
      </div>
    </div>
  );
};
export default BookmarksPage;
