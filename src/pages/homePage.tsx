import React, {useContext} from 'react';
import {AuthContext} from "../main";
import LoginForm from "../components/LoginForm";
import {observer} from "mobx-react-lite";
import {Text, Container, Tabs, Loader, Button} from '@mantine/core';
import RegForm from "../components/RegForm";

function HomePage() {
    const {userStore} = useContext(AuthContext);

    if (userStore.isAuth) {
        window.location.pathname = "/"
    }

    return (
        <div>
            <Text size="xl" ta="center" mt="30px" p="0px">Трекер ЖП</Text>
            <Text size="xs" ta="center" mt="0px" p="0px">(жизненных показетелй)</Text>
            <Container mt="20px" w="300px" className="homePage" p="0px">
                <Text>{userStore.isAuth ? `Выполнен вход, загрузка` : ""}</Text>
                {userStore.isAuth
                    ? <Loader color="blue"/>
                    : <Tabs defaultValue="auth"
                            style={{width: "300px"}}>
                        <Tabs.List grow>
                            <Tabs.Tab value="auth">
                                Вход
                            </Tabs.Tab>
                            <Tabs.Tab value="reg">
                                Регистрация
                            </Tabs.Tab>
                        </Tabs.List>
                        <Tabs.Panel value="auth">
                            {!userStore.isAuth ? <LoginForm/> : ""}
                        </Tabs.Panel>
                        <Tabs.Panel value="reg">
                            {!userStore.isAuth ? <RegForm/> : ""}
                        </Tabs.Panel>
                    </Tabs>
                }
                <Button variant="transparent" color="gray" size="compact-xs" m="0px" p="0px"
                        component="a"
                        href="/about"
                        style={{float: "right"}}
                >подробнее</Button>
            </Container>
        </div>
    );
}

export default observer(HomePage);
