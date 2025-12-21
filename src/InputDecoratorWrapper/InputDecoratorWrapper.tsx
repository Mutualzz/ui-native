import styled from "@emotion/native";
import { resolveTypographyStyles } from "../Typography/Typography.helpers";
import type { TypographyProps } from "../Typography/Typography.types";
import { normalizeTypography } from "../utils/normalize";

const InputDecoratorWrapper = styled.Text<TypographyProps>(
    ({
        theme,
        level = "body-md",
        color = "primary",
        textColor = "primary",
        variant = "none",
        weight,
    }) => ({
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
        flexShrink: 0,

        ...normalizeTypography(theme.typography.levels[level]),
        ...resolveTypographyStyles(theme, color, textColor)[variant],
        fontWeight: weight,
    }),
);

InputDecoratorWrapper.displayName = "InputDecoratorWrapper";

export { InputDecoratorWrapper };
