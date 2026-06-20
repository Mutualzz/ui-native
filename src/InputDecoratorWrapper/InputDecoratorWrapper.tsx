import styled from "@emotion/native";
import type { ComponentType } from "react";
import type { TextProps } from "react-native";
import { resolveTypographyStyles } from "../Typography/Typography.helpers";
import type { TypographyProps } from "../Typography/Typography.types";
import { normalizeTypography } from "../utils/normalize";

type InputDecoratorWrapperProps = TypographyProps & {
    position: "start" | "end";
};

const InputDecoratorWrapper = styled.Text<InputDecoratorWrapperProps>(
    ({
        theme,
        level = "body-md",
        color = "primary",
        textColor = "primary",
        variant = "none",
        weight,
        position,
    }) => ({
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
        flexShrink: 0,
        marginLeft: position === "start" ? 8 : 0,
        marginRight: position === "end" ? 8 : 0,
        ...normalizeTypography(theme.typography.levels[level]),
        ...resolveTypographyStyles(theme, color, textColor)[variant],
        fontWeight: weight,
    }),
) as ComponentType<InputDecoratorWrapperProps & TextProps>;

InputDecoratorWrapper.displayName = "InputDecoratorWrapper";

export { InputDecoratorWrapper };
