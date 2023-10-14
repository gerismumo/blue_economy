import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
let isAuthenticated = false;

const ProtectedRoute = () => {
    return isAuthenticated ? <Outlet/> : <Navigate to="/login"/>;
}

export const setAuthenticated = (value) => {
    isAuthenticated = value;
}

export default ProtectedRoute;