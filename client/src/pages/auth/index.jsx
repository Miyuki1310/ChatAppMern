import { useState } from "react";
import Victory from "@/assets/victory.svg";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import backGround from "@/assets/backgroundLogin.jfif";
import { toast } from "sonner";
import apiClient from "@/lib/api-client";
import { LOGIN_ROUTE, SIGNUP_ROUTE } from "@/utils/constants";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store";

const Auth = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { setUserInfo } = useAppStore();

  const validateSignup = () => {
    if (!email.length) {
      toast.error("Please provide an email");
      return false;
    }
    if (!password.length) {
      toast.error("Please provide a password");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }
    return true;
  };

  const validateLogin = () => {
    if (!email.length) {
      toast.error("Please provide an email");
      return false;
    }
    if (!password.length) {
      toast.error("Please provide a password");
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (validateLogin()) {
      const response = await apiClient.post(
        LOGIN_ROUTE,
        { email, password },
        { withCredentials: true }
      );
      console.log(response);
      if (response.data.user.userId) {
        setUserInfo(response.data.user);
        console.log(response.data.user.profileSetup);
        if (response.data.user.profileSetup == true) {
          console.log("chat");
          navigate("/chat");
        } else {
          console.log("profile");
          navigate("/profile");
        }
      }
      if (!response) {
        toast.error("Invalid email or password");
      }
    }
  };

  const handleSignup = async () => {
    if (validateSignup()) {
      const response = await apiClient.post(
        SIGNUP_ROUTE,
        { email, password },
        { withCredentials: true }
      );
      console.log(response);
      if (response.status === 201) {
        setUserInfo(response.data.user);
        navigate("/profile");
      }
      if (!response) {
        toast.error("Email is already taken");
      }
    }
  };
  return (
    <div className="h-[100vh] w-[100vw] flex items-center align-center justify-center">
      <div className="h-[590px] bg-white border-2 border-white text-opacity-90 shadow-2xl w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] grid lg:grid-cols-2 rounded-lg">
        <div className="flex flex-col gap-10 item-center justify-center h-full">
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center justify-center">
              <h1 className="text-5xl font-bold md:text-6xl">Welcome</h1>
              <img src={Victory} alt="Hi" className="h-[100px]"></img>
            </div>
            <p className="font-medium text-center">
              Fill the detail to get started with chat app
            </p>
          </div>
          <div className="flex items-center justify-center w-full">
            <Tabs className="w-3/4">
              <TabsList className="w-full bg-transparent rounded-none">
                <TabsTrigger
                  value="login"
                  className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:border-b-purple-500"
                >
                  Log In
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:border-b-purple-500"
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>
              <TabsContent value="login" className="flex mt-5 flex-col gap-3">
                <Input
                  placeholder="Enter your email"
                  type="email"
                  className="rounded-full p-3 text-[16px]"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                ></Input>
                <Input
                  placeholder="Enter your password"
                  type="password"
                  className="rounded-full p-3 text-[16px]"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                ></Input>

                <Button className="rounded-full" onClick={handleLogin}>
                  Log In
                </Button>
              </TabsContent>
              <TabsContent value="signup" className="flex mt-5 flex-col gap-3">
                <Input
                  placeholder="Enter your email"
                  type="email"
                  className="rounded-full p-3 text-[16px]"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                ></Input>
                <Input
                  placeholder="Enter your password"
                  type="password"
                  className="rounded-full p-3 text-[16px]"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                ></Input>
                <Input
                  placeholder="Confirm password"
                  type="password"
                  className="rounded-full p-3 text-[16px]"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                  }}
                ></Input>
                <Button className="rounded-full" onClick={handleSignup}>
                  Sign Up
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <div className="hidden lg:flex item-center align-center h-full">
          <img
            src={backGround}
            alt="background"
            className="w-full h-[590px] object-cover block"
          ></img>
        </div>
      </div>
    </div>
  );
};

export default Auth;
