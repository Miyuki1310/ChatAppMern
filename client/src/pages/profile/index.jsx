import { colors, getColor } from "@/lib/utils";
import { useAppStore } from "@/store";
import { useEffect, useRef, useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { FaPlus, FaTrash } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import apiClient from "@/lib/api-client";
import {
  ADD_PROFILE_IMAGE_ROUTE,
  HOST,
  REMOVE_PROFILE_IMAGE_ROUTE,
  UPDATE_PROFILE_ROUTE,
} from "@/utils/constants";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
// import React from "react";

const Profile = () => {
  const { userInfo, setUserInfo } = useAppStore();
  const [firstName, setFistName] = useState(userInfo.firstName || "");
  const [lastName, setLastName] = useState(userInfo.lastName || "");
  const [image, setImage] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [color, setColor] = useState(userInfo.color || 0);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  console.log(userInfo.color);

  useEffect(() => {
    if (userInfo.image) {
      setImage(`${HOST}/${userInfo.image}`);
    }
  }, [userInfo]);
  console.log(image);
  const validateUpdate = () => {
    if (!firstName.length) {
      toast.error("Please provide a first name");
      return false;
    }
    if (!lastName.length) {
      toast.error("Please provide a last name");
      return false;
    }
    return true;
  };
  const saveChange = async () => {
    if (validateUpdate()) {
      try {
        const response = await apiClient.post(
          UPDATE_PROFILE_ROUTE,
          {
            firstName,
            lastName,
            color,
          },
          { withCredentials: true }
        );
        if (response.status === 200 && response.data) {
          setUserInfo(response.data.user);
          toast.success("Profile updated successfully");
          navigate("/chat");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleNavigate = () => {
    if (userInfo.profileSetup) {
      navigate("/chat");
    } else {
      toast("Please complete your profile to continue");
    }
  };

  const handleFileInputClick = () => {
    fileInputRef.current.click(); // Explain: This function is called when the user clicks on the avatar image. It triggers a click event on the file input element, which opens the file picker dialog.
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("profile_image", file);
      try {
        const response = await apiClient.post(
          ADD_PROFILE_IMAGE_ROUTE,
          formData,
          { withCredentials: true }
        );
        if (response.status === 200 && response.data) {
          setUserInfo({ ...userInfo, image: response.data.image });
          toast.success("Image uploaded successfully");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleDeleteImage = async () => {
    try {
      const response = await apiClient.delete(REMOVE_PROFILE_IMAGE_ROUTE, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setUserInfo({ ...userInfo, image: null });
        toast.success("Image removed successfully");
        setImage(null);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="bg-[#1b1c24] h-[100vh] flex items-center justify-center flex-col gap-10">
      <div className="flex flex-col gap-10 w-[80vw] md:w-max">
        <div onClick={handleNavigate}>
          <IoArrowBack className="text-4xl lg:text-6xl text-white/90 cursor-pointer"></IoArrowBack>
        </div>
        <div className="grid grid-cols-2">
          <div
            onMouseEnter={() => {
              setHovered(true);
            }}
            onMouseLeave={() => {
              setHovered(false);
            }}
            className="h-full w-32 md:w-48 md:h-48 relative flex items-center justify-center"
          >
            <Avatar className="h-32 w-32 md:h-48 md:w-48 rounded-full overflow-hidden">
              {image ? (
                <AvatarImage
                  src={image}
                  alt="avatar"
                  className="w-full h-full object-cover bg-black"
                ></AvatarImage>
              ) : (
                <div
                  className={`uppercase h-32 w-32 md:w-48 md:h-48 text-5xl border-[1px] flex items-center justify-center rounded-full ${getColor(
                    color
                  )}`}
                >
                  {" "}
                  {firstName
                    ? firstName.split("").shift()
                    : userInfo.email.split("").shift()}
                </div>
              )}
            </Avatar>
            {hovered && (
              <div
                onClick={image ? handleDeleteImage : handleFileInputClick}
                className="absolute inset-0 flex items-center justify-center bg-black/50 ring-fuchsia-50 rounded-full text-white"
              >
                {image ? (
                  <FaTrash className="text-3xl cursor-pointer" />
                ) : (
                  <FaPlus className="text-3xl cursor-pointer" />
                )}
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              name="profile_image"
              onChange={handleImageChange}
            />
          </div>
          <div className="flex min-w-32 md:min-w-64 flex-col gap-5 text-white items-center justify-center ">
            <div className="w-full">
              <Input
                className="rounded-lg p-6 bg-[#2c2e3b] border-none"
                placeholder="Email"
                type="email"
                disabled
                value={userInfo.email}
              ></Input>
            </div>
            <div className="w-full">
              <Input
                className="rounded-lg p-6 bg-[#2c2e3b] border-none"
                placeholder="First Name"
                type="text"
                value={firstName}
                onChange={(e) => {
                  setFistName(e.target.value);
                }}
              ></Input>
            </div>
            <div className="w-full">
              <Input
                className="rounded-lg p-6 bg-[#2c2e3b] border-none"
                placeholder="Last Name"
                type="text"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                }}
              ></Input>
            </div>
            <div className="w-full flex gap-5">
              {colors.map((item, index) => {
                return (
                  <div
                    key={index}
                    className={`w-8 h-8 rounded-full ${item} 
                      ${
                        color === index
                          ? "outline outline-white"
                          : "border-none"
                      }
                    `}
                    onClick={() => {
                      setColor(index);
                    }}
                  ></div>
                );
              })}
            </div>
          </div>
        </div>
        <div>
          <button
            onClick={saveChange}
            className="bg-[#ff006e] text-white rounded-full p-4 w-full"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
