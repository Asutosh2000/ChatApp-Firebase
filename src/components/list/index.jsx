import ChatList from "./chatList/ChatList";
import UserInfo from "./UserInfo";

const List = () => {
  return (
    <div className="basis-3/12 flex flex-col">
      <UserInfo />
      <ChatList />
    </div>
  );
};

export default List;
