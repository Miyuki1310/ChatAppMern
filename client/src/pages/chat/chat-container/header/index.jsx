// import React from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";
import { useAppStore } from "@/store";
import { HOST } from "@/utils/constants";
import { RiCloseFill } from "react-icons/ri";
const ChatHeader = () => {
  const { closeChat, selectedChatData, selectedChatType } = useAppStore();
  return (
    <div className="h-[10vh] border-b-2 border-[#2f303b] flex items-center justify-between px-20">
      <div className="flex gap-5 items-center justify-between w-full">
        <div className="flex gap-3 items-center">
          <div className="flex gap-4 items-center justify-center cursor-pointer">
            <div className="w-12 h-12 relative">
              {selectedChatType === "contact" ? (
                <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                  {selectedChatData.image ? (
                    <AvatarImage
                      src={`${HOST}/${selectedChatData.image}`}
                      alt="avatar"
                      className="w-full h-full object-cover bg-black"
                    ></AvatarImage>
                  ) : (
                    <div
                      className={`uppercase h-12 w-12 text-xl border-[1px] flex items-center justify-center rounded-full ${getColor(
                        selectedChatData.color
                      )}`}
                    >
                      {selectedChatData.firstName
                        ? selectedChatData.firstName.split("").shift()
                        : selectedChatData.email.split("").shift()}
                    </div>
                  )}
                </Avatar>
              ) : (
                <div className="bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full">
                  #
                </div>
              )}
            </div>
            <div className="">
              {selectedChatType === "contact" && (
                <div className="flex flex-col text-opacity-80">
                  <span>
                    {selectedChatData.firstName && selectedChatData.lastName
                      ? `${selectedChatData.firstName} ${selectedChatData.lastName}`
                      : selectedChatData.email}
                  </span>
                  <span className="text-xs">
                    {selectedChatData.email
                      ? `${selectedChatData.email}`
                      : selectedChatData.email}
                  </span>
                </div>
              )}
              {selectedChatType === "channel" && (
                <span>{selectedChatData.name}</span>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-5 items-center justify-center ">
          <button
            onClick={closeChat}
            className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
          >
            <RiCloseFill className="text-3xl "> </RiCloseFill>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
