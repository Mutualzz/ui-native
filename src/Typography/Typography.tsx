import styled from "@emotion/native";
import { normalizeTypography } from "@mutualzz/ui-core";
import { Text, type TextStyle } from "react-native";
import { resolveTypographStyles } from "./Typography.helpers";
import type { TypographyProps } from "./Typography.types";

const Typography = styled(Text)<TypographyProps>(
    ({
        theme,
        level = "inherit",
        color = "primary",
        textColor = "primary",
        variant = "none",
        weight,
    }) => ({
        ...(weight && { fontWeight: weight }),
        ...((level !== "inherit" &&
            normalizeTypography(theme.typography.levels[level])) as TextStyle),
        ...resolveTypographStyles(theme, color, textColor)[variant],
    }),
);

Typography.displayName = "Typography";

export { Typography };
