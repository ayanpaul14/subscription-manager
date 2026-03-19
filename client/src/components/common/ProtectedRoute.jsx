// import { Navigate, Outlet } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';

// const ProtectedRoute = () => {
//   const { token } = useAuth();
//   return token ? <Outlet /> : <Navigate to="/login" />;
// };

// export default ProtectedRoute;

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = () => {
  // const { token } = useAuth();
  // return token ? <Outlet /> : <Navigate to="/login" />;
  return <Outlet />; // ← temporarily allow everyone through
};

export default ProtectedRoute;