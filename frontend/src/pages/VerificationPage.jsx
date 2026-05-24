import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

const VerificationPage = () => {
  const { user, updateVerificationStatus } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('student'); // 'student' or 'alumni'
  const [collegeEmail, setCollegeEmail] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // Local verification status state
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await api.get('/verification/status');
        setStatus(res.data.verificationStatus);
        updateVerificationStatus(res.data.verificationStatus);
      } catch (err) {
        console.error('Failed to fetch status');
      }
    };
    checkStatus();
  }, []);

  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/verification/submit', {
        userType: 'student',
        collegeEmail
      });
      setStatus('verified');
      updateVerificationStatus('verified', 'student');
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAlumniSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('userType', 'alumni');
      if (file) formData.append('idProof', file);
      
      await api.post('/verification/submit', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setStatus('pending');
      updateVerificationStatus('pending', 'alumni');
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'verified') {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <CheckCircle className="text-green-500 w-20 h-20 mb-6" />
        <h2 className="text-3xl font-bold text-gray-900 mb-4">You are verified!</h2>
        <p className="text-gray-600 mb-8 max-w-md">You have full access to view, search, and bookmark placement experiences.</p>
        <button onClick={() => navigate('/dashboard')} className="btn-primary">Go to Dashboard</button>
      </div>
    );
  }

  if (status === 'pending') {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Clock className="text-yellow-500 w-20 h-20 mb-6" />
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Verification Pending</h2>
        <p className="text-gray-600 mb-8 max-w-md">Your alumni verification request has been received and is being reviewed by an admin. Please check back later.</p>
        <button onClick={() => navigate('/dashboard')} className="btn-secondary">Go to Dashboard</button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Complete Your Profile</h2>
      
      <div className="card">
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`pb-4 px-6 font-medium text-sm ${activeTab === 'student' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('student')}
          >
            I am a Current Student
          </button>
          <button
            className={`pb-4 px-6 font-medium text-sm ${activeTab === 'alumni' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('alumni')}
          >
            I am an Alumni
          </button>
        </div>

        {error && <div className="mb-6 bg-red-50 p-4 rounded-md flex items-start gap-3"><AlertCircle className="text-red-500 w-5 h-5 shrink-0" /><p className="text-sm text-red-700">{error}</p></div>}

        {activeTab === 'student' ? (
          <form onSubmit={handleStudentSubmit} className="space-y-6">
            <div className="bg-blue-50 text-blue-800 p-3 rounded-lg text-sm mb-4">
              <span className="font-semibold">Note:</span> This option is for current JIIT students graduating in <strong>2027 or later</strong>.
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">JIIT College Email</label>
              <input
                type="email"
                required
                className="input-field"
                placeholder="e.g. 99999999@mail.jiit.ac.in"
                value={collegeEmail}
                onChange={(e) => setCollegeEmail(e.target.value)}
              />
            </div>
            <button type="submit" disabled={loading} className="w-full btn-primary">
              {loading ? 'Verifying...' : 'Verify Email'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleAlumniSubmit} className="space-y-6">
            <div className="bg-blue-50 text-blue-800 p-3 rounded-lg text-sm mb-4">
              <span className="font-semibold">Note:</span> This option is for JIIT alumni who graduated in <strong>2026 or earlier</strong>.
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload College ID Proof</label>
              <input
                type="file"
                className="input-field py-2"
                onChange={(e) => setFile(e.target.files[0])}
              />
              <p className="mt-2 text-xs text-gray-500">Upload a clear photo of your old JIIT ID card or degree certificate. Admin approval takes 24-48 hours.</p>
            </div>
            <button type="submit" disabled={loading} className="w-full btn-primary">
              {loading ? 'Submitting...' : 'Submit for Review'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
export default VerificationPage;
