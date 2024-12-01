import { useContext, useEffect, useState } from "react";
import AddUser from "./AddUser";
import { AuthContext } from "../../../providers/AuthProvider";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { useChatStore } from "../../../utils/useChatStore";

const ChatList = () => {
  const [addMode, setAddMode] = useState(false);
  const [input, setInput] = useState("");
  const [chats, setChats] = useState([]);
  const { currentUser } = useContext(AuthContext);

  const { chatId, changeChat } = useChatStore();
  console.log(chatId);

  useEffect(() => {
    if (!currentUser) return;

    const unsub = onSnapshot(
      doc(db, "userchats", currentUser?.id),
      async (res) => {
        const items = res.data().chats;

        const promises = items.map(async (item) => {
          const userDocRef = doc(db, "users", item.receiverId);
          const userDocSnap = await getDoc(userDocRef);

          const user = userDocSnap.data();

          return { ...item, user };
        });

        const chatData = await Promise.all(promises);

        setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
      }
    );

    return () => unsub();
  }, [currentUser]);

  const handleSelect = async (chat) => {
    const userChats = chats.map((item) => {
      const { user, ...rest } = item;
      return rest;
    });

    const chatIndex = userChats.findIndex(
      (item) => item.chatId === chat.chatId
    );

    userChats[chatIndex].isSeen = true;

    const userChatsRef = doc(db, "userchats", currentUser.id);

    try {
      await updateDoc(userChatsRef, {
        chats: userChats,
      });
      changeChat(chat.chatId, chat.user);
    } catch (err) {
      console.log(err);
    }
  };

  const filteredChats = chats.filter((c) =>
    c.user.username.toLowerCase().includes(input.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-scroll">
      <div className="flex items-center gap-5 p-5">
        <div
          className="flex-1 flex items-center gap-5 rounded-[10px] p-3"
          style={{ backgroundColor: "rgba(17, 25, 40, 0.50)" }}
        >
          <img src="./search.png" alt="" className="h-[20px] w-[20px]" />
          <input
            type="text"
            name="search"
            id="search"
            placeholder="Search"
            className="flex-1 text-white border-none outline-none bg-transparent"
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
        <img
          src={addMode ? "./minus.png" : "./plus.png"}
          alt=""
          style={{ backgroundColor: "rgba(17, 25, 40, 0.50)" }}
          className="p-3 h-9 w-9 rounded-[10px] cursor-pointer"
          onClick={() => setAddMode((prev) => !prev)}
        />
      </div>
      {filteredChats &&
        filteredChats?.map((chat) => (
          <div
            key={chat?.chatId}
            onClick={() => handleSelect(chat)}
            style={{
              backgroundColor: chat?.isSeen ? "transparent" : "#5183fe",
            }}
            className="flex items-center gap-5 p-5 cursor-pointer border-b border-[#dddddd35]"
          >
            <img
              src={chat.user.avatar || "./avatar.png"}
              alt=""
              className="h-[50px] w-[50px] object-cover rounded-full"
            />
            <div className="flex-1 space-y-1">
              <span className="font-medium">{chat.user.username}</span>
              <p className="text-[14px] font-light">{chat?.lastMessage}</p>
            </div>
          </div>
        ))}

      {addMode && <AddUser setAddMode={setAddMode} />}
    </div>
  );
};

export default ChatList;
