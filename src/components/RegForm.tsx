import React, {useContext, useState} from 'react';
import {AuthContext} from "../main";
import {Button, Container, PasswordInput, TextInput, Tooltip} from '@mantine/core';
import AuthService from "../sevices/authService";
import {observer} from "mobx-react-lite";
import {useForm} from '@mantine/form';
import {DateInput, DateInputProps} from "@mantine/dates";
import dayjs from "dayjs";
import ErrorText from "./utility/ErrorText";

const dateParser: DateInputProps['dateParser'] = (input) => {
    //todo add ddmmyyyy dd mm yyyy dd.mm.yyyy parse
    return dayjs(input, 'DD/MM/YYYY').toDate()
};

function RegForm() {
    const {userStore} = useContext(AuthContext)
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false)

    interface RegFormValues {
        login: string;
        pass: string;
        birthday: Date | null;
        confirmPass: string,
    }

    const form = useForm<RegFormValues>({
        initialValues: {
            login: '',
            pass: '',
            birthday: null,
            confirmPass: '',
        },

        validate: {
            login: (value) => (value.length < 1 || value.length > 30 ? 'От 1 до 30  символов' : null),
            pass: (value) => (value.length < 6 ? 'От 6  символов' : null),
            birthday: (value) => (value === null ? 'Укажите год рождения' : null),
            confirmPass: (value, values) => value !== values.pass ? 'Пароли не совпадают' : null,
        },
    });

    return <Container w="300px">
        <form
            onSubmit={form.onSubmit((values) =>
                reg(values.login, values.pass, values.birthday as Date))}>
            <TextInput
                mt="xs"
                type="text"
                data-autofocus
                placeholder="Логин"
                {...form.getInputProps('login')}
            />
            <Tooltip
                label={"Дата нужна для определения начала вашего календаря"}
                offset={5}
                multiline
                arrowOffset={25} arrowSize={10}
                openDelay={1000}
                withArrow position="top-start">
                <DateInput
                    mt="xs"
                    locale="ru"
                    dateParser={dateParser}
                    valueFormat="DD MMM YYYY"
                    placeholder="Дата рождения"
                    {...form.getInputProps('birthday')}
                />
            </Tooltip>
            <PasswordInput
                mt="xs"
                type="password"
                placeholder="Пароль"
                {...form.getInputProps('pass')}
            />
            <PasswordInput
                mt="xs"
                type="password"
                placeholder="Подтвердите пароль"
                {...form.getInputProps('confirmPass')}
            />
            <Button
                mt="xs"
                fullWidth
                type="submit"
                loading={isLoading}
                loaderProps={{type: 'dots'}}>
                Зарегестрироваться
            </Button>
            <ErrorText text={error}/>
        </form>
    </Container>

    function reg(login: string, pass: string, birthday: Date) {
        userStore.login(AuthService.registration(login, pass, birthday), setIsLoading, setError)
    }
}

export default observer(RegForm);