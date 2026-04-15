import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  
  // If authenticated, show the admin page; otherwise, redirect to login
  return token === "admin-authenticated" ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;