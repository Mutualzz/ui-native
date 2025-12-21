import styled from "@emotion/native";
import { Text } from "react-native";

import { normalizeTypography } from "../utils/normalize";
import { resolveTypographyStyles } from "./Typography.helpers";
import type { TypographyProps } from "./Typography.types";

export const Typography = styled(Text)<TypographyProps>(
    ({
        theme,
        level = "body-md",
        color = "primary",
        textColor = "primary",
        variant = "none",
        weight = "normal",
    }) => ({
        ...normalizeTypography(theme.typography.levels[level]),
        ...resolveTypographyStyles(theme, color, textColor)[variant],
        fontWeight: weight,
    }),
);

Typography.displayName = "Typography";
