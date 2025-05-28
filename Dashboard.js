// frontend/src/components/Dashboard.js
import React, { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [scrapedData, setScrapedData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // IMPORTANT: Replace with your deployed backend URL
  // During local development, this might be 'http://localhost:5000'
  // After Firebase Functions deployment, it will be your Firebase Functions URL
  const BACKEND_URL = 'http://127.0.0.1:5001/web-admin-scraper/us-central1/api'; // e.g., https://your-project-id.cloudfunctions.net/api

  const fetchScrapedData = async () => {
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const response = await fetch(`${BACKEND_URL}/data`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setScrapedData(data);
      setMessage('Data loaded successfully!');
    } catch (err) {
      console.error("Error fetching scraped data:", err);
      setError(`Failed to load data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleScrapeNow = async () => {
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const response = await fetch(`${BACKEND_URL}/scrape`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setMessage(result.message || 'Scraping initiated successfully!');
      // After scraping, fetch the updated data
      fetchScrapedData();
    } catch (err) {
      console.error("Error initiating scrape:", err);
      setError(`Failed to initiate scrape: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (err) {
      console.error("Logout error:", err);
      setError("Failed to log out.");
    }
  };

  useEffect(() => {
    fetchScrapedData();
  }, []); // Fetch data on component mount

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-200 ease-in-out"
        >
          Logout
        </button>
      </header>

      <main>
        <div className="flex justify-start mb-6 space-x-4">
          <button
            onClick={handleScrapeNow}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75 transition duration-200 ease-in-out flex items-center"
            disabled={loading}
          >
            {loading ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
            )}
            {loading ? 'Scraping...' : 'Scrape Now'}
          </button>
          <button
            onClick={fetchScrapedData}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition duration-200 ease-in-out flex items-center"
            disabled={loading}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM13 7a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1zM13 15a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z" />
              <path fillRule="evenodd" d="M12 2a1 1 0 011 1v1h2a3 3 0 013 3v2a3 3 0 01-3 3h-2v2a3 3 0 01-3 3H5a3 3 0 01-3-3v-2a3 3 0 013-3h2V7a3 3 0 013-3h2V3a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Refresh Data
          </button>
        </div>

        {message && <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded-lg relative mb-4" role="alert">{message}</div>}
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4" role="alert">{error}</div>}

        <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
          {scrapedData.length === 0 && !loading && !error ? (
            <p className="text-center text-gray-600">No data available. Click "Scrape Now" to fetch data.</p>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Availability</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scraped At</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {scrapedData.map((book) => (
                  <tr key={book.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{book.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{book.price}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{book.availability}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{book.rating}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {book.timestamp ? new Date(book.timestamp._seconds * 1000).toLocaleString() : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;

