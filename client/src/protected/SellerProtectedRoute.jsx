import { Navigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const SellerProtectedRoute = ({ children }) => {
  const { isSeller } = useAppContext();

  if (isSeller === null) {
    return <div>Loading...</div>; // wait for auth check
  }

  return isSeller ? children : <Navigate to="/seller-login" replace />;
};

export default SellerProtectedRoute;
