import { useContext, useEffect } from "react";
import Home from "../pages";
import { AuthContext } from "../providers/AuthProvider";
import { useNavigate } from "react-router-dom";

const ProtectedLayout = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    if (!isAuthenticated) {
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 500);
    }
  }, [navigate, isAuthenticated]);

  return (
    <>
      <Home />
    </>
  );
};
export default ProtectedLayout;
