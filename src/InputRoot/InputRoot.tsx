import styled from "@emotion/native";
import { TextInput } from "react-native";
import {
    resolveInputRootSize,
    resolveInputRootStyles,
} from "./InputRoot.helpers";
import type { InputRootProps } from "./InputRoot.types";

const InputRoot = styled(TextInput)<InputRootProps>(
    ({
        theme,
        color = "neutral",
        textColor = "inherit",
        size = "md",
        variant = "outlined",
        error = false,
        fullWidth,
        disabled,
    }) => ({
        ...resolveInputRootSize(theme, size, fullWidth),
        ...resolveInputRootStyles(theme, color, textColor, error)[variant],
        ...(disabled && { opacity: 0.5 }),

        display: "flex",
        alignItems: "center",

        minWidth: 0,
        flexShrink: 1,
        flexGrow: fullWidth ? 1 : 0,
        boxSizing: "border-box",
        overflow: "hidden",

        gap: 6,
        borderRadius: 8,
    }),
);

InputRoot.displayName = "InputRoot";

export { InputRoot };
