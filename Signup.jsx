import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Save the secure token to local storage so the user stays logged in
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({ name: data.name, email: data.email }));
        
        // Push the user to the dashboard
        navigate('/dashboard');
      } else {
        // Show the error from the backend (e.g., "User already exists")
        setError(data.message || 'Signup failed. Please try again.');
      }
    } catch (err) {
      setError('Server error. Is your backend running?');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-apple-blue/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md glass-panel p-8 relative z-10"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Create Account</h2>
          <p className="text-gray-500 text-sm">Join InterviewGPT to start practicing.</p>
        </div>

        {/* Display Errors if they occur */}
        {error && (
          <div className="mb-4 p-3 bg-red-100/80 border border-red-200 text-red-600 text-sm rounded-xl text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              name="name"
              placeholder="Full Name" 
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-black/50 focus:outline-none focus:ring-2 focus:ring-apple-blue transition-all"
              required
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="email" 
              name="email"
              placeholder="Email Address" 
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-black/50 focus:outline-none focus:ring-2 focus:ring-apple-blue transition-all"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="password" 
              name="password"
              placeholder="Password" 
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-black/50 focus:outline-none focus:ring-2 focus:ring-apple-blue transition-all"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-3 mt-4 bg-apple-dark dark:bg-white text-white dark:text-black rounded-xl font-medium shadow-lg hover:scale-[1.02] transition-transform flex justify-center items-center gap-2 disabled:opacity-70 disabled:hover:scale-100"
          >
            {isLoading ? <Loader2 className="animate-spin" size={18} /> : (
              <>Sign Up <ArrowRight size={18} /></>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account? <Link to="/login" className="text-apple-blue font-semibold hover:underline">Log in</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;