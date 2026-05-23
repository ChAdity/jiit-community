import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-3xl"
      >
        <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight mb-6">
          Real Placement Experiences from <span className="text-blue-600">JIIT Alumni</span>
        </h1>
        <p className="text-xl text-gray-600 mb-10">
          The exclusive, verified platform for JIIT students to read interview experiences, ask queries, and prepare for placements.
        </p>
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
