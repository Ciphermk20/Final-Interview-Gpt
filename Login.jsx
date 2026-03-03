import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
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
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Save the secure token
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({ name: data.name, email: data.email }));
        
        // Push user to dashboard
        navigate('/dashboard');
      } else {
        // Show invalid email/password error
        setError(data.message || 'Login failed. Check your credentials.');
      }
    } catch (err) {
      setError('Server error. Is your backend running?');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-apple-blue/20 rounded-full blur-3xl"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md glass-panel p-8 relative z-10"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
          <p className="text-gray-500 text-sm">Log in to continue your interview prep.</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100/80 border border-red-200 text-red-600 text-sm rounded-xl text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <div className="flex justify-end">
            <a href="#" className="text-xs text-apple-blue hover:underline">Forgot password?</a>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-3 mt-4 bg-apple-blue text-white rounded-xl font-medium shadow-lg hover:bg-blue-600 transition-colors flex justify-center items-center gap-2 disabled:opacity-70 disabled:hover:bg-apple-blue"
          >
            {isLoading ? <Loader2 className="animate-spin" size={18} /> : (
              <>Log In <ArrowRight size={18} /></>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account? <Link to="/signup" className="text-apple-dark dark:text-white font-semibold hover:underline">Sign up</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;