// import React from "react";

import apiClient from "@/lib/api-client";
import { useAppStore } from "@/store";
import {
  GET_CHANNEL_MESSAGES_ROUTE,
  GET_MESSAGES_ROUTE,
  HOST,
} from "@/utils/constants";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { MdFolderZip } from "react-icons/md";
import { IoMdArrowRoundDown } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";

const MessageContainer = () => {
  const scrollRef = useRef();
  const {
    selectedChatData,
    selectedChatType,
    userInfo,
    selectedChatMessages,
    setSelectedChatMessages,
    setIsDownloading,
    setFileDownloadProgress,
  } = useAppStore();
  const [showImage, setShowImage] = useState(false);
  const [imgUrl, setImgUrl] = useState(null);
  useEffect(() => {
    const getMessages = async () => {
      try {
        const messages = await apiClient.post(
          GET_MESSAGES_ROUTE,
          { id: selectedChatData._id },
          { withCredentials: true }
        );
        if (messages) {
          setSelectedChatMessages(messages.data.messages);
        }
      } catch (error) {
        console.log(error);
      }
    };
    const getChannelMessages = async () => {
      try {
        const response = await apiClient.get(
          `${GET_CHANNEL_MESSAGES_ROUTE}/${selectedChatData._id}`,
          { withCredentials: true }
        );
        if(response.data.messages){
          setSelectedChatMessages(response.data.messages);
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (selectedChatData._id) {
      if (selectedChatType === "contact") {
        getMessages();
      }
      if (selectedChatType === "channel") {
        getChannelMessages();
      }
    }
  }, [selectedChatData, selectedChatType]);

  const checkIfImage = (filePath) => {
    const imageRegex = /\.(gif|jpe?g|tiff?|png|webp|bmp|svg|ico|heic|heif)$/i;
    return imageRegex.test(filePath);
  };
  const handleDownloadFile = async (file) => {
    setIsDownloading(true);
    setFileDownloadProgress(0);
    const res = await apiClient.get(`${HOST}/${file}`, {
      responseType: "blob",
      onDownloadProgress: (progressEvent) => {
        setFileDownloadProgress(
          Math.round((progressEvent.loaded / progressEvent.total) * 100)
        );
      },
    });
    const urlBlob = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = urlBlob;
    link.setAttribute("download", file.split("/").pop());
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(urlBlob);
    setIsDownloading(false);
  };

  const renderMessages = () => {
    let lastDate = null;
    return selectedChatMessages.map((message, index) => {
      let messageDate = moment(message.timeStamps).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;
      return (
        <div key={index}>
          {showDate && (
            <div className="text-center text-gray-500 my-2">
              {moment(message.timeStamps).format("LL")}
            </div>
          )}
          {selectedChatType === "contact" && renderDMMessage(message, userInfo)}
          {selectedChatType === "channel" &&
            renderChannelMessage(message, userInfo)}
        </div>
      );
    });
  };

  const renderDMMessage = (message, userInfo) => {
    return (
      <div
        className={`${
          message.sender === selectedChatData._id ? "text-left" : "text-right"
        }`}
      >
        {message.messageType === "text" && (
          <div
            className={`${
              message.sender !== selectedChatData._id
                ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50 "
                : "bg-[#2a2b33]/5 text-white/80 border-[#fff]/20 "
            } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
          >
            {message.content}
          </div>
        )}

        {message.messageType === "file" && (
          <div
            className={`${
              message.sender !== selectedChatData._id
                ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50 "
                : "bg-[#2a2b33]/5 text-white/80 border-[#fff]/20 "
            } border inline-block p-4 rounded my-1 max-w-[70%] break-words`}
          >
            {checkIfImage(message.fileUrl) ? (
              <div
                onClick={() => {
                  setShowImage(true);
                  setImgUrl(message.fileUrl);
                }}
                className="cursor-pointer"
              >
                <img src={`${HOST}/${message.fileUrl}`}></img>
              </div>
            ) : (
              <div className="flex items-center justify-center flex-wrap gap-4 ">
                <span className="text-white/80 text-3xl bg-black/20 rounded-full p-3">
                  <MdFolderZip />
                </span>
                <span>{message.fileUrl.split("/").pop()}</span>
                <span
                  onClick={() => handleDownloadFile(message.fileUrl)}
                  className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                >
                  <IoMdArrowRoundDown />
                </span>
              </div>
            )}
          </div>
        )}
        <div className="text-xs text-gray-500">
          {moment(message.timeStamps).format("LT")}
        </div>
      </div>
    );
  };

  const renderChannelMessage = (message, userInfo) => {
    console.log(message);
    return (
      <div
        className={`mt-5 ${
          message.sender._id !== userInfo.userId ? "text-left " : "text-right "
        }`}
      >
        {message.messageType === "text" && (
          <div
            className={`${
              message.sender._id === userInfo.userId
                ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50 "
                : "bg-[#2a2b33]/5 text-white/80 border-[#fff]/20 "
            } border inline-block max-w-[50%] px-4 py-2 rounded my-1 break-words`}
          >
            {message.content}
          </div>
        )}

        {message.messageType === "file" && (
          <div
            className={`${
              message.sender._id !== userInfo.userId
                ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50 "
                : "bg-[#2a2b33]/5 text-white/80 border-[#fff]/20 "
            } border inline-block p-4 rounded my-1 max-w-[70%] break-words`}
          >
            {checkIfImage(message.fileUrl) ? (
              <div
                onClick={() => {
                  setShowImage(true);
                  setImgUrl(message.fileUrl);
                }}
                className="cursor-pointer"
              >
                <img src={`${HOST}/${message.fileUrl}`}></img>
              </div>
            ) : (
              <div className="flex items-center justify-center flex-wrap gap-4 ">
                <span className="text-white/80 text-3xl bg-black/20 rounded-full p-3">
                  <MdFolderZip />
                </span>
                <span>{message.fileUrl.split("/").pop()}</span>
                <span
                  onClick={() => handleDownloadFile(message.fileUrl)}
                  className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                >
                  <IoMdArrowRoundDown />
                </span>
              </div>
            )}
          </div>
        )}
        {message.sender._id !== userInfo.userId ? (
          <div className="flex items-center justify-start gap-3">
            <Avatar className="h-8 w-8 rounded-full overflow-hidden">
              {message.sender.image ? (
                <AvatarImage
                  src={`${HOST}/${message.sender.image}`}
                  alt="avatar"
                  className="w-full h-full object-cover bg-black"
                ></AvatarImage>
              ) : (
                <div
                  className={`uppercase h-12 w-12 text-xl border-[1px] flex items-center justify-center rounded-full ${getColor(
                    message.sender.color
                  )}`}
                >
                  {message.sender.firstName
                    ? message.sender.firstName.split("").shift()
                    : message.sender.email.split("").shift()}
                </div>
              )}
            </Avatar>
            <span className="block text-sm text-white/60 ">
              {`${message.sender.firstName} ${message.sender.lastName}`}
            </span>
            <span className=" block text-xs text-white/60 ">
              {moment(message.timeStamps).format("LT")}
            </span>
          </div>
        ) : (
          <div className=" block text-xs text-white/60 ">
            {moment(message.timeStamps).format("LT")}
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ smooth: true });
    }
  }, [selectedChatMessages]);
  return (
    <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 w-full">
      {renderMessages()}
      <div ref={scrollRef}>
        {showImage && (
          <div className="fixed z-[100] top-0 left-0 bottom-0 right-0 flex items-center justify-center backdrop-blur-lg flex-col">
            <div>
              <img
                src={`${HOST}/${imgUrl}`}
                alt="img"
                className="h-[80vh] w-full bg-cover"
              />
            </div>
            <div className="flex gap-5 fixed top-0 mt-5">
              <button
                className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                onClick={() => {
                  handleDownloadFile(imgUrl);
                }}
              >
                <IoMdArrowRoundDown />
              </button>
              <button
                onClick={() => {
                  setShowImage(false);
                }}
                className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
              >
                <IoCloseSharp />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageContainer;
