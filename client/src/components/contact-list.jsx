import { getColor } from "@/lib/utils";
import { useAppStore } from "@/store";
import { HOST } from "@/utils/constants";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import PropTypes from "prop-types";
// import React from "react";

const ContactList = ({ contacts, isChannel = false }) => {
  console.log(contacts);
  const {
    selectedChatData,
    setSelectedChatData,
    setSelectedChatType,
    setSelectedChatMessages,
  } = useAppStore();
  const handleClick = (contact) => {
    if (isChannel) setSelectedChatType("channel");
    else setSelectedChatType("contact");
    setSelectedChatData(contact);
    if (selectedChatData && selectedChatData._id !== contact._id) {
      setSelectedChatMessages([]);
    }
  };
  return (
    <div className="mt-5">
      {contacts.map((contact) => {
        return (
          <div
            key={contact._id}
            className={`pl-10 py-2 transition-all duration-300 cursor-pointer ${
              selectedChatData && selectedChatData._id === contact._id
                ? "bg-[#8417ff] hover:bg-[#8417ff]"
                : "hover:bg-[#8417ff]"
            }`}
            onClick={() => handleClick(contact)}
          >
            <div className="flex gap-5 items-center justify-start text-neutral-300 ">
              {!isChannel && (
                <Avatar className="h-10 w-10 rounded-full overflow-hidden">
                  {contact.image ? (
                    <AvatarImage
                      src={`${HOST}/${contact.image}`}
                      alt="avatar"
                      className="w-full h-full object-cover bg-black"
                    ></AvatarImage>
                  ) : (
                    <div
                      className={` ${
                        selectedChatData && selectedChatData._id === contact._id
                          ? "bg-[#ffffff22] border border-white/70"
                          : getColor(contact._id)
                      } text-white
                      uppercase h-10 w-10 text-xl border-[1px] flex items-center justify-center rounded-full`}
                    >
                      {contact.firstName
                        ? contact.firstName.split("").shift()
                        : contact.email.split("").shift()}
                    </div>
                  )}
                </Avatar>
              )}

              {isChannel && (
                <div className="bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full">
                  #
                </div>
              )}
              {isChannel ? (
                <span className="">{contact.name}</span>
              ) : (
                <span className="">
                  {contact.firstName} {contact.lastName}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

ContactList.propTypes = {
  contacts: PropTypes.array,
  isChannel: PropTypes.bool,
};

export default ContactList;
