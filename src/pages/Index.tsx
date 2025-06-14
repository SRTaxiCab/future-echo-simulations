
import { Navigate } from 'react-router-dom';

const Index = () => {
  // Redirect to auth page for initial authentication flow
  return <Navigate to="/auth" replace />;
};

export default Index;
