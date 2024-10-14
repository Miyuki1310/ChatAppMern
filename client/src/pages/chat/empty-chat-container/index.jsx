import { animationOptionsDefault } from "@/lib/utils";
import React from "react";
import Lottie from "react-lottie";

const EmptyChatContainer = () => {
  return (
    <div className="flex-1 md:bg-[rgb(28,29,37)] hidden md:flex flex-col justify-center items-center duration-1000 transition-all">
      <Lottie
        isClickToPauseDisabled={true}
        height={200}
        width={200}
        options={animationOptionsDefault}
      ></Lottie>
      <div className="text-opacity-90 text-white  flex flex-col gap-5 items-center mt-10 lg:text-4xl text-3xl transition-all duration-300 text-center">
        <h3 className=" poppins-medium">
          Hi <span className="text-purple-500">!</span> Welcome to{" "}
          <span className=" to-purple-500">Syncronus</span> Chat App
        </h3>
      </div>
    </div>
  );
};

export default EmptyChatContainer;
