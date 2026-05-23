import { useState, useEffect } from 'react';
import api from '../utils/api';
import { CheckCircle, XCircle } from 'lucide-react';

const AdminDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await api.get('/admin/verifications');
      setRequests(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    try {
      await api.patch(`/admin/verifications/${id}/${action}`);
      setRequests(requests.filter(req => req._id !== id));
    } catch (err) {
      alert('Action failed');
    }
  };

  if (loading) return <div className="py-20 text-center">Loading admin dashboard...</div>;

  return (
    <div className="py-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Verification Dashboard</h1>
      
      {requests.length === 0 ? (
        <div className="card text-center py-12 text-gray-500">No pending verification requests.</div>
      ) : (
        <div className="grid gap-6">
          {requests.map((req) => (
            <div key={req._id} className="card flex flex-col md:flex-row gap-6 items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded font-bold uppercase">Pending</span>
                  <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded font-bold uppercase">{req.userType}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900">{req.userId?.name}</h3>
                <p className="text-gray-600 mb-4">{req.userId?.email}</p>
                
                {req.proofType === 'college_id' && (
                  <div className="mb-4">
                    <p className="font-medium text-sm text-gray-700 mb-2">ID Proof Provided:</p>
                    <a href={req.proofUrl} target="_blank" rel="noreferrer" className="text-blue-600 text-sm hover:underline">
                      View ID Document / Image
                    </a>
                  </div>
                )}
              </div>
              
              <div className="flex flex-col gap-3 w-full md:w-auto">
                <button 
                  onClick={() => handleAction(req._id, 'approve')}
                  className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  <CheckCircle size={18} /> Approve
                </button>
                <button 
                  onClick={() => handleAction(req._id, 'reject')}
                  className="flex items-center justify-center gap-2 bg-red-100 hover:bg-red-200 text-red-700 px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  <XCircle size={18} /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default AdminDashboard;
