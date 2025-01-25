import { Navigate } from 'react-router-dom';
import { useAdmin } from './AdminContext';

const AdminProtectedRoute = ({ children }) => {
  const { admin } = useAdmin();
  
  if (!admin) {
    return <Navigate to="/admin/login" />;
  }
  
  return children;
};

export default AdminProtectedRoute;