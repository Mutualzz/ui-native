import styled from "@emotion/native";
import { TextInput } from "react-native";
import { resolveTypographyStyles } from "../Typography/Typography.helpers";
import { resolveInputBaseSize } from "./InputBase.helpers";
import type { InputBaseProps } from "./InputBase.types";

const InputBase = styled(TextInput)<InputBaseProps>(
    ({
        theme,
        color = "neutral",
        textColor = "primary",
        size = "md",

        fullWidth,
        disabled,
    }) => ({
        ...resolveInputBaseSize(theme, size, fullWidth),
        ...resolveTypographyStyles(theme, color, textColor)["none"],

        ...(disabled ? { opacity: 0.5 } : null),

        backgroundColor: "transparent",

        paddingVertical: 0,
        paddingHorizontal: 0,

        marginTop: 1,

        textAlignVertical: "center",
    }),
);

InputBase.displayName = "InputBase";

export { InputBase };
