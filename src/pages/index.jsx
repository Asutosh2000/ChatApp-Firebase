import List from "../components/list";
import Chat from "../components/Chat";
import Detail from "../components/Detail";
import { useChatStore } from "../utils/useChatStore";

const Home = () => {
  const { chatId } = useChatStore();

  return (
    <div className="h-screen w-screen text-white flex bg-gradient-to-r from-gray-800 via-black to-gray-900">
      <List />
      {chatId && <Chat />}
      {chatId && <Detail />}
    </div>
  );
};

export default Home;
