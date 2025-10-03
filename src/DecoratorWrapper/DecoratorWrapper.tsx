import styled from "@emotion/native";
import { View } from "react-native";

interface DecoratorWrapperProps {
    position?: "start" | "end";
    spacing?: number;
}

const DecoratorWrapper = styled(View)<DecoratorWrapperProps>(
    ({ position, spacing = 8 }) => ({
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        lineHeight: 1,

        fontSize: "inherit",
        color: "inherit",

        ...(position === "start" && {
            marginRight: spacing,
        }),
        ...(position === "end" && {
            marginLeft: spacing,
        }),

        flexShrink: 0,
        flexGrow: 0,
    }),
);

DecoratorWrapper.displayName = "DecoratorWrapper";

export { DecoratorWrapper };
