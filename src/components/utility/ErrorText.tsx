import {Text} from "@mantine/core";
import React from "react";
import {ITextProps} from "./ITextProps";

function ErrorText({text, size}: ITextProps) {
    return <Text ta="center" size={size ?? "sm"} mt="5px" color="orange.9">
        {text}
    </Text>
}

export default ErrorText