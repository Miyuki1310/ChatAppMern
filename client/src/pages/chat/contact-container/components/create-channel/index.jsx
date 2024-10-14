import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import MultipleSelector from "@/components/ui/multipleSelect";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import apiClient from "@/lib/api-client";
import { useAppStore } from "@/store";
import {
  CREATE_CHANNEL_ROUTE,
  GET_ALL_CONTACTS_ROUTE,
} from "@/utils/constants";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";

const CreateChannel = () => {
  const { setSelectedChatType, setSelectedChatData, addChannel } =
    useAppStore();
  const [openChannelModal, setOpenChannelModal] = useState(false);
  const [allContacts, setAllContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [channelName, setChannelName] = useState("");

  useEffect(() => {
    const getData = async () => {
      const response = await apiClient.get(GET_ALL_CONTACTS_ROUTE, {
        withCredentials: true,
      });
      setAllContacts(response.data.contacts);
    };
    getData();
  }, []);

  const createChannel = async () => {
    try {
      if (selectedContacts.length > 0 && channelName.length > 0) {
        const response = await apiClient.post(
          CREATE_CHANNEL_ROUTE,
          {
            name: channelName,
            members: selectedContacts.map((contact) => contact.value),
          },
          { withCredentials: true }
        );
        if (response.data.channel) {
          addChannel(response.data.channel);
          setSelectedContacts([]);
          setChannelName("");
          setOpenChannelModal(false);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger onClick={setOpenChannelModal}>
            <FaPlus className="text-neutral-400 font-light text-opacity-80 hover:text-neutral-100 cursor-pointer transition-all duration-300" />
          </TooltipTrigger>
          <TooltipContent>
            <p>Create new channel</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Dialog open={openChannelModal} onOpenChange={setOpenChannelModal}>
        <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col align-center">
          <DialogHeader>
            <DialogTitle>Please select a contact?</DialogTitle>
            <DialogDescription>Please select a contact</DialogDescription>
          </DialogHeader>

          <Input
            placeholder="Enter channel name"
            className="w-full p-3 border-none outline-none rounded-lg bg-[#2c2e3b]"
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
          ></Input>
          <Button
            onClick={createChannel}
            className="w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300"
          >
            Create channel
          </Button>
          <MultipleSelector
            className="rounded-lg bg-[#2c2e3b] border-none py-2 text-white"
            defaultOptions={allContacts}
            placeholder="Select members"
            value={selectedContacts}
            onChange={setSelectedContacts}
            emptyIndicator={
              <p className="text-center text-lg leading-10 text-gray-600">
                No result found
              </p>
            }
          ></MultipleSelector>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateChannel;
