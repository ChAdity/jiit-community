import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const CreateQuestion = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ title: '', body: '', company: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/questions', formData);
      navigate(`/question/${res.data._id}`);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to post question');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Ask a Question</h1>
      <form onSubmit={handleSubmit} className="card space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">Question Title</label>
          <input required type="text" className="input-field" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="What exactly do you want to know?" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Company (Optional)</label>
          <input type="text" className="input-field" value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} placeholder="e.g. Google, Microsoft" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">More Details</label>
          <textarea required rows="5" className="input-field" value={formData.body} onChange={(e) => setFormData({...formData, body: e.target.value})} placeholder="Provide context or specific details..."></textarea>
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Posting...' : 'Post Question'}
        </button>
      </form>
    </div>
  );
};
export default CreateQuestion;
