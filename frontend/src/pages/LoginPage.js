import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { loginUser } from '../services/api';
import toast from 'react-hot-toast';
import { FiMail, FiLock } from 'react-icons/fi';
import ThemeToggleButton from '../components/ThemeToggleButton';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loginMode, setLoginMode] = useState('user');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await loginUser(formData);
      const { id, name, email, token, role, sosEmail } = response.data;
      const inferredRole = role || (email === 'admin@touristsafety.com' ? 'ADMIN' : 'USER');
      login({ id, name, email, sosEmail, role: inferredRole }, token);
      toast.success('Login successful!');
      navigate(inferredRole === 'ADMIN' ? '/admin' : '/dashboard');
    } catch (error) {
      const backendMessage =
        typeof error.response?.data === 'string'
          ? error.response.data
          : error.response?.data?.message;
      toast.error(backendMessage || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen theme-bg text-black flex items-center justify-center px-4">
      <div className="absolute right-4 top-4 z-10">
        <ThemeToggleButton />
      </div>
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
          TouristSafe
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Safety Monitoring System
        </p>

        <div className="mb-6">
          <div className="bg-gray-100 rounded-lg p-1 flex">
            <button
              type="button"
              onClick={() => setLoginMode('user')}
              className={`flex-1 py-2 rounded-md text-sm font-semibold transition-colors ${
                loginMode === 'user'
                  ? 'bg-white text-blue-700 shadow'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              User Login
            </button>
            <button
              type="button"
              onClick={() => setLoginMode('admin')}
              className={`flex-1 py-2 rounded-md text-sm font-semibold transition-colors ${
                loginMode === 'admin'
                  ? 'bg-white text-red-700 shadow'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Admin Login
            </button>
          </div>
          <p className="text-xs text-gray-500 text-center mt-2">
            {loginMode === 'admin'
              ? 'Enter your admin credentials to access the Admin Dashboard.'
              : 'Enter your user credentials to access the Tourist Dashboard.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <FiMail className="absolute left-3 top-3 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-3 text-gray-400" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-blue-400"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 font-semibold hover:underline">
            Register here
          </Link>
        </p>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Demo credentials:
            <br />
            Email: admin@touristsafety.com
            <br />
            Password: admin123
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
