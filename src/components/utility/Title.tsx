import {Text} from "@mantine/core";
import React from "react";
import {ITextProps} from "./ITextProps";

function Title({text}: ITextProps) {
    return <Text ta="center" size="sm" fw={600} color="gray.7">
        {text}
    </Text>
}

export default Title