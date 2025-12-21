import styled from "@emotion/native";
import {
    resolveSize,
    type Size,
    type SizeValue,
    type TypographyLevel,
} from "@mutualzz/ui-core";
import { forwardRef } from "react";
import { View } from "react-native";
import { useTheme } from "../useTheme";
import { resolveDividerColor, resolveDividerStyles } from "./Divider.helpers";
import type { DividerProps } from "./Divider.types";

const DividerWrapper = styled.View<{ isVertical?: boolean }>(
    ({ isVertical }) => ({
        position: "relative",
        flexDirection: isVertical ? "column" : "row",
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "stretch",
        minWidth: isVertical ? undefined : 0,
        width: isVertical ? undefined : "100%",
    }),
);

DividerWrapper.displayName = "DividerWrapper";

const DividerLine = styled.View<{
    isVertical: boolean;
    lineColor: string;
    variant: "solid" | "dashed" | "dotted";
    grow?: boolean;
}>(({ isVertical, lineColor, variant, grow }) => ({
    alignSelf: "center",
    ...(isVertical
        ? {
              width: 1,
              flexGrow: grow ? 1 : 0,
              minHeight: 16,
          }
        : {
              height: 1,
              flexGrow: grow ? 1 : 0,
              flexShrink: grow ? 1 : 0,
              minWidth: 16,
          }),
    ...resolveDividerStyles(isVertical, lineColor)[variant],
}));

DividerLine.displayName = "DividerLine";

const DividerText = styled.Text<{
    textColor: string;
    isVertical: boolean;
    textPadding?: Size | SizeValue | number;
    textLevel?: TypographyLevel;
}>(
    ({
        theme,
        isVertical,
        textColor,
        textLevel = "body-md",
        textPadding = 5,
    }) => {
        const paddingValue = resolveSize(theme, textPadding, {
            sm: 4,
            md: 6,
            lg: 12,
        });

        return {
            color: textColor,
            paddingVertical: isVertical ? paddingValue : 0,
            paddingHorizontal: isVertical ? 0 : paddingValue,
            lineHeight: 1,
            fontSize: theme.typography.levels[textLevel].fontSize,
        };
    },
);

DividerText.displayName = "DividerText";

const Divider = forwardRef<View, DividerProps>(
    (
        {
            orientation = "horizontal",
            inset = "none",
            lineColor = "neutral",
            textColor = "neutral",
            variant = "solid",
            textPadding = 5,
            textLevel = "body-md",
            children,
            style,
            ...props
        },
        ref,
    ) => {
        const { theme } = useTheme();

        const isVertical = orientation === "vertical";

        const resolvedLineColor = resolveDividerColor(theme, lineColor);
        const resolvedTextColor = resolveDividerColor(theme, textColor);

        const showFirstLine = inset !== "start";
        const showSecondLine = inset !== "end";
        const firstLineGrow = inset !== "half-start";
        const secondLineGrow = inset !== "half-end";

        return (
            <DividerWrapper
                ref={ref}
                isVertical={isVertical}
                accessibilityRole="none"
                {...props}
                style={style}
            >
                {showFirstLine && (
                    <DividerLine
                        isVertical={isVertical}
                        lineColor={resolvedLineColor}
                        variant={variant}
                        grow={firstLineGrow}
                    />
                )}

                {children ? (
                    <DividerText
                        textColor={resolvedTextColor}
                        isVertical={isVertical}
                        textLevel={textLevel}
                        textPadding={textPadding}
                    >
                        {children}
                    </DividerText>
                ) : null}

                {showSecondLine && (
                    <DividerLine
                        isVertical={isVertical}
                        lineColor={resolvedLineColor}
                        variant={variant}
                        grow={secondLineGrow}
                    />
                )}
            </DividerWrapper>
        );
    },
);

Divider.displayName = "Divider";

export { Divider };
