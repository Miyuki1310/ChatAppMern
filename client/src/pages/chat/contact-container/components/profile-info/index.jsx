import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import apiClient from "@/lib/api-client";
import { getColor } from "@/lib/utils";
import { useAppStore } from "@/store";
import { HOST, LOGOUT_ROUTE } from "@/utils/constants";
import React from "react";
import { FiEdit2 } from "react-icons/fi";
import { IoLogOut } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const ProfileInfo = () => {
  const { userInfo, setUserInfo } = useAppStore();
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      const response = await apiClient.post(
        `${LOGOUT_ROUTE}`,
        {},
        { withCredentials: true }
      );
      if (response.status === 200) {
        toast.success("Logged out successfully");
        setUserInfo(null);
        navigate("/auth");
      }
    } catch (error) {
      toast.error("Failed to logout");
    }
  };
  return (
    <div className="absolute bottom-0 h-16 flex items-center justify-between px-5 w-full bg-[#2a2b33]">
      <div className="flex gap-3 items-center justify-center">
        <div className="w-12 h-12 relative">
          <Avatar className="h-12 w-12 rounded-full overflow-hidden">
            {userInfo.image ? (
              <AvatarImage
                src={`${HOST}/${userInfo.image}`}
                alt="avatar"
                className="w-full h-full object-cover bg-black"
              ></AvatarImage>
            ) : (
              <div
                className={`uppercase h-12 w-12 text-xl border-[1px] flex items-center justify-center rounded-full ${getColor(
                  userInfo.color
                )}`}
              >
                {" "}
                {userInfo.firstName
                  ? userInfo.firstName.split("").shift()
                  : userInfo.email.split("").shift()}
              </div>
            )}
          </Avatar>
        </div>
        <div>
          {userInfo.firstName && userInfo.lastName
            ? `${userInfo.firstName} ${userInfo.lastName}`
            : userInfo.email}
        </div>
      </div>
      <div className="flex gap-5">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger
              onClick={() => {
                navigate("/profile");
              }}
            >
              <FiEdit2 className="text-xl text-purple-500 cursor-pointer font-medium" />
            </TooltipTrigger>
            <TooltipContent className="bg-[#1b1c1e] border-none text-white">
              <p>Edit profile</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger onClick={handleLogout}>
              <IoLogOut className="text-xl text-purple-500 cursor-pointer font-medium" />
            </TooltipTrigger>
            <TooltipContent className="bg-[#1b1c1e] border-none text-white">
              <p>Log out</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default ProfileInfo;
