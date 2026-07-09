import styled from "@emotion/native";
import { forwardRef } from "react";
import { Pressable, useWindowDimensions, type View } from "react-native";
import { resolveInputBaseSize } from "../InputBase/InputBase.helpers";
import { resolveInputRootStyles } from "./InputRoot.helpers";
import type { InputRootProps } from "./InputRoot.types";

const InputRootStyled = styled(Pressable)<
    InputRootProps & { $fontScale: number }
>(
    ({
        theme,
        color = "neutral",
        variant = "outlined",
        error = false,
        readOnly = false,
        fullWidth,
        disabled,
        size = "md",
        $fontScale,
    }) => {
        const { fontSize, paddingVertical, paddingHorizontal } =
            resolveInputBaseSize(theme, size, $fontScale);
        const resolvedPaddingVertical =
            typeof paddingVertical === "number" ? paddingVertical : 0;

        return {
            fontSize,
            paddingVertical,
            paddingHorizontal,
        minHeight:
            (typeof fontSize === "number" ? fontSize : 16) +
            resolvedPaddingVertical * 2 +
            4,

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

const InputRoot = forwardRef<View, InputRootProps>((props, ref) => {
    const { fontScale } = useWindowDimensions();
    return <InputRootStyled ref={ref} $fontScale={fontScale} {...props} />;
});

InputRoot.displayName = "InputRoot";

export { InputRoot };
