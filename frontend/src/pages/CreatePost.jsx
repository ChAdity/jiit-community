import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';

const CreatePost = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    company: '', roleTitle: '', ctc: '', batchYear: new Date().getFullYear(),
    difficulty: 'Medium', rounds: '', questions: '', tips: '', selectionStatus: 'Selected'
  });

  if (user?.role === 'student') return <div className="text-center py-20 text-red-500 font-medium text-lg">Only verified Alumni and Admins can share experiences.</div>;
  if (user?.verificationStatus !== 'verified') return <div className="text-center py-20 text-red-500 font-medium text-lg">Your profile must be verified to post. Please go to the Verify page.</div>;

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/posts', formData);
      navigate(`/experience/${res.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post experience');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Share Your Interview Experience</h1>
      <form onSubmit={handleSubmit} className="card space-y-6">
        {error && <div className="text-red-500 text-sm bg-red-50 p-3 rounded">{error}</div>}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div><label className="block text-sm font-medium mb-1">Company Name</label><input type="text" required name="company" onChange={handleChange} className="input-field" placeholder="e.g. Amazon" /></div>
          <div><label className="block text-sm font-medium mb-1">Role Title</label><input type="text" required name="roleTitle" onChange={handleChange} className="input-field" placeholder="e.g. SDE-1" /></div>
          <div><label className="block text-sm font-medium mb-1">CTC</label><input type="text" required name="ctc" onChange={handleChange} className="input-field" placeholder="e.g. 44 LPA" /></div>
          <div><label className="block text-sm font-medium mb-1">Batch Year</label><input type="number" required name="batchYear" value={formData.batchYear} onChange={handleChange} className="input-field" /></div>
          <div>
            <label className="block text-sm font-medium mb-1">Selection Status</label>
            <select name="selectionStatus" value={formData.selectionStatus} onChange={handleChange} className="input-field">
              <option value="Selected">Selected</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div><label className="block text-sm font-medium mb-1">Interview Rounds Details</label><textarea required name="rounds" rows="4" onChange={handleChange} className="input-field" placeholder="Describe the rounds (e.g. OA, Technical 1, HR...)"></textarea></div>
        <div><label className="block text-sm font-medium mb-1">Questions Asked</label><textarea name="questions" rows="4" onChange={handleChange} className="input-field" placeholder="What specific questions do you remember?"></textarea></div>
        <div><label className="block text-sm font-medium mb-1">Preparation Tips</label><textarea name="tips" rows="3" onChange={handleChange} className="input-field" placeholder="Any advice for juniors?"></textarea></div>

        <div className="flex justify-end pt-4 border-t border-gray-100">
          <button type="submit" disabled={loading} className="btn-primary w-full md:w-auto">
            {loading ? 'Posting...' : 'Publish Experience'}
          </button>
        </div>
      </form>
    </div>
  );
};
export default CreatePost;
