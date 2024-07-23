import {Text} from "@mantine/core";
import React from "react";
import {ITextProps} from "./ITextProps";

function SuccessText({text}: ITextProps) {
    return <Text ta="center" size="sm" mt="5px" color="green.9">
        {text}
    </Text>
}

export default SuccessText