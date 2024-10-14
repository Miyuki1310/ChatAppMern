import { useAppStore } from "@/store";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ContactContainer from "./contact-container";
import EmptyChatContainer from "./empty-chat-container";
import ChatContainer from "./chat-container";

const Chat = () => {
  const {
    userInfo,
    selectedChatType,
    isUploading,
    isDownloading,
    fileDownloadProgress,
    fileUploadProgress,
  } = useAppStore();
  const navigate = useNavigate();
  console.log("Chat", userInfo);
  useEffect(() => {
    if (!userInfo.profileSetup) {
      toast("Please complete your profile to continue");
      navigate("/profile");
    }
  });
  return (
    <div className="flex h-[100vh] text-white overflow-hidden ">
      {isUploading && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-black/90 flex items-center justify-center flex-col gap-5 backdrop-blur-lg">
          <div className="text-5xl animate-pulse">Uploading file</div>
          {fileUploadProgress}%
        </div>
      )}
      {isDownloading && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-black/90 flex items-center justify-center flex-col gap-5 backdrop-blur-lg">
          <div className="text-5xl animate-pulse">Downloading file</div>
          {fileDownloadProgress}%
        </div>
      )}
      <ContactContainer />
      {selectedChatType ? <ChatContainer /> : <EmptyChatContainer />}
    </div>
  );
};

export default Chat;
