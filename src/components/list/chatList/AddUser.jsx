import React, { useContext, useState } from "react";
import { AuthContext } from "../../../providers/AuthProvider";
import {
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../../lib/firebase";

const AddUser = ({ setAddMode }) => {
  const [user, setUser] = useState(null);

  const { currentUser } = useContext(AuthContext);

  const handleSearch = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get("username");

    try {
      const userRef = collection(db, "users");

      const q = query(userRef, where("username", "==", username));

      const querySnapShot = await getDocs(q);

      if (!querySnapShot.empty) {
        setUser(querySnapShot.docs[0].data());
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleAdd = async () => {
    const chatRef = collection(db, "chats");
    const userChatsRef = collection(db, "userchats");

    try {
      const newChatRef = doc(chatRef);

      await setDoc(newChatRef, {
        createdAt: serverTimestamp(),
        messages: [],
      });

      await updateDoc(doc(userChatsRef, user.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: currentUser.id,
          updatedAt: Date.now(),
        }),
      });

      await updateDoc(doc(userChatsRef, currentUser.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: user.id,
          updatedAt: Date.now(),
        }),
      });
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div
      style={{ background: "rgba(17, 25, 40, 0.781)" }}
      className="addUser fixed inset-0 flex items-center justify-center"
      onClick={() => setAddMode(false)}
    >
      <div
        className="bg-gray-900 p-10 rounded-lg shadow-lg w-full max-w-md relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setAddMode(false)}
          className="absolute top-3 right-4 text-gray-400 hover:text-white transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Form */}
        <form className="flex gap-4" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Username"
            name="username"
            className="flex-1 p-3 rounded-md bg-gray-800 text-white placeholder-gray-500 border border-gray-700 outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="p-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-500 transition">
            Search
          </button>
        </form>

        {/* User Details */}
        {user && (
          <div className="user mt-6 flex items-center justify-between bg-gray-800 p-4 rounded-md">
            <div className="detail flex items-center gap-4">
              <img
                src={user.avatar || "./avatar.png"}
                alt="User Avatar"
                className="h-12 w-12 object-cover rounded-full"
              />
              <span className="text-white font-medium">{user.username}</span>
            </div>
            <button
              className="px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-500 transition"
              onClick={handleAdd}
            >
              Add User
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddUser;
