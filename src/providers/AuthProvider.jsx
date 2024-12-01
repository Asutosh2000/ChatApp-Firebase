import { createContext, useEffect } from "react";
import Notification from "../components/Notification";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";
import Loader from "../components/Loader";
import { useUserStore } from "../utils/useUserStore";

export const AuthContext = createContext({});
const AuthProvider = ({ children }) => {
  const { currentUser, isLoading, fetchUserInfo } = useUserStore();

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      fetchUserInfo(user?.uid);
    });

    return () => {
      unSub();
    };
  }, [fetchUserInfo]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: currentUser?.id,
        currentUser: currentUser && currentUser,
      }}
    >
      {isLoading ? <Loader /> : children}
      <Notification />
    </AuthContext.Provider>
  );
};

export default AuthProvider;
