import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import apiClient from "@/lib/api-client";
import { animationOptionsDefault, getColor } from "@/lib/utils";
import { useAppStore } from "@/store";
import { HOST, SEARCH_CONTACT_ROUTE } from "@/utils/constants";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import Lottie from "react-lottie";
// import { useStore } from "zustand";

const NewDM = () => {
  const [openContactModal, setOpenContactModal] = useState(false);
  const [searchedContacts, setSearchedContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { setSelectedChatType, setSelectedChatData, setSelectedChatMessages } =
    useAppStore();

  useEffect(() => {
    const searchContact = async () => {
      try {
        if (searchTerm.length > 0) {
          const response = await apiClient.post(
            `${SEARCH_CONTACT_ROUTE}`,
            {
              searchTerm,
            },
            { withCredentials: true }
          );
          if (response.status === 200) {
            setSearchedContacts(response.data.contacts);
          }
        } else {
          setSearchedContacts([]);
        }
      } catch (error) {
        console.error(error);
      }
    };
    searchContact();
  }, [searchTerm]);

  const selectNewContact = (contact) => {
    setOpenContactModal(false);
    setSelectedChatType("contact");
    setSelectedChatData(contact);
    setSearchedContacts([]);
  };
  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger onClick={setOpenContactModal}>
            <FaPlus className="text-neutral-400 font-light text-opacity-80 hover:text-neutral-100 cursor-pointer transition-all duration-300" />
          </TooltipTrigger>
          <TooltipContent>
            <p>Add new chat</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Dialog open={openContactModal} onOpenChange={setOpenContactModal}>
        <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col align-center">
          <DialogHeader>
            <DialogTitle>Please select a contact?</DialogTitle>
            <DialogDescription>Please select a contact</DialogDescription>
          </DialogHeader>

          <Input
            placeholder="Search your contact"
            className="w-full p-3 border-none outline-none rounded-lg bg-[#2c2e3b]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          ></Input>
          {searchedContacts.length > 0 && (
            <ScrollArea className="h-[250px]">
              <div className="flex flex-col gap-5">
                {searchedContacts.map((contact) => {
                  return (
                    <div
                      key={contact._id}
                      className="flex gap-4 items-center cursor-pointer"
                      onClick={(e) => selectNewContact(contact)}
                    >
                      <div className="w-12 h-12 relative">
                        <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                          {contact.image ? (
                            <AvatarImage
                              src={`${HOST}/${contact.image}`}
                              alt="avatar"
                              className="w-full h-full object-cover bg-black"
                            ></AvatarImage>
                          ) : (
                            <div
                              className={`uppercase h-12 w-12 text-xl border-[1px] flex items-center justify-center rounded-full ${getColor(
                                contact.color
                              )}`}
                            >
                              {contact.firstName
                                ? contact.firstName.split("").shift()
                                : contact.email.split("").shift()}
                            </div>
                          )}
                        </Avatar>
                      </div>
                      <div className="flex flex-col text-opacity-80">
                        <span>
                          {contact.firstName && contact.lastName
                            ? `${contact.firstName} ${contact.lastName}`
                            : contact.email}
                        </span>
                        <span className="text-xs">
                          {contact.email ? `${contact.email}` : contact.email}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          )}
          {searchedContacts.length <= 0 && (
            <div className="flex-1 flex flex-col justify-center items-center duration-1000 transition-all">
              <Lottie
                isClickToPauseDisabled={true}
                height={100}
                width={100}
                options={animationOptionsDefault}
              ></Lottie>
              <div className="text-opacity-90 text-white  flex flex-col gap-5 items-center mt-10 lg:text-2xl text-xl transition-all duration-300 text-center">
                <h3 className=" poppins-medium">
                  Hi <span className="text-purple-500">!</span> Search new
                  <span className=" text-purple-500"> contact</span>
                </h3>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewDM;
