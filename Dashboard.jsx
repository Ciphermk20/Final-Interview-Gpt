import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, TrendingUp, Award, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) setUserName(storedUser.name);
  }, []);

  // Dummy data for the chart to make it look premium until we connect the backend interviews
  const mockChartData = [
    { date: 'Mon', score: 65 },
    { date: 'Tue', score: 72 },
    { date: 'Wed', score: 68 },
    { date: 'Thu', score: 85 },
    { date: 'Fri', score: 90 },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto space-y-8"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {userName.split(' ')[0]} 👋</h1>
          <p className="text-gray-500 mt-1">Ready to ace your next big interview?</p>
        </div>
        <Link 
          to="/interview"
          className="inline-flex items-center gap-2 bg-apple-blue hover:bg-blue-600 text-white px-6 py-3 rounded-full font-medium shadow-lg transition-all hover:scale-105"
        >
          <Play size={18} fill="currentColor" /> Start New Interview
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard icon={<Award className="text-yellow-500" />} title="Average Score" value="82%" subtitle="+5% from last week" />
        <StatCard icon={<TrendingUp className="text-green-500" />} title="Interviews Taken" value="12" subtitle="Top 20% of users" />
        <StatCard icon={<Clock className="text-purple-500" />} title="Practice Time" value="4.5 hrs" subtitle="This month" />
      </div>

      {/* Charts & History Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Graph */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl">
          <h3 className="text-lg font-semibold mb-6">Confidence & Clarity Trend</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#0066CC" 
                  strokeWidth={4} 
                  dot={{ r: 4, fill: '#0066CC', strokeWidth: 2, stroke: '#fff' }} 
                  activeDot={{ r: 8 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Interviews List */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Recent Activity</h3>
            <button className="text-sm text-apple-blue hover:underline">View All</button>
          </div>
          
          <div className="flex-1 space-y-4">
            <ActivityRow role="Frontend Developer" date="Today" score={90} />
            <ActivityRow role="HR Round" date="Yesterday" score={75} />
            <ActivityRow role="Backend Engineer" date="Mar 1" score={82} />
            <ActivityRow role="System Design" date="Feb 28" score={68} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Reusable micro-components for cleaner code
const StatCard = ({ icon, title, value, subtitle }) => (
  <div className="glass-panel p-6 rounded-2xl flex items-center gap-4 hover:-translate-y-1 transition-transform">
    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-2xl">{icon}</div>
    <div>
      <h4 className="text-gray-500 text-sm font-medium">{title}</h4>
      <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</div>
      <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
    </div>
  </div>
);

const ActivityRow = ({ role, date, score }) => (
  <div className="flex items-center justify-between p-3 rounded-xl hover:bg-white/50 dark:hover:bg-black/20 transition-colors">
    <div>
      <p className="font-medium text-sm">{role}</p>
      <p className="text-xs text-gray-500 mt-0.5">{date}</p>
    </div>
    <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
      score >= 80 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
    }`}>
      {score}%
    </div>
  </div>
);

export default Dashboard;