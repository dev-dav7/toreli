import React from 'react';
import {observer} from "mobx-react-lite";
import {Button, Container, Text} from "@mantine/core";

function AboutPage() {
    return (<Container mt="md">
            <Text>Текст и данные о календаре</Text>
            <Button variant="light" color="cyan" size="sm" m="0px"
                    component="a"
                    href="/"
                    style={{float: "right"}}
            >Войти</Button>
        </Container>
    );
}

export default observer(AboutPage);

