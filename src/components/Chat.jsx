import EmojiPicker from "emoji-picker-react";
import { useEffect, useRef, useState } from "react";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { useChatStore } from "../utils/useChatStore";
import { useUserStore } from "../utils/useUserStore";
import { format } from "timeago.js";
import { upload } from "../lib/upload";

const Chat = () => {
  const [chat, setChat] = useState();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [img, setImg] = useState({
    file: null,
    url: "",
  });

  const endRef = useRef(null);
  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } =
    useChatStore();
  const { currentUser } = useUserStore();

  useEffect(() => {
    endRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
      setChat(res.data());
    });

    return () => unSub();
  }, [chatId]);

  const handleEmojiClick = (e) => {
    setText((prev) => prev + e.emoji);
    setOpen(false);
  };

  const handleImg = (e) => {
    if (e.target.files[0]) {
      setImg({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleSend = async () => {
    if (text === "") return;

    let imgUrl = null;

    try {
      if (img.file) {
        imgUrl = await upload(img.file);
      }

      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderId: currentUser.id,
          text,
          createdAt: new Date(),
          ...(imgUrl && { img: imgUrl }),
        }),
      });

      const userIDs = [currentUser.id, user.id];

      userIDs.forEach(async (id) => {
        const userChatsRef = doc(db, "userchats", id);
        const userChatsSnapshot = await getDoc(userChatsRef);

        if (userChatsSnapshot.exists()) {
          const userChatsData = userChatsSnapshot.data();

          const chatIndex = userChatsData.chats.findIndex(
            (c) => c.chatId === chatId
          );

          userChatsData.chats[chatIndex].lastMessage = text;
          userChatsData.chats[chatIndex].isSeen =
            id === currentUser.id ? true : false;
          userChatsData.chats[chatIndex].updatedAt = Date.now();

          await updateDoc(userChatsRef, {
            chats: userChatsData.chats,
          });
        }
      });
    } catch (err) {
      console.log(err);
    } finally {
      setImg({
        file: null,
        url: "",
      });

      setText("");
    }
  };
  return (
    <div className="basis-6/12 border-l border-r border-[#dddddd35] flex flex-col">
      <div className="top p-5 flex items-center justify-between border-b border-[#dddddd35]">
        <div className="flex items-center gap-5">
          <img
            src={user?.avatar || "./avatar.png"}
            alt=""
            className="h-[60px] w-[60px] object-cover rounded-full"
          />
          <div className="flex flex-col gap-[5px]">
            <span className="text-[18px] font-bold">{user?.username}</span>
            <p className="text-[14px] font-light text-[#a5a5a5]">
              Lorem ipsum, dolor sit amet.
            </p>
          </div>
        </div>
        <div className="flex gap-5">
          <img src="./phone.png" alt="" className="h-5 w-5" />
          <img src="./video.png" alt="" className="h-5 w-5" />
          <img src="./info.png" alt="" className="h-5 w-5" />
        </div>
      </div>
      <div className="center flex-1 p-5 overflow-y-auto flex flex-col gap-5">
        {chat?.messages?.map((message) => (
          <div
            key={message?.createdAt}
            className={
              message.senderId === currentUser?.id
                ? "message own flex max-w-[70%] gap-5 self-end"
                : "message flex max-w-[70%] gap-5"
            }
          >
            <div className="texts flex-1 flex flex-col gap-[5px]">
              {message.img && (
                <img
                  src={message.img}
                  alt=""
                  className="h-[300px] w-full rounded-[10px] object-contain"
                />
              )}
              <p
                className="p-5 rounded-[10px]"
                style={{
                  backgroundColor:
                    message.senderId === currentUser?.id
                      ? "#5183fe"
                      : "rgba(17, 25, 40, 0.3)",
                }}
              >
                {message.text}
              </p>
              <span className="text-[13px]">
                {format(message.createdAt.toDate())}
              </span>
            </div>
          </div>
        ))}
        {img.url && (
          <div className="flex max-w-[70%] gap-5 self-end">
            <div className="texts flex-1 flex flex-col gap-[5px]">
              <img
                src={img.url}
                alt=""
                className="h-[300px] w-full rounded-[10px] object-cover"
              />
            </div>
          </div>
        )}
        <div ref={endRef}></div>
      </div>
      <div className="bottom flex p-5 gap-5 justify-between items-center border-t border-[#dddddd35] mt-auto">
        <div className="flex items-center gap-5">
          <label htmlFor="file">
            <img src="./img.png" alt="" className="h-5 w-5 cursor-pointer" />
          </label>
          <input
            type="file"
            id="file"
            style={{ display: "none" }}
            onChange={handleImg}
          />

          <img src="./camera.png" alt="" className="h-5 w-5 cursor-pointer" />
          <img src="./mic.png" alt="" className="h-5 w-5 cursor-pointer" />
        </div>
        <input
          type="text"
          placeholder={
            isCurrentUserBlocked || isReceiverBlocked
              ? "You cannot send a message"
              : "Type a message..."
          }
          value={text}
          style={{ backgroundColor: "rgba(17, 25, 40, 0.50)" }}
          className="bg-transparent flex-1 border-none outline-none text-white p-5 rounded-[10px] text-[16px]"
          onChange={(e) => setText(e.target.value)}
          disabled={isCurrentUserBlocked || isReceiverBlocked}
        />
        <div className="relative">
          <img
            src="./emoji.png"
            alt=""
            className="h-5 w-5 cursor-pointer"
            onClick={() => setOpen((prev) => !prev)}
          />
          <div className="absolute bottom-[50px] left-0">
            <EmojiPicker open={open} onEmojiClick={handleEmojiClick} />
          </div>
        </div>
        <button
          onClick={handleSend}
          className="bg-[#5183fe] text-white py-[10px] px-5 border-none rounded-[5px]"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
