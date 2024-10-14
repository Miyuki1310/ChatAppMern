// import React from "react";

import { useSocket } from "@/context/SocketContext";
import apiClient from "@/lib/api-client";
import { useAppStore } from "@/store";
import { UPLOAD_FILES_ROUTE } from "@/utils/constants";
import EmojiPicker from "emoji-picker-react";
import { useEffect, useRef, useState } from "react";
import { GrAttachment } from "react-icons/gr";
import { IoSend } from "react-icons/io5";
import { RiEmojiStickerLine } from "react-icons/ri";

const MessageBar = () => {
  const {
    selectedChatData,
    selectedChatType,
    userInfo,
    setIsUploading,
    setFileUploadProgress,
  } = useAppStore();
  const socket = useSocket();
  const inputFileRef = useRef();
  const emojiRef = useRef();
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (emojiRef.current && !emojiRef.current.contains(e.target)) {
        setEmojiPickerOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [emojiRef]);

  const handleAddEmoji = (emoji) => {
    setMessage((prev) => prev + emoji.emoji);
  };
  const [message, setMessage] = useState("");
  const handleSendMessage = async () => {
    if (selectedChatType === "contact") {
      socket.emit("sendMessage", {
        sender: userInfo.userId,
        content: message,
        recipient: selectedChatData._id,
        messageType: "text",
        fileUrl: undefined,
      });
    } else if (selectedChatType === "channel") {
      socket.emit("send-channel-message", {
        sender: userInfo.userId,
        content: message,
        messageType: "text",
        fileUrl: undefined,
        channelId: selectedChatData._id,
      });
    }
  };
  const handleGrAttachmentClick = () => {
    inputFileRef.current.click();
  };

  const handleUploadFile = async (e) => {
    try {
      const file = e.target.files[0];
      if (file) {
        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        const res = await apiClient.post(UPLOAD_FILES_ROUTE, formData, {
          withCredentials: true,
          onUploadProgress: (progress) => {
            setFileUploadProgress(
              Math.round((progress.loaded / progress.total) * 100)
            );
          },
        });
        if (res.status == 200 && res.data) {
          setIsUploading(false);
          if (selectedChatType === "contact") {
            socket.emit("sendMessage", {
              sender: userInfo.userId,
              content: undefined,
              recipient: selectedChatData._id,
              messageType: "file",
              fileUrl: res.data.filePath,
            });
          } else if (selectedChatType === "channel") {
            socket.emit("send-channel-message", {
              sender: userInfo.userId,
              content: undefined,
              channelId: selectedChatData._id,
              messageType: "file",
              fileUrl: res.data.filePath,
            });
          }
        }
      }
    } catch (error) {
      setIsUploading(false);
      console.log(error);
    }
  };
  return (
    <div className="h-[10vh] bg-[#1c1d25] flex justify-center items-center px-8 gap-6 mb-6">
      <div className="flex-1 flex bg-[#2a2b33] rounded-md items-center gap-5 pr-5">
        <input
          type="text"
          className="flex-1 p-5 bg-transparent rounded-md focus:border-none focus:outline-none"
          placeholder="Enter message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></input>
        <button className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all">
          <GrAttachment
            onClick={handleGrAttachmentClick}
            className="text-2xl"
          ></GrAttachment>
        </button>
        <div className="relative">
          <button
            onClick={() => setEmojiPickerOpen(!emojiPickerOpen)}
            ref={emojiRef}
            className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
          >
            <RiEmojiStickerLine className="text-2xl"></RiEmojiStickerLine>
          </button>
          <input
            type="file"
            ref={inputFileRef}
            className="hidden"
            onChange={handleUploadFile}
          ></input>
          <div className="absolute bottom-16 right-0">
            <EmojiPicker
              theme="dark"
              open={emojiPickerOpen}
              onEmojiClick={handleAddEmoji}
              autoFocusSearch={false}
            ></EmojiPicker>
          </div>
        </div>
      </div>
      <button
        onClick={handleSendMessage}
        className="bg-[#8417ff] rounded-lg p-5 flex items-center justify-center hover:bg-[#741bda]  focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
      >
        <IoSend className="text-2xl"></IoSend>
      </button>
    </div>
  );
};

export default MessageBar;
