import styled from "@emotion/native";
import { resolveInputBaseSize } from "../InputBase/InputBase.helpers";
import { resolveInputRootStyles } from "./InputRoot.helpers";
import type { InputRootProps } from "./InputRoot.types";

const InputRoot = styled.View<InputRootProps>(
    ({
        theme,
        color = "neutral",
        variant = "outlined",
        error = false,
        readOnly = false,
        fullWidth,
        disabled,
        size = "md",
    }) => {
        const { fontSize } = resolveInputBaseSize(theme, size);

        return {
            fontSize,

            ...resolveInputRootStyles(theme, color, error, readOnly)[variant],

            ...(disabled ? { opacity: 0.5 } : null),

            flexDirection: "row",
            alignItems: "center",
            overflow: "hidden",
            borderRadius: 6,
            width: fullWidth ? "100%" : undefined,
            minWidth: 0,
            flexShrink: 1,
            flexGrow: fullWidth ? 1 : 0,
        };
    },
);

InputRoot.displayName = "InputRoot";

export { InputRoot };
