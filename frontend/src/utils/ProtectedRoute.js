import React from 'react';
import { Navigate } from 'react-router-dom';
let isAuthenticated = false;

export const ProtectedRoute = ({ element }) => {
  
    return isAuthenticated ? element : <Navigate to="/login"/>;
}

export const setAuthenticated = (value) => {
    isAuthenticated = value;
}

// export default ProtectedRoute;