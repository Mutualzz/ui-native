import styled from "@emotion/native";
import {
    resolveInputRootLayout,
    resolveInputRootStyles,
} from "./InputRoot.helpers";
import type { InputRootProps } from "./InputRoot.types";

const InputRoot = styled.View<InputRootProps>(
    ({
        theme,
        color = "neutral",
        size = "md",
        variant = "outlined",
        error = false,
        readOnly = false,
        fullWidth,
        disabled,
    }) => ({
        ...resolveInputRootLayout(theme, size),
        ...resolveInputRootStyles(theme, color, error, readOnly)[variant],

        ...(disabled ? { opacity: 0.5 } : null),

        flexDirection: "row",
        alignItems: "center",
        columnGap: 4,

        width: fullWidth ? "100%" : undefined,
        minWidth: 0,
        flexShrink: 1,
        flexGrow: fullWidth ? 1 : 0,

        overflow: "hidden",
    }),
);

InputRoot.displayName = "InputRoot";

export { InputRoot };
