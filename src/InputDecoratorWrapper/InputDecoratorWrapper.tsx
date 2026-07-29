import styled from "@emotion/native";
import type { ComponentType } from "react";
import type { ViewProps } from "react-native";

interface InputDecoratorWrapperProps {
    position: "start" | "end";
}

const InputDecoratorWrapper = styled.View<InputDecoratorWrapperProps>(
    ({ position }) => ({
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
        flexShrink: 0,
        marginLeft: position === "start" ? 8 : 0,
        marginRight: position === "end" ? 8 : 0,
    }),
) as ComponentType<InputDecoratorWrapperProps & ViewProps>;

InputDecoratorWrapper.displayName = "InputDecoratorWrapper";

export { InputDecoratorWrapper };
