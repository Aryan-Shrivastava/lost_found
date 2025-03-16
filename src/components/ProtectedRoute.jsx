import React, { useEffect } from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const location = useLocation();

  console.log('ProtectedRoute: Current path:', location.pathname);
  console.log('ProtectedRoute: User from localStorage:', user ? 'exists' : 'not found');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log('ProtectedRoute: Firebase auth state changed:', currentUser ? 'logged in' : 'logged out');
      
      if (currentUser && !user) {
        console.log('ProtectedRoute: Updating localStorage with current user');
        localStorage.setItem('user', JSON.stringify(currentUser));
      } else if (!currentUser && user) {
        console.log('ProtectedRoute: Removing user from localStorage');
        localStorage.removeItem('user');
      }
    });

    return () => unsubscribe();
  }, [user]);

  if (!user) {
    console.log('ProtectedRoute: Redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  console.log('ProtectedRoute: Rendering protected content');
  return children ? children : <Outlet />;
};

export default ProtectedRoute; 