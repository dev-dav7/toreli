import React, {useState} from "react";
import {GroupModel} from "../../models/models";
import {Paper, Text, Flex, ActionIcon, Tooltip} from "@mantine/core";
import {observer} from "mobx-react-lite";
import {IconX} from "@tabler/icons-react";
import GroupService from "../../sevices/groupService";
import {trackStorageStore as ts} from "../../store/trackStorageStore";
import ErrorText from "../utility/ErrorText";

interface IGroupCardProps {
    group: GroupModel
    indexGroup: number
}

function GroupCard(props: IGroupCardProps) {
    const [isHover, setIsHover] = useState(false)
    const [deleteInPro, setDeleteInPro] = useState(false)
    const [error, setError] = useState<string>("")

    const handleMouseEnter = () => setIsHover(true)
    const handleMouseLeave = () => setIsHover(false)

    return (
        <div style={{width: "300px"}}>
            <Paper withBorder
                   mb="4px"
                   w="300px"
                   onMouseEnter={handleMouseEnter}
                   onMouseLeave={handleMouseLeave}
                   style={{
                       background: `linear-gradient(145deg, gray, 1%,rgba(255,255,255,1)  ${(!isHover ? "5%" : "30%")})`
                   }}>
                <ErrorText text={error}/>
                <div style={{display: "flex", flexDirection: "row", maxWidth: "350px"}}>
                    <Text pl="xs" style={{wordWrap: "break-word", maxWidth: "225px"}}>{props.group.name}</Text>
                    <Flex justify="flex-end"
                          direction="row-reverse"
                          style={{marginLeft: "auto", marginRight: "0px"}}>
                        <Tooltip
                            label={"Удалить"}
                            offset={5}
                            arrowOffset={25} arrowSize={10}
                            openDelay={1000}
                            withArrow position="top-start">
                            <div style={{paddingRight: "5px", paddingBottom: "5px"}}>
                                <ActionIcon variant="default"
                                            disabled={deleteInPro}
                                            onClick={() => {
                                                setDeleteInPro(true)
                                                setError("")
                                                GroupService
                                                    .removeGroup(props.group.id)
                                                    .then(() => {
                                                        ts.tracks.forEach(x => {
                                                            if (x.groupId === props.group.id) {
                                                                x.groupId = null
                                                            }
                                                            ts.removeGroup(props.group)
                                                        })
                                                    })
                                                    .catch(error => setError(error))
                                                    .finally(() => setDeleteInPro(false))
                                            }}
                                >
                                    <IconX size={"80%"}/>
                                </ActionIcon>
                            </div>
                        </Tooltip>
                    </Flex>
                </div>
            </Paper>
        </div>
    )
}

export default observer(GroupCard);
