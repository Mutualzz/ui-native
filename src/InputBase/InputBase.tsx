import { forwardRef } from "react";
import { TextInput, useWindowDimensions } from "react-native";
import styled from "@emotion/native";
import { resolveTypographyStyles } from "../Typography/Typography.helpers";
import { useTheme } from "../useTheme";
import { MAX_FONT_SCALE_MULTIPLIER } from "../utils/accessibility";
import { resolveInputBaseSize } from "./InputBase.helpers";
import type { InputBaseProps } from "./InputBase.types";

const StyledInputBase = styled(TextInput)<
    InputBaseProps & { $fontScale: number }
>(
    ({
        theme,
        color = "neutral",
        textColor = "primary",
        size = "md",
        fullWidth,
        disabled,
        $fontScale,
    }) => ({
        ...resolveInputBaseSize(theme, size, $fontScale),
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
        const { fontScale } = useWindowDimensions();

        return (
            <StyledInputBase
                ref={ref}
                $fontScale={fontScale}
                placeholderTextColor={
                    placeholderTextColor ?? theme.typography.colors.muted
                }
                maxFontSizeMultiplier={MAX_FONT_SCALE_MULTIPLIER}
                {...props}
            />
        );
    },
);

InputBase.displayName = "InputBase";

export { InputBase };
