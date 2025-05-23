import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from './App';
import Chats from "./components/Chats";
import Chatrooms from "./components/Chatrooms";
import userContext from './context/userContext.tsx';
import { useState } from "react";

function Router() {
    
    const [user, setUser] = useState<string>("");
    
    return (
        <userContext.Provider value={[user, setUser]}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<App />}></Route>
                    <Route path="/chatrooms" element={<Chatrooms />}></Route>
                    <Route path="/chats" element={<Chats />}></Route>
                </Routes>
            </BrowserRouter>
        </userContext.Provider>
    )
}

export default Router;