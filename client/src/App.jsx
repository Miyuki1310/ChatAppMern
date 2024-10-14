// import { useState } from "react";
// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
// import { Button } from "./components/ui/button";
import Auth from "./pages/auth";
import Chat from "./pages/chat";
import Profile from "./pages/profile";
import { useAppStore } from "./store";
import { useEffect, useState } from "react";
import apiClient from "./lib/api-client";
import { GET_USER_INFO } from "./utils/constants";
const PrivateRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;

  return isAuthenticated ? children : <Navigate to={"/auth"} />;
};

const AuthRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? <Navigate to={"/chat"} /> : children;
};

function App() {
  const { userInfo, setUserInfo } = useAppStore();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await apiClient.get(GET_USER_INFO, {
          withCredentials: true,
        });
        console.log(response.data.user);
        if (response.data) {
          setUserInfo(response.data.user);
        } else {
          setUserInfo(undefined);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    if (!userInfo) {
      getUserData();
    } else {
      setLoading(false);
    }
  }, [userInfo, setUserInfo]);
  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<Navigate to={"/auth"} />}></Route>

        <Route
          path="/auth"
          element={
            <AuthRoute>
              <Auth />
            </AuthRoute>
          }
        ></Route>
        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <Chat />
            </PrivateRoute>
          }
        ></Route>
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile></Profile>
            </PrivateRoute>
          }
        ></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
