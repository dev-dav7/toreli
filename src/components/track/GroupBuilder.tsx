import {observer} from "mobx-react-lite";
import React, {useState} from "react";
import {
    Text,
    CloseButton,
    Button,
    Container, ScrollArea, TextInput
} from '@mantine/core';
import {IconPlus} from "@tabler/icons-react";
import GroupService from "../../sevices/groupService";
import {trackStorageStore as ts} from "../../store/trackStorageStore";
import GroupCard from "./GroupCard";
import ErrorText from "../utility/ErrorText";

function GroupBuilder() {
    const [groupName, setGroupName] = useState<string>("")
    const [error, setError] = useState<string>("")
    const [saveInPro, setSaveInPro] = useState<boolean>(false)

    return (
        <Container pt="xs" w="350px">
            <Text size="sm" mt="xs">Создать группу</Text>
            <TextInput
                mt="xs"
                w="300px"
                placeholder="Название для группы"
                value={groupName}
                disabled={saveInPro}
                onChange={(event) => setGroupName(event.currentTarget.value)}
                rightSectionPointerEvents="all"
                rightSection={
                    <CloseButton
                        aria-label="Clear input"
                        onClick={() => setGroupName('')}
                        style={{display: groupName ? undefined : 'none'}}
                    />}
            />
            <Button
                disabled={isAddTrackDisabled()}
                onClick={addCategory}
                mt="xs"
                w="300px"
                justify="center"
                fullWidth
                leftSection={<IconPlus size={14}/>}
                variant="default">
                Создать группу
            </Button>
            <ErrorText text={error}/>
            <ScrollArea h="500px" scrollbars="y" offsetScrollbars type="always"
                        style={{
                            height: "100%",
                            paddingRight: "5px"
                        }}>
                {ts.groups.map((x, i) => <GroupCard group={x} key={x.id} indexGroup={i}/>)}
            </ScrollArea>
        </Container>
    )

    function addCategory() {
        setSaveInPro(true)
        GroupService.createGroup(groupName)
            .then(x => {
                ts.groups.push(x.data)
                setError("")
                setGroupName("")
            })
            .catch(error => setError(error))
            .finally(() => {
                setSaveInPro(false)
            })
    }

    function isAddTrackDisabled(): boolean {
        return groupName.length === 0 || saveInPro
    }

}

export default observer(GroupBuilder);