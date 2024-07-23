import React, {createContext, StrictMode} from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import UserStore from "./store/userStore";
import {BrowserRouter} from "react-router-dom";

interface IUserStore {
    userStore: UserStore;
}

const userStore = new UserStore();
export const AuthContext = createContext<IUserStore>({userStore})

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <StrictMode>
        <BrowserRouter>
            <AuthContext.Provider value={{userStore}}>
                <App/>
            </AuthContext.Provider>
        </BrowserRouter>
    </StrictMode>
);