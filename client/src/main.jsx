import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Toaster } from "sonner";
import { SocketProvider } from "./context/SocketContext.jsx";

createRoot(document.getElementById("root")).render(
  <>
    <SocketProvider>
      <App />
      <Toaster closeButton className="bg-white" />
    </SocketProvider>
  </>
);
