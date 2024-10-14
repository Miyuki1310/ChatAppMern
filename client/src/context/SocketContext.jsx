import { useAppStore } from "@/store";
import { HOST } from "@/utils/constants";
import PropTypes from "prop-types";
import { createContext, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();

const SocketProvider = ({ children }) => {
  const socket = useRef();
  const { userInfo } = useAppStore();

  useEffect(() => {
    if (userInfo) {
      socket.current = io(HOST, {
        withCredentials: true,
        query: {
          userId: userInfo.userId,
        },
      });
      socket.current.on("connect", () => {
        console.log("Connected to server");
      });

      const handleReceiveMessage = (message) => {
        const { addMessage } = useAppStore.getState();
        addMessage(message);

        // if (
        //   selectedChatType !== undefined //&&
        //   //  (selectedChatData._id === message.sender._id ||
        //   //  selectedChatData._id === message.recipient._id)
        // ) {
        // }
      };

      const handleReceiveChannelMessage = (message) => {
        console.log(message);
        const { addMessage, addChannelInChannelList } = useAppStore.getState();
        addMessage(message);
        addChannelInChannelList(message);
      };
      socket.current.on("receiveMessage", handleReceiveMessage);
      socket.current.on("receiveChannelMessage", handleReceiveChannelMessage);
    }
    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, [userInfo]);
  return (
    <SocketContext.Provider value={socket.current}>
      {children}
    </SocketContext.Provider>
  );
};
SocketProvider.propTypes = {
  children: PropTypes.node,
};
const useSocket = () => {
  return useContext(SocketContext);
};

export { SocketProvider, useSocket };
