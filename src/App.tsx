import '@mantine/carousel/styles.css';
import '@mantine/charts/styles.css';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/dropzone/styles.css';
import '@mantine/spotlight/styles.css';
import "@mantine/core/styles.css";
import {MantineProvider} from "@mantine/core";
import {theme} from "./theme";
import {Route, Routes} from "react-router-dom";
import {RequireAuth} from "./hoc/RequireAuth";
import {Layout} from "./components/layout";
import HomePage from "./pages/homePage";
import AboutPage from "./pages/aboutPage";
import NotFoundPage from "./pages/notFoundPage";
import MainPage from "./pages/mainPage";
import ChatPage from "./pages/chatPage"
import {AuthContext} from "./main";
import {useEffect, useContext} from "react";

function App() {
    const {userStore} = useContext(AuthContext)

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (token && !userStore.isAuth) {
            userStore.setAuth(true)
            userStore.loadUserData()
        }
    }, [])

    return <MantineProvider theme={theme}>
        <Routes>
            <Route path={"/"} element={<Layout/>}>
                <Route path="auth" element={<HomePage/>}/>
                <Route path="about" element={<AboutPage/>}/>
                <Route path="*" element={<NotFoundPage/>}/>
                <Route element={<RequireAuth/>}>
                    <Route index element={<ChatPage/>}/>
                    <Route path="main" element={<MainPage/>}/>
                </Route>
            </Route>
        </Routes>
    </MantineProvider>;
}

export default App
