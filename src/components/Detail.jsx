import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import { useChatStore } from "../utils/useChatStore";
import { useUserStore } from "../utils/useUserStore";

const Detail = () => {
  const {
    chatId,
    user,
    isCurrentUserBlocked,
    isReceiverBlocked,
    changeBlock,
    resetChat,
  } = useChatStore();
  const { currentUser } = useUserStore();

  const handleBlock = async () => {
    if (!user) return;

    const userDocRef = doc(db, "users", currentUser.id);

    try {
      await updateDoc(userDocRef, {
        blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
      });
      changeBlock();
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = () => {
    auth.signOut();
    resetChat();
  };
  return (
    <div className="basis-3/12 overflow-y-scroll">
      <div className="user py-[30px] px-5 flex flex-col justify-center items-center gap-4 border-b border-[#dddddd35]">
        <img
          src={user?.avatar || "./avatar.png"}
          alt=""
          className="h-[100px] w-[100px] rounded-full object-cover"
        />
        <h2>{user?.username}</h2>
        {/* <p>Lorem Ipsum dolar sit amet</p> */}
      </div>
      <div className="info flex flex-col p-5 gap-6">
        <div className="option">
          <div className="title flex justify-between items-center">
            <span>Chat Settings</span>
            <img
              src="./arrowUp.png"
              alt=""
              className="w-[30px] h-[30px] bg-[rgba(17, 25, 40, 0.3)] p-[10px] rounded-full cursor-pointer"
            />
          </div>
        </div>
        <div className="option">
          <div className="title flex justify-between items-center">
            <span>Privacy & help</span>
            <img
              src="./arrowUp.png"
              alt=""
              className="w-[30px] h-[30px] bg-[rgba(17, 25, 40, 0.3)] p-[10px] rounded-full cursor-pointer"
            />
          </div>
        </div>
        <div className="option">
          <div className="title flex justify-between items-center">
            <span>Shared Photos</span>
            <img
              src="./arrowDown.png"
              alt=""
              className="w-[30px] h-[30px] bg-[rgba(17, 25, 40, 0.3)] p-[10px] rounded-full cursor-pointer"
            />
          </div>
          <div className="photos flex flex-col gap-5 mt-5">
            <div className="photoItem flex justify-between items-center">
              <div className="photoDetail flex items-center gap-5">
                <img
                  src="https://images.pexels.com/photos/29187003/pexels-photo-29187003/free-photo-of-couple-strolling-through-a-vibrant-autumn-forest.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt=""
                  className="w-10 h-10 object-cover"
                />
                <span className="font-light text-[14px] text-gray-300">
                  photo_2024.png
                </span>
              </div>
              <img
                src="./download.png"
                alt=""
                className="w-[30px] h-[30px] bg-[rgba(17, 25, 40, 0.3)] p-[10px] rounded-full cursor-pointer"
              />
            </div>
            <div className="photoItem flex justify-between items-center">
              <div className="photoDetail flex items-center gap-5">
                <img
                  src="https://images.pexels.com/photos/29187003/pexels-photo-29187003/free-photo-of-couple-strolling-through-a-vibrant-autumn-forest.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt=""
                  className="w-10 h-10 object-cover"
                />
                <span className="font-light text-[14px] text-gray-300">
                  photo_2024.png
                </span>
              </div>
              <img
                src="./download.png"
                alt=""
                className="w-[30px] h-[30px] bg-[rgba(17, 25, 40, 0.3)] p-[10px] rounded-full cursor-pointer"
              />
            </div>
            <div className="photoItem flex justify-between items-center">
              <div className="photoDetail flex items-center gap-5">
                <img
                  src="https://images.pexels.com/photos/29187003/pexels-photo-29187003/free-photo-of-couple-strolling-through-a-vibrant-autumn-forest.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt=""
                  className="w-10 h-10 object-cover"
                />
                <span className="font-light text-[14px] text-gray-300">
                  photo_2024.png
                </span>
              </div>
              <img
                src="./download.png"
                alt=""
                className="w-[30px] h-[30px] bg-[rgba(17, 25, 40, 0.3)] p-[10px] rounded-full cursor-pointer"
              />
            </div>
          </div>
        </div>
        <div className="option">
          <div className="title flex justify-between items-center">
            <span>Shared Files</span>
            <img
              src="./arrowUp.png"
              alt=""
              className="w-[30px] h-[30px] bg-[rgba(17, 25, 40, 0.3)] p-[10px] rounded-full cursor-pointer"
            />
          </div>
        </div>
        <button
          onClick={handleBlock}
          className="py-[10px] px-5 bg-red-800 hover:bg-red-950 text-white rounded-[5px] cursor-pointer"
        >
          {isCurrentUserBlocked
            ? "You are Blocked!"
            : isReceiverBlocked
            ? "User blocked"
            : "Block User"}
        </button>
        <button
          onClick={handleLogout}
          className="py-[10px] px-5 bg-blue-500 hover:bg-blue-700 text-white rounded-[5px] cursor-pointer"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Detail;
