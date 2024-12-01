import { useContext, useEffect, useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { upload } from "../../lib/upload";
import { AuthContext } from "../../providers/AuthProvider";

const SignUp = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState({
    file: null,
    url: "",
  });
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [navigate, isAuthenticated]);

  const handleAvatar = (e) => {
    if (e.target.files[0]) {
      setAvatar((prev) => ({
        ...prev,
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      }));
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const { username, email, password } = Object.fromEntries(formData);

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      const imgUrl = await upload(avatar.file);

      await setDoc(doc(db, "users", res.user.uid), {
        username,
        email,
        avatar: imgUrl,
        id: res.user.uid,
        blocked: [],
      });

      await setDoc(doc(db, "userchats", res.user.uid), {
        chats: [],
      });

      navigate("/", { replace: true });
    } catch (error) {
      console.log(error);
      toast(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-r from-gray-800 via-black to-gray-900">
      <div className="p-8 bg-gray-900/80 border border-gray-700 shadow-lg rounded-lg w-full max-w-md flex flex-col gap-6">
        <h2 className="text-3xl font-semibold text-white text-center">
          Create an Account
        </h2>
        <p className="text-gray-400 text-sm text-center">
          Join us today to get started.
        </p>
        <form className="flex flex-col gap-6" onSubmit={handleRegister}>
          <label
            htmlFor="file"
            className="cursor-pointer flex flex-col items-center gap-2"
          >
            <img
              src={avatar.url || "./avatar.png"}
              alt="Avatar Upload"
              className="h-[60px] w-[60px] object-cover rounded-full opacity-60 hover:opacity-100 transition"
            />
            <p className="text-sm text-gray-400">Upload an image</p>
            <input
              type="file"
              id="file"
              style={{ display: "none" }}
              onChange={handleAvatar}
            />
          </label>
          <input
            type="text"
            placeholder="Username"
            name="username"
            className="bg-gray-800 text-white placeholder-gray-500 border border-gray-700 p-3 rounded-md outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
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
            {loading ? "Loading..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
