import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, MessageCircle, Zap, ExternalLink, Star } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center px-4 py-20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-5xl w-full"
      >
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-4">
          Get verified interview guidance <br className="hidden md:block" /> from your <span className="text-blue-600">JIIT seniors.</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 font-medium mb-12">
          Real experiences. Faster answers. <span className="text-blue-600">Better preparation.</span>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-left mb-12">
          <div className="flex flex-col md:border-r border-gray-100 md:pr-4">
            <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <ShieldCheck className="text-blue-600 w-6 h-6" />
            </div>
            <h3 className="font-bold text-gray-900 mb-1">Verified by JIIT</h3>
            <p className="text-sm text-gray-500">Only JIIT students and alumni</p>
          </div>
          <div className="flex flex-col md:border-r border-gray-100 md:pr-4">
            <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <MessageCircle className="text-blue-600 w-6 h-6" />
            </div>
            <h3 className="font-bold text-gray-900 mb-1">Real Interview Experiences</h3>
            <p className="text-sm text-gray-500">Company-wise experiences</p>
          </div>
          <div className="flex flex-col md:border-r border-gray-100 md:pr-4">
            <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <Zap className="text-blue-600 w-6 h-6" />
            </div>
            <h3 className="font-bold text-gray-900 mb-1">Get Answers</h3>
            <p className="text-sm text-gray-500">Ask queries and get help from seniors fast</p>
          </div>
          <div className="flex flex-col">
            <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <ExternalLink className="text-blue-600 w-6 h-6" />
            </div>
            <h3 className="font-bold text-gray-900 mb-1">Connect on LinkedIn</h3>
            <p className="text-sm text-gray-500">Reach out to mentors instantly</p>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <Link to="/login" className="btn-primary text-lg px-8 py-3">
            Login
          </Link>
          <Link to="/register" className="btn-secondary text-lg px-8 py-3">
            Create Account
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
export default LandingPage;
