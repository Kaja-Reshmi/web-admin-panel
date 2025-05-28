import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard'; // Make sure the path is correct
import Login from './components/Login'; // Assuming you have a Login component
import { auth } from './firebaseConfig'; // Your Firebase auth instance
import { onAuthStateChanged } from 'firebase/auth';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading authentication...</div>; // Or a nice spinner
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={user ? <Dashboard /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/login"
          element={user ? <Navigate to="/" replace /> : <Login />}
        />
        {/* Add other routes if you have them */}
      </Routes>
    </Router>
  );
}

export default App;