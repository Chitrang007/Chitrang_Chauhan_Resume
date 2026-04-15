import { Navigate } from 'react-router-dom';

const PublicOnlyRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  // If already logged in, redirect to admin; otherwise, show the login page
  return token === "admin-authenticated" ? <Navigate to="/admin" /> : children;
};

export default PublicOnlyRoute;