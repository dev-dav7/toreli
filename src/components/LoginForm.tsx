import React, {useContext, useState} from 'react';
import {AuthContext} from "../main";
import {Button, Container, PasswordInput, TextInput} from '@mantine/core';
import AuthService from "../sevices/authService";
import {observer} from "mobx-react-lite";
import {useForm} from '@mantine/form';
import ErrorText from "./utility/ErrorText";

function LoginForm() {
    const {userStore} = useContext(AuthContext)
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const form = useForm({
        initialValues: {
            login: '',
            pass: '',
        },

        validate: {
            login: (value) => (value.length < 1 || value.length > 30 ? 'От 1 до 30  символов' : null),
            pass: (value) => (value.length < 6 ? 'От 6  символов' : null),
        },
    });

    return (
        <Container w="300px">
            <form onSubmit={form.onSubmit((values) => login(values.login, values.pass))}>
                <div>
                    <TextInput
                        mt="xs"
                        type="text"
                        data-autofocus
                        placeholder="Логин"
                        {...form.getInputProps('login')}/>
                    <PasswordInput
                        mt="xs"
                        type="password"
                        placeholder="Пароль"
                        {...form.getInputProps('pass')}/>
                    <Button
                        mt="xs"
                        fullWidth
                        type="submit"
                        loading={isLoading}
                        loaderProps={{type: 'dots'}}>
                        Войти
                    </Button>
                    <ErrorText text={error}/>
                </div>
            </form>
        </Container>
    )

    function login(login: string, pass: string) {
        userStore.login(AuthService.login(login, pass), setIsLoading, setError)
    }
}

export default  observer(LoginForm);