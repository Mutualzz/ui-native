import { forwardRef } from "react";
import { TextInput } from "react-native";
import styled from "@emotion/native";
import { resolveTypographyStyles } from "../Typography/Typography.helpers";
import { resolveInputBaseSize } from "./InputBase.helpers";
import type { InputBaseProps } from "./InputBase.types";

const StyledInputBase = styled(TextInput)<InputBaseProps>(
    ({
        theme,
        color = "neutral",
        textColor = "primary",
        size = "md",
        fullWidth,
        disabled,
    }) => ({
        ...resolveInputBaseSize(theme, size),
        ...resolveTypographyStyles(theme, color, textColor)["none"],
        ...(disabled ? { opacity: 0.5 } : null),
        width: fullWidth ? "100%" : undefined,
        minWidth: 0,
        flexShrink: 1,
        borderRadius: 6,
        flexGrow: fullWidth ? 1 : 0,
        textAlignVertical: "center",
    }),
);

const InputBase = forwardRef<TextInput, InputBaseProps>((props, ref) => (
    <StyledInputBase ref={ref} {...props} />
));

InputBase.displayName = "InputBase";

export { InputBase };
