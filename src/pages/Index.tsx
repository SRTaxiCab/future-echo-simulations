
import { Navigate } from 'react-router-dom';

const Index = () => {
  // Redirect to login page for initial authentication flow
  return <Navigate to="/login" replace />;
};

export default Index;
