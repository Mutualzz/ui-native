import styled from "@emotion/native";
import { forwardRef } from "react";
import { Text, useWindowDimensions } from "react-native";

import {
    MAX_FONT_SCALE_MULTIPLIER,
    resolveTruncateLines,
} from "../utils/accessibility";
import { normalizeTypography } from "../utils/normalize";
import { resolveTypographyStyles } from "./Typography.helpers";
import type { TypographyProps } from "./Typography.types";

const TypographyBase = styled(Text)<TypographyProps>(
    ({
        theme,
        level = "body-md",
        color = "primary",
        textColor = "primary",
        variant = "none",
        weight,
    }) => ({
        ...normalizeTypography(theme.typography.levels[level]),
        ...resolveTypographyStyles(theme, color, textColor)[variant],
        ...(weight != null ? { fontWeight: weight } : {}),
    }),
);

const Typography = forwardRef<Text, TypographyProps>(
    (
        {
            truncate,
            numberOfLines,
            maxFontSizeMultiplier,
            allowFontScaling = true,
            ...props
        },
        ref,
    ) => {
        const { fontScale } = useWindowDimensions();

        return (
            <TypographyBase
                ref={ref}
                allowFontScaling={allowFontScaling}
                maxFontSizeMultiplier={
                    maxFontSizeMultiplier ?? MAX_FONT_SCALE_MULTIPLIER
                }
                numberOfLines={resolveTruncateLines(
                    truncate,
                    numberOfLines,
                    fontScale,
                )}
                {...props}
            />
        );
    },
);

Typography.displayName = "Typography";

export { Typography };
