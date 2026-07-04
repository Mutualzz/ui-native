import { forwardRef } from "react";
import { TextInput } from "react-native";
import styled from "@emotion/native";
import { resolveTypographyStyles } from "../Typography/Typography.helpers";
import { useTheme } from "../useTheme";
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
        flex: fullWidth ? 1 : undefined,
        flexShrink: 1,
        alignSelf: "stretch",
        borderRadius: 6,
        textAlignVertical: "center",
    }),
);

const InputBase = forwardRef<TextInput, InputBaseProps>(
    ({ placeholderTextColor, ...props }, ref) => {
        const { theme } = useTheme();

        return (
            <StyledInputBase
                ref={ref}
                placeholderTextColor={
                    placeholderTextColor ?? theme.typography.colors.muted
                }
                {...props}
            />
        );
    },
);

InputBase.displayName = "InputBase";

export { InputBase };
