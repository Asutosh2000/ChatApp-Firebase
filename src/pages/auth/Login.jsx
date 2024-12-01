import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../providers/AuthProvider";
import { toast } from "react-toastify";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../lib/firebase";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [navigate, isAuthenticated]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const { email, password } = Object.fromEntries(formData);

    try {
      await signInWithEmailAndPassword(auth, email, password);

      navigate("/", { replace: true });
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-r from-gray-800 via-black to-gray-900">
      <div className="p-8 bg-gray-900/80 border border-gray-700 shadow-lg rounded-lg w-full max-w-md flex flex-col gap-6">
        <h2 className="text-3xl font-semibold text-white text-center">
          Welcome Back
        </h2>
        <p className="text-gray-400 text-sm text-center">
          Sign in to access your account.
        </p>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Email"
            name="email"
            className="bg-gray-800 text-white placeholder-gray-500 border border-gray-700 p-3 rounded-md outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            className="bg-gray-800 text-white placeholder-gray-500 border border-gray-700 p-3 rounded-md outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <button
            className="w-full p-3 rounded-md bg-blue-600 text-white font-semibold text-lg hover:bg-blue-500 transition disabled:bg-blue-800 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Loading..." : "Sign In"}
          </button>
        </form>
        <div className="text-center">
          <p className="text-sm text-gray-400">
            Don't have an account?{" "}
            <Link to="/sign-up" className="text-blue-400 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/* <div className="item">
          <h2>Create an Account</h2>
          <form onSubmit={handleRegister}>
            <label htmlFor="file">
              <img src={avatar?.url || "./avatar.png"} alt="" />
              Upload an image
            </label>
            <input
              type="file"
              id="file"
              style={{ display: "none" }}
              // onChange={handleAvatar}
            />
            <input type="text" placeholder="Username" name="username" />
            <input type="text" placeholder="Email" name="email" />
            <input type="password" placeholder="Password" name="password" />
            <button disabled={false}>{false ? "Loading" : "Sign Up"}</button>
          </form>
        </div> */}
    </div>
  );
};

export default Login;
