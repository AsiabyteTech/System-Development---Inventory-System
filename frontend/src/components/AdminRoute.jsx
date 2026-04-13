import { Navigate } from 'react-router-dom';
import { isAdmin } from '../shared/role';

const AdminRoute = ({ children }) => {
  if (!isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

export default AdminRoute;